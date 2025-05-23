
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { text, audio, emojis, type } = await req.json();
    
    // Mock Hume AI analysis since we don't have the actual API key
    // In production, you would use the real Hume AI API
    
    let analysisResult;
    
    if (type === 'text' && text) {
      analysisResult = analyzeTextEmotions(text);
    } else if (type === 'audio' && audio) {
      analysisResult = analyzeAudioEmotions(text); // text from transcription
    } else if (type === 'emoji' && emojis) {
      analysisResult = analyzeEmojiEmotions(emojis);
    } else {
      throw new Error('Invalid analysis type or missing data');
    }

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in hume-analysis:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function analyzeTextEmotions(text: string) {
  // Simulate emotion analysis based on text content
  const positiveWords = ['heureux', 'joyeux', 'content', 'génial', 'parfait', 'excellent', 'merveilleux', 'fantastique'];
  const negativeWords = ['triste', 'déprimé', 'difficile', 'problème', 'stress', 'fatigue', 'mal', 'peur'];
  const neutralWords = ['travail', 'journée', 'temps', 'moment', 'situation', 'normal'];
  
  const lowerText = text.toLowerCase();
  
  let positiveCount = 0;
  let negativeCount = 0;
  let neutralCount = 0;
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) positiveCount++;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativeCount++;
  });
  
  neutralWords.forEach(word => {
    if (lowerText.includes(word)) neutralCount++;
  });
  
  let primaryEmotion = 'neutral';
  let averageScore = 50;
  let emotions = { neutral: 0.5, joy: 0.25, sadness: 0.25 };
  
  if (positiveCount > negativeCount) {
    primaryEmotion = 'joy';
    averageScore = 70 + Math.min(positiveCount * 5, 25);
    emotions = { joy: 0.6, excitement: 0.2, contentment: 0.1, neutral: 0.1 };
  } else if (negativeCount > positiveCount) {
    primaryEmotion = 'sadness';
    averageScore = 40 - Math.min(negativeCount * 3, 20);
    emotions = { sadness: 0.5, stress: 0.2, fatigue: 0.2, neutral: 0.1 };
  } else {
    averageScore = 55 + Math.random() * 20;
    emotions = { neutral: 0.4, calm: 0.3, contemplation: 0.2, balance: 0.1 };
  }
  
  const feedback = generateFeedback(primaryEmotion, averageScore);
  
  return {
    averageScore: Math.round(averageScore),
    topEmotion: primaryEmotion,
    emotions,
    feedback
  };
}

function analyzeAudioEmotions(transcribedText: string) {
  // For audio, we can analyze the transcribed text
  // In production, you would also analyze voice characteristics
  const textAnalysis = analyzeTextEmotions(transcribedText);
  
  // Simulate voice characteristic analysis
  const voiceStress = Math.random() * 0.3; // Simulate stress detection in voice
  
  // Adjust score based on simulated voice analysis
  textAnalysis.averageScore = Math.max(0, textAnalysis.averageScore - (voiceStress * 20));
  
  if (voiceStress > 0.2) {
    textAnalysis.emotions = {
      ...textAnalysis.emotions,
      stress: Math.min(0.4, textAnalysis.emotions.stress || 0 + voiceStress)
    };
  }
  
  textAnalysis.feedback += ' L\'analyse vocale révèle des nuances supplémentaires dans votre expression émotionnelle.';
  
  return textAnalysis;
}

function analyzeEmojiEmotions(emojis: string[]) {
  const emojiMap: Record<string, { emotion: string, score: number }> = {
    '😊': { emotion: 'joy', score: 80 },
    '😔': { emotion: 'sadness', score: 30 },
    '😤': { emotion: 'anger', score: 25 },
    '😰': { emotion: 'anxiety', score: 35 },
    '😍': { emotion: 'love', score: 90 },
    '🤔': { emotion: 'contemplation', score: 60 },
    '😴': { emotion: 'fatigue', score: 45 },
    '😎': { emotion: 'confidence', score: 85 },
    '🥳': { emotion: 'excitement', score: 95 },
    '😢': { emotion: 'sadness', score: 20 },
    '😡': { emotion: 'anger', score: 15 },
    '😌': { emotion: 'calm', score: 75 },
    '🤗': { emotion: 'affection', score: 85 },
    '😱': { emotion: 'fear', score: 25 },
    '🙄': { emotion: 'annoyance', score: 40 },
    '😇': { emotion: 'peace', score: 80 }
  };
  
  let totalScore = 0;
  const emotionCounts: Record<string, number> = {};
  
  emojis.forEach(emoji => {
    const emojiData = emojiMap[emoji];
    if (emojiData) {
      totalScore += emojiData.score;
      emotionCounts[emojiData.emotion] = (emotionCounts[emojiData.emotion] || 0) + 1;
    }
  });
  
  const averageScore = emojis.length > 0 ? totalScore / emojis.length : 50;
  
  // Find dominant emotion
  const dominantEmotion = Object.entries(emotionCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral';
  
  // Create emotion distribution
  const emotions: Record<string, number> = {};
  Object.entries(emotionCounts).forEach(([emotion, count]) => {
    emotions[emotion] = count / emojis.length;
  });
  
  const feedback = generateFeedback(dominantEmotion, averageScore);
  
  return {
    averageScore: Math.round(averageScore),
    topEmotion: dominantEmotion,
    emotions,
    feedback
  };
}

function generateFeedback(emotion: string, score: number): string {
  const feedbackMap: Record<string, string[]> = {
    joy: [
      "Votre état émotionnel reflète une belle énergie positive ! Continuez à cultiver cette joie.",
      "C'est merveilleux de voir cette émotion positive ressortir de votre expression.",
      "Votre joie transparaît clairement. Profitez de ces moments de bonheur."
    ],
    sadness: [
      "Je perçois une certaine mélancolie. Prenez soin de vous et n'hésitez pas à chercher du soutien.",
      "Ces émotions difficiles sont normales. Accordez-vous de la bienveillance.",
      "Il est important de reconnaître ces sentiments. Vous n'êtes pas seul(e)."
    ],
    neutral: [
      "Votre état émotionnel semble équilibré. C'est un bon point de départ pour la journée.",
      "Une humeur stable est précieuse. Profitez de cette sérénité.",
      "Cet équilibre émotionnel est sain. Vous semblez en harmonie."
    ],
    stress: [
      "Je détecte des signes de stress. Prenez quelques respirations profondes.",
      "Le stress fait partie de la vie, mais il est important de le gérer. Pensez à une pause.",
      "Votre tension est perceptible. Des exercices de relaxation pourraient vous aider."
    ]
  };
  
  const messages = feedbackMap[emotion] || feedbackMap.neutral;
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  
  let scoreComment = '';
  if (score >= 80) {
    scoreComment = ' Votre score de bien-être est excellent !';
  } else if (score >= 60) {
    scoreComment = ' Votre niveau de bien-être est bon.';
  } else if (score >= 40) {
    scoreComment = ' Votre bien-être pourrait bénéficier d\'attention.';
  } else {
    scoreComment = ' Il semble important de prendre soin de votre bien-être actuellement.';
  }
  
  return randomMessage + scoreComment;
}
