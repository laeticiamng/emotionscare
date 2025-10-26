// @ts-nocheck
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';

export default function TrendsPage() {
  const trends = [
    { metric: 'Humeur Moyenne', current: 7.8, previous: 7.2, change: '+8.3%', trend: 'up' },
    { metric: 'Fréquence Sessions', current: 5.2, previous: 4.8, change: '+8.3%', trend: 'up' },
    { metric: 'Durée Moyenne', current: 15, previous: 18, change: '-16.7%', trend: 'down' },
    { metric: 'Engagement', current: 85, previous: 78, change: '+9.0%', trend: 'up' },
  ];

  return (
    <div className="min-h-screen bg-background p-6" data-testid="page-root">
      <div className="max-w-6xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-8 w-8 text-primary" />
            Tendances Personnelles
          </h1>
          <p className="text-muted-foreground">Évolution de vos métriques sur les 30 derniers jours</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {trends.map((trend, idx) => (
            <Card key={idx}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{trend.metric}</CardTitle>
                  {trend.trend === 'up' ? (
                    <TrendingUp className="h-5 w-5 text-success" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-destructive" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">{trend.current}</span>
                  <span className="text-muted-foreground">vs {trend.previous}</span>
                </div>
                <div className={`text-sm font-medium ${trend.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                  {trend.change} ce mois
                </div>
                <Progress 
                  value={trend.trend === 'up' ? 75 : 25} 
                  className={trend.trend === 'up' ? '' : 'bg-destructive/20'}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Analyse Détaillée</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                <h4 className="font-semibold text-success-foreground mb-2">Points Positifs</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Augmentation constante de votre humeur moyenne (+8.3%)</li>
                  <li>• Engagement élevé et en progression (+9%)</li>
                  <li>• Régularité des sessions améliorée</li>
                </ul>
              </div>
              
              <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <h4 className="font-semibold text-warning-foreground mb-2">Points d'Attention</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Durée moyenne des sessions en baisse (-16.7%)</li>
                  <li>• Privilégiez des sessions légèrement plus longues pour maximiser les bénéfices</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
