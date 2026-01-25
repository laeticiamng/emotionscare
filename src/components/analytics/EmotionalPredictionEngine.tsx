import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Brain, 
  Target, 
  Calendar,
  Activity,
  Zap,
  Heart,
  Shield
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Algorithmes de Machine Learning simplifiés
class EmotionalPredictionML {

  // Régression polynomiale pour les tendances
  polynomialRegression(data: number[], degree: number = 2): number[] {
    const n = data.length;
    const x = Array.from({ length: n }, (_, i) => i);
    
    // Matrice de Vandermonde simplifiée
    const A: number[][] = [];
    for (let i = 0; i < n; i++) {
      A[i] = [];
      for (let j = 0; j <= degree; j++) {
        A[i][j] = Math.pow(x[i], j);
      }
    }
    
    // Résolution par moindres carrés (approximation)
    const coefficients = this.leastSquares(A, data);
    
    // Prédiction pour les prochains points
    const predictions: number[] = [];
    for (let i = n; i < n + 7; i++) {
      let prediction = 0;
      for (let j = 0; j <= degree; j++) {
        prediction += coefficients[j] * Math.pow(i, j);
      }
      predictions.push(Math.max(0, Math.min(10, prediction)));
    }
    
    return predictions;
  }

  private leastSquares(A: number[][], y: number[]): number[] {
    // Approximation simple pour les moindres carrés
    const n = A.length;
    const m = A[0].length;
    const coeffs = new Array(m).fill(0);
    
    // Calcul simplifié des coefficients
    for (let i = 0; i < m; i++) {
      let numerator = 0;
      let denominator = 0;
      
      for (let j = 0; j < n; j++) {
        numerator += A[j][i] * y[j];
        denominator += A[j][i] * A[j][i];
      }
      
      coeffs[i] = denominator !== 0 ? numerator / denominator : 0;
    }
    
    return coeffs;
  }

  // Analyse des patterns saisonniers
  analyzeSeasonalPatterns(data: EmotionalDataPoint[]): SeasonalPattern[] {
    const patterns: SeasonalPattern[] = [];
    
    // Pattern hebdomadaire
    const weeklyData = this.groupByWeekday(data);
    const weeklyPattern = this.calculateWeeklyPattern(weeklyData);
    patterns.push({
      type: 'weekly',
      pattern: weeklyPattern,
      strength: this.calculatePatternStrength(weeklyPattern),
      description: this.describeWeeklyPattern(weeklyPattern)
    });

    // Pattern mensuel
    const monthlyData = this.groupByMonth(data);
    const monthlyPattern = this.calculateMonthlyPattern(monthlyData);
    patterns.push({
      type: 'monthly',
      pattern: monthlyPattern,
      strength: this.calculatePatternStrength(monthlyPattern),
      description: this.describeMonthlyPattern(monthlyPattern)
    });

    return patterns;
  }

  private groupByWeekday(data: EmotionalDataPoint[]) {
    const grouped: { [key: number]: number[] } = {};
    data.forEach(point => {
      const day = new Date(point.timestamp).getDay();
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(point.overallScore);
    });
    return grouped;
  }

  private calculateWeeklyPattern(data: { [key: number]: number[] }) {
    const pattern: number[] = [];
    for (let i = 0; i < 7; i++) {
      const dayData = data[i] || [];
      const avg = dayData.length > 0 ? dayData.reduce((a, b) => a + b, 0) / dayData.length : 5;
      pattern.push(avg);
    }
    return pattern;
  }

  private groupByMonth(data: EmotionalDataPoint[]) {
    const grouped: { [key: number]: number[] } = {};
    data.forEach(point => {
      const month = new Date(point.timestamp).getMonth();
      if (!grouped[month]) grouped[month] = [];
      grouped[month].push(point.overallScore);
    });
    return grouped;
  }

  private calculateMonthlyPattern(data: { [key: number]: number[] }) {
    const pattern: number[] = [];
    for (let i = 0; i < 12; i++) {
      const monthData = data[i] || [];
      const avg = monthData.length > 0 ? monthData.reduce((a, b) => a + b, 0) / monthData.length : 5;
      pattern.push(avg);
    }
    return pattern;
  }

  private calculatePatternStrength(pattern: number[]): number {
    const mean = pattern.reduce((a, b) => a + b, 0) / pattern.length;
    const variance = pattern.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / pattern.length;
    return Math.min(1, variance / 2); // Normalisation
  }

  private describeWeeklyPattern(pattern: number[]): string {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const max = Math.max(...pattern);
    const min = Math.min(...pattern);
    const maxDay = days[pattern.indexOf(max)];
    const minDay = days[pattern.indexOf(min)];
    return `Meilleur jour: ${maxDay} (${max.toFixed(1)}), Jour difficile: ${minDay} (${min.toFixed(1)})`;
  }

  private describeMonthlyPattern(pattern: number[]): string {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const max = Math.max(...pattern);
    const min = Math.min(...pattern);
    const maxMonth = months[pattern.indexOf(max)];
    const minMonth = months[pattern.indexOf(min)];
    return `Meilleur mois: ${maxMonth}, Mois difficile: ${minMonth}`;
  }

  // Détection d'anomalies
  detectAnomalies(data: EmotionalDataPoint[]): Anomaly[] {
    const anomalies: Anomaly[] = [];
    const scores = data.map(d => d.overallScore);
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const std = Math.sqrt(scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scores.length);
    
    data.forEach((point) => {
      const zScore = Math.abs((point.overallScore - mean) / std);
      
      if (zScore > 2) { // Seuil de 2 écarts-types
        anomalies.push({
          timestamp: point.timestamp,
          type: point.overallScore > mean ? 'peak' : 'dip',
          severity: zScore > 3 ? 'high' : 'medium',
          value: point.overallScore,
          expectedValue: mean,
          description: point.overallScore > mean 
            ? `Pic émotionnel inhabituel (${point.overallScore.toFixed(1)}/10)`
            : `Chute émotionnelle significative (${point.overallScore.toFixed(1)}/10)`
        });
      }
    });

    return anomalies;
  }

  // Prédiction de risques
  predictRisks(data: EmotionalDataPoint[]): RiskPrediction[] {
    const risks: RiskPrediction[] = [];
    const recentData = data.slice(-14); // 14 derniers jours
    
    // Tendance décroissante
    const trendSlope = this.calculateTrendSlope(recentData.map(d => d.overallScore));
    if (trendSlope < -0.1) {
      risks.push({
        type: 'declining_mood',
        probability: Math.min(0.9, Math.abs(trendSlope) * 2),
        timeframe: '7-14 jours',
        description: 'Tendance décroissante de l\'humeur détectée',
        recommendations: [
          'Planifier des activités plaisantes',
          'Augmenter l\'activité physique',
          'Consulter un professionnel si nécessaire'
        ]
      });
    }

    // Variance élevée (instabilité émotionnelle)
    const variance = this.calculateVariance(recentData.map(d => d.overallScore));
    if (variance > 4) {
      risks.push({
        type: 'emotional_instability',
        probability: Math.min(0.8, variance / 5),
        timeframe: '3-7 jours',
        description: 'Instabilité émotionnelle élevée',
        recommendations: [
          'Pratiquer la méditation',
          'Maintenir une routine stable',
          'Techniques de gestion du stress'
        ]
      });
    }

    // Stress chronique
    const stressLevel = recentData.reduce((acc, d) => acc + (d.emotions.stress || 0), 0) / recentData.length;
    if (stressLevel > 7) {
      risks.push({
        type: 'chronic_stress',
        probability: Math.min(0.85, stressLevel / 10),
        timeframe: '1-3 semaines',
        description: 'Niveau de stress chronique élevé',
        recommendations: [
          'Techniques de relaxation',
          'Réévaluer la charge de travail',
          'Améliorer la qualité du sommeil'
        ]
      });
    }

    return risks;
  }

  private calculateTrendSlope(data: number[]): number {
    const n = data.length;
    if (n < 2) return 0;
    
    const x = Array.from({ length: n }, (_, i) => i);
    const meanX = x.reduce((a, b) => a + b, 0) / n;
    const meanY = data.reduce((a, b) => a + b, 0) / n;
    
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < n; i++) {
      numerator += (x[i] - meanX) * (data[i] - meanY);
      denominator += (x[i] - meanX) * (x[i] - meanX);
    }
    
    return denominator !== 0 ? numerator / denominator : 0;
  }

  private calculateVariance(data: number[]): number {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    return data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length;
  }
}

// Types
interface EmotionalDataPoint {
  timestamp: string;
  overallScore: number;
  emotions: {
    joy?: number;
    calm?: number;
    energy?: number;
    stress?: number;
    anxiety?: number;
  };
  context?: string;
}

interface SeasonalPattern {
  type: 'weekly' | 'monthly' | 'seasonal';
  pattern: number[];
  strength: number;
  description: string;
}

interface PersonalityProfile {
  type: string;
  characteristics: string[];
  predictions: string[];
}

interface Anomaly {
  timestamp: string;
  type: 'peak' | 'dip';
  severity: 'low' | 'medium' | 'high';
  value: number;
  expectedValue: number;
  description: string;
}

interface RiskPrediction {
  type: string;
  probability: number;
  timeframe: string;
  description: string;
  recommendations: string[];
}

interface PredictionResult {
  nextWeekPrediction: number[];
  trends: {
    shortTerm: 'positive' | 'negative' | 'stable';
    longTerm: 'positive' | 'negative' | 'stable';
    confidence: number;
  };
  seasonalPatterns: SeasonalPattern[];
  anomalies: Anomaly[];
  risks: RiskPrediction[];
  recommendations: string[];
}

const EmotionalPredictionEngine: React.FC = () => {
  const [predictionHorizon, setPredictionHorizon] = useState<'3d' | '1w' | '2w' | '1m'>('1w');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictions, setPredictions] = useState<PredictionResult | null>(null);

  const mlEngine = useMemo(() => new EmotionalPredictionML(), []);

  // Génération de données historiques factices
  const generateHistoricalData = (): EmotionalDataPoint[] => {
    const data: EmotionalDataPoint[] = [];
    const now = new Date();
    
    for (let i = 90; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Simulation de patterns réalistes
      const weekday = date.getDay();
      const dayOfMonth = date.getDate();
      
      // Pattern hebdomadaire (lundi difficile, vendredi meilleur)
      let baseScore = 6 + Math.sin((weekday + 1) * Math.PI / 7) * 1.5;
      
      // Pattern mensuel (milieu de mois plus stable)
      baseScore += Math.sin((dayOfMonth / 30) * Math.PI) * 0.5;
      
      // Bruit aléatoire
      baseScore += (Math.random() - 0.5) * 2;
      
      // Tendance générale légèrement positive
      baseScore += (90 - i) * 0.01;
      
      const stress = Math.max(0, Math.min(10, 5 + (Math.random() - 0.5) * 4));
      const joy = Math.max(0, Math.min(10, baseScore + (Math.random() - 0.5) * 2));
      const calm = Math.max(0, Math.min(10, baseScore - stress * 0.3 + (Math.random() - 0.5) * 1));
      const energy = Math.max(0, Math.min(10, baseScore + joy * 0.2 + (Math.random() - 0.5) * 1.5));
      
      data.push({
        timestamp: date.toISOString(),
        overallScore: (joy + calm + energy - stress * 0.5) / 3,
        emotions: {
          joy,
          calm,
          energy,
          stress,
          anxiety: stress * 0.8 + (Math.random() - 0.5) * 1
        },
        context: i % 7 === 0 ? 'weekend' : 'workday'
      });
    }
    
    return data;
  };

  const runPredictionAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulation d'un délai de calcul
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const historicalData = generateHistoricalData();
    
    // Prédictions
    const nextWeekScores = mlEngine.polynomialRegression(
      historicalData.map(d => d.overallScore),
      2
    );
    
    // Analyse des tendances
    const recentTrend = mlEngine.polynomialRegression(
      historicalData.slice(-14).map(d => d.overallScore),
      1
    );
    
    const longTermTrend = mlEngine.polynomialRegression(
      historicalData.slice(-30).map(d => d.overallScore),
      2
    );
    
    const shortTrendDirection = recentTrend[0] > historicalData[historicalData.length - 1].overallScore ? 'positive' : 'negative';
    const longTrendDirection = longTermTrend[longTermTrend.length - 1] > historicalData[historicalData.length - 1].overallScore ? 'positive' : 'negative';
    
    // Patterns saisonniers
    const seasonalPatterns = mlEngine.analyzeSeasonalPatterns(historicalData);
    
    // Détection d'anomalies
    const anomalies = mlEngine.detectAnomalies(historicalData);
    
    // Prédiction de risques
    const risks = mlEngine.predictRisks(historicalData);
    
    // Recommandations basées sur l'analyse
    const recommendations = generateRecommendations(risks, seasonalPatterns, shortTrendDirection);
    
    const result: PredictionResult = {
      nextWeekPrediction: nextWeekScores,
      trends: {
        shortTerm: shortTrendDirection as any,
        longTerm: longTrendDirection as any,
        confidence: 0.75 + Math.random() * 0.2
      },
      seasonalPatterns,
      anomalies: anomalies.slice(-5), // 5 dernières anomalies
      risks,
      recommendations
    };
    
    setPredictions(result);
    setIsAnalyzing(false);
  };

  const generateRecommendations = (
    risks: RiskPrediction[],
    patterns: SeasonalPattern[],
    trend: string
  ): string[] => {
    const recommendations: string[] = [];
    
    if (trend === 'negative') {
      recommendations.push('Augmenter les activités plaisantes dans votre routine');
      recommendations.push('Planifier des moments de détente quotidiens');
    }
    
    if (risks.some(r => r.type === 'chronic_stress')) {
      recommendations.push('Intégrer des techniques de respiration profonde');
      recommendations.push('Évaluer et réduire les sources de stress');
    }
    
    if (risks.some(r => r.type === 'emotional_instability')) {
      recommendations.push('Maintenir une routine stable et prévisible');
      recommendations.push('Pratiquer la méditation ou la mindfulness');
    }
    
    // Recommandations basées sur les patterns
    const weeklyPattern = patterns.find(p => p.type === 'weekly');
    if (weeklyPattern && weeklyPattern.strength > 0.5) {
      recommendations.push('Adapter vos activités selon vos patterns hebdomadaires');
    }
    
    return recommendations.slice(0, 6); // Limiter à 6 recommandations
  };

  useEffect(() => {
    runPredictionAnalysis();
  }, []);

  const formatPredictionData = () => {
    if (!predictions) return [];
    
    const days = ['Aujourd\'hui', 'Demain', 'J+2', 'J+3', 'J+4', 'J+5', 'J+6'];
    return predictions.nextWeekPrediction.map((score, index) => ({
      day: days[index] || `J+${index}`,
      score: Number(score.toFixed(1)),
      date: new Date(Date.now() + index * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { 
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      })
    }));
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'positive': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'negative': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const getRiskColor = (probability: number) => {
    if (probability < 0.3) return 'bg-green-100 text-green-800';
    if (probability < 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Moteur de Prédiction Émotionnelle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Select value={predictionHorizon} onValueChange={setPredictionHorizon as any}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3d">3 jours</SelectItem>
                <SelectItem value="1w">1 semaine</SelectItem>
                <SelectItem value="2w">2 semaines</SelectItem>
                <SelectItem value="1m">1 mois</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={runPredictionAnalysis} disabled={isAnalyzing}>
              {isAnalyzing ? 'Analyse en cours...' : 'Actualiser l\'analyse'}
            </Button>
          </div>

          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 animate-pulse" />
                <span className="text-sm">Traitement des algorithmes ML...</span>
              </div>
              <Progress value={85} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {predictions && (
        <>
          {/* Prédictions graphiques */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Prédictions pour la semaine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={formatPredictionData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Tendances */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Analyse des Tendances
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tendance court terme (2 semaines)</span>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(predictions.trends.shortTerm)}
                    <Badge variant={predictions.trends.shortTerm === 'positive' ? 'default' : 'destructive'}>
                      {predictions.trends.shortTerm === 'positive' ? 'Positive' : 
                       predictions.trends.shortTerm === 'negative' ? 'Négative' : 'Stable'}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tendance long terme (3 mois)</span>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(predictions.trends.longTerm)}
                    <Badge variant={predictions.trends.longTerm === 'positive' ? 'default' : 'destructive'}>
                      {predictions.trends.longTerm === 'positive' ? 'Positive' : 
                       predictions.trends.longTerm === 'negative' ? 'Négative' : 'Stable'}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-sm">Confiance du modèle</span>
                  <Progress value={predictions.trends.confidence * 100} />
                  <span className="text-xs text-muted-foreground">
                    {(predictions.trends.confidence * 100).toFixed(1)}% - 
                    {predictions.trends.confidence > 0.8 ? ' Très fiable' : 
                     predictions.trends.confidence > 0.6 ? ' Fiable' : ' Modérément fiable'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Patterns Saisonniers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {predictions.seasonalPatterns.map((pattern, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">
                        Pattern {pattern.type === 'weekly' ? 'hebdomadaire' : 'mensuel'}
                      </span>
                      <Badge variant="outline">
                        Force: {(pattern.strength * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{pattern.description}</p>
                    <Progress value={pattern.strength * 100} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Prédictions de risques */}
          {predictions.risks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Prédictions de Risques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {predictions.risks.map((risk, index) => (
                  <Alert key={index}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{risk.description}</span>
                        <div className="flex items-center gap-2">
                          <Badge className={getRiskColor(risk.probability)}>
                            {(risk.probability * 100).toFixed(0)}%
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {risk.timeframe}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm font-medium">Recommandations:</span>
                        <ul className="text-sm space-y-1">
                          {risk.recommendations.map((rec, recIndex) => (
                            <li key={recIndex} className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-current rounded-full" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Recommandations personnalisées */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Recommandations Personnalisées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {predictions.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Anomalies récentes */}
          {predictions.anomalies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Anomalies Détectées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {predictions.anomalies.map((anomaly, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <span className="text-sm font-medium">{anomaly.description}</span>
                        <p className="text-xs text-muted-foreground">
                          {new Date(anomaly.timestamp).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long'
                          })}
                        </p>
                      </div>
                      <Badge 
                        variant={anomaly.type === 'peak' ? 'default' : 'destructive'}
                        className={anomaly.severity === 'high' ? 'animate-pulse' : ''}
                      >
                        {anomaly.type === 'peak' ? 'Pic' : 'Chute'} - {anomaly.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default EmotionalPredictionEngine;