/**
 * CoachTypingIndicator - Indicateur d'écriture du coach
 */

import { memo } from 'react';
import { cn } from '@/lib/utils';

interface CoachTypingIndicatorProps {
  isTyping: boolean;
}

export const CoachTypingIndicator = memo(function CoachTypingIndicator({
  isTyping,
}: CoachTypingIndicatorProps) {
  if (!isTyping) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <span className="text-xs text-muted-foreground">Coach écrit</span>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn(
              'h-2 w-2 rounded-full bg-primary/60 animate-bounce',
            )}
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
});
