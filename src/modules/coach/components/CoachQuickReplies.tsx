/**
 * CoachQuickReplies - Réponses rapides suggérées
 */

import { memo, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MessageCircle, Sparkles, Heart, Wind, BookOpen, Target } from 'lucide-react';

interface QuickReply {
  id: string;
  text: string;
  icon: typeof MessageCircle;
  category: 'emotion' | 'action' | 'question' | 'exercise';
}

interface CoachQuickRepliesProps {
  onSelect: (text: string) => void;
  emotion?: string | null;
  hasMessages?: boolean;
  disabled?: boolean;
  className?: string;
}

const getQuickReplies = (emotion?: string | null, hasMessages?: boolean): QuickReply[] => {
  // Initial prompts when no messages
  if (!hasMessages) {
    return [
      { id: 'intro-1', text: 'Je me sens stressé(e) aujourd\'hui', icon: Heart, category: 'emotion' },
      { id: 'intro-2', text: 'J\'aimerais un exercice de relaxation', icon: Wind, category: 'exercise' },
      { id: 'intro-3', text: 'Comment améliorer mon bien-être ?', icon: Sparkles, category: 'question' },
      { id: 'intro-4', text: 'J\'ai besoin de parler de quelque chose', icon: MessageCircle, category: 'emotion' },
    ];
  }

  // Context-aware replies based on detected emotion
  const emotionBased: Record<string, QuickReply[]> = {
    stress: [
      { id: 'stress-1', text: 'Oui, le travail me pèse', icon: Heart, category: 'emotion' },
      { id: 'stress-2', text: 'Propose-moi une technique de respiration', icon: Wind, category: 'exercise' },
      { id: 'stress-3', text: 'Comment identifier mes sources de stress ?', icon: Target, category: 'question' },
    ],
    anxious: [
      { id: 'anx-1', text: 'Je ressens de l\'anxiété', icon: Heart, category: 'emotion' },
      { id: 'anx-2', text: 'Aide-moi à me recentrer', icon: Wind, category: 'exercise' },
      { id: 'anx-3', text: 'Qu\'est-ce qui pourrait m\'aider ?', icon: Sparkles, category: 'question' },
    ],
    sad: [
      { id: 'sad-1', text: 'Je me sens un peu seul(e)', icon: Heart, category: 'emotion' },
      { id: 'sad-2', text: 'Propose-moi une activité apaisante', icon: BookOpen, category: 'action' },
      { id: 'sad-3', text: 'Comment remonter la pente ?', icon: Target, category: 'question' },
    ],
    happy: [
      { id: 'happy-1', text: 'Je veux cultiver cette joie', icon: Sparkles, category: 'action' },
      { id: 'happy-2', text: 'Comment partager ce bonheur ?', icon: Heart, category: 'question' },
      { id: 'happy-3', text: 'Ancrons ce moment positif', icon: Wind, category: 'exercise' },
    ],
    default: [
      { id: 'def-1', text: 'Dis-m\'en plus', icon: MessageCircle, category: 'question' },
      { id: 'def-2', text: 'Propose-moi un exercice', icon: Wind, category: 'exercise' },
      { id: 'def-3', text: 'Comment puis-je progresser ?', icon: Target, category: 'question' },
      { id: 'def-4', text: 'Merci, ça m\'aide', icon: Heart, category: 'emotion' },
    ]
  };

  const normalizedEmotion = emotion?.toLowerCase() || 'default';
  return emotionBased[normalizedEmotion] || emotionBased.default;
};

const categoryColors: Record<string, string> = {
  emotion: 'hover:bg-pink-50 hover:text-pink-700 dark:hover:bg-pink-900/20 dark:hover:text-pink-300',
  action: 'hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20 dark:hover:text-blue-300',
  question: 'hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-900/20 dark:hover:text-purple-300',
  exercise: 'hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-teal-900/20 dark:hover:text-teal-300',
};

export const CoachQuickReplies = memo(function CoachQuickReplies({
  onSelect,
  emotion,
  hasMessages,
  disabled = false,
  className
}: CoachQuickRepliesProps) {
  const replies = useMemo(
    () => getQuickReplies(emotion, hasMessages),
    [emotion, hasMessages]
  );

  if (disabled) return null;

  return (
    <div className={cn('flex flex-wrap gap-2', className)} role="group" aria-label="Réponses rapides suggérées">
      {replies.map((reply) => {
        const Icon = reply.icon;
        return (
          <Button
            key={reply.id}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onSelect(reply.text)}
            className={cn(
              'text-xs font-normal transition-all',
              'bg-background/50 border-dashed',
              categoryColors[reply.category]
            )}
          >
            <Icon className="h-3 w-3 mr-1.5 opacity-70" />
            {reply.text}
          </Button>
        );
      })}
    </div>
  );
});
