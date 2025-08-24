import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useMood } from '@/contexts/MoodContext';

interface PageRootProps {
  children: React.ReactNode;
  className?: string;
  adaptToMood?: boolean;
}

export const PageRoot: React.FC<PageRootProps> = ({ 
  children, 
  className,
  adaptToMood = true 
}) => {
  const { currentMood } = useMood();

  // Mood-based styling
  const getMoodBasedClasses = () => {
    if (!adaptToMood || !currentMood) return '';
    
    const valence = currentMood.valence;
    const arousal = currentMood.arousal;
    
    // Low energy states - warmer, softer colors
    if (arousal < 0.4) {
      return 'bg-gradient-to-br from-amber-50/30 to-orange-50/30';
    }
    
    // High energy, positive - vibrant colors
    if (valence > 0.6 && arousal > 0.6) {
      return 'bg-gradient-to-br from-blue-50/30 to-purple-50/30';
    }
    
    // Negative states - calm, neutral tones
    if (valence < 0.4) {
      return 'bg-gradient-to-br from-slate-50/30 to-gray-50/30';
    }
    
    // Default balanced state
    return 'bg-gradient-to-br from-emerald-50/30 to-teal-50/30';
  };

  return (
    <div 
      data-testid="page-root" 
      className={cn(
        'min-h-screen transition-colors duration-1000',
        getMoodBasedClasses(),
        className
      )}
    >
      {children}
    </div>
  );
};

export default PageRoot;