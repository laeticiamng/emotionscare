
import { v4 as uuid } from 'uuid';
import { EmotionResult } from '@/types/emotion';

// Fonction pour récupérer la dernière émotion enregistrée pour un utilisateur
export const fetchLatestEmotion = async (userId: string): Promise<EmotionResult | null> => {
  // Dans une vraie application, ceci ferait un appel à une API ou une base de données
  console.log(`Fetching latest emotion for user: ${userId}`);
  
  // Simuler un délai réseau
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Retourner des données simulées
  return {
    id: uuid(),
    user_id: userId,
    date: new Date().toISOString(),
    score: 75,
    emojis: '😊',
    text: 'Je me sens bien aujourd\'hui',
    primary_emotion: 'joy',
    emotions: {
      joy: 0.75,
      calm: 0.15,
      sadness: 0.05,
      anxiety: 0.03,
      anger: 0.02
    }
  };
};

// Fonction pour créer une nouvelle entrée d'émotion
export const createEmotionEntry = async (data: Partial<EmotionResult>): Promise<EmotionResult> => {
  // Dans une vraie application, ceci enregistrerait les données dans une base de données
  console.log('Creating new emotion entry:', data);
  
  // Simuler un délai réseau
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Compléter les données si nécessaire et retourner l'entrée créée
  const completedData: EmotionResult = {
    id: data.id || uuid(),
    user_id: data.user_id || '',
    date: data.date || new Date().toISOString(),
    score: data.score !== undefined ? data.score : 50,
    emojis: data.emojis || '😐',
    text: data.text || '',
    primary_emotion: data.primary_emotion || 'neutral',
    emotions: data.emotions || {
      joy: 0.2,
      calm: 0.2,
      sadness: 0.2,
      anxiety: 0.2,
      anger: 0.2
    }
  };
  
  return completedData;
};

// Add missing analyzeEmotion function
export const analyzeEmotion = async (text: string): Promise<EmotionResult> => {
  console.log('Analyzing emotion from text:', text);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock emotions based on text content
  const emotions: Record<string, number> = {};
  const emotionKeywords: Record<string, string[]> = {
    joy: ['happy', 'glad', 'excited', 'joyful', 'content', 'pleased'],
    sadness: ['sad', 'upset', 'depressed', 'unhappy', 'down', 'disappointed'],
    anger: ['angry', 'mad', 'furious', 'irritated', 'annoyed', 'frustrated'],
    fear: ['afraid', 'scared', 'terrified', 'worried', 'nervous', 'anxious'],
    disgust: ['disgusted', 'revolted', 'repulsed', 'sickened'],
    surprise: ['surprised', 'shocked', 'amazed', 'astonished'],
    neutral: ['fine', 'okay', 'alright', 'neutral']
  };
  
  // Simple algorithm to detect emotions
  const lowerText = text.toLowerCase();
  let primaryEmotion = 'neutral';
  let highestScore = 0.2; // Default neutral score
  
  // Calculate scores for each emotion
  Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
    const matchCount = keywords.filter(word => lowerText.includes(word)).length;
    const emotionScore = matchCount > 0 ? 0.3 + (matchCount * 0.15) : 0.1;
    emotions[emotion] = Math.min(emotionScore, 0.95); // Cap at 0.95
    
    if (emotionScore > highestScore) {
      highestScore = emotionScore;
      primaryEmotion = emotion;
    }
  });
  
  // Generate feedback based on detected emotion
  const feedbackMap: Record<string, string> = {
    joy: "Vous semblez être de bonne humeur aujourd'hui!",
    sadness: "Vous semblez un peu mélancolique. Comment puis-je vous aider?",
    anger: "Je détecte de la frustration. Prenez quelques respirations profondes.",
    fear: "Vous semblez inquiet. Parlons de ce qui vous préoccupe.",
    disgust: "Quelque chose semble vous déranger.",
    surprise: "Vous semblez surpris ou étonné.",
    neutral: "Votre humeur semble plutôt neutre actuellement."
  };
  
  return {
    id: uuid(),
    user_id: 'user-1',
    date: new Date().toISOString(),
    timestamp: new Date().toISOString(),
    score: Math.round(highestScore * 100),
    confidence: highestScore,
    emotion: primaryEmotion,
    primary_emotion: primaryEmotion,
    text: text,
    transcript: text,
    feedback: feedbackMap[primaryEmotion] || "Merci de partager vos émotions.",
    emotions: emotions
  };
};

// Add missing saveEmotion function
export const saveEmotion = async (emotion: EmotionResult): Promise<EmotionResult> => {
  console.log('Saving emotion:', emotion);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real application, this would save to a database
  return {
    ...emotion,
    id: emotion.id || uuid()
  };
};
