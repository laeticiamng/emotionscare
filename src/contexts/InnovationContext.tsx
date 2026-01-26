import React, { createContext, useContext, useState, useEffect } from 'react';

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

const mockExperiments: ExperimentFeature[] = [
  {
    id: 'ai-coach-v2',
    name: 'Coach IA Avancé',
    description: 'Nouveau moteur d\'IA avec apprentissage personnalisé',
    enabled: true,
    category: 'ai',
    rolloutPercentage: 25,
    metrics: { adoption: 78, satisfaction: 4.2, performance: 0.95 },
    feedback: ['Plus personnalisé', 'Réponses plus rapides'],
    startDate: '2024-01-15'
  },
  {
    id: 'voice-emotion-detection',
    name: 'Détection Émotionnelle Vocale',
    description: 'Analyse des émotions via reconnaissance vocale',
    enabled: false,
    category: 'ai',
    rolloutPercentage: 10,
    metrics: { adoption: 45, satisfaction: 3.8, performance: 0.82 },
    feedback: ['Très innovant', 'Besoin d\'améliorer la précision'],
    startDate: '2024-02-01'
  },
  {
    id: 'micro-interactions',
    name: 'Micro-interactions Avancées',
    description: 'Nouvelles animations et retours haptiques',
    enabled: true,
    category: 'ui',
    rolloutPercentage: 50,
    metrics: { adoption: 89, satisfaction: 4.5, performance: 0.98 },
    feedback: ['Interface plus fluide', 'Très agréable'],
    startDate: '2024-01-20'
  },
  {
    id: 'real-time-collaboration',
    name: 'Collaboration Temps Réel',
    description: 'Espace de travail collaboratif pour les équipes',
    enabled: false,
    category: 'performance',
    rolloutPercentage: 5,
    metrics: { adoption: 32, satisfaction: 3.5, performance: 0.75 },
    feedback: ['Potentiel énorme', 'Performance à optimiser'],
    startDate: '2024-02-15'
  }
];

const mockTechTrends: TechTrend[] = [
  {
    id: 'webgl-vr',
    name: 'WebGL/WebXR Natif',
    category: 'Réalité Virtuelle',
    impact: 'high',
    maturity: 'growing',
    adoptionScore: 7.5,
    description: 'VR native dans le navigateur sans plugins',
    potentialBenefits: ['Expérience immersive', 'Pas d\'installation'],
    implementationComplexity: 8
  },
  {
    id: 'edge-ai',
    name: 'IA Edge Computing',
    category: 'Intelligence Artificielle',
    impact: 'high',
    maturity: 'emerging',
    adoptionScore: 6.8,
    description: 'Traitement IA local pour la confidentialité',
    potentialBenefits: ['Latence réduite', 'Confidentialité totale'],
    implementationComplexity: 9
  },
  {
    id: 'web-assembly',
    name: 'WebAssembly Advanced',
    category: 'Performance',
    impact: 'medium',
    maturity: 'mature',
    adoptionScore: 8.2,
    description: 'Calculs haute performance dans le navigateur',
    potentialBenefits: ['Performance native', 'Polyvalence'],
    implementationComplexity: 6
  }
];

export const InnovationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [experiments, setExperiments] = useState<ExperimentFeature[]>(mockExperiments);
  const [techTrends, setTechTrends] = useState<TechTrend[]>(mockTechTrends);
  const [enabledFeatures, setEnabledFeatures] = useState<string[]>([]);

  useEffect(() => {
    // Calculer les fonctionnalités activées basées sur les expériences
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
    averageAdoptionTime: 14, // jours
    innovationScore: calculateInnovationScore(),
    techDebtRatio: 0.15,
    scalabilityIndex: 8.7
  };

  function calculateInnovationScore(): number {
    const activeExp = experiments.filter(e => e.enabled);
    if (activeExp.length === 0) return 0;
    
    const avgSatisfaction = activeExp.reduce((sum, e) => sum + e.metrics.satisfaction, 0) / activeExp.length;
    const avgAdoption = activeExp.reduce((sum, e) => sum + e.metrics.adoption, 0) / activeExp.length;
    const techScore = techTrends.reduce((sum, t) => sum + t.adoptionScore, 0) / techTrends.length;
    
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
