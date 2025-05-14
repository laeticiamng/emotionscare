
import { EmotionResult, Emotion } from '@/types/emotion';
import { v4 as uuidv4 } from 'uuid';

// Fonction pour analyser les émotions à partir du texte, des emojis ou de l'audio
export const analyzeEmotion = async (data: {
  user_id: string;
  text?: string;
  emojis?: string;
  audio_url?: string;
  is_confidential?: boolean;
  share_with_coach?: boolean;
}): Promise<EmotionResult> => {
  // Simuler un délai d'analyse
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Analyse simpliste basée sur les données disponibles
  let emotion = 'neutral';
  let score = 5;
  
  if (data.text) {
    // Analyse basique des mots positifs et négatifs
    const positiveWords = ['heureux', 'content', 'joie', 'bonheur', 'super', 'bien', 'positif'];
    const negativeWords = ['triste', 'malheureux', 'déprimé', 'mal', 'colère', 'énervé', 'anxieux'];
    
    const text = data.text.toLowerCase();
    const foundPositive = positiveWords.some(word => text.includes(word));
    const foundNegative = negativeWords.some(word => text.includes(word));
    
    if (foundPositive && !foundNegative) {
      emotion = 'joy';
      score = Math.floor(Math.random() * 3) + 7; // 7-9
    } else if (foundNegative && !foundPositive) {
      emotion = 'sadness';
      score = Math.floor(Math.random() * 3) + 2; // 2-4
    } else if (foundPositive && foundNegative) {
      emotion = 'mixed';
      score = 5;
    }
  }
  
  if (data.emojis) {
    // Analyse simpliste basée sur les emojis
    if (data.emojis.includes('😊') || data.emojis.includes('😄') || data.emojis.includes('🙂')) {
      emotion = 'joy';
      score = Math.floor(Math.random() * 3) + 7; // 7-9
    } else if (data.emojis.includes('😔') || data.emojis.includes('😢') || data.emojis.includes('😞')) {
      emotion = 'sadness';
      score = Math.floor(Math.random() * 3) + 2; // 2-4
    } else if (data.emojis.includes('😡') || data.emojis.includes('😠')) {
      emotion = 'anger';
      score = Math.floor(Math.random() * 3) + 3; // 3-5
    }
  }
  
  // Générer un feedback basé sur l'émotion détectée
  let feedback = '';
  switch (emotion) {
    case 'joy':
      feedback = "C'est formidable de vous voir dans un état d'esprit positif ! Continuez à cultiver cette énergie.";
      break;
    case 'sadness':
      feedback = "Je perçois une certaine tristesse. N'hésitez pas à prendre un moment pour vous et peut-être parler à quelqu'un de confiance.";
      break;
    case 'anger':
      feedback = "Vous semblez ressentir de la colère. Essayez de prendre quelques respirations profondes et de vous accorder un moment de calme.";
      break;
    default:
      feedback = "Votre état émotionnel semble équilibré. C'est un bon moment pour réfléchir à vos objectifs.";
  }
  
  return {
    id: uuidv4(),
    emotion,
    dominantEmotion: emotion,
    score,
    text: data.text,
    transcript: data.text,
    emojis: data.emojis,
    feedback,
    ai_feedback: feedback,
    source: data.audio_url ? "audio" : "text"
  };
};

// Fonction pour sauvegarder une émotion
export const saveEmotion = async (emotion: Emotion): Promise<Emotion> => {
  // Simuler un délai de sauvegarde
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // En production, cela enverrait les données au backend
  console.log('Émotion sauvegardée:', emotion);
  
  return emotion;
};

// Fonction pour analyser un flux audio
export const analyzeAudioStream = async (
  audioBlob: Blob,
  userId: string,
  isConfidential: boolean
): Promise<EmotionResult> => {
  // Simuler un délai d'analyse
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Résultat fictif pour l'analyse audio
  const emotions = ['neutral', 'calm', 'joy', 'sadness', 'anxiety'];
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  const randomScore = Math.floor(Math.random() * 8) + 2; // 2-9
  
  const transcript = "Voici une transcription simulée de ce que vous avez dit. Dans un environnement réel, cela serait la transcription de votre audio.";
  
  const feedbacks = {
    neutral: "Votre voix a une tonalité neutre. C'est un bon moment pour explorer vos émotions plus profondément.",
    calm: "Vous semblez calme et posé. C'est une excellente disposition pour la réflexion et la concentration.",
    joy: "Je perçois de la joie dans votre voix. C'est merveilleux de vous entendre ainsi !",
    sadness: "Votre voix reflète une certaine mélancolie. Prenez le temps de reconnaître et d'accepter cette émotion.",
    anxiety: "Il semble y avoir de l'anxiété dans votre ton. Des exercices de respiration pourraient vous aider à retrouver votre calme."
  };
  
  return {
    id: uuidv4(),
    emotion: randomEmotion,
    dominantEmotion: randomEmotion,
    score: randomScore,
    transcript,
    feedback: feedbacks[randomEmotion as keyof typeof feedbacks],
    ai_feedback: feedbacks[randomEmotion as keyof typeof feedbacks],
    source: "audio"
  };
};
