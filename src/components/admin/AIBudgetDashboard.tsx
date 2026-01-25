/**
 * AI Budget Dashboard - Monitoring des coûts API OpenAI
 * Affiche les dépenses, les seuils et les alertes budget
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Brain,
  Zap,
  Settings,
  RefreshCw,
  BarChart3,
  Clock
} from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { budgetMonitor } from '@/lib/ai/budgetMonitor';

interface UsageData {
  model: string;
  cost: number;
  requests: number;
  tokens: number;
  trend: 'up' | 'down' | 'stable';
}

interface DailyUsage {
  date: string;
  gpt4: number;
  gpt35: number;
  total: number;
}

const MODEL_CONFIG = {
  'gpt-4.1-2025-04-14': { 
    name: 'GPT-4.1', 
    color: 'hsl(var(--primary))',
    threshold: 100,
    icon: Brain
  },
  'gpt-4o-mini-2024-07-18': { 
    name: 'GPT-4o Mini', 
    color: 'hsl(var(--accent))',
    threshold: 50,
    icon: Zap
  },
  'gpt-3.5-turbo': { 
    name: 'GPT-3.5', 
    color: 'hsl(var(--muted-foreground))',
    threshold: 25,
    icon: Zap
  }
};

export const AIBudgetDashboard: React.FC = () => {
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [dailyUsage, setDailyUsage] = useState<DailyUsage[]>([]);
  const [totalBudget, setTotalBudget] = useState(200);
  const [currentSpend, setCurrentSpend] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [budgetExceeded, setBudgetExceeded] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    loadBudgetData();
  }, []);

  const loadBudgetData = async () => {
    setIsLoading(true);
    try {
      // Simuler les données pour la démo (en prod, utiliser budgetMonitor)
      const mockUsage: UsageData[] = [
        { model: 'gpt-4.1-2025-04-14', cost: 45.32, requests: 1250, tokens: 125000, trend: 'up' },
        { model: 'gpt-4o-mini-2024-07-18', cost: 12.85, requests: 3420, tokens: 450000, trend: 'stable' },
        { model: 'gpt-3.5-turbo', cost: 3.21, requests: 890, tokens: 180000, trend: 'down' },
      ];

      const mockDaily: DailyUsage[] = Array.from({ length: 14 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (13 - i));
        return {
          date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
          gpt4: Math.random() * 8 + 2,
          gpt35: Math.random() * 2 + 0.5,
          total: 0
        };
      }).map(d => ({ ...d, total: d.gpt4 + d.gpt35 }));

      setUsageData(mockUsage);
      setDailyUsage(mockDaily);
      setCurrentSpend(mockUsage.reduce((acc, u) => acc + u.cost, 0));
      
      const exceeded = await budgetMonitor.hasExceededBudget();
      setBudgetExceeded(exceeded);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erreur chargement budget:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const spendPercentage = (currentSpend / totalBudget) * 100;
  const isWarning = spendPercentage > 70;
  const isCritical = spendPercentage > 90;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Budget IA</h2>
          <p className="text-muted-foreground">Monitoring des coûts API OpenAI</p>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdate && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {lastUpdate.toLocaleTimeString('fr-FR')}
            </span>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadBudgetData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Alerte budget dépassé */}
      {budgetExceeded && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Budget dépassé</AlertTitle>
          <AlertDescription>
            Le seuil de dépenses a été atteint. Les requêtes sont automatiquement basculées vers des modèles économiques.
          </AlertDescription>
        </Alert>
      )}

      {/* Cartes résumé */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Dépenses ce mois</p>
                <p className="text-2xl font-bold text-foreground">${currentSpend.toFixed(2)}</p>
              </div>
              <div className={`p-3 rounded-full ${isCritical ? 'bg-destructive/10' : isWarning ? 'bg-warning/10' : 'bg-primary/10'}`}>
                <DollarSign className={`h-5 w-5 ${isCritical ? 'text-destructive' : isWarning ? 'text-warning' : 'text-primary'}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Budget total</p>
                <p className="text-2xl font-bold text-foreground">${totalBudget}</p>
              </div>
              <div className="p-3 rounded-full bg-accent/10">
                <BarChart3 className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Requêtes totales</p>
                <p className="text-2xl font-bold text-foreground">
                  {usageData.reduce((acc, u) => acc + u.requests, 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-full bg-accent/10">
                <Zap className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tokens utilisés</p>
                <p className="text-2xl font-bold text-foreground">
                  {(usageData.reduce((acc, u) => acc + u.tokens, 0) / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <Brain className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de progression budget */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Utilisation du budget</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Progress 
              value={Math.min(spendPercentage, 100)} 
              className={`h-4 ${isCritical ? '[&>div]:bg-destructive' : isWarning ? '[&>div]:bg-warning' : ''}`}
            />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{spendPercentage.toFixed(1)}% utilisé</span>
              <span className={isCritical ? 'text-destructive font-medium' : isWarning ? 'text-warning font-medium' : 'text-muted-foreground'}>
                ${(totalBudget - currentSpend).toFixed(2)} restant
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="usage" className="space-y-4">
        <TabsList>
          <TabsTrigger value="usage">Par modèle</TabsTrigger>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="space-y-4">
          {/* Usage par modèle */}
          <div className="grid gap-4 md:grid-cols-3">
            {usageData.map((usage) => {
              const config = MODEL_CONFIG[usage.model as keyof typeof MODEL_CONFIG] || {
                name: usage.model,
                color: 'hsl(var(--muted-foreground))',
                threshold: 50,
                icon: Brain
              };
              const Icon = config.icon;
              const percentage = (usage.cost / config.threshold) * 100;

              return (
                <Card key={usage.model}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-base">{config.name}</CardTitle>
                      </div>
                      <Badge variant={usage.trend === 'up' ? 'destructive' : usage.trend === 'down' ? 'secondary' : 'outline'}>
                        {usage.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : 
                         usage.trend === 'down' ? <TrendingDown className="h-3 w-3 mr-1" /> : null}
                        {usage.trend === 'up' ? '+12%' : usage.trend === 'down' ? '-8%' : '0%'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-2xl font-bold">${usage.cost.toFixed(2)}</div>
                    <Progress value={Math.min(percentage, 100)} className="h-2" />
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div>
                        <span className="block font-medium text-foreground">{usage.requests.toLocaleString()}</span>
                        requêtes
                      </div>
                      <div>
                        <span className="block font-medium text-foreground">{(usage.tokens / 1000).toFixed(0)}K</span>
                        tokens
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="trends">
          {/* Graphique tendances */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution des dépenses (14 jours)</CardTitle>
              <CardDescription>Coûts journaliers par modèle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyUsage}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" tickFormatter={(v) => `$${v}`} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="gpt4" 
                      stackId="1"
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))"
                      fillOpacity={0.6}
                      name="GPT-4"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="gpt35" 
                      stackId="1"
                      stroke="hsl(var(--accent))" 
                      fill="hsl(var(--accent))"
                      fillOpacity={0.6}
                      name="GPT-3.5"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIBudgetDashboard;
