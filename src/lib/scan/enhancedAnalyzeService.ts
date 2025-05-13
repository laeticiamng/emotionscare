
import { Emotion, EmotionResult, EnhancedEmotionResult } from '@/types/emotion';
import { OpenAIClient } from '../api/openAIClient';

export const enhanceEmotionAnalysis = async (emotion: Partial<EmotionResult>): Promise<EnhancedEmotionResult> => {
  // In a real app, this would call an AI service to get insights
  // For now, return mock enhanced data
  
  const dominantEmotionName = emotion.dominantEmotion?.name || emotion.emotion || 'neutral';
  const textContent = emotion.text || '';
  
  // Create enhanced result with insights
  const result: EnhancedEmotionResult = {
    emotions: emotion.emotions || [{ name: dominantEmotionName, intensity: emotion.intensity || 0.5 }],
    dominantEmotion: emotion.dominantEmotion || { name: dominantEmotionName, intensity: emotion.intensity || 0.5 },
    score: emotion.score || 0.5,
    source: emotion.source || 'text',
    text: textContent,
    insights: generateInsightsForEmotion(dominantEmotionName),
    recommendations: generateRecommendationsForEmotion(dominantEmotionName),
    triggers: detectTriggersFromText(textContent)
  };
  
  return result;
};

const generateInsightsForEmotion = (emotion: string): string => {
  const insights: Record<string, string> = {
    'happiness': 'Vous semblez être dans un état positif aujourd'hui. La joie est associée à une libération de dopamine et d'endorphines.',
    'sadness': 'La tristesse est une émotion naturelle qui nous aide à traiter les pertes. Elle peut nous inciter à chercher du soutien.',
    'anger': 'La colère est souvent liée à un sentiment d'injustice ou de frustration. La reconnaître est la première étape pour la gérer.',
    'fear': 'La peur est un mécanisme de protection, mais elle peut parfois nous empêcher d'avancer.',
    'surprise': 'La surprise nous aide à nous adapter rapidement à de nouvelles situations et stimule notre curiosité.',
    'disgust': 'Le dégoût est une émotion protectrice qui nous aide à éviter des situations potentiellement nuisibles.',
    'neutral': 'Un état émotionnel neutre peut indiquer un équilibre ou une période de transition.'
  };
  
  return insights[emotion.toLowerCase()] || 'Cette émotion reflète votre état intérieur actuel.';
};

const generateRecommendationsForEmotion = (emotion: string): string[] => {
  const recommendations: Record<string, string[]> = {
    'happiness': [
      'Partagez votre joie avec d'autres personnes pour renforcer ce sentiment',
      'Notez ce qui vous rend heureux dans un journal de gratitude',
      'Utilisez cette énergie positive pour accomplir des tâches difficiles'
    ],
    'sadness': [
      'Accordez-vous le droit de ressentir cette tristesse sans jugement',
      'Parlez à quelqu'un de confiance ou écrivez vos pensées',
      'Écoutez de la musique qui résonne avec votre humeur actuelle'
    ],
    'anger': [
      'Prenez quelques respirations profondes pour calmer votre système nerveux',
      'Identifiez la cause exacte de votre colère',
      'Exprimez vos sentiments de façon constructive'
    ],
    'fear': [
      'Pratiquez des exercices de respiration pour apaiser l'anxiété',
      'Concentrez-vous sur ce que vous pouvez contrôler',
      'Imaginez le meilleur scénario possible'
    ],
    'surprise': [
      'Prenez un moment pour assimiler les nouvelles informations',
      'Identifiez comment cette surprise peut être une opportunité',
      'Partagez votre expérience avec d'autres'
    ],
    'disgust': [
      'Essayez de comprendre la source de ce sentiment',
      'Prenez du recul par rapport à la situation',
      'Considérez différentes perspectives'
    ],
    'neutral': [
      'Profitez de cet équilibre pour réfléchir à vos objectifs',
      'C'est un bon moment pour pratiquer la pleine conscience',
      'Envisagez de nouvelles activités qui pourraient vous stimuler'
    ]
  };
  
  return recommendations[emotion.toLowerCase()] || [
    'Prenez un moment pour réfléchir à ce que vous ressentez',
    'Pratiquez la pleine conscience pour mieux comprendre vos émotions',
    'Pensez à discuter de vos émotions avec un professionnel'
  ];
};

const detectTriggersFromText = (text: string): string[] => {
  if (!text) return [];
  
  const commonTriggers = [
    { words: ['travail', 'boss', 'collègue', 'bureau', 'projet', 'deadline'], trigger: 'Stress professionnel' },
    { words: ['fatigue', 'épuisé', 'dormir', 'insomnie', 'repos'], trigger: 'Fatigue' },
    { words: ['famille', 'enfant', 'parent', 'conjoint', 'relation'], trigger: 'Dynamiques familiales' },
    { words: ['anxieux', 'stress', 'inquiet', 'préoccupé', 'peur'], trigger: 'Anxiété' }
  ];
  
  const detectedTriggers = new Set<string>();
  
  const lowerText = text.toLowerCase();
  
  commonTriggers.forEach(({ words, trigger }) => {
    if (words.some(word => lowerText.includes(word))) {
      detectedTriggers.add(trigger);
    }
  });
  
  if (detectedTriggers.size === 0 && text.length > 0) {
    detectedTriggers.add('Facteurs personnels');
  }
  
  return Array.from(detectedTriggers);
};
