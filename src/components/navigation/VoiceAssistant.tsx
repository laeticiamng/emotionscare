// @ts-nocheck

import React from 'react';
import { Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceAssistantProps {
  variant?: 'icon' | 'button' | 'floating';
  emotionalState?: 'neutral' | 'happy' | 'sad' | 'angry' | 'excited';
  badgesCount?: number;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ 
  variant = 'floating',
  emotionalState = 'neutral',
  badgesCount = 0
}) => {
  return (
    <div className={cn(
      'voice-assistant',
      variant === 'floating' && 'fixed bottom-6 right-6 z-50',
      variant === 'icon' && 'inline-flex',
      variant === 'button' && 'btn btn-primary'
    )}>
      <button 
        className={cn(
          'flex items-center justify-center rounded-full p-2 shadow transition-all',
          emotionalState === 'neutral' && 'bg-blue-500 hover:bg-blue-600',
          emotionalState === 'happy' && 'bg-green-500 hover:bg-green-600',
          emotionalState === 'sad' && 'bg-indigo-500 hover:bg-indigo-600',
          emotionalState === 'angry' && 'bg-red-500 hover:bg-red-600',
          emotionalState === 'excited' && 'bg-amber-500 hover:bg-amber-600',
          variant === 'floating' ? 'h-14 w-14' : 'h-8 w-8'
        )}
        aria-label="Assistant vocal"
      >
        <Mic className="text-white" size={variant === 'floating' ? 24 : 16} />
        {badgesCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {badgesCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default VoiceAssistant;
