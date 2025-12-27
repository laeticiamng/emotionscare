import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface MusicMoodVisualizationProps {
  mood: string;
  intensity?: number; // 0-100
}

const MusicMoodVisualization: React.FC<MusicMoodVisualizationProps> = ({
  mood,
  intensity = 50
}) => {
  // Map moods to colors and patterns
  const getMoodStyles = () => {
    switch (mood.toLowerCase()) {
      case 'happy':
        return {
          primaryColor: '#FDE68A', // Yellow
          secondaryColor: '#FBBF24', 
          background: 'radial-gradient(circle at center, #FDE68A 0%, #FBBF24 100%)',
          animation: 'pulse 3s infinite'
        };
      case 'calm':
        return {
          primaryColor: '#93C5FD', // Light blue
          secondaryColor: '#3B82F6',
          background: 'linear-gradient(135deg, #93C5FD 0%, #3B82F6 100%)',
          animation: 'wave 6s infinite ease-in-out'
        };
      case 'focused':
        return {
          primaryColor: '#A78BFA', // Purple
          secondaryColor: '#7C3AED',
          background: 'linear-gradient(90deg, #A78BFA 0%, #7C3AED 100%)',
          animation: 'pulse 4s infinite alternate'
        };
      case 'energetic':
        return {
          primaryColor: '#FCA5A5', // Red
          secondaryColor: '#EF4444',
          background: 'radial-gradient(circle at center, #FCA5A5 0%, #EF4444 100%)',
          animation: 'bounce 2s infinite'
        };
      case 'melancholic':
        return {
          primaryColor: '#6B7280', // Gray
          secondaryColor: '#4B5563',
          background: 'linear-gradient(180deg, #6B7280 0%, #4B5563 100%)',
          animation: 'slowPulse 8s infinite'
        };
      default:
        return {
          primaryColor: '#D1D5DB', // Default gray
          secondaryColor: '#9CA3AF',
          background: 'linear-gradient(135deg, #D1D5DB 0%, #9CA3AF 100%)',
          animation: 'none'
        };
    }
  };

  const styles = getMoodStyles();
  
  // Adjust animation speed based on intensity
  const animationDuration = Math.max(1, 10 - intensity / 10); // 1-10 seconds inverse to intensity
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div 
          className="h-40 w-full"
          style={{
            background: styles.background,
            animation: styles.animation !== 'none' 
              ? `${styles.animation} ${animationDuration}s infinite alternate` 
              : 'none'
          }}
        >
          <div className="flex items-center justify-center h-full">
            <span className="text-xl font-bold text-white drop-shadow-md">
              {mood.charAt(0).toUpperCase() + mood.slice(1)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicMoodVisualization;
