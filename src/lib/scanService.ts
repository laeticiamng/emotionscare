
import { EmotionResult } from '@/types';

export async function analyzeAudioStream(audioBlob: Blob): Promise<EmotionResult> {
  try {
    // In a real implementation, this would send the audio to a server for processing
    // For now, we'll just mock a response
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing time
    
    const mockResult: EmotionResult = {
      id: crypto.randomUUID(),
      primaryEmotion: {
        name: randomEmotion(),
        score: Math.random() * 100
      },
      emotion: randomEmotion(),
      intensity: Math.random(),
      score: Math.floor(Math.random() * 100),
      confidence: 0.7 + Math.random() * 0.3,
      feedback: "Votre voix révèle un sentiment de calme mêlé à de l'enthousiasme. Je perçois une énergie positive dans votre intonation.",
      recommendations: [
        "Prenez un moment pour apprécier cette émotion positive",
        "Essayez de partager cette énergie avec votre entourage",
        "Notez ce qui a contribué à cet état émotionnel pour y revenir plus tard"
      ]
    };
    
    return mockResult;
  } catch (error) {
    console.error("Error analyzing audio:", error);
    throw new Error("Failed to analyze audio");
  }
}

function randomEmotion(): string {
  const emotions = ['calm', 'happy', 'focused', 'anxious', 'neutral', 'excited', 'contemplative', 'hopeful'];
  return emotions[Math.floor(Math.random() * emotions.length)];
}
