// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { authorizeRole } from '../_shared/auth.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { user, status } = await authorizeRole(req, ['b2c', 'b2b_user', 'b2b_admin', 'admin']);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { article, language, readingLevel, sector, model, temperature } = await req.json();
    
    if (!article) {
      throw new Error('Un article ou sujet RGPD doit être spécifié');
    }

    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) {
      throw new Error('Clé API OpenAI manquante');
    }

    // Niveau de détail et ajustement du prompt selon le niveau de lecture
    let detailLevel = "simple";
    if (readingLevel === "standard") {
      detailLevel = "avec un niveau de détail modéré";
    } else if (readingLevel === "detailed") {
      detailLevel = "avec un bon niveau de détail, tout en restant accessible";
    }

    // Personnalisation sectorielle
    let sectorContext = "";
    if (sector && sector !== "general") {
      sectorContext = `Adaptez l'explication au contexte du secteur ${sector}.`;
    }

    const prompt = `
    Agissez comme un expert RGPD empathique dont la mission est de rendre la réglementation accessible. 
    Voici le sujet ou l'article RGPD à expliquer simplement: "${article}".
    Donnez une explication ${detailLevel}, bienveillante et rassurante en ${language || 'français'}.
    ${sectorContext}
    
    Votre réponse doit contenir:
    1. Une explication principale simple et empathique (maximum 200 mots)
    2. 3-5 points clés simplifiés sur le sujet
    3. Si pertinent, des étapes pratiques que l'utilisateur peut suivre
    
    Utilisez un ton chaleureux et rassurant.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'gpt-4.1-2025-04-14',
        temperature: temperature || 0.3,
        messages: [
          { role: 'system', content: 'Vous êtes un expert du RGPD spécialisé dans la vulgarisation et l\'empathie.' },
          { role: 'user', content: prompt }
        ]
      }),
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      console.error('Erreur OpenAI:', responseData);
      throw new Error('Erreur lors de la génération de l\'explication RGPD');
    }

    const content = responseData.choices[0].message.content;
    
    // Traitement de la réponse pour l'organiser en sections
    let explanation = "";
    let simplifiedPoints: string[] = [];
    let nextSteps: string[] = [];

    const sections = content.split(/\n\n|\r\n\r\n/);
    if (sections.length > 0) {
      explanation = sections[0].replace(/^(Explication|Explication principale|Introduction):\s*/i, '');
    }

    // Extraction des points clés
    const pointsMatch = content.match(/Points clés(.*?)(?=Étapes|$)/s);
    if (pointsMatch) {
      simplifiedPoints = pointsMatch[0]
        .replace(/Points clés.*?:/i, '')
        .trim()
        .split(/\n/)
        .map(point => point.replace(/^[•\-\*]\s*/, '').trim())
        .filter(point => point.length > 0);
    }

    // Extraction des étapes pratiques, si présentes
    const stepsMatch = content.match(/Étapes pratiques.*?:([\s\S]*)/i);
    if (stepsMatch) {
      nextSteps = stepsMatch[1]
        .split(/\n/)
        .map(step => step.replace(/^[•\-\*]\s*/, '').trim())
        .filter(step => step.length > 0);
    }

    return new Response(
      JSON.stringify({
        explanation,
        simplifiedPoints,
        nextSteps: nextSteps.length > 0 ? nextSteps : undefined
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erreur:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
