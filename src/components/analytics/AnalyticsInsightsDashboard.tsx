// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, TrendingUp, Sparkles, Target, Activity, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { logger } from '@/lib/logger';

interface Insights {
  emotional_state: string;
  positive_trends: string[];
  attention_points: string[];
  recommendations: string[];
  predicted_score: number;
}

interface Trends {
  emotional_progression: Array<{ date: string; score: number; emotion: string }>;
  activity_correlation: Record<string, { frequency: number; avg_improvement: number }>;
  peak_times: string[];
  improvement_rate: number;
}

interface Prediction {
  current_score: number;
  predicted_score_7days: number;
  predicted_score_30days: number;
  confidence: number;
  factors: Record<string, number>;
  recommendations: string[];
}

const AnalyticsInsightsDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [trends, setTrends] = useState<Trends | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('week');

  useEffect(() => {
    loadTrends();
    loadPrediction();
  }, [timeframe]);

  const generateInsights = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('analytics-insights', {
        body: { action: 'generate_insights', timeframe }
      });

      if (error) throw error;

      setInsights(data.insights);
      toast.success('Insights générés avec succès');
    } catch (error) {
      logger.error('Error generating insights', error as Error, 'UI');
      toast.error('Erreur lors de la génération des insights');
    } finally {
      setLoading(false);
    }
  };

  const loadTrends = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('analytics-insights', {
        body: { action: 'get_trends', timeframe }
      });

      if (error) throw error;
      setTrends(data.trends);
    } catch (error) {
      logger.error('Error loading trends', error as Error, 'UI');
    }
  };

  const loadPrediction = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('analytics-insights', {
        body: { action: 'predict_wellness' }
      });

      if (error) throw error;
      setPrediction(data.prediction);
    } catch (error) {
      logger.error('Error loading prediction', error as Error, 'UI');
    }
  };

  const activityData = trends ? Object.entries(trends.activity_correlation).map(([name, data]) => ({
    name: name.replace('_', ' '),
    frequency: data.frequency,
    improvement: data.avg_improvement,
  })) : [];

  const radarData = prediction ? Object.entries(prediction.factors).map(([key, value]) => ({
    factor: key.replace('_', ' '),
    value: value * 100,
  })) : [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Brain className="h-8 w-8 text-primary" />
            Analytics & Insights AI
          </h1>
          <p className="text-muted-foreground mt-1">
            Analyses prédictives et recommandations personnalisées
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="px-4 py-2 rounded-lg border bg-background"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
          </select>
          
          <Button onClick={generateInsights} disabled={loading} size="lg">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Générer Insights AI
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insights">
            <Brain className="mr-2 h-4 w-4" />
            Insights AI
          </TabsTrigger>
          <TabsTrigger value="trends">
            <TrendingUp className="mr-2 h-4 w-4" />
            Tendances
          </TabsTrigger>
          <TabsTrigger value="prediction">
            <Target className="mr-2 h-4 w-4" />
            Prédictions
          </TabsTrigger>
        </TabsList>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          {insights ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Analyse Émotionnelle</CardTitle>
                  <CardDescription>État émotionnel actuel</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed">{insights.emotional_state}</p>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      Tendances Positives
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {insights.positive_trends.map((trend, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                          <span>{trend}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                      Points d'Attention
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {insights.attention_points.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="h-2 w-2 rounded-full bg-amber-500 mt-2" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Recommandations Personnalisées
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {insights.recommendations.map((rec, idx) => (
                      <div key={idx} className="p-4 rounded-lg bg-muted/50 border">
                        <p className="font-medium">#{idx + 1} {rec}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-10 pb-10 text-center">
                <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg text-muted-foreground mb-4">
                  Générez vos insights personnalisés avec l'IA
                </p>
                <Button onClick={generateInsights} size="lg">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyser maintenant
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          {trends && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Progression Émotionnelle</CardTitle>
                  <CardDescription>Évolution de votre bien-être sur {timeframe === 'week' ? '7 jours' : timeframe === 'month' ? '30 jours' : '90 jours'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trends.emotional_progression}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} name="Score de bien-être" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Corrélation Activités</CardTitle>
                  <CardDescription>Impact de vos activités sur votre bien-être</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="frequency" fill="hsl(var(--primary))" name="Fréquence" />
                      <Bar dataKey="improvement" fill="hsl(var(--accent))" name="Amélioration %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Heures Optimales</CardTitle>
                    <CardDescription>Meilleurs moments de la journée</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {trends.peak_times.map((time, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-primary/10 text-center font-medium">
                          {time}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Taux d'Amélioration</CardTitle>
                    <CardDescription>Progression globale</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-6xl font-bold text-primary mb-2">
                        +{trends.improvement_rate}%
                      </div>
                      <p className="text-muted-foreground">depuis le début du {timeframe === 'week' ? 'semaine' : timeframe === 'month' ? 'mois' : 'trimestre'}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        {/* Prediction Tab */}
        <TabsContent value="prediction" className="space-y-6">
          {prediction && (
            <>
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Score Actuel</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-5xl font-bold text-primary text-center">
                      {prediction.current_score}
                      <span className="text-2xl text-muted-foreground">/100</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Prédiction 7 jours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-5xl font-bold text-green-500 text-center">
                      {prediction.predicted_score_7days}
                      <span className="text-2xl text-muted-foreground">/100</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Prédiction 30 jours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-5xl font-bold text-blue-500 text-center">
                      {prediction.predicted_score_30days}
                      <span className="text-2xl text-muted-foreground">/100</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Facteurs de Progression</CardTitle>
                  <CardDescription>Analyse radar des facteurs clés (Confiance: {(prediction.confidence * 100).toFixed(0)}%)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="factor" />
                      <PolarRadiusAxis domain={[0, 100]} />
                      <Radar name="Facteurs" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions Recommandées</CardTitle>
                  <CardDescription>Pour atteindre vos objectifs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {prediction.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                        <Activity className="h-5 w-5 text-primary mt-0.5" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsInsightsDashboard;
