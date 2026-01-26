// @ts-nocheck
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Clock,
  Tag,
  Heart,
  Brain,
  Award,
  Zap,
  Sun,
  Moon,
  Coffee,
  Smile,
  Meh,
  Frown
} from 'lucide-react';

interface JournalEntry {
  id: string;
  date: string;
  time: string;
  mood: 'positive' | 'neutral' | 'negative';
  moodScore: number;
  tags: string[];
  category: string;
  wordCount: number;
}

interface JournalAnalyticsProps {
  entries: JournalEntry[];
}

const JournalAnalytics: React.FC<JournalAnalyticsProps> = ({ entries }) => {
  // Calculs des statistiques
  const totalEntries = entries.length;
  const averageMoodScore = entries.reduce((sum, entry) => sum + entry.moodScore, 0) / totalEntries || 0;
  const totalWords = entries.reduce((sum, entry) => sum + entry.wordCount, 0);
  const averageWordsPerEntry = totalWords / totalEntries || 0;

  // Analyse des tendances
  const moodDistribution = {
    positive: entries.filter(e => e.mood === 'positive').length,
    neutral: entries.filter(e => e.mood === 'neutral').length,
    negative: entries.filter(e => e.mood === 'negative').length
  };

  const moodPercentages = {
    positive: Math.round((moodDistribution.positive / totalEntries) * 100) || 0,
    neutral: Math.round((moodDistribution.neutral / totalEntries) * 100) || 0,
    negative: Math.round((moodDistribution.negative / totalEntries) * 100) || 0
  };

  // Tags les plus utilisés
  const tagCounts = entries.reduce((acc, entry) => {
    entry.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topTags = Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }));

  // Analyse par catégorie
  const categoryStats = entries.reduce((acc, entry) => {
    if (!acc[entry.category]) {
      acc[entry.category] = { count: 0, totalMoodScore: 0, averageMood: 0 };
    }
    acc[entry.category].count++;
    acc[entry.category].totalMoodScore += entry.moodScore;
    acc[entry.category].averageMood = acc[entry.category].totalMoodScore / acc[entry.category].count;
    return acc;
  }, {} as Record<string, { count: number; totalMoodScore: number; averageMood: number }>);

  // Analyse temporelle
  const timeOfDayStats = entries.reduce((acc, entry) => {
    const hour = parseInt(entry.time.split(':')[0]);
    let period: string;
    
    if (hour >= 5 && hour < 12) period = 'morning';
    else if (hour >= 12 && hour < 17) period = 'afternoon';
    else if (hour >= 17 && hour < 22) period = 'evening';
    else period = 'night';

    if (!acc[period]) {
      acc[period] = { count: 0, totalMoodScore: 0, averageMood: 0 };
    }
    acc[period].count++;
    acc[period].totalMoodScore += entry.moodScore;
    acc[period].averageMood = acc[period].totalMoodScore / acc[period].count;
    return acc;
  }, {} as Record<string, { count: number; totalMoodScore: number; averageMood: number }>);

  // Calcul de la progression (derniers 7 jours vs 7 jours précédents)
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const recentEntries = entries.filter(e => new Date(e.date) >= sevenDaysAgo);
  const previousEntries = entries.filter(e => 
    new Date(e.date) >= fourteenDaysAgo && new Date(e.date) < sevenDaysAgo
  );

  const recentAverage = recentEntries.reduce((sum, e) => sum + e.moodScore, 0) / recentEntries.length || 0;
  const previousAverage = previousEntries.reduce((sum, e) => sum + e.moodScore, 0) / previousEntries.length || 0;
  const moodTrend = recentAverage - previousAverage;

  const insights = [
    {
      title: "Meilleur moment pour écrire",
      content: `Vous êtes généralement plus positif(ve) ${
        timeOfDayStats.morning?.averageMood > (timeOfDayStats.evening?.averageMood || 0) ? 'le matin' : 'le soir'
      }`,
      icon: timeOfDayStats.morning?.averageMood > (timeOfDayStats.evening?.averageMood || 0) ? Sun : Moon,
      color: "text-yellow-500"
    },
    {
      title: "Catégorie la plus positive",
      content: `Vos entrées "${Object.entries(categoryStats).sort(([,a], [,b]) => b.averageMood - a.averageMood)[0]?.[0] || 'personnel'}" sont les plus joyeuses`,
      icon: Heart,
      color: "text-pink-500"
    },
    {
      title: "Progression récente",
      content: moodTrend > 0 ? 
        `Votre humeur s'améliore (+${moodTrend.toFixed(1)} pts cette semaine)` :
        `Votre humeur fluctue (${moodTrend.toFixed(1)} pts cette semaine)`,
      icon: moodTrend > 0 ? TrendingUp : TrendingDown,
      color: moodTrend > 0 ? "text-green-500" : "text-orange-500"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{totalEntries}</div>
            <p className="text-sm text-muted-foreground">Entrées totales</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{averageMoodScore.toFixed(1)}</div>
            <p className="text-sm text-muted-foreground">Score moyen</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Brain className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{Math.round(averageWordsPerEntry)}</div>
            <p className="text-sm text-muted-foreground">Mots/entrée</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Award className="h-8 w-8 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold">{moodPercentages.positive}%</div>
            <p className="text-sm text-muted-foreground">Humeur positive</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="mood" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="mood">Humeur</TabsTrigger>
          <TabsTrigger value="topics">Sujets</TabsTrigger>
          <TabsTrigger value="time">Temps</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="mood" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Distribution de l'humeur
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smile className="h-4 w-4 text-green-500" />
                    <span>Positive</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={moodPercentages.positive} className="w-20" />
                    <span className="text-sm font-medium w-12">{moodPercentages.positive}%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Meh className="h-4 w-4 text-yellow-500" />
                    <span>Neutre</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={moodPercentages.neutral} className="w-20" />
                    <span className="text-sm font-medium w-12">{moodPercentages.neutral}%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Frown className="h-4 w-4 text-red-500" />
                    <span>Négative</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={moodPercentages.negative} className="w-20" />
                    <span className="text-sm font-medium w-12">{moodPercentages.negative}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Humeur par catégorie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(categoryStats).map(([category, stats]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="capitalize">{category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{stats.count} entrées</span>
                      <Badge variant={stats.averageMood >= 7 ? "default" : stats.averageMood >= 4 ? "secondary" : "destructive"}>
                        {stats.averageMood.toFixed(1)}/10
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="topics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Tags les plus utilisés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topTags.map(({ tag, count }, index) => (
                  <div key={tag} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">#{index + 1}</span>
                      <Badge variant="outline">{tag}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={(count / totalEntries) * 100} className="w-20" />
                      <span className="text-sm text-muted-foreground w-8">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="time" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Analyse temporelle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(timeOfDayStats).map(([period, stats]) => {
                  const icons = {
                    morning: Sun,
                    afternoon: Coffee,
                    evening: Moon,
                    night: Moon
                  };
                  
                  const labels = {
                    morning: 'Matin',
                    afternoon: 'Après-midi', 
                    evening: 'Soir',
                    night: 'Nuit'
                  };
                  
                  const Icon = icons[period as keyof typeof icons];
                  
                  return (
                    <div key={period} className="text-center p-4 border rounded-lg">
                      <Icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <h4 className="font-medium">{labels[period as keyof typeof labels]}</h4>
                      <p className="text-sm text-muted-foreground">{stats.count} entrées</p>
                      <Badge variant={stats.averageMood >= 7 ? "default" : "secondary"} className="mt-1">
                        {stats.averageMood.toFixed(1)}/10
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.map((insight, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <insight.icon className={`h-6 w-6 ${insight.color} mt-1`} />
                    <div>
                      <h4 className="font-semibold mb-1">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground">{insight.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Recommandations personnalisées
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Fréquence d'écriture</h4>
                  <p className="text-sm text-blue-700">
                    {totalEntries < 7 ? 
                      'Essayez d\'écrire plus régulièrement pour mieux suivre vos émotions' :
                      'Excellente constance dans vos écritures !'
                    }
                  </p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Diversité des sujets</h4>
                  <p className="text-sm text-green-700">
                    {topTags.length > 5 ?
                      'Vous explorez une belle variété de sujets dans vos réflexions' :
                      'Essayez d\'explorer différents aspects de votre vie'
                    }
                  </p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">Profondeur des réflexions</h4>
                  <p className="text-sm text-purple-700">
                    {averageWordsPerEntry > 100 ?
                      'Vos entrées sont riches et détaillées' :
                      'Essayez d\'approfondir vos réflexions pour plus d\'insights'
                    }
                  </p>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2">Équilibre émotionnel</h4>
                  <p className="text-sm text-orange-700">
                    {moodPercentages.positive > 60 ?
                      'Votre équilibre émotionnel est excellent !' :
                      'Prenez le temps d\'identifier ce qui améliore votre humeur'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JournalAnalytics;