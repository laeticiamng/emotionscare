import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, Lightbulb, Target, Check, Clock, X, ChevronRight, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

interface Insight {
  id: string;
  type: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  icon: typeof TrendingUp;
  status: 'new' | 'applied' | 'dismissed' | 'reminded';
  actionLabel?: string;
}

const initialInsights: Insight[] = [
  {
    id: '1',
    type: 'trend',
    title: 'Tendance Positive',
    description: 'Votre humeur s\'améliore de 12% les jours où vous méditez le matin',
    impact: 'high',
    icon: TrendingUp,
    status: 'new',
    actionLabel: 'Planifier méditation matinale',
  },
  {
    id: '2',
    type: 'suggestion',
    title: 'Suggestion Personnalisée',
    description: 'Essayez la musique thérapeutique entre 18h-20h pour optimiser votre détente',
    impact: 'medium',
    icon: Lightbulb,
    status: 'new',
    actionLabel: 'Programmer rappel',
  },
  {
    id: '3',
    type: 'pattern',
    title: 'Pattern Détecté',
    description: 'Vos sessions VR le weekend ont un score moyen de 8.5/10, contre 7.2 en semaine',
    impact: 'medium',
    icon: Brain,
    status: 'applied',
  },
  {
    id: '4',
    type: 'goal',
    title: 'Objectif Recommandé',
    description: 'Augmentez votre fréquence de méditation à 5x/semaine pour atteindre vos objectifs plus rapidement',
    impact: 'high',
    icon: Target,
    status: 'new',
    actionLabel: 'Créer objectif',
  },
];

export default function InsightsPage() {
  const { toast } = useToast();
  const [insights, setInsights] = useState<Insight[]>(initialInsights);
  const [filter, setFilter] = useState<'all' | 'new' | 'applied'>('all');

  const filteredInsights = insights.filter(i => {
    if (filter === 'all') return i.status !== 'dismissed';
    if (filter === 'new') return i.status === 'new';
    if (filter === 'applied') return i.status === 'applied';
    return true;
  });

  const newCount = insights.filter(i => i.status === 'new').length;
  const appliedCount = insights.filter(i => i.status === 'applied').length;
  const applicationRate = insights.length > 0 ? Math.round((appliedCount / insights.length) * 100) : 0;

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

  const handleApply = (id: string) => {
    setInsights(prev => prev.map(i => 
      i.id === id ? { ...i, status: 'applied' as const } : i
    ));
    toast({ 
      title: 'Insight appliqué !', 
      description: 'Cette recommandation a été ajoutée à vos objectifs.' 
    });
  };

  const handleDismiss = (id: string) => {
    setInsights(prev => prev.map(i => 
      i.id === id ? { ...i, status: 'dismissed' as const } : i
    ));
    toast({ title: 'Insight masqué' });
  };

  const handleRemind = (id: string) => {
    setInsights(prev => prev.map(i => 
      i.id === id ? { ...i, status: 'reminded' as const } : i
    ));
    toast({ 
      title: 'Rappel programmé', 
      description: 'Vous serez notifié demain.' 
    });
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

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{newCount}</p>
                <p className="text-xs text-muted-foreground">Nouveaux insights</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <Check className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{appliedCount}</p>
                <p className="text-xs text-muted-foreground">Appliqués</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Taux d'application</span>
                <span className="font-semibold">{applicationRate}%</span>
              </div>
              <Progress value={applicationRate} className="h-2" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('all')}
          >
            Tous
          </Button>
          <Button 
            variant={filter === 'new' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('new')}
          >
            Nouveaux ({newCount})
          </Button>
          <Button 
            variant={filter === 'applied' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('applied')}
          >
            Appliqués ({appliedCount})
          </Button>
        </div>

        <div className="space-y-4">
          {filteredInsights.map((insight) => {
            const Icon = insight.icon;
            return (
              <Card key={insight.id} className={`${getImpactColor(insight.impact)} border-2 transition-all`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                        {insight.status === 'applied' && (
                          <Badge variant="outline" className="mt-1 text-green-600 border-green-600">
                            <Check className="h-3 w-3 mr-1" /> Appliqué
                          </Badge>
                        )}
                        {insight.status === 'reminded' && (
                          <Badge variant="outline" className="mt-1 text-yellow-600 border-yellow-600">
                            <Clock className="h-3 w-3 mr-1" /> Rappel programmé
                          </Badge>
                        )}
                      </div>
                    </div>
                    {getImpactBadge(insight.impact)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{insight.description}</p>
                  
                  {insight.status === 'new' && (
                    <div className="flex gap-2 flex-wrap">
                      {insight.actionLabel && (
                        <Button size="sm" onClick={() => handleApply(insight.id)}>
                          {insight.actionLabel}
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => handleRemind(insight.id)}>
                        <Clock className="h-4 w-4 mr-1" />
                        Rappeler demain
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDismiss(insight.id)}>
                        <X className="h-4 w-4 mr-1" />
                        Ignorer
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {filteredInsights.length === 0 && (
            <Card className="p-12 text-center">
              <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Aucun insight dans cette catégorie</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
