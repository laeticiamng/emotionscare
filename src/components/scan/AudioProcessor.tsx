
import React, { useEffect, useRef, useState } from 'react';
import { EmotionResult } from '@/types/emotion';

interface AudioProcessorProps {
  isRecording: boolean;
  onResult?: (result: EmotionResult) => void;
  onProcessingChange?: (isProcessing: boolean) => void;
}

const AudioProcessor: React.FC<AudioProcessorProps> = ({ 
  isRecording, 
  onResult,
  onProcessingChange
}) => {
  const [audioData, setAudioData] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Reset audio data when recording starts
  useEffect(() => {
    if (isRecording) {
      setAudioData(null);
    }
  }, [isRecording]);
  
  // Simulate recording completion
  useEffect(() => {
    let timeout: number | null = null;
    
    if (!isRecording && audioData === null) {
      // Create a mock audio blob
      const mockAudioBlob = new Blob([], { type: 'audio/wav' });
      setAudioData(mockAudioBlob);
      
      // Start processing
      setIsProcessing(true);
      if (onProcessingChange) {
        onProcessingChange(true);
      }
      
      // Simulate processing delay
      timeout = window.setTimeout(() => {
        processAudio(mockAudioBlob);
      }, 1500);
    }
    
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isRecording, audioData]);
  
  // Process the audio data
  const processAudio = (audioBlob: Blob) => {
    // Mock processing of audio data
    console.log('Processing audio data...');
    
    // Simulate API call delay
    setTimeout(() => {
      // Generate mock emotion result
      const emotions = [
        'joy', 'calm', 'focused', 'anxious', 'sad',
        'neutral', 'happy', 'excited', 'tired', 'confused'
      ];
      
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      
      const emotionResult: EmotionResult = {
        id: `audio-${Date.now()}`,
        emotion: randomEmotion,
        score: Math.random() * 0.5 + 0.5,
        confidence: Math.random() * 0.3 + 0.7,
        intensity: Math.random(),
        timestamp: new Date().toISOString(),
        emojis: getEmojisForEmotion(randomEmotion),
        feedback: "Your voice analysis reveals aspects of your emotional state. Consider how this aligns with your self-perception.",
        recommendations: getRecommendationsForEmotion(randomEmotion),
        source: 'audio'
      };
      
      console.log('Emotion result:', emotionResult);
      
      // Send result to parent
      if (onResult) {
        onResult(emotionResult);
      }
      
      // Update processing state
      setIsProcessing(false);
      if (onProcessingChange) {
        onProcessingChange(false);
      }
    }, 2000);
  };
  
  // Helper function to get emojis for an emotion
  const getEmojisForEmotion = (emotion: string): string[] => {
    const emojiMap: Record<string, string[]> = {
      joy: ['😊', '😄', '😁'],
      calm: ['😌', '🧘', '☺️'],
      focused: ['🧐', '🤔', '💭'],
      anxious: ['😟', '😰', '😨'],
      sad: ['😢', '😔', '😞'],
      neutral: ['😐', '🙂', '😶'],
      happy: ['😀', '😄', '🥰'],
      excited: ['🤩', '😃', '🎉'],
      tired: ['😴', '🥱', '😮‍💨'],
      confused: ['😕', '🤨', '🤔']
    };
    
    return emojiMap[emotion] || ['😐'];
  };
  
  // Helper function to get recommendations for an emotion
  const getRecommendationsForEmotion = (emotion: string): string[] => {
    const recommendationMap: Record<string, string[]> = {
      joy: ['Share your joy with others', 'Document this moment for future reflection'],
      calm: ['Practice deep breathing to maintain this state', 'Consider a short meditation'],
      focused: ['Set clear goals for your focused time', 'Take regular breaks to maintain focus'],
      anxious: ['Try the 4-7-8 breathing technique', 'Ground yourself by naming 5 things you can see'],
      sad: ['Allow yourself to feel without judgment', 'Consider talking to someone you trust'],
      neutral: ['Check in with yourself about what you need', 'Try a mood-boosting activity'],
      happy: ['Journal about what's making you happy', 'Spread positivity to others'],
      excited: ['Channel this energy into a creative activity', 'Share your excitement with others'],
      tired: ['Consider a short power nap', 'Hydrate and take a short break from screens'],
      confused: ['Break problems into smaller parts', 'Ask for clarity where needed']
    };
    
    return recommendationMap[emotion] || ['Take a moment for self-reflection'];
  };
  
  return null; // No UI needed for this component
};

export default AudioProcessor;
