
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmotionAnalysisRequest {
  type: 'text' | 'audio' | 'image';
  data: string; // text content or base64 data
  options?: {
    language?: string;
    includeRecommendations?: boolean;
    includeSentiment?: boolean;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body: EmotionAnalysisRequest = await req.json();
    const { type, data, options = {} } = body;

    console.log(`Processing enhanced ${type} emotion analysis`);

    let analysisResult;

    switch (type) {
      case 'text':
        analysisResult = await enhancedTextAnalysis(data, options);
        break;
      case 'audio':
        analysisResult = await enhancedAudioAnalysis(data, options);
        break;
      case 'image':
        analysisResult = await enhancedImageAnalysis(data, options);
        break;
      default:
        throw new Error(`Unsupported analysis type: ${type}`);
    }

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in enhanced-emotion-analyze:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        dominantEmotion: 'neutral',
        confidence: 0.5,
        emotions: { neutral: 0.5 },
        sentiment: 'neutral'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function enhancedTextAnalysis(text: string, options: any = {}) {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Enhanced text analysis with more sophisticated emotion detection
  const emotionKeywords = {
    joy: ['happy', 'joyful', 'excited', 'elated', 'cheerful', 'content', 'pleased', 'delighted'],
    sadness: ['sad', 'depressed', 'melancholy', 'downcast', 'blue', 'glum', 'dejected'],
    anger: ['angry', 'furious', 'mad', 'irritated', 'annoyed', 'rage', 'frustrated'],
    fear: ['afraid', 'scared', 'terrified', 'anxious', 'worried', 'nervous', 'frightened'],
    surprise: ['surprised', 'amazed', 'astonished', 'shocked', 'stunned', 'bewildered'],
    disgust: ['disgusted', 'revolted', 'repulsed', 'sick', 'nauseated'],
    calm: ['calm', 'peaceful', 'serene', 'tranquil', 'relaxed', 'zen', 'centered'],
    love: ['love', 'adore', 'cherish', 'treasure', 'devoted', 'affection'],
    trust: ['trust', 'confidence', 'faith', 'reliable', 'secure', 'safe']
  };

  const textLower = text.toLowerCase();
  const emotions = {};

  // Calculate emotion scores based on keyword presence and intensity
  Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
    let score = 0;
    keywords.forEach(keyword => {
      const matches = (textLower.match(new RegExp(keyword, 'g')) || []).length;
      score += matches * (1 + Math.random() * 0.3); // Add some randomness
    });
    
    // Normalize and add baseline
    emotions[emotion] = Math.max(0.05, Math.min(0.9, score * 0.1 + Math.random() * 0.2));
  });

  // Add neutral baseline
  emotions.neutral = Math.random() * 0.3 + 0.1;

  // Normalize emotions
  const total = Object.values(emotions).reduce((sum: number, val: number) => sum + val, 0);
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
    sentiment: calculateSentiment(emotions),
    analysisType: 'enhanced_text',
    textMetrics: {
      length: text.length,
      wordCount: text.split(/\s+/).length,
      sentenceCount: text.split(/[.!?]+/).length
    }
  };

  if (options.includeRecommendations) {
    result.recommendations = generateRecommendations(dominantEmotion, emotions[dominantEmotion]);
  }

  return result;
}

async function enhancedAudioAnalysis(audioBase64: string, options: any = {}) {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock enhanced audio analysis
  const emotions = {
    calm: Math.random() * 0.4 + 0.2,
    happy: Math.random() * 0.3 + 0.1,
    sad: Math.random() * 0.25 + 0.1,
    angry: Math.random() * 0.2 + 0.05,
    anxious: Math.random() * 0.3 + 0.1,
    neutral: Math.random() * 0.2 + 0.1
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
    sentiment: calculateSentiment(emotions),
    analysisType: 'enhanced_audio',
    audioMetrics: {
      duration: Math.random() * 10 + 5, // 5-15 seconds
      averageVolume: Math.random() * 0.5 + 0.3,
      pitchVariation: Math.random() * 0.4 + 0.2
    }
  };

  if (options.includeRecommendations) {
    result.recommendations = generateRecommendations(dominantEmotion, emotions[dominantEmotion]);
  }

  return result;
}

async function enhancedImageAnalysis(imageBase64: string, options: any = {}) {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1200));

  // Mock enhanced image analysis
  const emotions = {
    joy: Math.random() * 0.4 + 0.1,
    sadness: Math.random() * 0.3 + 0.1,
    surprise: Math.random() * 0.25 + 0.05,
    anger: Math.random() * 0.2 + 0.05,
    fear: Math.random() * 0.15 + 0.05,
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
    sentiment: calculateSentiment(emotions),
    analysisType: 'enhanced_image',
    imageMetrics: {
      faceCount: Math.floor(Math.random() * 3) + 1,
      primaryFaceSize: Math.random() * 0.4 + 0.3,
      lightingQuality: Math.random() * 0.3 + 0.7
    }
  };

  if (options.includeRecommendations) {
    result.recommendations = generateRecommendations(dominantEmotion, emotions[dominantEmotion]);
  }

  return result;
}

function calculateSentiment(emotions: Record<string, number>): string {
  const positiveEmotions = ['joy', 'happy', 'love', 'trust', 'calm'];
  const negativeEmotions = ['sadness', 'anger', 'fear', 'disgust'];

  const positiveScore = positiveEmotions.reduce((sum, emotion) => sum + (emotions[emotion] || 0), 0);
  const negativeScore = negativeEmotions.reduce((sum, emotion) => sum + (emotions[emotion] || 0), 0);

  if (positiveScore > negativeScore + 0.1) return 'positive';
  if (negativeScore > positiveScore + 0.1) return 'negative';
  return 'neutral';
}

function generateRecommendations(emotion: string, confidence: number) {
  const recommendations = {
    joy: [
      { type: 'activity', content: 'Partagez votre joie avec vos proches' },
      { type: 'music', content: 'Écoutez de la musique énergisante' }
    ],
    sadness: [
      { type: 'activity', content: 'Prenez du temps pour vous, pratiquez l\'auto-compassion' },
      { type: 'music', content: 'Écoutez de la musique apaisante' }
    ],
    anger: [
      { type: 'activity', content: 'Prenez de profondes respirations, faites de l\'exercice' },
      { type: 'music', content: 'Écoutez de la musique relaxante' }
    ],
    fear: [
      { type: 'activity', content: 'Pratiquez la méditation ou parlez à quelqu\'un' },
      { type: 'music', content: 'Écoutez de la musique rassurante' }
    ],
    calm: [
      { type: 'activity', content: 'Profitez de ce moment de paix' },
      { type: 'music', content: 'Continuez avec de la musique douce' }
    ]
  };

  return recommendations[emotion] || [
    { type: 'activity', content: 'Prenez un moment pour réfléchir à vos émotions' },
    { type: 'music', content: 'Écoutez de la musique qui vous fait du bien' }
  ];
}
