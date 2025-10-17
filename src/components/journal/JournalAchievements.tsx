import { useMemo } from 'react';
import { Trophy, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { SanitizedNote } from '@/modules/journal/types';

interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  category: 'streak' | 'volume' | 'exploration' | 'consistency';
}

interface JournalAchievementsProps {
  notes: SanitizedNote[];
}

/**
 * Système d'achievements pour gamifier le journaling
 * Encourage différents aspects de la pratique (régularité, volume, exploration)
 */
export function JournalAchievements({ notes }: JournalAchievementsProps) {
  const achievements = useMemo((): Achievement[] => {
    // Calculer les métriques
    const totalNotes = notes.length;
    const totalWords = notes.reduce((sum, note) => 
      sum + note.text.split(/\s+/).filter(Boolean).length, 0
    );
    const uniqueTags = new Set(notes.flatMap(note => note.tags)).size;
    
    // Calculer la série actuelle
    const daysSet = new Set<string>();
    notes.forEach(note => {
      const date = new Date(note.created_at);
      const dayKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      daysSet.add(dayKey);
    });
    const sortedDays = Array.from(daysSet)
      .map(key => {
        const [year, month, day] = key.split('-').map(Number);
        return new Date(year, month - 1, day);
      })
      .sort((a, b) => b.getTime() - a.getTime());
    
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedDays.length; i++) {
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);
      
      const actualDate = new Date(sortedDays[i]);
      actualDate.setHours(0, 0, 0, 0);
      
      if (actualDate.getTime() === expectedDate.getTime()) {
        currentStreak++;
      } else {
        break;
      }
    }

    return [
      // STREAK
      {
        id: 'first-step',
        icon: '🌱',
        title: 'Premier pas',
        description: 'Écrivez votre première note',
        unlocked: totalNotes >= 1,
        progress: Math.min(totalNotes, 1),
        maxProgress: 1,
        category: 'streak',
      },
      {
        id: 'week-warrior',
        icon: '🔥',
        title: 'Guerrier hebdomadaire',
        description: 'Maintenez une série de 7 jours',
        unlocked: currentStreak >= 7,
        progress: Math.min(currentStreak, 7),
        maxProgress: 7,
        category: 'streak',
      },
      {
        id: 'month-master',
        icon: '⚡',
        title: 'Maître du mois',
        description: 'Atteignez 30 jours consécutifs',
        unlocked: currentStreak >= 30,
        progress: Math.min(currentStreak, 30),
        maxProgress: 30,
        category: 'streak',
      },
      {
        id: 'year-legend',
        icon: '👑',
        title: 'Légende annuelle',
        description: 'Une année complète de journaling quotidien',
        unlocked: currentStreak >= 365,
        progress: Math.min(currentStreak, 365),
        maxProgress: 365,
        category: 'streak',
      },

      // VOLUME
      {
        id: 'ten-notes',
        icon: '📝',
        title: 'Décollage',
        description: 'Écrivez 10 notes',
        unlocked: totalNotes >= 10,
        progress: Math.min(totalNotes, 10),
        maxProgress: 10,
        category: 'volume',
      },
      {
        id: 'fifty-notes',
        icon: '📚',
        title: 'Bibliothèque naissante',
        description: 'Atteignez 50 notes',
        unlocked: totalNotes >= 50,
        progress: Math.min(totalNotes, 50),
        maxProgress: 50,
        category: 'volume',
      },
      {
        id: 'hundred-notes',
        icon: '🎖️',
        title: 'Centenaire',
        description: 'Écrivez 100 notes',
        unlocked: totalNotes >= 100,
        progress: Math.min(totalNotes, 100),
        maxProgress: 100,
        category: 'volume',
      },
      {
        id: 'wordsmith',
        icon: '✍️',
        title: 'Maître des mots',
        description: 'Écrivez 10 000 mots au total',
        unlocked: totalWords >= 10000,
        progress: Math.min(totalWords, 10000),
        maxProgress: 10000,
        category: 'volume',
      },

      // EXPLORATION
      {
        id: 'tag-explorer',
        icon: '🏷️',
        title: 'Explorateur thématique',
        description: 'Utilisez 10 tags différents',
        unlocked: uniqueTags >= 10,
        progress: Math.min(uniqueTags, 10),
        maxProgress: 10,
        category: 'exploration',
      },
      {
        id: 'tag-master',
        icon: '🎯',
        title: 'Maître des catégories',
        description: 'Explorez 25 tags uniques',
        unlocked: uniqueTags >= 25,
        progress: Math.min(uniqueTags, 25),
        maxProgress: 25,
        category: 'exploration',
      },

      // CONSISTENCY
      {
        id: 'morning-ritual',
        icon: '☀️',
        title: 'Rituel matinal',
        description: 'Écrivez 10 notes avant 9h',
        unlocked: notes.filter(n => new Date(n.created_at).getHours() < 9).length >= 10,
        progress: Math.min(notes.filter(n => new Date(n.created_at).getHours() < 9).length, 10),
        maxProgress: 10,
        category: 'consistency',
      },
      {
        id: 'night-owl',
        icon: '🌙',
        title: 'Oiseau de nuit',
        description: 'Écrivez 10 notes après 21h',
        unlocked: notes.filter(n => new Date(n.created_at).getHours() >= 21).length >= 10,
        progress: Math.min(notes.filter(n => new Date(n.created_at).getHours() >= 21).length, 10),
        maxProgress: 10,
        category: 'consistency',
      },
    ];
  }, [notes]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  const categoryLabels = {
    streak: 'Régularité',
    volume: 'Volume',
    exploration: 'Exploration',
    consistency: 'Constance',
  };

  const groupedAchievements = useMemo(() => {
    const groups: Record<string, Achievement[]> = {
      streak: [],
      volume: [],
      exploration: [],
      consistency: [],
    };

    achievements.forEach(achievement => {
      groups[achievement.category].push(achievement);
    });

    return groups;
  }, [achievements]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              Achievements
            </CardTitle>
            <CardDescription>
              Déverrouillez des badges en pratiquant régulièrement
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{unlockedCount}/{totalCount}</div>
            <div className="text-xs text-muted-foreground">{completionPercentage}%</div>
          </div>
        </div>
        <Progress value={completionPercentage} className="h-2 mt-4" />
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedAchievements).map(([category, categoryAchievements]) => (
          <div key={category} className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground">
              {categoryLabels[category as keyof typeof categoryLabels]}
            </h4>
            <div className="space-y-2">
              {categoryAchievements.map(achievement => (
                <div
                  key={achievement.id}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg border transition-colors',
                    achievement.unlocked
                      ? 'bg-primary/5 border-primary/20'
                      : 'bg-muted/30 border-muted'
                  )}
                >
                  <div className="text-2xl flex-shrink-0 mt-0.5">
                    {achievement.unlocked ? achievement.icon : <Lock className="h-5 w-5 text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h5 className={cn(
                        'font-medium text-sm',
                        !achievement.unlocked && 'text-muted-foreground'
                      )}>
                        {achievement.title}
                      </h5>
                      {achievement.unlocked && (
                        <Badge variant="default" className="text-xs">
                          Débloqué
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {achievement.description}
                    </p>
                    {!achievement.unlocked && (
                      <div className="flex items-center gap-2 mt-2">
                        <Progress 
                          value={(achievement.progress / achievement.maxProgress) * 100} 
                          className="h-1.5 flex-1"
                        />
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {achievement.progress}/{achievement.maxProgress}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
