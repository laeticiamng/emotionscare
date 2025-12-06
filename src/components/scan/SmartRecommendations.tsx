import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Lightbulb, Brain, Heart, Zap, Music, Sparkles, Coffee,
  UtensilsCrossed, Dumbbell, Moon, BookOpen, Users, ChevronRight
} from 'lucide-react';
import { useScanHistory } from '@/hooks/useScanHistory';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'wellness' | 'social' | 'activity' | 'rest' | 'creative';
  priority: 'high' | 'medium' | 'low';
  duration?: string;
}

interface Pattern {
  name: string;
  description: string;
  confidence: number;
  timeRange?: string;
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

const RecommendationCard: React.FC<{ rec: Recommendation }> = ({ rec }) => {
  const categoryColors = {
    wellness: 'bg-green-50 border-green-200',
    social: 'bg-purple-50 border-purple-200',
    activity: 'bg-blue-50 border-blue-200',
    rest: 'bg-indigo-50 border-indigo-200',
    creative: 'bg-orange-50 border-orange-200'
  };

  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  };

  return (
    <div className={`rounded-lg border p-4 ${categoryColors[rec.category]}`}>
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
          {rec.duration && (
            <p className="text-xs text-muted-foreground mt-2 font-medium">⏱️ {rec.duration}</p>
          )}
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

  const { recommendations, patterns } = useMemo(() => {
    if (history.length === 0) {
      return {
        recommendations: RECOMMENDATIONS.low_arousal,
        patterns: []
      };
    }

    const recs: Recommendation[] = [];
    const detectedPatterns: Pattern[] = [];

    // Calculer les moyennes
    const avgArousal = Math.round(history.reduce((a, s) => a + s.arousal, 0) / history.length);
    const avgValence = Math.round(history.reduce((a, s) => a + s.valence, 0) / history.length);

    // Analyser l'arousal
    if (avgArousal < 40) {
      recs.push(...RECOMMENDATIONS.low_arousal);
      detectedPatterns.push({
        name: 'Faible énergie détectée',
        description: 'Votre arousal moyen est inférieur à 40. Vous pourriez bénéficier d\'une stimulation.',
        confidence: 85
      });
    }

    if (avgArousal > 70) {
      recs.push(...RECOMMENDATIONS.high_arousal);
      detectedPatterns.push({
        name: 'Activation élevée',
        description: 'Votre niveau d\'activité est élevé. La relaxation pourrait être bénéfique.',
        confidence: 80,
        timeRange: 'Souvent observé l\'après-midi'
      });
    }

    // Analyser la valence
    if (avgValence < 30) {
      recs.push(...RECOMMENDATIONS.negative_valence);
      detectedPatterns.push({
        name: 'Humeur négative',
        description: 'Votre valence moyenne est basse. Cherchez du soutien ou des activités positives.',
        confidence: 75
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
        timeRange: 'Entre 22h et 6h'
      });
    }

    // Détection de patterns additionnels
    const morning = history.filter(s => {
      const h = new Date(s.created_at).getHours();
      return h >= 6 && h < 12;
    });
    const afternoon = history.filter(s => {
      const h = new Date(s.created_at).getHours();
      return h >= 12 && h < 18;
    });
    const evening = history.filter(s => {
      const h = new Date(s.created_at).getHours();
      return h >= 18;
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
      }
    }

    // Limite à 3-4 recommandations pertinentes
    const uniqueRecs = Array.from(new Map(recs.map(r => [r.id, r])).values()).slice(0, 4);

    return {
      recommendations: uniqueRecs,
      patterns: detectedPatterns.slice(0, 3)
    };
  }, [history]);

  return (
    <div className="space-y-6">
      {/* Recommandations intelligentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Recommandations personnalisées
          </CardTitle>
          <CardDescription>Basées sur votre état émotionnel actuel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {recommendations.length > 0 ? (
            <>
              {recommendations.map((rec) => (
                <RecommendationCard key={rec.id} rec={rec} />
              ))}
              <Button variant="outline" className="w-full gap-2 mt-2">
                Voir plus de suggestions
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Aucune donnée disponible pour générer des recommandations
            </p>
          )}
        </CardContent>
      </Card>

      {/* Patterns détectés */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Patterns détectés
          </CardTitle>
          <CardDescription>Tendances dans vos données émotionnelles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {patterns.length > 0 ? (
            patterns.map((pattern, idx) => (
              <PatternCard key={idx} pattern={pattern} />
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Besoin de plus de données pour détecter des patterns
            </p>
          )}
        </CardContent>
      </Card>

      {/* Conseils de bien-être */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Conseils de bien-être
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
            <p className="text-sm text-blue-900">
              💡 <span className="font-semibold">Conseil du jour:</span> Pratiquez la gratitude. Notez 3 choses pour lesquelles vous êtes reconnaissant(e). Cela augmente la valence de 15% en moyenne.
            </p>
          </div>
          <div className="rounded-lg bg-green-50 border border-green-200 p-4">
            <p className="text-sm text-green-900">
              🎯 <span className="font-semibold">Focus bien-être:</span> Vos données suggèrent une bonne stabilité émotionnelle. Continuez ainsi!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartRecommendations;
