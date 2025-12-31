/**
 * CoachWelcomeMessage - Message d'accueil personnalisé
 */

import { memo, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Sun, Moon, Sunset, Coffee, Sparkles } from 'lucide-react';

interface CoachWelcomeMessageProps {
  userName?: string;
  sessionsCount?: number;
  lastEmotion?: string;
  className?: string;
}

function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

const greetings: Record<string, { icon: typeof Sun; message: string; subMessage: string }> = {
  morning: {
    icon: Coffee,
    message: 'Bonjour',
    subMessage: 'Comment démarres-tu ta journée ?'
  },
  afternoon: {
    icon: Sun,
    message: 'Bon après-midi',
    subMessage: 'Comment se passe ta journée ?'
  },
  evening: {
    icon: Sunset,
    message: 'Bonsoir',
    subMessage: 'Comment s\'est passée ta journée ?'
  },
  night: {
    icon: Moon,
    message: 'Bonne nuit',
    subMessage: 'Prends soin de toi pour bien dormir.'
  }
};

const emotionFollowUps: Record<string, string> = {
  stress: 'Tu semblais stressé(e) lors de notre dernier échange. Comment vas-tu aujourd\'hui ?',
  anxious: 'Comment va ton anxiété depuis notre dernière conversation ?',
  sad: 'J\'espère que tu te sens un peu mieux. Je suis là si tu veux en parler.',
  happy: 'Ravi de te revoir ! J\'espère que cette bonne humeur continue.',
  calm: 'Content de te retrouver dans cet état de sérénité.',
  colère: 'Comment vas-tu depuis notre dernier échange ?',
  tristesse: 'J\'espère que tu te sens mieux. N\'hésite pas à partager.',
  peur: 'Comment te sens-tu maintenant ? Je suis là pour t\'écouter.',
};

export const CoachWelcomeMessage = memo(function CoachWelcomeMessage({
  userName,
  sessionsCount = 0,
  lastEmotion,
  className
}: CoachWelcomeMessageProps) {
  const timeOfDay = useMemo(() => getTimeOfDay(), []);
  const greeting = greetings[timeOfDay];
  const Icon = greeting.icon;

  const personalizedSubMessage = useMemo(() => {
    // First session ever
    if (sessionsCount === 0) {
      return 'Bienvenue ! Je suis ton coach bien-être. Comment puis-je t\'aider aujourd\'hui ?';
    }

    // Follow-up based on last emotion
    if (lastEmotion) {
      const normalized = lastEmotion.toLowerCase();
      if (emotionFollowUps[normalized]) {
        return emotionFollowUps[normalized];
      }
    }

    // Regular returning user
    if (sessionsCount > 10) {
      return `C\'est notre ${sessionsCount}e échange. Tes progrès sont inspirants !`;
    }

    return greeting.subMessage;
  }, [sessionsCount, lastEmotion, greeting.subMessage]);

  return (
    <Card className={cn('border-dashed bg-gradient-to-r from-primary/5 to-primary/10', className)}>
      <CardContent className="flex items-start gap-4 py-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-1">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            {greeting.message}{userName ? `, ${userName}` : ''} !
            {sessionsCount > 5 && (
              <Sparkles className="h-4 w-4 text-amber-500" />
            )}
          </h3>
          <p className="text-sm text-muted-foreground">
            {personalizedSubMessage}
          </p>
          {sessionsCount > 0 && sessionsCount <= 5 && (
            <p className="text-xs text-muted-foreground mt-2">
              Session n°{sessionsCount + 1} ensemble
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
});
