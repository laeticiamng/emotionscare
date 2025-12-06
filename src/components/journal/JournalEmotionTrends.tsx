import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { SanitizedNote } from '@/modules/journal/types';

interface EmotionTrendsProps {
  notes: SanitizedNote[];
  period?: 'week' | 'month' | 'all';
}

interface EmotionStats {
  positive: number;
  negative: number;
  neutral: number;
  trend: 'up' | 'down' | 'stable';
  mostCommonTags: Array<{ tag: string; count: number }>;
}

/**
 * Composant d'analyse des tendances émotionnelles
 * Calcule et affiche les patterns émotionnels sur une période
 */
export function JournalEmotionTrends({ notes, period = 'month' }: EmotionTrendsProps) {
  const stats = useMemo((): EmotionStats => {
    if (notes.length === 0) {
      return {
        positive: 0,
        negative: 0,
        neutral: 100,
        trend: 'stable',
        mostCommonTags: [],
      };
    }

    // Filtrer par période
    const now = new Date();
    const filteredNotes = notes.filter(note => {
      const noteDate = new Date(note.created_at);
      const diffDays = Math.floor((now.getTime() - noteDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (period === 'week') return diffDays <= 7;
      if (period === 'month') return diffDays <= 30;
      return true;
    });

    // Analyse des tags émotionnels
    const emotionKeywords = {
      positive: ['joie', 'bonheur', 'gratitude', 'fierté', 'confiance', 'espoir', 'amour', 'satisfaction'],
      negative: ['tristesse', 'anxiété', 'colère', 'peur', 'stress', 'frustration', 'inquiétude', 'douleur'],
    };

    let positiveCount = 0;
    let negativeCount = 0;
    const tagCounts = new Map<string, number>();

    filteredNotes.forEach(note => {
      // Analyser les tags
      note.tags.forEach(tag => {
        const lowerTag = tag.toLowerCase();
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);

        if (emotionKeywords.positive.some(kw => lowerTag.includes(kw))) {
          positiveCount++;
        } else if (emotionKeywords.negative.some(kw => lowerTag.includes(kw))) {
          negativeCount++;
        }
      });

      // Analyser le contenu
      const text = note.text.toLowerCase();
      if (emotionKeywords.positive.some(kw => text.includes(kw))) {
        positiveCount++;
      }
      if (emotionKeywords.negative.some(kw => text.includes(kw))) {
        negativeCount++;
      }
    });

    const total = filteredNotes.length;
    const positive = Math.round((positiveCount / total) * 100) || 0;
    const negative = Math.round((negativeCount / total) * 100) || 0;
    const neutral = Math.max(0, 100 - positive - negative);

    // Calculer la tendance (comparaison première moitié vs deuxième moitié)
    const midPoint = Math.floor(filteredNotes.length / 2);
    const firstHalf = filteredNotes.slice(0, midPoint);
    const secondHalf = filteredNotes.slice(midPoint);

    const calcScore = (notesList: SanitizedNote[]) => {
      let score = 0;
      notesList.forEach(note => {
        const text = note.text.toLowerCase();
        if (emotionKeywords.positive.some(kw => text.includes(kw))) score++;
        if (emotionKeywords.negative.some(kw => text.includes(kw))) score--;
      });
      return score;
    };

    const firstScore = calcScore(firstHalf);
    const secondScore = calcScore(secondHalf);
    const scoreDiff = secondScore - firstScore;

    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (scoreDiff > 2) trend = 'up';
    else if (scoreDiff < -2) trend = 'down';

    // Tags les plus fréquents
    const mostCommonTags = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));

    return {
      positive,
      negative,
      neutral,
      trend,
      mostCommonTags,
    };
  }, [notes, period]);

  const getTrendIcon = () => {
    switch (stats.trend) {
      case 'up':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-5 w-5 text-red-600" />;
      default:
        return <Minus className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getTrendText = () => {
    switch (stats.trend) {
      case 'up':
        return 'Tendance positive';
      case 'down':
        return 'Tendance en baisse';
      default:
        return 'Tendance stable';
    }
  };

  const getPeriodLabel = () => {
    switch (period) {
      case 'week':
        return '7 derniers jours';
      case 'month':
        return '30 derniers jours';
      default:
        return 'Toutes les notes';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getTrendIcon()}
          Analyse émotionnelle
        </CardTitle>
        <CardDescription>
          {getTrendText()} · {getPeriodLabel()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Répartition émotionnelle */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Émotions positives</span>
              <span className="text-muted-foreground">{stats.positive}%</span>
            </div>
            <Progress value={stats.positive} className="h-2 bg-muted" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Émotions négatives</span>
              <span className="text-muted-foreground">{stats.negative}%</span>
            </div>
            <Progress value={stats.negative} className="h-2 bg-muted" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Neutre</span>
              <span className="text-muted-foreground">{stats.neutral}%</span>
            </div>
            <Progress value={stats.neutral} className="h-2 bg-muted" />
          </div>
        </div>

        {/* Tags les plus fréquents */}
        {stats.mostCommonTags.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3">Thèmes récurrents</h4>
            <div className="flex flex-wrap gap-2">
              {stats.mostCommonTags.map(({ tag, count }) => (
                <Badge key={tag} variant="secondary" className="gap-2">
                  {tag}
                  <span className="text-xs text-muted-foreground">×{count}</span>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Insights */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-semibold mb-2">Insights</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {stats.positive > 60 && (
              <li>✨ Période globalement positive - continuez cette dynamique !</li>
            )}
            {stats.negative > 40 && (
              <li>💭 Présence d'émotions difficiles - n'hésitez pas à en parler avec votre coach.</li>
            )}
            {stats.trend === 'up' && (
              <li>📈 Amélioration notable de votre bien-être ces derniers temps.</li>
            )}
            {stats.trend === 'down' && (
              <li>📉 Période plus difficile - prenez soin de vous.</li>
            )}
            {stats.neutral > 50 && (
              <li>⚖️ Émotions équilibrées - période de stabilité.</li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
