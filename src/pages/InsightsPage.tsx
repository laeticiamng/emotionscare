import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, Lightbulb, Target } from 'lucide-react';

export default function InsightsPage() {
  const insights = [
    {
      type: 'trend',
      title: 'Tendance Positive',
      description: 'Votre humeur s\'améliore de 12% les jours où vous méditez le matin',
      impact: 'high',
      icon: TrendingUp,
    },
    {
      type: 'suggestion',
      title: 'Suggestion Personnalisée',
      description: 'Essayez la musique thérapeutique entre 18h-20h pour optimiser votre détente',
      impact: 'medium',
      icon: Lightbulb,
    },
    {
      type: 'pattern',
      title: 'Pattern Détecté',
      description: 'Vos sessions VR le weekend ont un score moyen de 8.5/10, contre 7.2 en semaine',
      impact: 'medium',
      icon: Brain,
    },
    {
      type: 'goal',
      title: 'Objectif Recommandé',
      description: 'Augmentez votre fréquence de méditation à 5x/semaine pour atteindre vos objectifs plus rapidement',
      impact: 'high',
      icon: Target,
    },
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'border-primary bg-primary/5';
      case 'medium': return 'border-blue-500 bg-blue-500/5';
      case 'low': return 'border-muted-foreground bg-muted';
      default: return '';
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high': return <Badge variant="default">Impact Élevé</Badge>;
      case 'medium': return <Badge variant="secondary">Impact Moyen</Badge>;
      case 'low': return <Badge variant="outline">Impact Faible</Badge>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6" data-testid="page-root">
      <div className="max-w-4xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            Insights IA
          </h1>
          <p className="text-muted-foreground">Recommandations personnalisées basées sur vos données</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Analyse Comportementale</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Notre IA analyse vos habitudes et comportements pour vous fournir des insights actionnables 
              qui vous aideront à optimiser votre bien-être émotionnel.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {insights.map((insight, idx) => {
            const Icon = insight.icon;
            return (
              <Card key={idx} className={`${getImpactColor(insight.impact)} border-2`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                    </div>
                    {getImpactBadge(insight.impact)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{insight.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
