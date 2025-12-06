
import { useState, useEffect } from 'react';
import { useInnovation } from '@/contexts/InnovationContext';

interface InnovationTrend {
  date: string;
  score: number;
  experiments: number;
  adoption: number;
}

interface PerformanceMetrics {
  loadTime: number;
  responseTime: number;
  errorRate: number;
  userSatisfaction: number;
}

export const useInnovationMetrics = () => {
  const { metrics, experiments } = useInnovation();
  const [trends, setTrends] = useState<InnovationTrend[]>([]);
  const [performance, setPerformance] = useState<PerformanceMetrics>({
    loadTime: 0,
    responseTime: 0,
    errorRate: 0,
    userSatisfaction: 0
  });

  useEffect(() => {
    // Générer des données de tendance pour les 30 derniers jours
    const generateTrends = () => {
      const today = new Date();
      const trendsData: InnovationTrend[] = [];
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        trendsData.push({
          date: date.toISOString().split('T')[0],
          score: metrics.innovationScore + Math.random() * 10 - 5,
          experiments: metrics.activeExperiments + Math.floor(Math.random() * 3),
          adoption: Math.random() * 100
        });
      }
      
      setTrends(trendsData);
    };

    generateTrends();
  }, [metrics]);

  useEffect(() => {
    // Simuler des métriques de performance
    const updatePerformance = () => {
      const activeFeatures = experiments.filter(e => e.enabled);
      const avgPerformance = activeFeatures.length > 0
        ? activeFeatures.reduce((sum, e) => sum + e.metrics.performance, 0) / activeFeatures.length
        : 1;

      setPerformance({
        loadTime: Math.max(100, 200 - (avgPerformance * 100)),
        responseTime: Math.max(50, 150 - (avgPerformance * 80)),
        errorRate: Math.max(0.1, 2 - (avgPerformance * 1.5)),
        userSatisfaction: activeFeatures.length > 0
          ? activeFeatures.reduce((sum, e) => sum + e.metrics.satisfaction, 0) / activeFeatures.length
          : 4.0
      });
    };

    updatePerformance();
  }, [experiments]);

  const getExperimentImpact = (experimentId: string) => {
    const experiment = experiments.find(e => e.id === experimentId);
    if (!experiment) return null;

    return {
      userEngagement: experiment.metrics.adoption > 70 ? 'positive' : 'neutral',
      performanceImpact: experiment.metrics.performance > 0.9 ? 'positive' : 'negative',
      satisfactionTrend: experiment.metrics.satisfaction > 4.0 ? 'increasing' : 'stable'
    };
  };

  const predictNextQuarterMetrics = () => {
    const growthRate = 1.15; // 15% de croissance estimée
    return {
      expectedScore: Math.min(100, metrics.innovationScore * growthRate),
      expectedExperiments: Math.ceil(metrics.totalExperiments * 1.3),
      expectedAdoption: Math.min(100, metrics.successRate * 1.1)
    };
  };

  return {
    trends,
    performance,
    getExperimentImpact,
    predictNextQuarterMetrics,
    currentMetrics: metrics
  };
};
