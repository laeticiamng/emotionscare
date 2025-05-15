
import React, { Key } from 'react';
import { EmotionResult } from '@/types';

interface EmotionHistoryProps {
  emotions: EmotionResult[];
  onSelectEmotion?: (emotion: EmotionResult) => void;
}

const EmotionHistory: React.FC<EmotionHistoryProps> = ({ emotions, onSelectEmotion }) => {
  // Group emotions by date
  const groupedEmotions = emotions.reduce((acc, emotion) => {
    // Get the date string in a consistent format
    const dateObj = emotion.date 
      ? new Date(emotion.date) 
      : emotion.timestamp 
        ? new Date(emotion.timestamp) 
        : new Date();
    
    const dateStr = dateObj.toLocaleDateString();
    
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    
    acc[dateStr].push(emotion);
    return acc;
  }, {} as Record<string, EmotionResult[]>);
  
  // Sort dates in descending order
  const sortedDates = Object.keys(groupedEmotions).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });
  
  // Calculate emotion size based on intensity or confidence
  const getEmotionSize = (emotion: EmotionResult): string => {
    const size = emotion.intensity || emotion.confidence || 0.5;
    if (size > 0.8) return 'text-lg font-bold';
    if (size > 0.5) return 'text-base font-semibold';
    return 'text-sm';
  };
  
  // Get color class based on emotion
  const getEmotionColor = (emotion: string): string => {
    switch (emotion.toLowerCase()) {
      case 'happy':
      case 'joy':
        return 'text-yellow-500';
      case 'sad':
      case 'sadness':
        return 'text-blue-500';
      case 'angry':
      case 'anger':
        return 'text-red-500';
      case 'fear':
      case 'fearful':
        return 'text-purple-500';
      case 'disgust':
      case 'disgusted':
        return 'text-green-500';
      case 'surprise':
      case 'surprised':
        return 'text-pink-500';
      case 'calm':
        return 'text-teal-500';
      default:
        return 'text-gray-500';
    }
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Emotion History</h3>
      
      {sortedDates.length === 0 ? (
        <p className="text-muted-foreground">No emotion history available.</p>
      ) : (
        sortedDates.map((date) => (
          <div key={date as Key} className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">{date}</h4>
            
            <div className="flex flex-wrap gap-2">
              {groupedEmotions[date].map((emotion, idx) => (
                <button
                  key={emotion.id || idx}
                  className={`px-3 py-1 rounded-full border ${getEmotionColor(emotion.emotion)} ${getEmotionSize(emotion)} cursor-pointer hover:bg-muted/50 transition-colors`}
                  onClick={() => onSelectEmotion && onSelectEmotion(emotion)}
                  title={emotion.text || emotion.emotion}
                >
                  {emotion.emotion}
                </button>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default EmotionHistory;
