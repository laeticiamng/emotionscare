// @ts-nocheck
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { logger } from '@/lib/logger';

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
    dailyActiveUsers: 0,
    sessionDuration: 0,
    bounceRate: 0,
    conversionRate: 0,
    featureUsage: {},
    userSatisfaction: 0,
    retentionRate: 0,
    churnRisk: 0
  });
  const [insights, setInsights] = useState<ImprovementInsight[]>([]);

  // Démarrer une nouvelle session utilisateur et charger les métriques
  useEffect(() => {
    if (user) {
      startUserJourney();
      loadMetricsFromSupabase();
      generateInsights();
    }

    return () => {
      endUserJourney();
    };
  }, [user]);

  const loadMetricsFromSupabase = async () => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');

      // Get analytics metrics from Supabase
      const { data: metricsData } = await supabase
        .from('analytics_metrics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Get feature usage stats
      const { data: featureData } = await supabase
        .from('feature_usage')
        .select('feature_name, usage_count')
        .order('usage_count', { ascending: false });

      // Get recent activity events
      const { data: eventsData } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (metricsData) {
        const featureUsage: { [key: string]: number } = {};
        (featureData || []).forEach(f => {
          featureUsage[f.feature_name] = f.usage_count || 0;
        });

        setMetrics({
          dailyActiveUsers: metricsData.daily_active_users || 0,
          sessionDuration: metricsData.avg_session_duration || 0,
          bounceRate: metricsData.bounce_rate || 0,
          conversionRate: metricsData.conversion_rate || 0,
          featureUsage,
          userSatisfaction: metricsData.user_satisfaction || 0,
          retentionRate: metricsData.retention_rate || 0,
          churnRisk: metricsData.churn_risk || 0
        });
      }

      if (eventsData && eventsData.length > 0) {
        setEvents(eventsData.map(e => ({
          id: e.id,
          userId: e.user_id,
          eventType: e.action || 'interaction',
          module: e.module || 'unknown',
          timestamp: e.created_at,
          duration: e.duration,
          metadata: e.metadata
        })));
      }
    } catch (error) {
      logger.error('Error loading analytics metrics', error as Error, 'ANALYTICS');
    }
  };

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

    if (currentJourney) {
      setCurrentJourney(prev => prev ? {
        ...prev,
        events: [event, ...prev.events],
        pageViews: eventType === 'page_view' ? prev.pageViews + 1 : prev.pageViews,
        interactions: eventType !== 'page_view' ? prev.interactions + 1 : prev.interactions
      } : null);
    }

    logger.debug('Event tracked', { eventType, module, metadata }, 'ANALYTICS');
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
