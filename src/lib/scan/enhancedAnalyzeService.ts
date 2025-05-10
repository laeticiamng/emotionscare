
import { v4 as uuidv4 } from 'uuid';
import { EmotionResult, EnhancedEmotionResult } from '@/types';
import { analyzeEmotion, analyzeAudioEmotion } from './analyzeService';

// Emotion to color mapping
const EMOTION_COLORS: Record<string, string> = {
  happy: '#FFD700', // Gold
  joyful: '#FFA500', // Orange
  excited: '#FF4500', // OrangeRed
  content: '#90EE90', // LightGreen
  neutral: '#A9A9A9', // DarkGray
  sad: '#6495ED', // CornflowerBlue
  anxious: '#DA70D6', // Orchid
  stressed: '#FF6347', // Tomato
  angry: '#DC143C', // Crimson
  frustrated: '#FF4500', // OrangeRed
  calm: '#87CEEB', // SkyBlue
  relaxed: '#98FB98', // PaleGreen
};

// Improvement tips by emotion
const EMOTION_TIPS: Record<string, string[]> = {
  happy: ['Share your joy with someone', 'Express gratitude', 'Document this feeling'],
  joyful: ['Savor this moment', 'Keep a joy journal', 'Share your happiness'],
  excited: ['Channel this energy into something creative', 'Share your excitement', 'Set new goals'],
  content: ['Practice mindfulness', 'Enjoy the peace', 'Reflect on what\'s working well'],
  neutral: ['Try something new', 'Connect with nature', 'Engage in a hobby'],
  sad: ['Reach out to someone', 'Practice self-compassion', 'Allow yourself to feel'],
  anxious: ['Practice deep breathing', 'List your worries then reframe them', 'Move your body'],
  stressed: ['Take a break', 'Prioritize your tasks', 'Practice progressive muscle relaxation'],
  angry: ['Count to ten before reacting', 'Express your feelings appropriately', 'Find physical outlet'],
  frustrated: ['Take a step back', 'Break problems into smaller parts', 'Ask for help if needed'],
  calm: ['Continue mindfulness practices', 'Establish regular meditation', 'Notice what brings you peace'],
  relaxed: ['Appreciate this state', 'Create more moments like this', 'Share relaxing activities with others']
};

// Analyze text with enhanced results
export async function analyzeEmotionEnhanced(text: string): Promise<EnhancedEmotionResult> {
  // First get the basic emotion analysis
  const basicResult = await analyzeEmotion(text);
  
  // Then enhance it with additional information
  const enhanced: EnhancedEmotionResult = {
    ...basicResult,
    analysis: getEmotionDescription(basicResult.emotion),
    color: getEmotionColor(basicResult.emotion),
    recommendations: {
      activities: getImprovementTips(basicResult.emotion),
      music: ['Relaxing playlist', 'Focus music', 'Nature sounds'],
      breathing: ['4-7-8 breathing', 'Box breathing', 'Deep belly breathing']
    },
    insights: ['Your emotion may be affecting your decision-making', 'Consider taking a short break'],
    triggers: ['Work stress', 'Relationship dynamics'],
    score: basicResult.score || 50, // Ensure score is set
    feedback: basicResult.feedback,
    timestamp: new Date()
  };
  
  return enhanced;
}

// Analyze audio with enhanced results
export async function analyzeAudioEmotionEnhanced(audioData: Blob): Promise<EnhancedEmotionResult> {
  // First get the basic audio emotion analysis
  const basicResult = await analyzeAudioEmotion(audioData);
  
  // Then enhance it with additional information
  const enhanced: EnhancedEmotionResult = {
    ...basicResult,
    analysis: getEmotionDescription(basicResult.emotion),
    color: getEmotionColor(basicResult.emotion),
    recommendations: {
      activities: getImprovementTips(basicResult.emotion),
      music: ['Relaxing playlist', 'Focus music', 'Nature sounds'],
      breathing: ['4-7-8 breathing', 'Box breathing', 'Deep belly breathing']
    },
    insights: ['Your speech patterns indicate your emotional state', 'You can improve your well-being by practicing vocal awareness'],
    triggers: ['Speaking speed', 'Tone variations'],
    score: basicResult.score || 50, // Ensure score is set
    feedback: basicResult.feedback,
    transcript: basicResult.transcript,
    timestamp: new Date()
  };
  
  return enhanced;
}

// Helper function to get emotion description
function getEmotionDescription(emotion: string): string {
  const descriptions: Record<string, string> = {
    happy: "Happiness is a state of well-being characterized by emotions ranging from contentment to intense joy.",
    joyful: "Joy is a feeling of great pleasure and happiness that comes from success or good fortune.",
    excited: "Excitement is a feeling of great enthusiasm and eagerness.",
    content: "Contentment is a state of satisfaction and ease.",
    neutral: "A neutral emotional state is balanced, neither particularly positive nor negative.",
    sad: "Sadness is an emotional pain associated with feelings of disadvantage, loss, helplessness, and sorrow.",
    anxious: "Anxiety is characterized by feelings of tension, worried thoughts and physical changes.",
    stressed: "Stress is your body's reaction to pressure from a certain situation or event.",
    angry: "Anger is a strong feeling of annoyance, displeasure, or hostility.",
    frustrated: "Frustration is the feeling of being upset or annoyed as a result of being unable to achieve something.",
    calm: "Calmness is the state of being free from agitation or disturbance.",
    relaxed: "Being relaxed means being free from tension and anxiety."
  };
  
  return descriptions[emotion] || "This emotion reflects your current state of mind.";
}

// Helper function to get color associated with an emotion
function getEmotionColor(emotion: string): string {
  return EMOTION_COLORS[emotion] || '#A9A9A9'; // Default to dark gray if not found
}

// Helper function to get improvement tips for an emotion
function getImprovementTips(emotion: string): string[] {
  return EMOTION_TIPS[emotion] || [
    'Practice mindfulness',
    'Connect with others',
    'Engage in physical activity'
  ];
}

export default {
  analyzeEmotionEnhanced,
  analyzeAudioEmotionEnhanced,
  getEmotionColor,
  getEmotionDescription,
  getImprovementTips
};
