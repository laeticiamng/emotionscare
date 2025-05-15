
import { Emotion } from '@/types/emotions';

// Correct function name to match imports
export const fetchEmotionsHistory = async (userId: string): Promise<Emotion[]> => {
  // Simulating API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock data
  return [
    {
      id: '1',
      score: 8,
      date: new Date(2023, 4, 1).toISOString(),
      text: "I'm feeling great today!"
    },
    {
      id: '2',
      score: 5,
      date: new Date(2023, 4, 2).toISOString(),
      text: "Just a normal day, nothing special."
    },
    {
      id: '3',
      score: 3,
      date: new Date(2023, 4, 3).toISOString(),
      text: "Feeling a bit stressed with work."
    },
    {
      id: '4',
      score: 9,
      date: new Date(2023, 4, 4).toISOString(),
      text: "Amazing day! Got a promotion at work!"
    },
    {
      id: '5',
      score: 6,
      date: new Date(2023, 4, 5).toISOString(),
      text: "Decent day overall."
    }
  ] as Emotion[];
};

export const submitEmotionScan = async (emotionData: Partial<Emotion>): Promise<Emotion> => {
  // Simulating API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock response
  const newEmotion: Emotion = {
    id: Date.now().toString(),
    score: emotionData.score || 5,
    date: new Date().toISOString(),
    text: emotionData.text || "",
    emojis: emotionData.emojis || [],
    audio_url: emotionData.audio_url || undefined,
    ai_feedback: "Thank you for sharing your emotions. Based on your input, I recommend taking a few minutes to practice deep breathing."
  };
  
  return newEmotion;
};

export const getEmotionAnalysis = async (emotionData: Partial<Emotion>): Promise<string> => {
  // Simulating AI analysis
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock analysis
  const score = emotionData.score || 5;
  let analysis = "";
  
  if (score >= 7) {
    analysis = "You're doing great! Your positive emotions contribute to better overall health and wellbeing. Consider journaling about what went well today to reinforce these positive patterns.";
  } else if (score >= 4) {
    analysis = "You're in a balanced emotional state. This is a good time for reflection and planning. Consider what small changes might help improve your emotional wellbeing further.";
  } else {
    analysis = "You seem to be experiencing some difficult emotions. Remember that all emotions are temporary. Consider reaching out to someone you trust or trying a short meditation exercise.";
  }
  
  return analysis;
};
