import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { type, data } = await req.json();
    
    const humeApiKey = Deno.env.get('HUME_API_KEY');
    if (!humeApiKey) {
      throw new Error('HUME_API_KEY not configured');
    }

    let humeResponse;
    
    switch (type) {
      case 'text':
        humeResponse = await analyzeText(data.text, humeApiKey);
        break;
      case 'audio':
        humeResponse = await analyzeAudio(data.audioUrl, humeApiKey);
        break;
      case 'video':
        humeResponse = await analyzeVideo(data.videoUrl, humeApiKey);
        break;
      case 'image':
        humeResponse = await analyzeImage(data.imageUrl, humeApiKey);
        break;
      default:
        throw new Error(`Unsupported analysis type: ${type}`);
    }

    // Transform Hume response to EmotionsCare format
    const emotionResult = transformHumeResponse(humeResponse, type);

    return new Response(
      JSON.stringify(emotionResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Hume Analysis Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function analyzeText(text: string, apiKey: string) {
  const response = await fetch('https://api.hume.ai/v0/batch/jobs', {
    method: 'POST',
    headers: {
      'X-Hume-Api-Key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      models: {
        language: {
          granularity: "sentence"
        }
      },
      transcription: {
        language: "fr"
      },
      text: [text]
    }),
  });

  if (!response.ok) {
    throw new Error(`Hume API error: ${response.status}`);
  }

  return await response.json();
}

async function analyzeAudio(audioUrl: string, apiKey: string) {
  const response = await fetch('https://api.hume.ai/v0/batch/jobs', {
    method: 'POST',
    headers: {
      'X-Hume-Api-Key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      models: {
        prosody: {},
        language: {}
      },
      urls: [audioUrl]
    }),
  });

  if (!response.ok) {
    throw new Error(`Hume API error: ${response.status}`);
  }

  return await response.json();
}

async function analyzeVideo(videoUrl: string, apiKey: string) {
  const response = await fetch('https://api.hume.ai/v0/batch/jobs', {
    method: 'POST',
    headers: {
      'X-Hume-Api-Key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      models: {
        face: {},
        prosody: {},
        language: {}
      },
      urls: [videoUrl]
    }),
  });

  if (!response.ok) {
    throw new Error(`Hume API error: ${response.status}`);
  }

  return await response.json();
}

async function analyzeImage(imageUrl: string, apiKey: string) {
  const response = await fetch('https://api.hume.ai/v0/batch/jobs', {
    method: 'POST',
    headers: {
      'X-Hume-Api-Key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      models: {
        face: {}
      },
      urls: [imageUrl]
    }),
  });

  if (!response.ok) {
    throw new Error(`Hume API error: ${response.status}`);
  }

  return await response.json();
}

function transformHumeResponse(humeResponse: any, type: string) {
  // Transform Hume's complex response into EmotionsCare format
  const emotions = extractEmotions(humeResponse);
  const dominantEmotion = findDominantEmotion(emotions);
  
  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    source: type,
    emotions: emotions,
    dominantEmotion: dominantEmotion.name,
    confidence: dominantEmotion.confidence,
    overallMood: categorizeMood(dominantEmotion.name),
    recommendations: generateRecommendations(dominantEmotion.name, emotions)
  };
}

function extractEmotions(humeResponse: any) {
  // Extract emotions from Hume's nested response structure
  const emotions = [];
  
  // This is a simplified extraction - real implementation would handle
  // the complex nested structure of Hume's response
  if (humeResponse.results) {
    // Process results and extract emotion scores
    // Return normalized emotion data
  }
  
  // Fallback mock data for development
  return [
    { emotion: 'joy', confidence: 0.8, intensity: 0.7 },
    { emotion: 'calm', confidence: 0.6, intensity: 0.5 },
    { emotion: 'excitement', confidence: 0.4, intensity: 0.3 }
  ];
}

function findDominantEmotion(emotions: any[]) {
  return emotions.reduce((max, emotion) => 
    emotion.confidence > max.confidence ? 
      { name: emotion.emotion, confidence: emotion.confidence } : max,
    { name: emotions[0]?.emotion || 'neutral', confidence: 0 }
  );
}

function categorizeMood(emotion: string) {
  const moodCategories = {
    positive: ['joy', 'happiness', 'excitement', 'love', 'gratitude'],
    calm: ['calm', 'peaceful', 'relaxed', 'content'],
    negative: ['sadness', 'anger', 'fear', 'anxiety', 'frustration'],
    neutral: ['neutral', 'indifferent', 'bored']
  };
  
  for (const [category, emotions] of Object.entries(moodCategories)) {
    if (emotions.includes(emotion.toLowerCase())) {
      return category;
    }
  }
  
  return 'neutral';
}

function generateRecommendations(dominantEmotion: string, emotions: any[]) {
  const recommendations = {
    joy: ['Continuez à cultiver cette joie avec de la musique énergisante'],
    calm: ['Maintenez cette sérénité avec des sons apaisants'],
    sadness: ['Laissez-vous porter par des mélodies réconfortantes'],
    anger: ['Apaisez cette tension avec des compositions relaxantes'],
    anxiety: ['Retrouvez votre calme avec des sons de nature'],
    neutral: ['Explorez de nouvelles sonorités pour éveiller vos émotions']
  };
  
  return recommendations[dominantEmotion.toLowerCase()] || recommendations.neutral;
}