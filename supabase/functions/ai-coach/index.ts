import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CoachingRequest {
  message: string;
  userId: string;
  sessionId?: string;
  coachType: 'therapist' | 'wellness' | 'mindfulness' | 'general';
  userProfile?: {
    mood?: string;
    stressLevel?: number;
    goals?: string[];
    preferences?: string[];
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { 
      message, 
      userId, 
      sessionId, 
      coachType = 'general',
      userProfile = {}
    }: CoachingRequest = await req.json();
    
    console.log('🤖 Coaching IA demandé:', { userId, coachType, sessionId });

    // Récupération de l'historique de conversation si sessionId fourni
    let conversationHistory: any[] = [];
    if (sessionId) {
      const { data: messages } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', sessionId)
        .order('timestamp', { ascending: true })
        .limit(10); // Limiter à 10 derniers messages pour le contexte

      conversationHistory = messages || [];
    }

    // Construction du prompt système selon le type de coach
    const coachPrompts = {
      therapist: `Tu es un psychothérapeute bienveillant et expérimenté spécialisé dans le bien-être émotionnel. 
Tu utilises des techniques de thérapie cognitivo-comportementale (TCC) et de pleine conscience.
Ton approche est empathique, non-directive et axée sur l'autonomisation du patient.`,
      
      wellness: `Tu es un coach en bien-être holistique spécialisé dans l'équilibre vie-travail et la gestion du stress.
Tu proposes des solutions pratiques et des habitudes de vie saines.
Ton approche est motivante, positive et axée sur l'action.`,
      
      mindfulness: `Tu es un guide de méditation et de pleine conscience expérimenté.
Tu enseignes des techniques de respiration, de méditation et de présence à l'instant.
Ton approche est douce, contemplative et centrée sur la conscience corporelle.`,
      
      general: `Tu es un assistant IA bienveillant spécialisé dans le soutien émotionnel et le bien-être mental.
Tu combines empathie, connaissances en psychologie positive et conseils pratiques.
Ton approche est adaptative selon les besoins exprimés.`
    };

    const systemPrompt = `${coachPrompts[coachType]}

CONTEXTE UTILISATEUR:
- Humeur actuelle: ${userProfile.mood || 'Non spécifiée'}
- Niveau de stress: ${userProfile.stressLevel || 'Non évalué'}/10
- Objectifs: ${userProfile.goals?.join(', ') || 'Non définis'}
- Préférences: ${userProfile.preferences?.join(', ') || 'Non spécifiées'}

INSTRUCTIONS:
1. Réponds toujours en français avec bienveillance et empathie
2. Adapte ton langage au niveau émotionnel détecté
3. Propose des techniques concrètes et applicables immédiatement
4. Si tu détectes une détresse importante, encourage la consultation professionnelle
5. Garde tes réponses concises mais substantielles (200-400 mots)
6. Termine par une question ouverte ou un exercice pratique quand approprié
7. Ne donne jamais de diagnostic médical ou de conseils médicaux spécifiques

RESSOURCES À PROPOSER:
- Exercices de respiration (4-7-8, cohérence cardiaque)
- Techniques de grounding (5-4-3-2-1, ancrage corporel)
- Affirmations positives personnalisées
- Micro-méditations (1-3 minutes)
- Restructuration cognitive simple
- Hygiène de vie (sommeil, nutrition, activité physique)`;

    // Préparation des messages pour l'IA
    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    // Ajout de l'historique (si disponible)
    conversationHistory.forEach(msg => {
      messages.push({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      });
    });

    // Ajout du message actuel
    messages.push({ role: 'user', content: message });

    console.log('📝 Prompt système configuré pour:', coachType);

    // Appel à l'IA
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY non configurée');
    }

    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 800,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`Erreur IA Coach: ${await aiResponse.text()}`);
    }

    const aiData = await aiResponse.json();
    const coachResponse = aiData.choices[0].message.content;

    console.log('🎯 Réponse générée par l\'IA Coach');

    // Gestion de la session de conversation
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      // Créer nouvelle conversation
      const { data: newConversation, error: convError } = await supabase
        .from('chat_conversations')
        .insert({
          user_id: userId,
          title: `Session ${coachType} - ${new Date().toLocaleDateString('fr-FR')}`,
          last_message: message.substring(0, 100)
        })
        .select()
        .single();

      if (convError) throw convError;
      currentSessionId = newConversation.id;
    }

    // Sauvegarder les messages
    const messagesToSave = [
      {
        conversation_id: currentSessionId,
        sender: 'user',
        text: message,
        timestamp: new Date().toISOString()
      },
      {
        conversation_id: currentSessionId,
        sender: 'coach',
        text: coachResponse,
        timestamp: new Date().toISOString()
      }
    ];

    const { error: msgError } = await supabase
      .from('chat_messages')
      .insert(messagesToSave);

    if (msgError) {
      console.error('⚠️ Erreur sauvegarde messages:', msgError);
    }

    // Mise à jour de la dernière activité de conversation
    await supabase
      .from('chat_conversations')
      .update({
        last_message: coachResponse.substring(0, 100),
        updated_at: new Date().toISOString()
      })
      .eq('id', currentSessionId);

    // Analyse du sentiment de la réponse pour tracking
    let responseAnalysis = null;
    try {
      const sentimentResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Analyse le sentiment et les techniques thérapeutiques suggérées dans cette réponse de coaching. Réponds en JSON avec: {"techniques": ["tech1", "tech2"], "sentiment": "positif|neutre|préoccupant", "urgency": 1-5}'
            },
            {
              role: 'user',
              content: `Message utilisateur: "${message}"\n\nRéponse coach: "${coachResponse}"`
            }
          ],
          temperature: 0.2,
          max_tokens: 200
        }),
      });

      if (sentimentResponse.ok) {
        const sentimentData = await sentimentResponse.json();
        try {
          responseAnalysis = JSON.parse(sentimentData.choices[0].message.content);
        } catch (e) {
          console.warn('Erreur parsing analyse sentiment');
        }
      }
    } catch (e) {
      console.warn('Erreur analyse sentiment:', e.message);
    }

    console.log('✅ Session de coaching complétée:', currentSessionId);

    return new Response(JSON.stringify({
      success: true,
      response: coachResponse,
      sessionId: currentSessionId,
      coachType,
      analysis: responseAnalysis,
      suggestions: {
        nextTopics: [
          'Comment vous sentez-vous après cet échange ?',
          'Y a-t-il un aspect spécifique que vous aimeriez approfondir ?',
          'Souhaitez-vous que je vous guide dans un exercice pratique ?'
        ],
        resources: [
          'Exercice de respiration guidée',
          'Méditation courte adaptée',
          'Techniques de gestion du stress'
        ]
      },
      message: 'Coaching IA complété avec succès'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Erreur dans ai-coach:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Erreur lors du coaching IA'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});