// @ts-nocheck
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

interface ExperimentFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: 'ui' | 'performance' | 'ai' | 'analytics' | 'security';
  rolloutPercentage: number;
  metrics: {
    adoption: number;
    satisfaction: number;
    performance: number;
  };
  feedback: string[];
  startDate: string;
  endDate?: string;
}

interface TechTrend {
  id: string;
  name: string;
  category: string;
  impact: 'low' | 'medium' | 'high';
  maturity: 'emerging' | 'growing' | 'mature';
  adoptionScore: number;
  description: string;
  potentialBenefits: string[];
  implementationComplexity: number;
}

interface InnovationMetrics {
  totalExperiments: number;
  activeExperiments: number;
  successRate: number;
  averageAdoptionTime: number;
  innovationScore: number;
  techDebtRatio: number;
  scalabilityIndex: number;
}

interface InnovationContextType {
  experiments: ExperimentFeature[];
  techTrends: TechTrend[];
  metrics: InnovationMetrics;
  enabledFeatures: string[];
  isFeatureEnabled: (featureId: string) => boolean;
  toggleExperiment: (experimentId: string) => void;
  addFeedback: (experimentId: string, feedback: string) => void;
  updateTechTrend: (trend: TechTrend) => void;
  getInnovationScore: () => number;
  predictScalabilityNeeds: () => any;
}

const InnovationContext = createContext<InnovationContextType | undefined>(undefined);

export const InnovationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [experiments, setExperiments] = useState<ExperimentFeature[]>([]);
  const [techTrends, setTechTrends] = useState<TechTrend[]>([]);
  const [enabledFeatures, setEnabledFeatures] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    async function loadExperiments() {
      try {
        const { data, error } = await supabase
          .from('feature_experiments')
          .select('*')
          .order('start_date', { ascending: false });
        if (error) {
          logger.error('Failed to load experiments', { error }, 'innovation');
          return;
        }
        if (data && data.length > 0) {
          const mapped: ExperimentFeature[] = data.map((row: any) => ({
            id: row.id,
            name: row.name ?? '',
            description: row.description ?? '',
            enabled: row.enabled ?? false,
            category: row.category ?? 'ui',
            rolloutPercentage: row.rollout_percentage ?? 0,
            metrics: row.metrics ?? { adoption: 0, satisfaction: 0, performance: 0 },
            feedback: row.feedback ?? [],
            startDate: row.start_date ?? '',
            endDate: row.end_date,
          }));
          setExperiments(mapped);
        }
      } catch (err) {
        logger.error('Unexpected error loading experiments', { err }, 'innovation');
      }
    }

    async function loadTechTrends() {
      try {
        const { data, error } = await supabase
          .from('tech_trends')
          .select('*')
          .order('adoption_score', { ascending: false });
        if (error) {
          logger.error('Failed to load tech trends', { error }, 'innovation');
          return;
        }
        if (data && data.length > 0) {
          const mapped: TechTrend[] = data.map((row: any) => ({
            id: row.id,
            name: row.name ?? '',
            category: row.category ?? '',
            impact: row.impact ?? 'medium',
            maturity: row.maturity ?? 'emerging',
            adoptionScore: row.adoption_score ?? 0,
            description: row.description ?? '',
            potentialBenefits: row.potential_benefits ?? [],
            implementationComplexity: row.implementation_complexity ?? 5,
          }));
          setTechTrends(mapped);
        }
      } catch (err) {
        logger.error('Unexpected error loading tech trends', { err }, 'innovation');
      }
    }

    loadExperiments();
    loadTechTrends();
  }, []);

  useEffect(() => {
    const enabled = experiments
      .filter(exp => exp.enabled && Math.random() * 100 < exp.rolloutPercentage)
      .map(exp => exp.id);
    setEnabledFeatures(enabled);
  }, [experiments]);

  const metrics: InnovationMetrics = {
    totalExperiments: experiments.length,
    activeExperiments: experiments.filter(e => e.enabled).length,
    successRate: experiments.length > 0 ?
      experiments.filter(e => e.metrics.satisfaction > 4.0).length / experiments.length * 100 : 0,
    averageAdoptionTime: 14,
    innovationScore: calculateInnovationScore(),
    techDebtRatio: 0.15,
    scalabilityIndex: 8.7
  };

  function calculateInnovationScore(): number {
    const activeExp = experiments.filter(e => e.enabled);
    if (activeExp.length === 0) return 0;

    const avgSatisfaction = activeExp.reduce((sum, e) => sum + e.metrics.satisfaction, 0) / activeExp.length;
    const avgAdoption = activeExp.reduce((sum, e) => sum + e.metrics.adoption, 0) / activeExp.length;
    const techScore = techTrends.length > 0
      ? techTrends.reduce((sum, t) => sum + t.adoptionScore, 0) / techTrends.length
      : 0;

    return Math.round((avgSatisfaction * 20 + avgAdoption * 0.5 + techScore * 5) / 3);
  }

  const isFeatureEnabled = (featureId: string): boolean => {
    return enabledFeatures.includes(featureId);
  };

  const toggleExperiment = (experimentId: string) => {
    setExperiments(prev => prev.map(exp =>
      exp.id === experimentId ? { ...exp, enabled: !exp.enabled } : exp
    ));
  };

  const addFeedback = (experimentId: string, feedback: string) => {
    setExperiments(prev => prev.map(exp =>
      exp.id === experimentId ?
        { ...exp, feedback: [...exp.feedback, feedback] } : exp
    ));
  };

  const updateTechTrend = (trend: TechTrend) => {
    setTechTrends(prev => prev.map(t => t.id === trend.id ? trend : t));
  };

  const getInnovationScore = (): number => {
    return metrics.innovationScore;
  };

  const predictScalabilityNeeds = () => {
    return {
      nextMonth: {
        expectedUsers: Math.round(1000 * (1 + metrics.scalabilityIndex / 100)),
        requiredResources: '2x current capacity',
        bottlenecks: ['Database connections', 'CDN bandwidth']
      },
      nextQuarter: {
        expectedUsers: Math.round(1000 * (1 + metrics.scalabilityIndex / 50)),
        requiredResources: '4x current capacity',
        bottlenecks: ['Microservices scaling', 'Real-time processing']
      }
    };
  };

  return (
    <InnovationContext.Provider value={{
      experiments,
      techTrends,
      metrics,
      enabledFeatures,
      isFeatureEnabled,
      toggleExperiment,
      addFeedback,
      updateTechTrend,
      getInnovationScore,
      predictScalabilityNeeds
    }}>
      {children}
    </InnovationContext.Provider>
  );
};

export const useInnovation = () => {
  const context = useContext(InnovationContext);
  if (!context) {
    throw new Error('useInnovation must be used within InnovationProvider');
  }
  return context;
};
