// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, emotion, conversationHistory = [] } = await req.json();
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    console.log('🤖 AI Coach request from user:', user.id);

    // Build conversation context
    const contextMessages = conversationHistory.slice(-10).map((msg: any) => ({
      role: msg.isBot ? 'assistant' : 'user',
      content: msg.content
    }));

    // System prompt for empathetic coaching
    const systemPrompt = `Tu es un coach en bien-être émotionnel bienveillant et empathique. 
Tu utilises des techniques de coaching validées scientifiquement pour aider les utilisateurs à :
- Comprendre et gérer leurs émotions
- Développer leur résilience émotionnelle
- Améliorer leur bien-être mental
- Adopter des stratégies d'adaptation saines

${emotion ? `L'utilisateur exprime actuellement une émotion de type : ${emotion}` : ''}

Réponds de manière chaleureuse, encourageante et personnalisée. Pose des questions ouvertes pour mieux comprendre la situation. 
Propose des exercices concrets et des ressources quand c'est pertinent.
Limite tes réponses à 150 mots maximum pour rester concis.`;

    // Call Lovable AI Gateway
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...contextMessages,
          { role: 'user', content: message }
        ],
        temperature: 0.8,
        max_tokens: 500,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('❌ Lovable AI error:', aiResponse.status, errorText);
      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const coachResponse = aiData.choices[0].message.content;

    // Generate suggestions based on emotion
    const suggestions = generateSuggestions(emotion);

    // Save conversation to database
    const conversationData = {
      user_id: user.id,
      message: message,
      response: coachResponse,
      emotion: emotion,
      created_at: new Date().toISOString()
    };

    const { error: saveError } = await supabase
      .from('coach_conversations')
      .insert(conversationData);

    if (saveError) {
      console.warn('⚠️ Failed to save conversation:', saveError);
    }

    // Track analytics
    const { error: analyticsError } = await supabase
      .from('ai_coach_sessions')
      .upsert({
        user_id: user.id,
        messages_count: conversationHistory.length + 2,
        emotions_detected: emotion ? [emotion] : [],
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,created_at',
        ignoreDuplicates: false
      });

    if (analyticsError) {
      console.warn('⚠️ Failed to track analytics:', analyticsError);
    }

    console.log('✅ Coach response generated successfully');

    return new Response(JSON.stringify({
      success: true,
      response: coachResponse,
      suggestions: suggestions,
      emotion: emotion
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error in ai-coach-chat:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateSuggestions(emotion?: string): string[] {
  const emotionSuggestions: Record<string, string[]> = {
    anxious: [
      "Comment puis-je gérer mon anxiété au quotidien ?",
      "Quels exercices de respiration recommandez-vous ?",
      "Comment puis-je calmer mes pensées anxieuses ?"
    ],
    sad: [
      "Comment retrouver ma motivation ?",
      "Quelles activités peuvent améliorer mon humeur ?",
      "Comment puis-je sortir d'un état de tristesse ?"
    ],
    stressed: [
      "Comment mieux gérer mon stress ?",
      "Quelles techniques de relaxation fonctionnent le mieux ?",
      "Comment prioriser mes tâches ?"
    ],
    angry: [
      "Comment canaliser ma colère de manière constructive ?",
      "Quelles techniques d'apaisement puis-je utiliser ?",
      "Comment communiquer ma frustration efficacement ?"
    ],
    happy: [
      "Comment maintenir cet état positif ?",
      "Quelles habitudes renforcent le bien-être ?",
      "Comment cultiver la gratitude au quotidien ?"
    ]
  };

  const defaultSuggestions = [
    "Comment améliorer mon bien-être émotionnel ?",
    "Quelles sont les meilleures pratiques pour gérer mes émotions ?",
    "Comment développer ma résilience ?"
  ];

  return emotion && emotionSuggestions[emotion.toLowerCase()] 
    ? emotionSuggestions[emotion.toLowerCase()]
    : defaultSuggestions;
}
