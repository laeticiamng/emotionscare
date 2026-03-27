// @ts-nocheck
import { useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useVoiceCoach } from '@/hooks/useVoiceCoach';
import { cn } from '@/lib/utils';

interface VoiceCoachProps {
  sessionState: 'idle' | 'active' | 'break' | 'completed';
  sessionDuration?: number;
  onSessionStart?: () => void;
  enabled?: boolean;
  onToggle?: (enabled: boolean) => void;
}

export const VoiceCoach = ({
  sessionState,
  sessionDuration = 0,
  onSessionStart,
  enabled = true,
  onToggle
}: VoiceCoachProps) => {
  const {
    isSpeaking,
    startSession,
    encourageDuringPomodoro,
    startBreakReflection,
    endSession,
    stop
  } = useVoiceCoach({ voice: 'nova' });

  // Gestion automatique des phases de coaching
  useEffect(() => {
    if (!enabled) return;

    if (sessionState === 'active' && sessionDuration === 0) {
      startSession();
    }

    // Encouragement à mi-session (12.5 minutes sur 25 min pomodoro)
    if (sessionState === 'active' && sessionDuration === 750) {
      encourageDuringPomodoro();
    }

    if (sessionState === 'break') {
      startBreakReflection();
    }

    if (sessionState === 'completed') {
      endSession();
    }
  }, [sessionState, sessionDuration, enabled]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return (
    <Card className={cn(
      "fixed bottom-24 right-8 p-4 shadow-lg border-border/50 backdrop-blur-sm",
      "bg-background/80 transition-all duration-300",
      isSpeaking && "ring-2 ring-primary animate-pulse"
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          "relative w-12 h-12 rounded-full flex items-center justify-center",
          "bg-gradient-to-br from-primary/20 to-primary/5",
          isSpeaking && "animate-pulse"
        )}>
          {isSpeaking ? (
            <Volume2 className="w-6 h-6 text-primary" />
          ) : (
            <VolumeX className="w-6 h-6 text-muted-foreground" />
          )}
          
          {isSpeaking && (
            <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          )}
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-foreground">
            Coach Vocal IA
          </span>
          <span className="text-xs text-muted-foreground">
            {isSpeaking ? 'En train de parler...' : 'En attente'}
          </span>
        </div>

        <Button
          size="sm"
          variant={enabled ? "default" : "outline"}
          onClick={() => onToggle?.(!enabled)}
          className="ml-2"
        >
          {enabled ? 'ON' : 'OFF'}
        </Button>
      </div>

      {sessionState !== 'idle' && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className={cn(
              "w-2 h-2 rounded-full",
              sessionState === 'active' && "bg-green-500 animate-pulse",
              sessionState === 'break' && "bg-yellow-500 animate-pulse",
              sessionState === 'completed' && "bg-blue-500"
            )} />
            <span>
              {sessionState === 'active' && 'Session active'}
              {sessionState === 'break' && 'Pause'}
              {sessionState === 'completed' && 'Terminé'}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};
