
import { Emotion, EmotionResult } from '@/types';
import { v4 as uuid } from 'uuid';

// Mock database of emotions
let emotionsDB: Emotion[] = [];

// Save a new emotion entry
export async function saveEmotion(emotion: Emotion): Promise<Emotion> {
  // Ensure the emotion has an ID
  if (!emotion.id) {
    emotion.id = uuid();
  }
  
  // Set date if not provided
  if (!emotion.date) {
    emotion.date = new Date().toISOString();
  }
  
  // Add to "database"
  emotionsDB.push(emotion);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return emotion;
}

// Fetch the latest emotion for a user
export async function fetchLatestEmotion(userId: string): Promise<Emotion | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Find emotions for this user, sorted by date (newest first)
  const userEmotions = emotionsDB
    .filter(e => e.user_id === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return userEmotions.length > 0 ? userEmotions[0] : null;
}

// Fetch all emotions for a user
export async function fetchUserEmotions(userId: string): Promise<Emotion[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Find emotions for this user, sorted by date (newest first)
  return emotionsDB
    .filter(e => e.user_id === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Process an emotion scan result
export async function processEmotionScan(
  userId: string, 
  scanData: { text?: string; emojis?: string; audio_url?: string }
): Promise<EmotionResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock emotion detection based on input
  let emotion = 'neutral';
  let score = 50 + Math.floor(Math.random() * 30);
  
  // Very basic emotion detection for demo purposes
  if (scanData.text) {
    const text = scanData.text.toLowerCase();
    if (text.includes('happy') || text.includes('glad') || text.includes('joy')) emotion = 'happy';
    else if (text.includes('sad') || text.includes('upset')) emotion = 'sad';
    else if (text.includes('angry') || text.includes('mad')) emotion = 'angry';
    else if (text.includes('scared') || text.includes('afraid')) emotion = 'fearful';
    else if (text.includes('calm') || text.includes('relaxed')) emotion = 'calm';
    else if (text.includes('tired') || text.includes('exhausted')) emotion = 'tired';
    else if (text.includes('stressed') || text.includes('overwhelmed')) emotion = 'stressed';
  }
  
  // Emoji-based detection
  if (scanData.emojis) {
    if (scanData.emojis.includes('😊') || scanData.emojis.includes('😃')) emotion = 'happy';
    else if (scanData.emojis.includes('😔') || scanData.emojis.includes('😢')) emotion = 'sad';
    else if (scanData.emojis.includes('😡') || scanData.emojis.includes('😠')) emotion = 'angry';
    else if (scanData.emojis.includes('😨') || scanData.emojis.includes('😰')) emotion = 'fearful';
    else if (scanData.emojis.includes('😌') || scanData.emojis.includes('🧘')) emotion = 'calm';
    else if (scanData.emojis.includes('😴') || scanData.emojis.includes('🥱')) emotion = 'tired';
    else if (scanData.emojis.includes('😩') || scanData.emojis.includes('😫')) emotion = 'stressed';
  }
  
  // Generate a mock result
  const result: EmotionResult = {
    id: uuid(),
    user_id: userId,
    date: new Date().toISOString(),
    emotion: emotion,
    score: score,
    confidence: score / 100,
    intensity: (score - 40) / 60, // Scale to 0-1
    text: scanData.text,
    emojis: scanData.emojis,
    feedback: generateFeedback(emotion),
    recommendations: generateRecommendations(emotion)
  };
  
  return result;
}

// Create a new emotion entry from user input
export async function createEmotionEntry(data: {
  user_id: string;
  text?: string;
  emojis?: string;
  audio_url?: string;
}): Promise<Emotion> {
  // Process the scan
  const scanResult = await processEmotionScan(data.user_id, {
    text: data.text,
    emojis: data.emojis,
    audio_url: data.audio_url
  });
  
  // Create and save the emotion
  const emotion: Emotion = {
    id: scanResult.id || uuid(),
    user_id: data.user_id,
    date: scanResult.date || new Date().toISOString(),
    emotion: scanResult.emotion,
    name: scanResult.emotion,
    score: scanResult.score,
    confidence: scanResult.confidence,
    intensity: scanResult.intensity,
    text: scanResult.text,
    emojis: scanResult.emojis,
    ai_feedback: scanResult.feedback,
    source: 'manual',
    category: 'emotion'
  };
  
  return await saveEmotion(emotion);
}

// Helper function to generate feedback
function generateFeedback(emotion: string): string {
  const feedbacks: Record<string, string[]> = {
    'happy': [
      'Vous semblez être dans un état de joie et de bien-être. C\'est le moment idéal pour accomplir des tâches créatives.',
      'Votre bonne humeur peut être contagieuse! Profitez-en pour collaborer avec vos collègues.'
    ],
    'sad': [
      'Vous semblez ressentir de la tristesse. C\'est une émotion normale qui nous rappelle ce qui compte pour nous.',
      'La tristesse peut parfois nous aider à réfléchir et à prendre du recul. Une petite pause pourrait vous faire du bien.'
    ],
    'angry': [
      'Vous semblez ressentir de la colère. Cette énergie peut être canalisée de façon constructive.',
      'La colère nous signale souvent qu\'une limite a été franchie. Essayez de prendre quelques respirations profondes.'
    ],
    'fearful': [
      'Vous semblez ressentir de la peur ou de l\'anxiété. Ces émotions nous aident à identifier des risques potentiels.',
      'L\'anxiété peut parfois nous submerger. Une courte méditation pourrait vous aider à retrouver votre calme.'
    ],
    'calm': [
      'Vous semblez être dans un état de calme. C\'est idéal pour la concentration et la réflexion.',
      'Le calme est un état précieux. Profitez-en pour avancer sur des tâches qui demandent de la précision.'
    ],
    'tired': [
      'Vous semblez être fatigué. Votre corps vous envoie peut-être un signal qu\'il est temps de ralentir.',
      'La fatigue peut affecter notre concentration et notre humeur. Une courte pause pourrait vous revitaliser.'
    ],
    'stressed': [
      'Vous semblez être stressé. Le stress est une réponse naturelle face aux défis, mais il est important de le gérer.',
      'Face au stress, essayez de décomposer vos tâches en étapes plus petites et plus gérables.'
    ],
    'neutral': [
      'Votre état émotionnel semble équilibré. C\'est un bon moment pour planifier ou prendre des décisions.',
      'Un état neutre offre une clarté mentale qui peut être bénéfique pour évaluer des situations complexes.'
    ]
  };
  
  // Get feedback for this emotion or default to neutral
  const emotionFeedbacks = feedbacks[emotion] || feedbacks['neutral'];
  
  // Return a random feedback
  return emotionFeedbacks[Math.floor(Math.random() * emotionFeedbacks.length)];
}

// Helper function to generate recommendations
function generateRecommendations(emotion: string): string[] {
  const allRecommendations: Record<string, string[]> = {
    'happy': [
      'Partagez cette énergie positive avec votre équipe',
      'Profitez de cet élan pour des tâches créatives',
      'Notez ce qui vous a mis dans cet état pour le reproduire'
    ],
    'sad': [
      'Prenez une courte pause de 5 minutes',
      'Écoutez une musique apaisante',
      'Parlez à quelqu\'un en qui vous avez confiance'
    ],
    'angry': [
      'Faites quelques respirations profondes',
      'Prenez un moment pour identifier la source de cette colère',
      'Reportez les décisions importantes à plus tard'
    ],
    'fearful': [
      'Essayez notre exercice de respiration guidée',
      'Écrivez ce qui vous préoccupe pour prendre du recul',
      'Divisez les grands défis en petites étapes gérables'
    ],
    'calm': [
      'C\'est le moment idéal pour des tâches nécessitant de la concentration',
      'Profitez de cette clarté mentale pour planifier',
      'Notez ce qui vous aide à maintenir cet état'
    ],
    'tired': [
      'Considérez une courte pause ou micro-sieste',
      'Hydratez-vous et prenez une collation nutritive',
      'Faites quelques étirements pour vous revitaliser'
    ],
    'stressed': [
      'Essayez notre session de micro-méditation de 2 minutes',
      'Réorganisez votre liste de tâches par priorité',
      'Faites une courte marche pour vous aérer l\'esprit'
    ],
    'neutral': [
      'C\'est un bon moment pour planifier votre journée',
      'Essayez une session de brainstorming sur un projet',
      'Réfléchissez à vos priorités actuelles'
    ]
  };
  
  const recommendations = allRecommendations[emotion] || allRecommendations['neutral'];
  return recommendations;
}
