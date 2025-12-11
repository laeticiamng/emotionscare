import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Calendar, BarChart3, LineChart } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Period = '7d' | '30d' | '90d';

const trendData: Record<Period, { metric: string; current: number; previous: number; change: string; trend: 'up' | 'down'; unit?: string }[]> = {
  '7d': [
    { metric: 'Humeur Moyenne', current: 7.5, previous: 7.2, change: '+4.2%', trend: 'up' },
    { metric: 'Fréquence Sessions', current: 4.2, previous: 3.8, change: '+10.5%', trend: 'up' },
    { metric: 'Durée Moyenne', current: 12, previous: 14, change: '-14.3%', trend: 'down', unit: 'min' },
    { metric: 'Engagement', current: 82, previous: 75, change: '+9.3%', trend: 'up', unit: '%' },
  ],
  '30d': [
    { metric: 'Humeur Moyenne', current: 7.8, previous: 7.2, change: '+8.3%', trend: 'up' },
    { metric: 'Fréquence Sessions', current: 5.2, previous: 4.8, change: '+8.3%', trend: 'up' },
    { metric: 'Durée Moyenne', current: 15, previous: 18, change: '-16.7%', trend: 'down', unit: 'min' },
    { metric: 'Engagement', current: 85, previous: 78, change: '+9.0%', trend: 'up', unit: '%' },
  ],
  '90d': [
    { metric: 'Humeur Moyenne', current: 8.1, previous: 7.0, change: '+15.7%', trend: 'up' },
    { metric: 'Fréquence Sessions', current: 5.8, previous: 4.2, change: '+38.1%', trend: 'up' },
    { metric: 'Durée Moyenne', current: 18, previous: 15, change: '+20.0%', trend: 'up', unit: 'min' },
    { metric: 'Engagement', current: 91, previous: 72, change: '+26.4%', trend: 'up', unit: '%' },
  ],
};

// Simule un mini-graphique avec des barres
const MiniChart = ({ values, trend }: { values: number[]; trend: 'up' | 'down' }) => {
  const max = Math.max(...values);
  return (
    <div className="flex items-end gap-1 h-8">
      {values.map((v, i) => (
        <div 
          key={i}
          className={`w-2 rounded-t ${trend === 'up' ? 'bg-green-500' : 'bg-destructive'}`}
          style={{ height: `${(v / max) * 100}%`, opacity: 0.4 + (i * 0.12) }}
        />
      ))}
    </div>
  );
};

export default function TrendsPage() {
  const [period, setPeriod] = useState<Period>('30d');
  const [viewType, setViewType] = useState<'cards' | 'chart'>('cards');

  const trends = trendData[period];

  const periodLabel = {
    '7d': '7 derniers jours',
    '30d': '30 derniers jours',
    '90d': '90 derniers jours',
  };

  // Données simulées pour le mini-graphique
  const chartData = {
    '7d': [4, 5, 3, 6, 5, 7, 6],
    '30d': [5, 6, 4, 7, 6, 8, 7, 8, 6, 9],
    '90d': [4, 5, 6, 5, 7, 6, 8, 7, 9, 8, 9, 10],
  };

  return (
    <div className="min-h-screen bg-background p-6" data-testid="page-root">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Calendar className="h-8 w-8 text-primary" />
              Tendances Personnelles
            </h1>
            <p className="text-muted-foreground">Évolution de vos métriques - {periodLabel[period]}</p>
          </div>
          
          <div className="flex gap-2">
            <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 derniers jours</SelectItem>
                <SelectItem value="30d">30 derniers jours</SelectItem>
                <SelectItem value="90d">90 derniers jours</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex border rounded-md">
              <Button 
                variant={viewType === 'cards' ? 'secondary' : 'ghost'} 
                size="icon"
                onClick={() => setViewType('cards')}
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewType === 'chart' ? 'secondary' : 'ghost'} 
                size="icon"
                onClick={() => setViewType('chart')}
              >
                <LineChart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Score global */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Score de bien-être global</p>
                <p className="text-4xl font-bold text-primary">
                  {period === '7d' ? '78' : period === '30d' ? '82' : '88'}/100
                </p>
              </div>
              <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                <TrendingUp className="h-3 w-3 mr-1" />
                En progression
              </Badge>
            </div>
            <Progress value={period === '7d' ? 78 : period === '30d' ? 82 : 88} className="mt-4 h-3" />
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {trends.map((trend) => (
            <Card key={trend.metric}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{trend.metric}</CardTitle>
                  <div className="flex items-center gap-2">
                    <MiniChart values={chartData[period]} trend={trend.trend} />
                    {trend.trend === 'up' ? (
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">{trend.current}</span>
                  <span className="text-lg text-muted-foreground">{trend.unit}</span>
                  <span className="text-muted-foreground ml-2">vs {trend.previous}{trend.unit}</span>
                </div>
                <div className={`inline-flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
                  trend.trend === 'up' 
                    ? 'bg-green-500/10 text-green-600' 
                    : 'bg-destructive/10 text-destructive'
                }`}>
                  {trend.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {trend.change} cette période
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
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">Points Positifs</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Augmentation constante de votre humeur moyenne ({trends[0].change})</li>
                  <li>• Engagement élevé et en progression ({trends[3].change})</li>
                  <li>• Régularité des sessions améliorée</li>
                </ul>
              </div>
              
              {trends.some(t => t.trend === 'down') && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <h4 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-2">Points d'Attention</h4>
                  <ul className="space-y-2 text-sm">
                    {trends.filter(t => t.trend === 'down').map(t => (
                      <li key={t.metric}>• {t.metric} en baisse ({t.change})</li>
                    ))}
                    <li>• Privilégiez des sessions légèrement plus longues pour maximiser les bénéfices</li>
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
