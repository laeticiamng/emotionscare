
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';

interface AnalyticsEvent {
  id: string;
  userId: string;
  eventType: string;
  module: string;
  timestamp: string;
  duration?: number;
  metadata?: Record<string, any>;
}

interface UserJourney {
  sessionId: string;
  startTime: string;
  endTime?: string;
  events: AnalyticsEvent[];
  totalDuration: number;
  pageViews: number;
  interactions: number;
}

interface AnalyticsMetrics {
  dailyActiveUsers: number;
  sessionDuration: number;
  bounceRate: number;
  conversionRate: number;
  featureUsage: { [key: string]: number };
  userSatisfaction: number;
  retentionRate: number;
  churnRisk: number;
}

interface ImprovementInsight {
  metric: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  change: number;
  recommendation: string;
  priority: 'low' | 'medium' | 'high';
}

export const useAnalytics = () => {
  const { user } = useAuth();
  const { userMode } = useUserMode();
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [currentJourney, setCurrentJourney] = useState<UserJourney | null>(null);
  const [metrics, setMetrics] = useState<AnalyticsMetrics>({
    dailyActiveUsers: 1247,
    sessionDuration: 18.5,
    bounceRate: 12.3,
    conversionRate: 78.9,
    featureUsage: {
      scan: 89,
      music: 76,
      coach: 92,
      journal: 67,
      vr: 45,
      gamification: 83,
      socialCocon: 71
    },
    userSatisfaction: 8.4,
    retentionRate: 85.7,
    churnRisk: 8.2
  });
  const [insights, setInsights] = useState<ImprovementInsight[]>([]);

  // Démarrer une nouvelle session utilisateur
  useEffect(() => {
    if (user) {
      startUserJourney();
      generateInsights();
    }

    return () => {
      endUserJourney();
    };
  }, [user]);

  const startUserJourney = () => {
    const journey: UserJourney = {
      sessionId: `session_${Date.now()}`,
      startTime: new Date().toISOString(),
      events: [],
      totalDuration: 0,
      pageViews: 0,
      interactions: 0
    };
    setCurrentJourney(journey);
  };

  const endUserJourney = () => {
    if (currentJourney) {
      const endTime = new Date().toISOString();
      const totalDuration = new Date(endTime).getTime() - new Date(currentJourney.startTime).getTime();
      
      setCurrentJourney(prev => prev ? {
        ...prev,
        endTime,
        totalDuration: totalDuration / 1000 / 60 // en minutes
      } : null);
    }
  };

  const trackEvent = (eventType: string, module: string, metadata?: Record<string, any>) => {
    const event: AnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user?.id || 'anonymous',
      eventType,
      module,
      timestamp: new Date().toISOString(),
      metadata
    };

    setEvents(prev => [event, ...prev.slice(0, 999)]); // Garder les 1000 derniers événements

    // Mettre à jour le parcours utilisateur
    if (currentJourney) {
      setCurrentJourney(prev => prev ? {
        ...prev,
        events: [event, ...prev.events],
        pageViews: eventType === 'page_view' ? prev.pageViews + 1 : prev.pageViews,
        interactions: eventType !== 'page_view' ? prev.interactions + 1 : prev.interactions
      } : null);
    }

    console.log('Événement tracké:', event);
  };

  const trackPageView = (pageName: string, metadata?: Record<string, any>) => {
    trackEvent('page_view', pageName, metadata);
  };

  const trackInteraction = (action: string, module: string, metadata?: Record<string, any>) => {
    trackEvent('interaction', module, { action, ...metadata });
  };

  const trackFeatureUsage = (feature: string, duration?: number, metadata?: Record<string, any>) => {
    trackEvent('feature_usage', feature, { duration, ...metadata });
    
    // Mettre à jour les métriques d'usage
    setMetrics(prev => ({
      ...prev,
      featureUsage: {
        ...prev.featureUsage,
        [feature]: Math.min((prev.featureUsage[feature] || 0) + 1, 100)
      }
    }));
  };

  const generateInsights = () => {
    const mockInsights: ImprovementInsight[] = [
      {
        metric: 'Temps de session',
        trend: 'increasing',
        change: 12.5,
        recommendation: 'Optimiser les parcours utilisateurs pour maintenir l\'engagement',
        priority: 'medium'
      },
      {
        metric: 'Taux de rétention',
        trend: 'stable',
        change: 0.8,
        recommendation: 'Implémenter des notifications push personnalisées',
        priority: 'low'
      },
      {
        metric: 'Usage du module VR',
        trend: 'decreasing',
        change: -8.3,
        recommendation: 'Améliorer l\'onboarding VR et ajouter du contenu',
        priority: 'high'
      },
      {
        metric: 'Satisfaction utilisateur',
        trend: 'increasing',
        change: 6.2,
        recommendation: 'Capitaliser sur les améliorations récentes',
        priority: 'low'
      }
    ];
    setInsights(mockInsights);
  };

  const getFeatureAnalytics = (feature: string) => {
    const featureEvents = events.filter(e => e.module === feature);
    const usage = metrics.featureUsage[feature] || 0;
    const avgSessionTime = featureEvents.reduce((acc, e) => acc + (e.duration || 0), 0) / featureEvents.length || 0;

    return {
      totalUsage: usage,
      avgSessionTime,
      recentEvents: featureEvents.slice(0, 10),
      trendData: generateTrendData(feature)
    };
  };

  const generateTrendData = (feature: string) => {
    // Génération de données de tendance simulées
    const days = 30;
    const data = [];
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.floor(Math.random() * 100) + 50
      });
    }
    return data;
  };

  const exportAnalytics = () => {
    const data = {
      metrics,
      insights,
      userJourney: currentJourney,
      recentEvents: events.slice(0, 100),
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return {
    events,
    currentJourney,
    metrics,
    insights,
    trackEvent,
    trackPageView,
    trackInteraction,
    trackFeatureUsage,
    getFeatureAnalytics,
    exportAnalytics
  };
};
