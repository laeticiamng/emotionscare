
import React from 'react';
import { Card } from '@/components/ui/card';
import CoachCharacter from './CoachCharacter';
import { cn } from '@/lib/utils';

interface CoachPresenceProps {
  mood?: string;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const CoachPresence: React.FC<CoachPresenceProps> = ({
  mood = 'neutral',
  message = "Comment puis-je vous aider aujourd'hui ?",
  size = 'md',
  className,
  onClick
}) => {
  return (
    <Card 
      className={cn(
        "p-4 flex items-center gap-3 hover:bg-muted/50 cursor-pointer transition-colors",
        className
      )}
      onClick={onClick}
    >
      <CoachCharacter mood={mood} size={size} animated={true} />
      <div className="flex-1">
        <p className="text-sm">{message}</p>
      </div>
    </Card>
  );
};

export default CoachPresence;
