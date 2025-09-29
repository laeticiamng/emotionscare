import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  unit?: string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  target?: number;
  color?: string;
  category: 'engagement' | 'wellness' | 'performance' | 'prediction';
}

export interface EmotionalInsight {
  id: string;
  type: 'pattern' | 'anomaly' | 'prediction' | 'recommendation';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface UserBehaviorPattern {
  patternId: string;
  name: string;
  frequency: number;
  strength: number;
  description: string;
  predictability: number;
  lastOccurrence: string;
}

export interface PredictiveModel {
  modelId: string;
  name: string;
  accuracy: number;
  lastTrained: string;
  predictions: {
    shortTerm: number[];    // 7 jours
    mediumTerm: number[];   // 30 jours
    longTerm: number[];     // 90 jours
  };
  confidence: number;
}

interface AdvancedAnalyticsData {
  metrics: AnalyticsMetric[];
  insights: EmotionalInsight[];
  patterns: UserBehaviorPattern[];
  models: PredictiveModel[];
  correlations: {
    factors: string[];
    strength: number;
    description: string;
  }[];
}

interface AnalyticsFilter {
  dateRange: {
    start: Date;
    end: Date;
  };
  emotions: string[];
  categories: string[];
  minConfidence: number;
}

export const useAdvancedAnalytics = (filter?: AnalyticsFilter) => {
  const { user } = useAuth();
  const [data, setData] = useState<AdvancedAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [realTimeMode, setRealTimeMode] = useState(false);

  // Algorithmes d'analyse
  const emotionalPatternDetector = useMemo(() => {
    return {
      detectWeeklyPatterns: (emotionData: any[]) => {
        const weeklyAverages = Array(7).fill(0).map((_, dayIndex) => {
          const dayData = emotionData.filter(d => new Date(d.timestamp).getDay() === dayIndex);
          return dayData.length > 0 
            ? dayData.reduce((sum, d) => sum + d.score, 0) / dayData.length
            : 0;
        });

        const variance = this.calculateVariance(weeklyAverages);
        return {
          pattern: weeklyAverages,
          strength: Math.min(1, variance / 2),
          predictability: variance < 1 ? 0.8 : variance < 2 ? 0.6 : 0.4
        };
      },

      detectSeasonalPatterns: (emotionData: any[]) => {
        const monthlyData = Array(12).fill(0).map(() => ({ sum: 0, count: 0 }));
        
        emotionData.forEach(d => {
          const month = new Date(d.timestamp).getMonth();
          monthlyData[month].sum += d.score;
          monthlyData[month].count += 1;
        });

        const monthlyAverages = monthlyData.map(m => m.count > 0 ? m.sum / m.count : 0);
        
        return {
          pattern: monthlyAverages,
          strength: this.calculateVariance(monthlyAverages) / 3,
          peak: monthlyAverages.indexOf(Math.max(...monthlyAverages)),
          trough: monthlyAverages.indexOf(Math.min(...monthlyAverages))
        };
      },

      calculateVariance: (data: number[]) => {
        const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
        return data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
      }
    };
  }, []);

  const anomalyDetector = useMemo(() => {
    return {
      detectOutliers: (data: number[], threshold = 2) => {
        const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
        const std = Math.sqrt(data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length);
        
        return data.map((value, index) => ({
          index,
          value,
          isOutlier: Math.abs((value - mean) / std) > threshold,
          zScore: (value - mean) / std,
          severity: Math.abs((value - mean) / std) > 3 ? 'high' as const : 
                    Math.abs((value - mean) / std) > 2 ? 'medium' as const : 'low' as const
        }));
      },

      detectTrendChanges: (data: number[], windowSize = 7) => {
        const changes = [];
        
        for (let i = windowSize; i < data.length - windowSize; i++) {
          const beforeWindow = data.slice(i - windowSize, i);
          const afterWindow = data.slice(i, i + windowSize);
          
          const beforeMean = beforeWindow.reduce((sum, val) => sum + val, 0) / windowSize;
          const afterMean = afterWindow.reduce((sum, val) => sum + val, 0) / windowSize;
          
          const change = (afterMean - beforeMean) / beforeMean;
          
          if (Math.abs(change) > 0.2) { // 20% change threshold
            changes.push({
              index: i,
              changePercent: change,
              type: change > 0 ? 'improvement' : 'decline',
              severity: Math.abs(change) > 0.5 ? 'high' as const : 'medium' as const
            });
          }
        }
        
        return changes;
      }
    };
  }, []);

  const predictiveEngine = useMemo(() => {
    return {
      linearRegression: (data: number[]) => {
        const n = data.length;
        const x = Array.from({ length: n }, (_, i) => i);
        
        const sumX = x.reduce((sum, val) => sum + val, 0);
        const sumY = data.reduce((sum, val) => sum + val, 0);
        const sumXY = x.reduce((sum, val, i) => sum + val * data[i], 0);
        const sumXX = x.reduce((sum, val) => sum + val * val, 0);
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        
        return {
          slope,
          intercept,
          predict: (futureX: number) => slope * futureX + intercept,
          rSquared: this.calculateRSquared(data, x.map(xi => slope * xi + intercept))
        };
      },

      movingAveragePredict: (data: number[], windowSize = 7, steps = 7) => {
        const predictions = [];
        let workingData = [...data];
        
        for (let i = 0; i < steps; i++) {
          const window = workingData.slice(-windowSize);
          const prediction = window.reduce((sum, val) => sum + val, 0) / window.length;
          predictions.push(prediction);
          workingData.push(prediction);
        }
        
        return predictions;
      },

      exponentialSmoothing: (data: number[], alpha = 0.3, steps = 7) => {
        let lastSmoothed = data[0];
        const smoothed = [lastSmoothed];
        
        // Calculate smoothed values
        for (let i = 1; i < data.length; i++) {
          lastSmoothed = alpha * data[i] + (1 - alpha) * lastSmoothed;
          smoothed.push(lastSmoothed);
        }
        
        // Predict future values
        const predictions = [];
        for (let i = 0; i < steps; i++) {
          predictions.push(lastSmoothed);
        }
        
        return {
          smoothed,
          predictions,
          alpha
        };
      },

      calculateRSquared: (actual: number[], predicted: number[]) => {
        const actualMean = actual.reduce((sum, val) => sum + val, 0) / actual.length;
        const totalSumSquares = actual.reduce((sum, val) => sum + Math.pow(val - actualMean, 2), 0);
        const residualSumSquares = actual.reduce((sum, val, i) => sum + Math.pow(val - predicted[i], 2), 0);
        
        return 1 - (residualSumSquares / totalSumSquares);
      }
    };
  }, []);

  // Génération de données analytiques
  const generateAdvancedData = useCallback((): AdvancedAnalyticsData => {
    // Simulation de données historiques
    const historicalData = Array.from({ length: 90 }, (_, i) => ({
      timestamp: new Date(Date.now() - (90 - i) * 24 * 60 * 60 * 1000).toISOString(),
      score: 5 + Math.sin(i / 7) * 2 + Math.random() * 2,
      emotion: 'mixed',
      context: i % 7 < 5 ? 'work' : 'personal'
    }));

    // Métriques avancées
    const metrics: AnalyticsMetric[] = [
      {
        id: 'prediction_accuracy',
        name: 'Précision Prédictive',
        value: 87.3,
        unit: '%',
        change: 4.2,
        trend: 'up',
        target: 90,
        category: 'prediction'
      },
      {
        id: 'pattern_strength',
        name: 'Force des Patterns',
        value: 0.73,
        unit: '',
        change: 0.12,
        trend: 'up',
        category: 'performance'
      },
      {
        id: 'emotional_stability',
        name: 'Stabilité Émotionnelle',
        value: 6.8,
        unit: '/10',
        change: -0.3,
        trend: 'down',
        category: 'wellness'
      },
      {
        id: 'engagement_consistency',
        name: 'Consistance Engagement',
        value: 78.5,
        unit: '%',
        change: 8.7,
        trend: 'up',
        category: 'engagement'
      }
    ];

    // Détection de patterns
    const weeklyPattern = emotionalPatternDetector.detectWeeklyPatterns(historicalData);
    const patterns: UserBehaviorPattern[] = [
      {
        patternId: 'weekly_cycle',
        name: 'Cycle Hebdomadaire',
        frequency: 7,
        strength: weeklyPattern.strength,
        description: 'Pattern récurrent sur 7 jours avec pics en milieu de semaine',
        predictability: weeklyPattern.predictability,
        lastOccurrence: new Date().toISOString()
      }
    ];

    // Détection d'anomalies
    const scores = historicalData.map(d => d.score);
    const outliers = anomalyDetector.detectOutliers(scores);
    const trendChanges = anomalyDetector.detectTrendChanges(scores);

    // Génération d'insights
    const insights: EmotionalInsight[] = [
      ...outliers
        .filter(o => o.isOutlier)
        .slice(-3)
        .map((outlier, index) => ({
          id: `outlier_${index}`,
          type: 'anomaly' as const,
          severity: outlier.severity,
          title: `Anomalie détectée - Score ${outlier.value.toFixed(1)}`,
          description: `Valeur inhabituelle détectée avec un z-score de ${outlier.zScore.toFixed(2)}`,
          confidence: Math.min(0.95, Math.abs(outlier.zScore) / 4),
          actionable: outlier.severity === 'high',
          timestamp: historicalData[outlier.index]?.timestamp || new Date().toISOString()
        })),
      
      ...trendChanges.slice(-2).map((change, index) => ({
        id: `trend_${index}`,
        type: 'pattern' as const,
        severity: change.severity,
        title: `Changement de tendance détecté`,
        description: `${change.type === 'improvement' ? 'Amélioration' : 'Détérioration'} de ${(Math.abs(change.changePercent) * 100).toFixed(1)}%`,
        confidence: 0.8,
        actionable: change.type === 'decline',
        timestamp: new Date().toISOString()
      }))
    ];

    // Modèles prédictifs
    const linearModel = predictiveEngine.linearRegression(scores.slice(-30));
    const movingAvgPredictions = predictiveEngine.movingAveragePredict(scores.slice(-14));
    const expSmoothing = predictiveEngine.exponentialSmoothing(scores.slice(-21));

    const models: PredictiveModel[] = [
      {
        modelId: 'linear_trend',
        name: 'Régression Linéaire',
        accuracy: linearModel.rSquared * 100,
        lastTrained: new Date().toISOString(),
        predictions: {
          shortTerm: Array.from({ length: 7 }, (_, i) => linearModel.predict(scores.length + i)),
          mediumTerm: Array.from({ length: 30 }, (_, i) => linearModel.predict(scores.length + i)),
          longTerm: Array.from({ length: 90 }, (_, i) => linearModel.predict(scores.length + i))
        },
        confidence: linearModel.rSquared
      },
      {
        modelId: 'moving_average',
        name: 'Moyenne Mobile',
        accuracy: 75.4,
        lastTrained: new Date().toISOString(),
        predictions: {
          shortTerm: movingAvgPredictions,
          mediumTerm: predictiveEngine.movingAveragePredict(scores.slice(-14), 7, 30),
          longTerm: predictiveEngine.movingAveragePredict(scores.slice(-14), 7, 90)
        },
        confidence: 0.75
      },
      {
        modelId: 'exponential_smoothing',
        name: 'Lissage Exponentiel',
        accuracy: 82.1,
        lastTrained: new Date().toISOString(),
        predictions: {
          shortTerm: expSmoothing.predictions,
          mediumTerm: predictiveEngine.exponentialSmoothing(scores.slice(-30), 0.3, 30).predictions,
          longTerm: predictiveEngine.exponentialSmoothing(scores.slice(-60), 0.3, 90).predictions
        },
        confidence: 0.82
      }
    ];

    // Corrélations
    const correlations = [
      {
        factors: ['Sommeil', 'Score Émotionnel'],
        strength: 0.73,
        description: 'Corrélation forte entre qualité du sommeil et bien-être émotionnel'
      },
      {
        factors: ['Activité Physique', 'Énergie'],
        strength: 0.65,
        description: 'L\'activité physique impacte positivement les niveaux d\'énergie'
      },
      {
        factors: ['Stress Travail', 'Humeur Générale'],
        strength: -0.58,
        description: 'Le stress professionnel affecte négativement l\'humeur'
      }
    ];

    return {
      metrics,
      insights,
      patterns,
      models,
      correlations
    };
  }, [emotionalPatternDetector, anomalyDetector, predictiveEngine]);

  // Chargement des données
  const loadAnalytics = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const analyticsData = generateAdvancedData();
      setData(analyticsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement des analytics');
    } finally {
      setIsLoading(false);
    }
  }, [user, generateAdvancedData]);

  // Filtrage des données
  const filteredData = useMemo(() => {
    if (!data || !filter) return data;
    
    return {
      ...data,
      insights: data.insights.filter(insight => {
        if (filter.minConfidence && insight.confidence < filter.minConfidence) return false;
        // Ajout d'autres filtres selon les besoins
        return true;
      })
    };
  }, [data, filter]);

  // Mode temps réel
  useEffect(() => {
    if (!realTimeMode) return;
    
    const interval = setInterval(() => {
      loadAnalytics();
    }, 10000); // Mise à jour toutes les 10 secondes
    
    return () => clearInterval(interval);
  }, [realTimeMode, loadAnalytics]);

  // Chargement initial
  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  // Fonctions utilitaires
  const getInsightsByType = useCallback((type: EmotionalInsight['type']) => {
    return filteredData?.insights.filter(insight => insight.type === type) || [];
  }, [filteredData]);

  const getMetricsByCategory = useCallback((category: AnalyticsMetric['category']) => {
    return filteredData?.metrics.filter(metric => metric.category === category) || [];
  }, [filteredData]);

  const getBestModel = useCallback(() => {
    if (!filteredData?.models.length) return null;
    return filteredData.models.reduce((best, current) => 
      current.accuracy > best.accuracy ? current : best
    );
  }, [filteredData]);

  return {
    data: filteredData,
    isLoading,
    error,
    realTimeMode,
    setRealTimeMode,
    loadAnalytics,
    getInsightsByType,
    getMetricsByCategory,
    getBestModel,
    // Fonctions d'analyse avancée
    emotionalPatternDetector,
    anomalyDetector,
    predictiveEngine
  };
};