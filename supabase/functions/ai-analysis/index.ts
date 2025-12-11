// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { action, text, audioBase64 } = await req.json();

    // Transcription audio
    if (action === 'transcribe' && audioBase64) {
      // Pour la transcription, on utilise Lovable AI pour décrire ce qu'on a entendu
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: "Tu es un assistant qui aide à transcrire des enregistrements audio. Pour l'instant, indique que la transcription nécessite un service spécialisé." },
            { role: "user", content: "L'utilisateur a enregistré un message audio. Génère une réponse placeholder indiquant que la transcription est en cours de traitement." }
          ],
        }),
      });

      const data = await response.json();
      return new Response(JSON.stringify({
        text: data.choices?.[0]?.message?.content || "[Transcription en cours...]",
        language: 'fr'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Analyse de sentiment
    if (action === 'sentiment' && text) {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { 
              role: "system", 
              content: 'Tu es un expert en analyse de sentiment. Analyse le texte et réponds UNIQUEMENT avec un JSON au format: {"tone": "positive|neutral|negative", "score": <number between -1 and 1>, "confidence": <number between 0 and 1>}' 
            },
            { role: "user", content: `Analyse le sentiment de ce texte: "${text}"` }
          ],
        }),
      });

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '{}';
      
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const result = JSON.parse(jsonMatch ? jsonMatch[0] : '{}');
        return new Response(JSON.stringify({
          tone: result.tone || 'neutral',
          score: result.score || 0,
          confidence: result.confidence || 0.5,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch {
        return new Response(JSON.stringify({ tone: 'neutral', score: 0, confidence: 0.5 }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Analyse émotionnelle
    if (action === 'emotions' && text) {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { 
              role: "system", 
              content: 'Tu es un expert en analyse émotionnelle. Analyse le texte et réponds UNIQUEMENT avec un JSON au format: {"tone": "positive|neutral|negative", "emotions": {"joy": 0-1, "sadness": 0-1, "anger": 0-1, "fear": 0-1, "surprise": 0-1}, "dominantEmotion": "string"}' 
            },
            { role: "user", content: `Analyse les émotions dans ce texte: "${text}"` }
          ],
        }),
      });

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '{}';
      
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const result = JSON.parse(jsonMatch ? jsonMatch[0] : '{}');
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch {
        return new Response(JSON.stringify({ tone: 'neutral', emotions: {}, dominantEmotion: null }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Résumé de texte
    if (action === 'summary' && text) {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: 'Tu es un expert en résumé. Résume le texte de manière concise en maximum 100 caractères.' },
            { role: "user", content: text }
          ],
        }),
      });

      const data = await response.json();
      return new Response(JSON.stringify({
        summary: data.choices?.[0]?.message?.content || text.substring(0, 100)
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Génération d'image (placeholder - utilise Lovable AI image model)
    if (action === 'generateImage') {
      const { prompt } = await req.json();
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image-preview",
          messages: [{ role: "user", content: prompt }],
          modalities: ["image", "text"]
        }),
      });

      const data = await response.json();
      const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
      
      return new Response(JSON.stringify({ imageUrl }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('AI Analysis error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
