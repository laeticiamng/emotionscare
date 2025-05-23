
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function processBase64Chunks(base64String: string, chunkSize = 32768) {
  const chunks: Uint8Array[] = [];
  let position = 0;
  
  while (position < base64String.length) {
    const chunk = base64String.slice(position, position + chunkSize);
    const binaryChunk = atob(chunk);
    const bytes = new Uint8Array(binaryChunk.length);
    
    for (let i = 0; i < binaryChunk.length; i++) {
      bytes[i] = binaryChunk.charCodeAt(i);
    }
    
    chunks.push(bytes);
    position += chunkSize;
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { audio } = await req.json();
    
    if (!audio) {
      throw new Error('No audio data provided');
    }

    // Process audio in chunks
    const binaryAudio = processBase64Chunks(audio);
    
    // Prepare form data for Whisper API
    const formData = new FormData();
    const blob = new Blob([binaryAudio], { type: 'audio/webm' });
    formData.append('file', blob, 'audio.webm');
    formData.append('model', 'whisper-1');

    // Send to OpenAI Whisper for transcription
    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
      },
      body: formData,
    });

    if (!transcriptionResponse.ok) {
      throw new Error(`Whisper API error: ${await transcriptionResponse.text()}`);
    }

    const transcriptionResult = await transcriptionResponse.json();
    const transcribedText = transcriptionResult.text;

    // Analyze the transcribed text for emotions
    const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Tu es un assistant spécialisé dans l\'analyse émotionnelle vocale. Analyse le texte transcrit et donne un score de bien-être de 0 à 100, puis des conseils bienveillants en français. Réponds en JSON avec: score, feedback, emotions, confidence.' 
          },
          { 
            role: 'user', 
            content: `Analysez l'état émotionnel de ce texte transcrit depuis un enregistrement vocal: "${transcribedText}"` 
          }
        ],
        temperature: 0.7,
      }),
    });

    const analysisData = await analysisResponse.json();
    const analysisContent = analysisData.choices[0].message.content;
    
    // Try to parse as JSON
    let analysis;
    try {
      analysis = JSON.parse(analysisContent);
    } catch {
      // Fallback parsing
      const scoreMatch = analysisContent.match(/score["\s]*:[\s]*(\d+)/i);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : Math.floor(Math.random() * 40) + 50;
      
      analysis = {
        score,
        feedback: analysisContent,
        emotions: ['mixed'],
        confidence: 0.8
      };
    }

    return new Response(JSON.stringify({
      transcription: transcribedText,
      analysis: analysis
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in voice-analysis function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      transcription: '',
      analysis: {
        score: 50,
        feedback: "Analyse vocale temporairement indisponible.",
        emotions: ["neutral"],
        confidence: 0.5
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
