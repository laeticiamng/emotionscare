import React, { useMemo, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Lightbulb, Brain, Heart, Zap, Music, Sparkles, Coffee,
  UtensilsCrossed, Dumbbell, Moon, BookOpen, Users,
  TrendingUp, Clock, Target, RefreshCw, Play
} from 'lucide-react';
import { useScanHistory } from '@/hooks/useScanHistory';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
interface Recommendation {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'wellness' | 'social' | 'activity' | 'rest' | 'creative';
  priority: 'high' | 'medium' | 'low';
  duration?: string;
  emotionTrigger?: string;
}

interface Pattern {
  name: string;
  description: string;
  confidence: number;
  timeRange?: string;
  actionable?: boolean;
}

interface EmotionInsight {
  emotion: string;
  frequency: number;
  trend: 'up' | 'down' | 'stable';
  suggestion: string;
}

const RECOMMENDATIONS: { [key: string]: Recommendation[] } = {
  low_arousal: [
    {
      id: 'coffee-break',
      title: 'Pausa café',
      description: 'Une pause café et quelques minutes de mouvement vous aideront à regagner de l\'énergie.',
      icon: <Coffee className="w-5 h-5" />,
      category: 'wellness',
      priority: 'high',
      duration: '10 min'
    },
    {
      id: 'energetic-music',
      title: 'Musique énergisante',
      description: 'Écoutez une playlist dynamique pour augmenter votre énergie.',
      icon: <Music className="w-5 h-5" />,
      category: 'creative',
      priority: 'medium'
    },
    {
      id: 'quick-exercise',
      title: 'Exercice rapide',
      description: 'Quelques squats ou étirements pour réveiller votre corps.',
      icon: <Dumbbell className="w-5 h-5" />,
      category: 'activity',
      priority: 'high',
      duration: '5 min'
    }
  ],
  high_arousal: [
    {
      id: 'breathing',
      title: 'Respiration contrôlée',
      description: 'Pratiquez la respiration 4-7-8 pour calmer votre système nerveux.',
      icon: <Sparkles className="w-5 h-5" />,
      category: 'wellness',
      priority: 'high',
      duration: '5 min'
    },
    {
      id: 'calm-music',
      title: 'Musique apaisante',
      description: 'Écoutez de la musique relaxante ou de la nature.',
      icon: <Music className="w-5 h-5" />,
      category: 'creative',
      priority: 'medium'
    },
    {
      id: 'break-outside',
      title: 'Air frais',
      description: 'Une courte promenade à l\'extérieur pour vous détendre.',
      icon: <Users className="w-5 h-5" />,
      category: 'activity',
      priority: 'medium',
      duration: '10 min'
    }
  ],
  negative_valence: [
    {
      id: 'talk-friend',
      title: 'Parler à quelqu\'un',
      description: 'Contactez un ami ou un collègue pour une conversation supportive.',
      icon: <Users className="w-5 h-5" />,
      category: 'social',
      priority: 'high'
    },
    {
      id: 'journaling',
      title: 'Journaling',
      description: 'Écrivez vos pensées pour les clarifier et les traiter.',
      icon: <BookOpen className="w-5 h-5" />,
      category: 'creative',
      priority: 'medium',
      duration: '15 min'
    },
    {
      id: 'mood-music',
      title: 'Musique réconfortante',
      description: 'Écoutez une chanson qui vous plaît et vous met de bonne humeur.',
      icon: <Music className="w-5 h-5" />,
      category: 'creative',
      priority: 'medium'
    }
  ],
  late_night: [
    {
      id: 'wind-down',
      title: 'Détente progressive',
      description: 'Préparez-vous progressivement au sommeil avec un rituel relaxant.',
      icon: <Moon className="w-5 h-5" />,
      category: 'rest',
      priority: 'high',
      duration: '20 min'
    },
    {
      id: 'blue-light',
      title: 'Réduire la lumière bleue',
      description: 'Activez le mode sombre sur vos appareils.',
      icon: <Zap className="w-5 h-5" />,
      category: 'wellness',
      priority: 'high'
    },
    {
      id: 'herbal-tea',
      title: 'Tisane apaisante',
      description: 'Une tasse de tisane (camomille, tilleul) avant le lit.',
      icon: <UtensilsCrossed className="w-5 h-5" />,
      category: 'wellness',
      priority: 'medium'
    }
  ]
};

const RecommendationCard: React.FC<{ rec: Recommendation; onAction?: (rec: Recommendation) => void }> = ({ rec, onAction }) => {
  const categoryColors = {
    wellness: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
    social: 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800',
    activity: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
    rest: 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800',
    creative: 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800'
  };

  const priorityColors = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
  };

  return (
    <div className={`rounded-lg border p-4 ${categoryColors[rec.category]} transition-all hover:shadow-sm`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5 text-muted-foreground">
          {rec.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-sm">{rec.title}</h4>
            <Badge variant="secondary" className={priorityColors[rec.priority]} style={{ width: 'fit-content' }}>
              {rec.priority === 'high' ? 'Important' : rec.priority === 'medium' ? 'Recommandé' : 'Optionnel'}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{rec.description}</p>
          <div className="flex items-center justify-between mt-2">
            {rec.duration && (
              <p className="text-xs text-muted-foreground font-medium">⏱️ {rec.duration}</p>
            )}
            {onAction && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs gap-1"
                onClick={() => onAction(rec)}
              >
                <Play className="h-3 w-3" />
                Appliquer
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PatternCard: React.FC<{ pattern: Pattern }> = ({ pattern }) => {
  return (
    <div className="rounded-lg border p-4 bg-card">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-600" />
            {pattern.name}
          </h4>
          <p className="text-xs text-muted-foreground mt-1">{pattern.description}</p>
          {pattern.timeRange && (
            <p className="text-xs text-muted-foreground mt-2">🕐 {pattern.timeRange}</p>
          )}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-purple-600">{Math.round(pattern.confidence)}%</div>
          <p className="text-xs text-muted-foreground">confiance</p>
        </div>
      </div>
    </div>
  );
};

export const SmartRecommendations: React.FC = () => {
  const { data: history = [] } = useScanHistory(50);
  const [activeTab, setActiveTab] = useState('recommendations');
  const [refreshKey, setRefreshKey] = useState(0);
  const [_isActivating, setIsActivating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
 const { activateMusicForEmotion } = useMusicEmotionIntegration();

  // Action handler pour les recommandations
  const handleRecommendationAction = useCallback(async (rec: Recommendation) => {
    setIsActivating(true);
    try {
      if (rec.id.includes('music') || rec.category === 'creative') {
        // Activer la musique adaptée
        const emotion = rec.emotionTrigger?.toLowerCase() || 'calm';
        await activateMusicForEmotion({ emotion, intensity: 0.5, duration: 120 });
        toast({
          title: '🎵 Musique activée',
          description: `Playlist adaptée à votre état: ${rec.emotionTrigger || 'relaxation'}`,
        });
        navigate('/app/music');
      } else if (rec.id === 'breathing' || rec.id.includes('breath')) {
        navigate('/app/breathwork');
        toast({ title: '🌬️ Respiration guidée', description: 'Démarrage de l\'exercice...' });
      } else if (rec.id === 'journaling') {
        navigate('/app/journal');
        toast({ title: '📔 Journal', description: 'Ouverture du journal...' });
      } else if (rec.id === 'talk-friend' || rec.category === 'social') {
        navigate('/app/community');
        toast({ title: '👥 Communauté', description: 'Connectez-vous avec les autres' });
      } else if (rec.id === 'quick-exercise' || rec.category === 'activity') {
        toast({
          title: '💪 Activité suggérée',
          description: rec.description,
          duration: 5000
        });
      } else if (rec.category === 'rest') {
        navigate('/app/breathwork');
        toast({ title: '😴 Détente', description: 'Préparez-vous à vous relaxer' });
      } else {
        toast({
          title: `✅ ${rec.title}`,
          description: rec.description,
          duration: 5000
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'appliquer cette recommandation',
        variant: 'destructive'
      });
    } finally {
      setIsActivating(false);
    }
  }, [activateMusicForEmotion, navigate, toast]);
  const { recommendations, patterns, insights, emotionScore } = useMemo(() => {
    if (history.length === 0) {
      return {
        recommendations: RECOMMENDATIONS.low_arousal,
        patterns: [],
        insights: [],
        emotionScore: 50
      };
    }

    const recs: Recommendation[] = [];
    const detectedPatterns: Pattern[] = [];
    const emotionInsights: EmotionInsight[] = [];

    // Calculer les moyennes
    const avgArousal = Math.round(history.reduce((a, s) => a + s.arousal, 0) / history.length);
    const avgValence = Math.round(history.reduce((a, s) => a + s.valence, 0) / history.length);
    const recentScans = history.slice(0, 7);
    const olderScans = history.slice(7, 14);

    // Score global d'équilibre émotionnel
    const balanceScore = Math.round((avgValence + avgArousal) / 2);

    // Détecter les tendances récentes
    if (recentScans.length > 0 && olderScans.length > 0) {
      const recentAvg = recentScans.reduce((a, s) => a + s.valence, 0) / recentScans.length;
      const olderAvg = olderScans.reduce((a, s) => a + s.valence, 0) / olderScans.length;
      const trend = recentAvg > olderAvg + 5 ? 'up' : recentAvg < olderAvg - 5 ? 'down' : 'stable';
      
      emotionInsights.push({
        emotion: 'Bien-être général',
        frequency: recentScans.length,
        trend,
        suggestion: trend === 'up' 
          ? 'Continuez sur cette lancée positive !'
          : trend === 'down'
          ? 'Prenez du temps pour vous ressourcer'
          : 'Votre humeur est stable'
      });
    }

    // Analyser l'arousal
    if (avgArousal < 40) {
      recs.push(...RECOMMENDATIONS.low_arousal.map(r => ({ ...r, emotionTrigger: 'Faible énergie' })));
      detectedPatterns.push({
        name: 'Faible énergie détectée',
        description: 'Votre arousal moyen est inférieur à 40. Vous pourriez bénéficier d\'une stimulation.',
        confidence: 85,
        actionable: true
      });
    }

    if (avgArousal > 70) {
      recs.push(...RECOMMENDATIONS.high_arousal.map(r => ({ ...r, emotionTrigger: 'Haute activation' })));
      detectedPatterns.push({
        name: 'Activation élevée',
        description: 'Votre niveau d\'activité est élevé. La relaxation pourrait être bénéfique.',
        confidence: 80,
        timeRange: 'Souvent observé l\'après-midi',
        actionable: true
      });
    }

    // Analyser la valence
    if (avgValence < 30) {
      recs.push(...RECOMMENDATIONS.negative_valence.map(r => ({ ...r, emotionTrigger: 'Humeur basse' })));
      detectedPatterns.push({
        name: 'Humeur négative',
        description: 'Votre valence moyenne est basse. Cherchez du soutien ou des activités positives.',
        confidence: 75,
        actionable: true
      });
    } else if (avgValence > 70) {
      emotionInsights.push({
        emotion: 'Positivité',
        frequency: history.filter(s => s.valence > 70).length,
        trend: 'up',
        suggestion: 'Excellente énergie positive ! Profitez-en pour accomplir vos objectifs.'
      });
    }

    // Analyser l'heure
    const currentHour = new Date().getHours();
    if (currentHour >= 22 || currentHour < 6) {
      recs.push(...RECOMMENDATIONS.late_night);
      detectedPatterns.push({
        name: 'Cycle tardif détecté',
        description: 'Vous scannez tard. Pensez à votre sommeil et à votre récupération.',
        confidence: 90,
        timeRange: 'Entre 22h et 6h',
        actionable: true
      });
    }

    // Détection de patterns additionnels par période
    const morning = history.filter(s => {
      const h = new Date(s.created_at).getHours();
      return h >= 6 && h < 12;
    });
    const afternoon = history.filter(s => {
      const h = new Date(s.created_at).getHours();
      return h >= 12 && h < 18;
    });

    if (morning.length > 0 && afternoon.length > 0) {
      const morningAvgArousal = morning.reduce((a, s) => a + s.arousal, 0) / morning.length;
      const afternoonAvgArousal = afternoon.reduce((a, s) => a + s.arousal, 0) / afternoon.length;

      if (afternoonAvgArousal > morningAvgArousal * 1.2) {
        detectedPatterns.push({
          name: 'Chronotype de l\'après-midi',
          description: 'Vous êtes généralement plus énergique l\'après-midi qu\'en matinée.',
          confidence: 70,
          timeRange: '12h-18h'
        });
      } else if (morningAvgArousal > afternoonAvgArousal * 1.2) {
        detectedPatterns.push({
          name: 'Chronotype du matin',
          description: 'Vous êtes plus énergique le matin. Planifiez vos tâches importantes tôt.',
          confidence: 70,
          timeRange: '6h-12h'
        });
      }
    }

    // Analyser la régularité des scans
    const scanDates = new Set(history.map(s => new Date(s.created_at).toDateString()));
    if (scanDates.size >= 7) {
      detectedPatterns.push({
        name: 'Régularité exemplaire',
        description: 'Vous suivez régulièrement votre bien-être. Excellent pour la conscience de soi !',
        confidence: 95
      });
    }

    // Limite à 4 recommandations pertinentes
    const uniqueRecs = Array.from(new Map(recs.map(r => [r.id, r])).values()).slice(0, 4);

    return {
      recommendations: uniqueRecs.length > 0 ? uniqueRecs : RECOMMENDATIONS.low_arousal.slice(0, 2),
      patterns: detectedPatterns.slice(0, 4),
      insights: emotionInsights,
      emotionScore: balanceScore
    };
  }, [history, refreshKey]);

  const handleRefresh = () => setRefreshKey(k => k + 1);

  return (
    <div className="space-y-6">
      {/* Score global */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${emotionScore > 60 ? 'bg-green-500/10' : emotionScore > 40 ? 'bg-amber-500/10' : 'bg-red-500/10'}`}>
                <Target className={`h-6 w-6 ${emotionScore > 60 ? 'text-green-500' : emotionScore > 40 ? 'text-amber-500' : 'text-red-500'}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Score d'équilibre émotionnel</p>
                <p className="text-2xl font-bold">{emotionScore}%</p>
              </div>
            </div>
            <Button variant="outline" size="icon" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <Progress value={emotionScore} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Stress</span>
            <span>Équilibre</span>
            <span>Épanouissement</span>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommendations" className="gap-1">
            <Lightbulb className="h-4 w-4" />
            Actions
          </TabsTrigger>
          <TabsTrigger value="patterns" className="gap-1">
            <Brain className="h-4 w-4" />
            Patterns
          </TabsTrigger>
          <TabsTrigger value="insights" className="gap-1">
            <TrendingUp className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="w-5 h-5" />
                Recommandations personnalisées
              </CardTitle>
              <CardDescription>Basées sur votre état émotionnel actuel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <AnimatePresence mode="popLayout">
                {recommendations.length > 0 ? (
                  <>
                    {recommendations.map((rec, idx) => (
                      <motion.div
                        key={rec.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <RecommendationCard rec={rec} onAction={handleRecommendationAction} />
                      </motion.div>
                    ))}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Aucune donnée disponible pour générer des recommandations
                  </p>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Brain className="w-5 h-5" />
                Patterns détectés
              </CardTitle>
              <CardDescription>Tendances dans vos données émotionnelles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {patterns.length > 0 ? (
                patterns.map((pattern, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <PatternCard pattern={pattern} />
                  </motion.div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Besoin de plus de données pour détecter des patterns
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5" />
                Insights émotionnels
              </CardTitle>
              <CardDescription>Analyse de vos tendances récentes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {insights.length > 0 ? (
                insights.map((insight, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 rounded-lg border bg-card"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{insight.emotion}</span>
                      <Badge variant={insight.trend === 'up' ? 'default' : insight.trend === 'down' ? 'destructive' : 'secondary'}>
                        {insight.trend === 'up' ? '↑ Hausse' : insight.trend === 'down' ? '↓ Baisse' : '→ Stable'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{insight.suggestion}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <Clock className="inline h-3 w-3 mr-1" />
                      Basé sur {insight.frequency} scans récents
                    </p>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">
                    Continuez à scanner pour débloquer des insights personnalisés
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Conseils de bien-être */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Heart className="w-5 h-5" />
                Conseils de bien-être
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 dark:bg-blue-900/20 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  💡 <span className="font-semibold">Conseil du jour:</span> Pratiquez la gratitude. Notez 3 choses pour lesquelles vous êtes reconnaissant(e). Cela augmente la valence de 15% en moyenne.
                </p>
              </div>
              <div className="rounded-lg bg-green-50 border border-green-200 p-4 dark:bg-green-900/20 dark:border-green-800">
                <p className="text-sm text-green-900 dark:text-green-100">
                  🎯 <span className="font-semibold">Focus bien-être:</span> {emotionScore > 60 
                    ? 'Vos données suggèrent une bonne stabilité émotionnelle. Continuez ainsi!'
                    : 'Prenez quelques minutes pour vous recentrer avec une respiration profonde.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartRecommendations;
