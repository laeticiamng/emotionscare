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
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    // Parse multipart form data
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    const language = formData.get('language') as string || 'fr';
    const duration = formData.get('duration') as string;

    if (!audioFile) {
      throw new Error('No audio file provided');
    }

    console.log(`Transcribing audio: ${audioFile.name}, size: ${audioFile.size} bytes, duration: ${duration}s, language: ${language}`);

    // Convertir el archivo a formato compatible con Whisper
    // Whisper acepta: flac, m4a, mp3, mp4, mpeg, mpga, oga, ogg, wav, webm
    const audioBlob = await audioFile.arrayBuffer();

    // Crear FormData para Whisper API
    const whisperFormData = new FormData();
    whisperFormData.append('file', new Blob([audioBlob], { type: audioFile.type }), audioFile.name);
    whisperFormData.append('model', 'whisper-1');
    whisperFormData.append('language', language);
    whisperFormData.append('response_format', 'json');

    // Opcional: agregar prompt para mejorar precisión
    const prompt = language === 'fr'
      ? "Transcription d'une entrée de journal émotionnel. Émotion, sentiment, bien-être."
      : "Emotional journal entry transcription. Emotion, feeling, wellbeing.";
    whisperFormData.append('prompt', prompt);

    // Llamar a OpenAI Whisper API
    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: whisperFormData,
    });

    if (!whisperResponse.ok) {
      const errorText = await whisperResponse.text();
      console.error('Whisper API error:', errorText);
      throw new Error(`Whisper API error: ${whisperResponse.status} - ${errorText}`);
    }

    const whisperResult = await whisperResponse.json();

    console.log('Transcription successful:', {
      textLength: whisperResult.text?.length || 0,
      language: whisperResult.language || language
    });

    // Opcional: análisis emocional del texto transcrito usando GPT
    let emotionalAnalysis = null;

    if (whisperResult.text && whisperResult.text.length > 10) {
      try {
        const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'Tu es un assistant spécialisé en analyse émotionnelle. Analyse le texte et identifie les émotions principales. Réponds en JSON avec: emotion (string), intensity (0-1), sentiment (positive/neutral/negative), keywords (array).'
              },
              {
                role: 'user',
                content: whisperResult.text
              }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.3,
          }),
        });

        if (analysisResponse.ok) {
          const analysisResult = await analysisResponse.json();
          emotionalAnalysis = JSON.parse(analysisResult.choices[0].message.content);
        }
      } catch (analysisError) {
        console.error('Emotional analysis failed:', analysisError);
        // Non-critique, continuer sans analyse
      }
    }

    return new Response(JSON.stringify({
      success: true,
      text: whisperResult.text,
      transcription: whisperResult.text, // Alias pour compatibilité
      language: whisperResult.language || language,
      duration: parseFloat(duration || '0'),
      emotional_analysis: emotionalAnalysis,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in transcribe-audio function:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
