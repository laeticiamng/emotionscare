/**
 * Edge Function - Ambition Arcade
 * Génération IA de structure de jeu gamifié via Lovable AI Gateway
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { authorizeRole } from '../_shared/auth.ts';

const ALLOWED_ORIGINS = [
  'https://emotionscare.com',
  'https://www.emotionscare.com',
  'https://emotions-care.lovable.app',
  'http://localhost:5173',
];

function getCorsHeaders(req) {
  const origin = req.headers.get('origin') ?? '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: getCorsHeaders(req) });
  }

  try {
    const { user, status } = await authorizeRole(req, ['b2c', 'b2b_user', 'b2b_admin', 'admin']);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    const { goal, timeframe = '30', difficulty = 'medium' } = await req.json();

    if (!goal || typeof goal !== 'string' || goal.trim().length < 3) {
      return new Response(JSON.stringify({ error: 'Goal is required (min 3 characters)' }), {
        status: 400,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    // Lovable AI Gateway
    const LOVABLE_AI_URL = 'https://ai.gateway.lovable.dev/v1/chat/completions';
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY') || '';

    const difficultyMultiplier = difficulty === 'easy' ? 0.7 : difficulty === 'hard' ? 1.5 : 1;
    const daysNumber = parseInt(timeframe) || 30;
    const questsPerLevel = difficulty === 'easy' ? 2 : difficulty === 'hard' ? 5 : 3;

    const systemPrompt = `Tu es un expert en gamification et développement personnel. Tu crées des structures de jeu motivantes pour aider les utilisateurs à atteindre leurs objectifs.

RÈGLES CRITIQUES:
- Réponds UNIQUEMENT en JSON valide, sans texte autour
- Les niveaux doivent être progressifs et réalistes
- Chaque tâche doit être concrète et mesurable
- Les points doivent récompenser l'effort proportionnellement
- Les badges doivent célébrer les étapes clés

FORMAT JSON OBLIGATOIRE:
{
  "levels": [
    {
      "name": "string (nom du niveau)",
      "description": "string (description motivante)",
      "points": number (points à gagner),
      "tasks": ["string (tâche 1)", "string (tâche 2)", ...]
    }
  ],
  "totalPoints": number,
  "badges": ["string (nom du badge)", ...]
}`;

    const userPrompt = `Crée une structure de jeu gamifiée pour cet objectif:

OBJECTIF: ${goal.trim()}
DÉLAI: ${daysNumber} jours
DIFFICULTÉ: ${difficulty}
QUÊTES PAR NIVEAU: ${questsPerLevel}

Génère exactement 4 niveaux progressifs avec ${questsPerLevel} tâches par niveau.
Les points totaux doivent être autour de ${Math.round(1000 * difficultyMultiplier)}.
Inclus 5 badges motivants pour célébrer les accomplissements.`;

    console.log('Calling Lovable AI Gateway for game structure generation');

    const response = await fetch(LOVABLE_AI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (response.status === 429) {
      console.warn('Rate limited by Lovable AI Gateway');
      return new Response(JSON.stringify({ 
        error: 'Service temporairement surchargé, veuillez réessayer',
        gameStructure: getDefaultStructure(goal, difficulty)
      }), {
        status: 200,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    if (response.status === 402) {
      console.warn('Payment required for Lovable AI Gateway');
      return new Response(JSON.stringify({ 
        gameStructure: getDefaultStructure(goal, difficulty)
      }), {
        status: 200,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    if (!response.ok) {
      console.error('Lovable AI Gateway error:', response.status);
      return new Response(JSON.stringify({ 
        gameStructure: getDefaultStructure(goal, difficulty)
      }), {
        status: 200,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const aiContent = data.choices?.[0]?.message?.content || '';

    console.log('AI response received, parsing game structure');

    try {
      // Nettoyer le contenu AI
      let cleanContent = aiContent.trim();
      
      // Supprimer les blocs de code markdown
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.slice(7);
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith('```')) {
        cleanContent = cleanContent.slice(0, -3);
      }
      cleanContent = cleanContent.trim();

      const gameStructure = JSON.parse(cleanContent);

      // Validation basique
      if (!gameStructure.levels || !Array.isArray(gameStructure.levels)) {
        throw new Error('Invalid structure: missing levels array');
      }

      // S'assurer que chaque level a les bons champs
      gameStructure.levels = gameStructure.levels.map((level: any, index: number) => ({
        name: level.name || `Niveau ${index + 1}`,
        description: level.description || 'Progressez vers votre objectif',
        points: typeof level.points === 'number' ? level.points : 100 * (index + 1),
        tasks: Array.isArray(level.tasks) ? level.tasks : ['Tâche à définir']
      }));

      gameStructure.totalPoints = gameStructure.levels.reduce((sum: number, l: any) => sum + l.points, 0);
      gameStructure.badges = Array.isArray(gameStructure.badges) ? gameStructure.badges : ['Débutant', 'Persévérant', 'Champion'];

      return new Response(JSON.stringify({ gameStructure }), {
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Parse error, using default structure:', parseError);
      return new Response(JSON.stringify({
        gameStructure: getDefaultStructure(goal, difficulty)
      }), {
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in ambition-arcade function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
    });
  }
});

function getDefaultStructure(goal: string, difficulty: string) {
  const basePoints = difficulty === 'easy' ? 75 : difficulty === 'hard' ? 150 : 100;
  const tasksPerLevel = difficulty === 'easy' ? 2 : difficulty === 'hard' ? 5 : 3;

  return {
    levels: [
      {
        name: "🌱 Éveil",
        description: "Posez les fondations de votre objectif",
        points: basePoints,
        tasks: generateTasks('éveil', tasksPerLevel)
      },
      {
        name: "🔥 Momentum",
        description: "Construisez vos habitudes quotidiennes",
        points: basePoints * 1.5,
        tasks: generateTasks('momentum', tasksPerLevel)
      },
      {
        name: "⚡ Maîtrise",
        description: "Consolidez vos acquis et dépassez-vous",
        points: basePoints * 2,
        tasks: generateTasks('maitrise', tasksPerLevel)
      },
      {
        name: "🏆 Accomplissement",
        description: "Célébrez votre transformation",
        points: basePoints * 2.5,
        tasks: generateTasks('accomplissement', tasksPerLevel)
      }
    ],
    totalPoints: Math.round(basePoints * (1 + 1.5 + 2 + 2.5)),
    badges: [
      "🎯 Premier Pas",
      "🔥 En Feu",
      "💪 Persévérant",
      "⭐ Expert",
      "🏆 Légende"
    ]
  };
}

function generateTasks(phase: string, count: number): string[] {
  const tasksByPhase: Record<string, string[]> = {
    'éveil': [
      'Définir votre vision claire',
      'Créer un plan d\'action',
      'Identifier les obstacles potentiels',
      'Trouver votre motivation profonde',
      'Préparer votre environnement'
    ],
    'momentum': [
      'Pratiquer quotidiennement (15 min)',
      'Suivre vos progrès',
      'Ajuster votre stratégie',
      'Célébrer les petites victoires',
      'Demander du feedback'
    ],
    'maitrise': [
      'Approfondir vos compétences',
      'Relever un défi plus difficile',
      'Enseigner ce que vous avez appris',
      'Mesurer votre progression',
      'Optimiser votre routine'
    ],
    'accomplissement': [
      'Finaliser votre objectif',
      'Documenter votre parcours',
      'Partager votre réussite',
      'Définir le prochain défi',
      'Célébrer dignement'
    ]
  };

  return (tasksByPhase[phase] || tasksByPhase['éveil']).slice(0, count);
}
