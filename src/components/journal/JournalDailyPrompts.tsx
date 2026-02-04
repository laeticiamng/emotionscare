/**
 * Prompts quotidiens adaptatifs pour le journal
 * Suggestions intelligentes basées sur l'humeur et le contexte
 */

import { memo, useMemo } from 'react';
import type { LucideIcon } from 'lucide-react';
import { 
  Sparkles, 
  RefreshCw,
  Sun,
  Moon,
  Cloud,
  Heart,
  Target,
  Lightbulb,
  Coffee
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DailyPrompt {
  id: string;
  text: string;
  category: 'reflection' | 'gratitude' | 'emotion' | 'growth' | 'creativity';
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  moodMatch?: 'positive' | 'neutral' | 'negative';
  icon: LucideIcon;
}

const DAILY_PROMPTS: DailyPrompt[] = [
  // Morning prompts
  { id: 'm1', text: 'Quelle est mon intention pour aujourd\'hui ?', category: 'reflection', timeOfDay: 'morning', icon: Sun },
  { id: 'm2', text: 'Pour quoi suis-je reconnaissant(e) ce matin ?', category: 'gratitude', timeOfDay: 'morning', icon: Heart },
  { id: 'm3', text: 'Comment est-ce que je me sens en commençant cette journée ?', category: 'emotion', timeOfDay: 'morning', icon: Coffee },
  { id: 'm4', text: 'Quelle petite action peut améliorer ma journée ?', category: 'growth', timeOfDay: 'morning', icon: Target },
  
  // Afternoon prompts
  { id: 'a1', text: 'Quel moment de la matinée m\'a marqué(e) ?', category: 'reflection', timeOfDay: 'afternoon', icon: Cloud },
  { id: 'a2', text: 'Qu\'est-ce qui m\'a fait sourire aujourd\'hui ?', category: 'gratitude', timeOfDay: 'afternoon', icon: Heart },
  { id: 'a3', text: 'Comment puis-je prendre soin de moi cet après-midi ?', category: 'emotion', timeOfDay: 'afternoon', icon: Sparkles },
  
  // Evening prompts
  { id: 'e1', text: 'Quelle a été ma plus grande victoire aujourd\'hui ?', category: 'growth', timeOfDay: 'evening', icon: Target },
  { id: 'e2', text: '3 choses positives de ma journée :', category: 'gratitude', timeOfDay: 'evening', icon: Heart },
  { id: 'e3', text: 'Qu\'ai-je appris sur moi-même aujourd\'hui ?', category: 'reflection', timeOfDay: 'evening', icon: Lightbulb },
  { id: 'e4', text: 'Comment me suis-je senti(e) pendant la journée ?', category: 'emotion', timeOfDay: 'evening', icon: Moon },
  
  // Night prompts
  { id: 'n1', text: 'De quoi suis-je le plus fier/fière aujourd\'hui ?', category: 'growth', timeOfDay: 'night', icon: Moon },
  { id: 'n2', text: 'Si demain était parfait, à quoi ressemblerait-il ?', category: 'creativity', timeOfDay: 'night', icon: Sparkles },
  { id: 'n3', text: 'Qu\'est-ce que je veux lâcher avant de m\'endormir ?', category: 'emotion', timeOfDay: 'night', icon: Cloud },
  
  // Mood-based prompts
  { id: 'pos1', text: 'Qu\'est-ce qui me rend heureux/heureuse en ce moment ?', category: 'emotion', moodMatch: 'positive', icon: Heart },
  { id: 'pos2', text: 'Comment puis-je partager cette énergie positive ?', category: 'growth', moodMatch: 'positive', icon: Sparkles },
  { id: 'neu1', text: 'Comment puis-je rendre ce moment plus significatif ?', category: 'reflection', moodMatch: 'neutral', icon: Lightbulb },
  { id: 'neg1', text: 'De quoi ai-je besoin en ce moment ?', category: 'emotion', moodMatch: 'negative', icon: Heart },
  { id: 'neg2', text: 'Quelle petite chose pourrait améliorer mon humeur ?', category: 'growth', moodMatch: 'negative', icon: Target },
  { id: 'neg3', text: 'Qu\'est-ce que je dirais à un ami dans ma situation ?', category: 'reflection', moodMatch: 'negative', icon: Heart },
];

const CATEGORY_COLORS: Record<DailyPrompt['category'], string> = {
  reflection: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
  gratitude: 'bg-green-500/10 text-green-600 border-green-500/30',
  emotion: 'bg-rose-500/10 text-rose-600 border-rose-500/30',
  growth: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
  creativity: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
};

const CATEGORY_LABELS: Record<DailyPrompt['category'], string> = {
  reflection: 'Réflexion',
  gratitude: 'Gratitude',
  emotion: 'Émotion',
  growth: 'Croissance',
  creativity: 'Créativité',
};

type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

interface JournalDailyPromptsProps {
  currentMood?: 'positive' | 'neutral' | 'negative';
  onSelectPrompt: (prompt: string) => void;
  onRefresh?: () => void;
  className?: string;
}

export const JournalDailyPrompts = memo(function JournalDailyPrompts({
  currentMood = 'neutral',
  onSelectPrompt,
  onRefresh,
  className
}: JournalDailyPromptsProps) {
  const timeOfDay = getTimeOfDay();
  
  const suggestedPrompts = useMemo(() => {
    // Filter prompts by time of day and mood
    const timePrompts = DAILY_PROMPTS.filter(p => p.timeOfDay === timeOfDay);
    const moodPrompts = DAILY_PROMPTS.filter(p => p.moodMatch === currentMood);
    
    // Combine and dedupe, prioritizing mood-matched prompts
    const combined = [...moodPrompts, ...timePrompts];
    const unique = combined.filter((p, i, arr) => arr.findIndex(x => x.id === p.id) === i);
    
    // Shuffle and take 4
    return unique
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  }, [timeOfDay, currentMood]);

  const TIME_LABELS: Record<string, string> = {
    morning: '🌅 Bonjour',
    afternoon: '☀️ Bon après-midi',
    evening: '🌆 Bonsoir',
    night: '🌙 Bonne nuit'
  };
  const timeLabel = TIME_LABELS[timeOfDay] || '✨ Bienvenue';

  return (
    <Card className={cn("border-border/50", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Prompts du moment</CardTitle>
          </div>
          {onRefresh && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onRefresh}
              aria-label="Rafraîchir les suggestions"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
        <CardDescription className="flex items-center gap-2">
          {timeLabel} — Suggestions adaptées à votre moment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {suggestedPrompts.map((prompt) => {
            const Icon = prompt.icon;
            const colorClass = CATEGORY_COLORS[prompt.category];
            
            return (
              <button
                key={prompt.id}
                onClick={() => onSelectPrompt(prompt.text)}
                className={cn(
                  "flex flex-col gap-2 rounded-lg border p-4 text-left transition-all",
                  colorClass,
                  "hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <Badge variant="secondary" className="text-[10px]">
                    {CATEGORY_LABELS[prompt.category]}
                  </Badge>
                </div>
                <p className="text-sm font-medium leading-relaxed">
                  {prompt.text}
                </p>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
});
