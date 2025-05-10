
import { useState, useEffect } from 'react';
import { Emotion } from '@/types';

export function useEmotionVisualizer(emotion?: Emotion | null) {
  const [colorMapping, setColorMapping] = useState<{ [key: string]: string }>({
    joy: '#FFD700', // Gold
    happy: '#FFD700', // Gold
    sadness: '#4169E1', // Royal Blue
    sad: '#4169E1', // Royal Blue
    anger: '#FF4500', // Orange Red
    angry: '#FF4500', // Orange Red
    fear: '#800080', // Purple
    fearful: '#800080', // Purple
    disgust: '#008000', // Green
    surprised: '#FFA500', // Orange
    surprise: '#FFA500', // Orange
    neutral: '#A9A9A9', // Dark Gray
    calm: '#40E0D0', // Turquoise
    excited: '#FF1493', // Deep Pink
    stressed: '#8B0000', // Dark Red
    anxious: '#9932CC', // Dark Orchid
  });

  const [baseColor, setBaseColor] = useState<string>('#A9A9A9'); // Default gray

  useEffect(() => {
    if (emotion) {
      // Try to get the color from the dominant emotion or name or regular emotion field
      const emotionKey = (emotion.name || emotion.emotion || '').toLowerCase();
      if (colorMapping[emotionKey]) {
        setBaseColor(colorMapping[emotionKey]);
      }
    }
  }, [emotion, colorMapping]);

  const getGradient = (intensity: number = 0.5) => {
    // Adjust intensity to be between 0.2 and 1 for better visibility
    const adjustedIntensity = 0.2 + (intensity * 0.8);
    
    // Create a gradient that fades from the emotion color to white
    return `linear-gradient(135deg, ${baseColor} ${adjustedIntensity * 100}%, rgba(255,255,255,0.8) 100%)`;
  };

  const getPulseAnimation = (intensity: number = 0.5) => {
    // Adjust intensity to determine animation speed (higher intensity = faster pulse)
    const speed = 3 - (intensity * 1.5); // Between 1.5s (high intensity) and 3s (low intensity)
    
    return {
      animation: `pulse ${speed}s infinite ease-in-out`,
      keyframes: `
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(${hexToRgb(baseColor)}, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(${hexToRgb(baseColor)}, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(${hexToRgb(baseColor)}, 0);
          }
        }
      `
    };
  };

  // Helper to convert hex color to RGB for box-shadow
  const hexToRgb = (hex: string): string => {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `${r}, ${g}, ${b}`;
  };

  return {
    baseColor,
    getGradient,
    getPulseAnimation,
    colorMapping
  };
}

export default useEmotionVisualizer;
