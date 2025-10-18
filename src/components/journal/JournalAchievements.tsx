import { memo, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, Flame, Sparkles, BookOpen, Calendar, Award, Star } from 'lucide-react';
import type { SanitizedNote } from '@/modules/journal/types';

interface JournalAchievementsProps {
  notes: SanitizedNote[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  progress: number;
  target: number;
  unlocked: boolean;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

const tierColors = {
  bronze: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
  silver: 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20',
  gold: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
  platinum: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
};

export const JournalAchievements = memo<JournalAchievementsProps>(({ notes }) => {
  const achievements = useMemo<Achievement[]>(() => {
    const totalNotes = notes.length;
    const totalWords = notes.reduce((sum, note) => sum + note.text.split(/\s+/).length, 0);
    const uniqueTags = new Set(notes.flatMap(n => n.tags)).size;
    
    const sortedDates = notes
      .map(n => new Date(n.created_at).toDateString())
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    const uniqueDates = Array.from(new Set(sortedDates));
    
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 1;
    
    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const diff = (new Date(uniqueDates[i]).getTime() - new Date(uniqueDates[i + 1]).getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        tempStreak++;
      } else {
        maxStreak = Math.max(maxStreak, tempStreak);
        tempStreak = 1;
      }
    }
    maxStreak = Math.max(maxStreak, tempStreak);
    
    if (uniqueDates.length > 0) {
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      
      if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
        currentStreak = 1;
        for (let i = 0; i < uniqueDates.length - 1; i++) {
          const diff = (new Date(uniqueDates[i]).getTime() - new Date(uniqueDates[i + 1]).getTime()) / (1000 * 60 * 60 * 24);
          if (diff === 1) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }

    return [
      {
        id: 'first_note',
        title: 'Premier pas',
        description: 'Écrivez votre première note',
        icon: BookOpen,
        progress: Math.min(totalNotes, 1),
        target: 1,
        unlocked: totalNotes >= 1,
        tier: 'bronze',
      },
      {
        id: 'note_10',
        title: 'Écrivain régulier',
        description: 'Écrivez 10 notes',
        icon: Target,
        progress: Math.min(totalNotes, 10),
        target: 10,
        unlocked: totalNotes >= 10,
        tier: 'bronze',
      },
      {
        id: 'note_50',
        title: 'Journaliste confirmé',
        description: 'Écrivez 50 notes',
        icon: Award,
        progress: Math.min(totalNotes, 50),
        target: 50,
        unlocked: totalNotes >= 50,
        tier: 'silver',
      },
      {
        id: 'note_100',
        title: 'Maître du journal',
        description: 'Écrivez 100 notes',
        icon: Trophy,
        progress: Math.min(totalNotes, 100),
        target: 100,
        unlocked: totalNotes >= 100,
        tier: 'gold',
      },
      {
        id: 'note_500',
        title: 'Légende vivante',
        description: 'Écrivez 500 notes',
        icon: Star,
        progress: Math.min(totalNotes, 500),
        target: 500,
        unlocked: totalNotes >= 500,
        tier: 'platinum',
      },
      {
        id: 'streak_7',
        title: 'Une semaine forte',
        description: 'Écrivez 7 jours d\'affilée',
        icon: Flame,
        progress: Math.min(currentStreak, 7),
        target: 7,
        unlocked: maxStreak >= 7,
        tier: 'silver',
      },
      {
        id: 'streak_30',
        title: 'Mois de constance',
        description: 'Écrivez 30 jours d\'affilée',
        icon: Calendar,
        progress: Math.min(currentStreak, 30),
        target: 30,
        unlocked: maxStreak >= 30,
        tier: 'gold',
      },
      {
        id: 'words_10k',
        title: 'Romancier en herbe',
        description: 'Écrivez 10 000 mots au total',
        icon: Sparkles,
        progress: Math.min(totalWords, 10000),
        target: 10000,
        unlocked: totalWords >= 10000,
        tier: 'silver',
      },
      {
        id: 'tags_20',
        title: 'Taxonomiste créatif',
        description: 'Utilisez 20 tags différents',
        icon: Target,
        progress: Math.min(uniqueTags, 20),
        target: 20,
        unlocked: uniqueTags >= 20,
        tier: 'bronze',
      },
    ];
  }, [notes]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Achievements
            </CardTitle>
            <CardDescription>
              {unlockedCount} sur {totalCount} débloqués
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{Math.round((unlockedCount / totalCount) * 100)}%</div>
            <div className="text-xs text-muted-foreground">Complété</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            const progressPercent = (achievement.progress / achievement.target) * 100;

            return (
              <Card
                key={achievement.id}
                className={`transition-all ${
                  achievement.unlocked
                    ? 'border-2 ' + tierColors[achievement.tier]
                    : 'opacity-60 border-dashed'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-5 w-5 ${achievement.unlocked ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div>
                        <h4 className="font-semibold text-sm">{achievement.title}</h4>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                    {achievement.unlocked && (
                      <Badge variant="secondary" className="text-xs">
                        {achievement.tier}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0 space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Progression</span>
                    <span>
                      {achievement.progress} / {achievement.target}
                    </span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
});

JournalAchievements.displayName = 'JournalAchievements';
