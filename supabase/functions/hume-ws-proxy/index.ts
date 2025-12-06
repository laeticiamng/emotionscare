import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const humeApiKey = Deno.env.get('HUME_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { session_id, frame, ts } = await req.json();
    
    if (!frame || !session_id) {
      throw new Error('Missing session_id or frame data');
    }

    if (!humeApiKey) {
      // Fallback simulation when no Hume API key
      const emotions = ['joy', 'calm', 'sad', 'anger', 'fear', 'surprise', 'neutral'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const confidence = 0.6 + Math.random() * 0.3; // 60-90% confidence
      
      return new Response(
        JSON.stringify({
          emotion: randomEmotion,
          confidence: parseFloat(confidence.toFixed(2)),
          source: 'simulation'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Convert base64 frame to blob for Hume API
    const base64Data = frame.replace(/^data:image\/jpeg;base64,/, '');
    const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    // Create form data for Hume API
    const formData = new FormData();
    formData.append('file', new Blob([imageBuffer], { type: 'image/jpeg' }), 'frame.jpg');
    formData.append('models', JSON.stringify({ face: {} }));

    // Call Hume Expression Measurement API
    const response = await fetch('https://api.hume.ai/v0/batch/jobs', {
      method: 'POST',
      headers: {
        'X-Hume-Api-Key': humeApiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      console.error('Hume API error:', response.status, await response.text());
      throw new Error(`Hume API error: ${response.status}`);
    }

    const humeResult = await response.json();
    
    // Parse Hume response to extract dominant emotion
    let dominantEmotion = 'neutral';
    let confidence = 0.5;
    
    if (humeResult.predictions?.[0]?.models?.face?.grouped_predictions?.[0]?.predictions?.[0]?.emotions) {
      const emotions = humeResult.predictions[0].models.face.grouped_predictions[0].predictions[0].emotions;
      
      // Find emotion with highest score
      let maxScore = 0;
      emotions.forEach((emotion: any) => {
        if (emotion.score > maxScore) {
          maxScore = emotion.score;
          dominantEmotion = emotion.name;
        }
      });
      
      confidence = maxScore;
    }

    // Map Hume emotions to our simplified set
    const emotionMapping: Record<string, string> = {
      'Joy': 'joy',
      'Happiness': 'joy',
      'Calmness': 'calm',
      'Peace': 'calm',
      'Sadness': 'sad',
      'Sorrow': 'sad',
      'Anger': 'anger',
      'Rage': 'anger',
      'Fear': 'fear',
      'Anxiety': 'fear',
      'Surprise': 'surprise',
      'Shock': 'surprise',
      'Neutral': 'neutral'
    };
    
    const mappedEmotion = emotionMapping[dominantEmotion] || 'neutral';

    return new Response(
      JSON.stringify({
        emotion: mappedEmotion,
        confidence: parseFloat(confidence.toFixed(2)),
        source: 'hume_ai',
        session_id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in hume-ws-proxy:', error);
    
    // Always return a fallback response to keep the UX smooth
    const emotions = ['joy', 'calm', 'neutral'];
    const fallbackEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    
    return new Response(
      JSON.stringify({
        emotion: fallbackEmotion,
        confidence: 0.5,
        source: 'fallback',
        error: error.message
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
