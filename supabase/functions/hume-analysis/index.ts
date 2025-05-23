
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HumeAnalysisRequest {
  type: 'facial' | 'voice' | 'text';
  image?: string; // base64
  audio?: string; // base64
  text?: string;
  options?: {
    language?: string;
    returnFaceDetails?: boolean;
    includeProsody?: boolean;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body: HumeAnalysisRequest = await req.json();
    const { type, image, audio, text, options = {} } = body;

    console.log(`Processing ${type} analysis request`);

    // Mock Hume AI analysis - in production, this would call the real Hume API
    let analysisResult;

    switch (type) {
      case 'facial':
        analysisResult = await mockFacialAnalysis(image, options);
        break;
      case 'voice':
        analysisResult = await mockVoiceAnalysis(audio, text, options);
        break;
      case 'text':
        analysisResult = await mockTextAnalysis(text, options);
        break;
      default:
        throw new Error(`Unsupported analysis type: ${type}`);
    }

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in hume-analysis:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        dominantEmotion: 'neutral',
        confidence: 0.5,
        emotions: { neutral: 0.5 }
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function mockFacialAnalysis(imageBase64?: string, options: any = {}) {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const emotions = {
    joy: Math.random() * 0.4 + 0.3,
    sadness: Math.random() * 0.3 + 0.1,
    anger: Math.random() * 0.2 + 0.05,
    fear: Math.random() * 0.15 + 0.05,
    surprise: Math.random() * 0.25 + 0.1,
    neutral: Math.random() * 0.4 + 0.2
  };

  // Normalize emotions
  const total = Object.values(emotions).reduce((sum, val) => sum + val, 0);
  Object.keys(emotions).forEach(key => {
    emotions[key] = emotions[key] / total;
  });

  const dominantEmotion = Object.entries(emotions).reduce((a, b) => 
    emotions[a[0]] > emotions[b[0]] ? a : b
  )[0];

  const result = {
    dominantEmotion,
    confidence: emotions[dominantEmotion],
    emotions,
    sentiment: emotions.joy > 0.4 ? 'positive' : emotions.sadness > 0.4 ? 'negative' : 'neutral',
    analysisType: 'facial'
  };

  if (options.returnFaceDetails) {
    result.facialFeatures = {
      eyeOpenness: Math.random() * 0.3 + 0.7,
      smileIntensity: emotions.joy,
      attentionFocus: Math.random() * 0.4 + 0.6,
      facePosition: {
        x: Math.random() * 0.2 + 0.4,
        y: Math.random() * 0.2 + 0.4
      }
    };
  }

  return result;
}

async function mockVoiceAnalysis(audioBase64?: string, text?: string, options: any = {}) {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const emotions = {
    calm: Math.random() * 0.4 + 0.2,
    excited: Math.random() * 0.3 + 0.1,
    stressed: Math.random() * 0.2 + 0.1,
    sad: Math.random() * 0.25 + 0.1,
    happy: Math.random() * 0.35 + 0.15,
    neutral: Math.random() * 0.3 + 0.2
  };

  // Normalize emotions
  const total = Object.values(emotions).reduce((sum, val) => sum + val, 0);
  Object.keys(emotions).forEach(key => {
    emotions[key] = emotions[key] / total;
  });

  const dominantEmotion = Object.entries(emotions).reduce((a, b) => 
    emotions[a[0]] > emotions[b[0]] ? a : b
  )[0];

  const result = {
    dominantEmotion,
    confidence: emotions[dominantEmotion],
    emotions,
    sentiment: emotions.happy > 0.3 ? 'positive' : emotions.sad > 0.3 ? 'negative' : 'neutral',
    analysisType: 'voice'
  };

  if (options.includeProsody) {
    result.prosody = {
      pace: ['slow', 'moderate', 'fast'][Math.floor(Math.random() * 3)],
      pitch: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      variation: ['monotone', 'dynamic', 'varied'][Math.floor(Math.random() * 3)],
      volume: Math.random() * 0.4 + 0.3
    };
  }

  return result;
}

async function mockTextAnalysis(text?: string, options: any = {}) {
  if (!text) {
    throw new Error('Text is required for text analysis');
  }

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Simple sentiment analysis based on keywords
  const positiveWords = ['happy', 'joy', 'great', 'excellent', 'good', 'love', 'amazing', 'wonderful'];
  const negativeWords = ['sad', 'angry', 'bad', 'terrible', 'hate', 'awful', 'horrible', 'depressed'];
  const stressWords = ['stress', 'anxiety', 'worried', 'nervous', 'pressure', 'overwhelmed'];

  const textLower = text.toLowerCase();
  const positiveCount = positiveWords.filter(word => textLower.includes(word)).length;
  const negativeCount = negativeWords.filter(word => textLower.includes(word)).length;
  const stressCount = stressWords.filter(word => textLower.includes(word)).length;

  let emotions = {
    happy: Math.max(0.1, positiveCount * 0.3 + Math.random() * 0.2),
    sad: Math.max(0.1, negativeCount * 0.3 + Math.random() * 0.2),
    angry: Math.max(0.05, negativeCount * 0.2 + Math.random() * 0.15),
    anxious: Math.max(0.05, stressCount * 0.4 + Math.random() * 0.2),
    calm: Math.max(0.1, (1 - stressCount * 0.2) * 0.4 + Math.random() * 0.2),
    neutral: Math.random() * 0.3 + 0.2
  };

  // Normalize emotions
  const total = Object.values(emotions).reduce((sum, val) => sum + val, 0);
  Object.keys(emotions).forEach(key => {
    emotions[key] = emotions[key] / total;
  });

  const dominantEmotion = Object.entries(emotions).reduce((a, b) => 
    emotions[a[0]] > emotions[b[0]] ? a : b
  )[0];

  return {
    dominantEmotion,
    confidence: emotions[dominantEmotion],
    emotions,
    sentiment: emotions.happy > 0.3 ? 'positive' : emotions.sad > 0.3 ? 'negative' : 'neutral',
    analysisType: 'text',
    textLength: text.length,
    keywordMatches: {
      positive: positiveCount,
      negative: negativeCount,
      stress: stressCount
    }
  };
}
