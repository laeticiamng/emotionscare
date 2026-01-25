import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Calendar, 
  Award, 
  BarChart3,
  Clock,
  Tag,
  Heart,
  Zap
} from 'lucide-react';
import type { SanitizedNote } from '@/modules/journal/types';
import { JournalStreak } from './JournalStreak';
import { JournalPersonalStats } from './JournalPersonalStats';
import { JournalEmotionTrends } from './JournalEmotionTrends';
import { JournalAchievements } from './JournalAchievements';

interface JournalDashboardProps {
  notes: SanitizedNote[];
  className?: string;
}

/**
 * Dashboard principal du journal
 * Combine plusieurs widgets pour une vue d'ensemble complète
 */
export const JournalDashboard = memo<JournalDashboardProps>(({ notes, className = '' }) => {
  // Calculs de statistiques rapides
  const totalNotes = notes.length;
  const totalWords = notes.reduce((sum, note) => sum + note.text.split(/\s+/).length, 0);
  const uniqueTags = new Set(notes.flatMap(n => n.tags)).size;
  
  const today = new Date().toDateString();
  const notesToday = notes.filter(n => new Date(n.created_at).toDateString() === today).length;

  // Calcul de la streak actuelle
  const calculateCurrentStreak = (): number => {
    if (notes.length === 0) return 0;

    const sortedDates = notes
      .map(n => new Date(n.created_at).toDateString())
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < sortedDates.length; i++) {
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      
      if (sortedDates[i] === expectedDate.toDateString()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const currentStreak = calculateCurrentStreak();

  // Calcul du tag le plus utilisé
  const getMostUsedTag = (): string => {
    const tagCount = new Map<string, number>();
    notes.forEach(note => {
      note.tags.forEach(tag => {
        tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
      });
    });

    let maxCount = 0;
    let mostUsed = '-';
    tagCount.forEach((count, tag) => {
      if (count > maxCount) {
        maxCount = count;
        mostUsed = tag;
      }
    });

    return mostUsed;
  };

  const mostUsedTag = getMostUsedTag();

  return (
    <div className={className}>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="statistics">Statistiques</TabsTrigger>
          <TabsTrigger value="achievements">Succès</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Quick stats cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Notes totales</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalNotes}</div>
                <p className="text-xs text-muted-foreground">
                  {notesToday} aujourd'hui
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mots écrits</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalWords.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {totalNotes > 0 ? Math.round(totalWords / totalNotes) : 0} mots/note
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Série actuelle</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentStreak}</div>
                <p className="text-xs text-muted-foreground">
                  jours consécutifs
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tags uniques</CardTitle>
                <Tag className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{uniqueTags}</div>
                <p className="text-xs text-muted-foreground">
                  Plus utilisé: {mostUsedTag}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main widgets */}
          <div className="grid gap-4 lg:grid-cols-2">
            <JournalStreak notes={notes} />
            <JournalEmotionTrends notes={notes} />
          </div>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <JournalPersonalStats notes={notes} />
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <JournalAchievements notes={notes} />
        </TabsContent>
      </Tabs>
    </div>
  );
});

JournalDashboard.displayName = 'JournalDashboard';
