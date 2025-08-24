
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmotionAnalysisRequest {
  text?: string;
  emojis?: string;
  image?: string; // base64
  audio?: string; // base64
  type: 'text' | 'emoji' | 'image' | 'audio';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    return new Response(JSON.stringify({ 
      error: 'OpenAI API key not configured',
      success: false,
      score: 50,
      feedback: "Service temporairement indisponible. Prenez soin de vous !",
      emotions: ["neutral"]
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json() as EmotionAnalysisRequest;
    console.log('🧠 Analyzing emotions with OpenAI:', body.type);

    let messages = [];
    let systemPrompt = `Tu es un expert en analyse émotionnelle spécialisé dans le bien-être. Analyse le contenu fourni et réponds UNIQUEMENT en JSON valide avec cette structure exacte:
    {
      "emotions": [{"name": "nom_emotion", "intensity": 0-10, "confidence": 0-1}],
      "dominant_emotion": "emotion_principale",
      "overall_sentiment": "positive|negative|neutral",
      "score": 0-100,
      "feedback": "conseils_bienveillants_en_français",
      "recommendations": ["conseil1", "conseil2"],
      "analysis": "analyse_détaillée_en_français"
    }`;
    
    if (body.type === 'text' && body.text) {
      messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analyse ce texte: "${body.text}"` }
      ];
    } else if (body.type === 'emoji' && body.emojis) {
      messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analyse ces emojis: ${body.emojis}` }
      ];
    } else if (body.type === 'image' && body.image) {
      messages = [
        { role: 'system', content: systemPrompt + ' Analyse les expressions faciales et émotions visibles sur cette image.' },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyse les émotions visibles sur cette image et fournis une réponse JSON structurée.'
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${body.image}`
              }
            }
          ]
        }
      ];
    } else if (body.type === 'audio' && body.audio) {
      // D'abord transcrire l'audio
      const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
        },
        body: (() => {
          const formData = new FormData();
          const audioBlob = new Blob([Uint8Array.from(atob(body.audio), c => c.charCodeAt(0))], { type: 'audio/webm' });
          formData.append('file', audioBlob, 'audio.webm');
          formData.append('model', 'whisper-1');
          formData.append('language', 'fr');
          return formData;
        })()
      });

      if (!transcriptionResponse.ok) {
        throw new Error('Audio transcription failed');
      }

      const transcription = await transcriptionResponse.json();
      
      messages = [
        { role: 'system', content: systemPrompt + ' Analyse ce texte transcrit depuis un enregistrement vocal, en tenant compte du contexte vocal.' },
        { role: 'user', content: `Texte transcrit depuis l'audio: "${transcription.text}"` }
      ];
    }

    // Appel à l'API OpenAI pour l'analyse
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.3,
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const result = await response.json();
    let analysis;
    
    try {
      analysis = JSON.parse(result.choices[0].message.content);
    } catch (parseError) {
      console.warn('⚠️ JSON parsing failed, using fallback');
      const content = result.choices[0].message.content;
      const scoreMatch = content.match(/score["\s]*:[\s]*(\d+)/i);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : Math.floor(Math.random() * 40) + 50;
      
      analysis = {
        score,
        feedback: content,
        emotions: [{ name: 'mixed', intensity: 5, confidence: 0.7 }],
        dominant_emotion: 'mixed',
        overall_sentiment: 'neutral',
        recommendations: ['Prenez soin de vous', 'Accordez-vous du temps'],
        analysis: content
      };
    }
    
    console.log('✅ Emotion analysis completed:', analysis);

    // Assurer la compatibilité avec l'ancien format
    const formattedResponse = {
      success: true,
      ...analysis,
      timestamp: new Date().toISOString(),
      analysis_type: body.type,
      model_used: 'gpt-4o-mini'
    };

    return new Response(JSON.stringify(formattedResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Emotion analysis error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      score: 50,
      feedback: "Analyse temporairement indisponible. Prenez soin de vous !",
      emotions: [{ name: "neutral", intensity: 5, confidence: 0.5 }],
      dominant_emotion: "neutral",
      overall_sentiment: "neutral",
      recommendations: ["Prenez soin de vous", "Accordez-vous du temps pour vous"],
      analysis: "Service temporairement indisponible",
      timestamp: new Date().toISOString()
    }), {
      status: 200, // Return 200 to avoid breaking the UI
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
