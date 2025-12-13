/**
 * useCrisisDetectionEnriched - Détection de crise avec ML, alertes multi-canaux et suivi
 * Analyse complète multi-source avec scoring intelligent
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

export type CrisisLevel = 'none' | 'low' | 'medium' | 'high' | 'critical';
export type AlertChannel = 'in-app' | 'email' | 'sms' | 'emergency-contact';

export interface CrisisIndicator {
  id: string;
  source: 'journal' | 'mood' | 'behavior' | 'conversation' | 'assessment' | 'biometric';
  indicator: string;
  weight: number;
  confidence: number;
  detectedAt: string;
  context?: string;
}

export interface CrisisState {
  level: CrisisLevel;
  score: number; // 0-100
  confidence: number; // 0-1
  indicators: CrisisIndicator[];
  trend: 'improving' | 'stable' | 'declining';
  lastAnalysis: string | null;
  suggestedActions: CrisisAction[];
  emergencyResources: EmergencyResource[];
  alertsSent: AlertRecord[];
}

export interface CrisisAction {
  id: string;
  type: 'technique' | 'contact' | 'resource' | 'professional';
  title: string;
  description: string;
  urgency: 'immediate' | 'soon' | 'when-ready';
  actionUrl?: string;
}

export interface EmergencyResource {
  name: string;
  type: 'hotline' | 'chat' | 'location' | 'app';
  contact: string;
  available: string;
  description: string;
}

export interface AlertRecord {
  id: string;
  channel: AlertChannel;
  sentAt: string;
  recipient: string;
  status: 'sent' | 'delivered' | 'acknowledged' | 'failed';
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone?: string;
  email?: string;
  notifyOnCrisis: boolean;
  priority: number;
}

// Mots-clés avec pondération ML-like
const CRISIS_PATTERNS = {
  critical: {
    patterns: [
      { regex: /suicid[eé]/i, weight: 50, confidence: 0.95 },
      { regex: /me\s+tuer/i, weight: 50, confidence: 0.95 },
      { regex: /en\s+finir/i, weight: 45, confidence: 0.9 },
      { regex: /plus\s+la\s+force/i, weight: 40, confidence: 0.85 },
      { regex: /automutilation/i, weight: 45, confidence: 0.9 },
      { regex: /me\s+faire\s+du\s+mal/i, weight: 45, confidence: 0.9 },
    ],
    baseWeight: 40,
  },
  high: {
    patterns: [
      { regex: /d[ée]sespoir/i, weight: 30, confidence: 0.8 },
      { regex: /sans\s+espoir/i, weight: 30, confidence: 0.8 },
      { regex: /inutile/i, weight: 25, confidence: 0.75 },
      { regex: /fardeau/i, weight: 28, confidence: 0.8 },
      { regex: /personne\s+ne\s+comprend/i, weight: 25, confidence: 0.75 },
      { regex: /abandonner/i, weight: 25, confidence: 0.75 },
      { regex: /vide\s+int[ée]rieur/i, weight: 28, confidence: 0.8 },
    ],
    baseWeight: 25,
  },
  medium: {
    patterns: [
      { regex: /[ée]puis[ée]/i, weight: 15, confidence: 0.7 },
      { regex: /plus\s+envie/i, weight: 18, confidence: 0.75 },
      { regex: /vide/i, weight: 12, confidence: 0.65 },
      { regex: /anxi[ée]t[ée]/i, weight: 14, confidence: 0.7 },
      { regex: /panique/i, weight: 16, confidence: 0.75 },
      { regex: /insomnie/i, weight: 12, confidence: 0.7 },
      { regex: /cauchemar/i, weight: 12, confidence: 0.7 },
      { regex: /isol[ée]/i, weight: 15, confidence: 0.7 },
    ],
    baseWeight: 15,
  },
  low: {
    patterns: [
      { regex: /stress/i, weight: 8, confidence: 0.6 },
      { regex: /fatigu[ée]/i, weight: 6, confidence: 0.55 },
      { regex: /pr[ée]occup[ée]/i, weight: 7, confidence: 0.6 },
      { regex: /nerveux/i, weight: 7, confidence: 0.6 },
      { regex: /tendu/i, weight: 6, confidence: 0.55 },
      { regex: /difficile/i, weight: 5, confidence: 0.5 },
    ],
    baseWeight: 6,
  },
};

const DEFAULT_RESOURCES: EmergencyResource[] = [
  {
    name: 'Numéro national de prévention du suicide',
    type: 'hotline',
    contact: '3114',
    available: '24h/24, 7j/7',
    description: 'Ligne d\'écoute gratuite et confidentielle',
  },
  {
    name: 'SOS Amitié',
    type: 'hotline',
    contact: '09 72 39 40 50',
    available: '24h/24, 7j/7',
    description: 'Écoute et soutien',
  },
  {
    name: 'Fil Santé Jeunes',
    type: 'hotline',
    contact: '0 800 235 236',
    available: '9h-23h tous les jours',
    description: 'Pour les jeunes de 12 à 25 ans',
  },
  {
    name: 'SAMU',
    type: 'hotline',
    contact: '15',
    available: '24h/24, 7j/7',
    description: 'Urgences médicales',
  },
];

const DEFAULT_STATE: CrisisState = {
  level: 'none',
  score: 0,
  confidence: 0,
  indicators: [],
  trend: 'stable',
  lastAnalysis: null,
  suggestedActions: [],
  emergencyResources: DEFAULT_RESOURCES,
  alertsSent: [],
};

export function useCrisisDetectionEnriched() {
  const { user } = useAuth();
  const [state, setState] = useState<CrisisState>(DEFAULT_STATE);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const monitoringIntervalRef = useRef<NodeJS.Timeout>();

  // Load emergency contacts
  useEffect(() => {
    if (!user) return;

    const loadContacts = async () => {
      try {
        const { data } = await supabase
          .from('user_settings')
          .select('value')
          .eq('user_id', user.id)
          .eq('key', 'emergency_contacts')
          .maybeSingle();

        if (data?.value) {
          setEmergencyContacts(JSON.parse(data.value));
        }
      } catch (err) {
        logger.error('Failed to load emergency contacts', err as Error, 'CRISIS');
      }
    };

    loadContacts();
  }, [user]);

  // Analyze text for crisis indicators
  const analyzeText = useCallback((
    text: string,
    source: CrisisIndicator['source']
  ): CrisisIndicator[] => {
    const indicators: CrisisIndicator[] = [];

    for (const [level, config] of Object.entries(CRISIS_PATTERNS)) {
      for (const pattern of config.patterns) {
        if (pattern.regex.test(text)) {
          indicators.push({
            id: crypto.randomUUID(),
            source,
            indicator: pattern.regex.source,
            weight: pattern.weight,
            confidence: pattern.confidence,
            detectedAt: new Date().toISOString(),
            context: text.substring(0, 200),
          });
        }
      }
    }

    return indicators;
  }, []);

  // Analyze behavioral patterns
  const analyzeBehavior = useCallback(async (): Promise<CrisisIndicator[]> => {
    if (!user) return [];

    const indicators: CrisisIndicator[] = [];
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    try {
      // Check mood decline
      const { data: moods } = await supabase
        .from('mood_entries')
        .select('score, created_at')
        .eq('user_id', user.id)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: true });

      if (moods && moods.length >= 3) {
        // Calculate trend
        const avgFirst = moods.slice(0, Math.floor(moods.length / 2))
          .reduce((sum, m) => sum + m.score, 0) / Math.floor(moods.length / 2);
        const avgLast = moods.slice(Math.floor(moods.length / 2))
          .reduce((sum, m) => sum + m.score, 0) / (moods.length - Math.floor(moods.length / 2));

        if (avgLast < avgFirst * 0.7) {
          indicators.push({
            id: crypto.randomUUID(),
            source: 'behavior',
            indicator: 'mood_decline',
            weight: 20,
            confidence: 0.8,
            detectedAt: now.toISOString(),
            context: `Baisse de ${Math.round((1 - avgLast / avgFirst) * 100)}% de l'humeur`,
          });
        }

        // Check for consistently low moods
        const lowMoods = moods.filter(m => m.score < 30);
        if (lowMoods.length >= 5) {
          indicators.push({
            id: crypto.randomUUID(),
            source: 'behavior',
            indicator: 'persistent_low_mood',
            weight: 25,
            confidence: 0.85,
            detectedAt: now.toISOString(),
            context: `${lowMoods.length} enregistrements d'humeur basse cette semaine`,
          });
        }
      }

      // Check inactivity
      const { data: lastActivity } = await supabase
        .from('activity_logs')
        .select('created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (lastActivity) {
        const daysSinceActivity = Math.floor(
          (now.getTime() - new Date(lastActivity.created_at).getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceActivity >= 7) {
          indicators.push({
            id: crypto.randomUUID(),
            source: 'behavior',
            indicator: 'prolonged_inactivity',
            weight: 15,
            confidence: 0.7,
            detectedAt: now.toISOString(),
            context: `${daysSinceActivity} jours sans activité`,
          });
        }
      }

      // Check assessment scores
      const { data: assessments } = await supabase
        .from('assessments')
        .select('instrument, score_json')
        .eq('user_id', user.id)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (assessments) {
        for (const assessment of assessments) {
          const scoreJson = typeof assessment.score_json === 'string'
            ? JSON.parse(assessment.score_json)
            : assessment.score_json;
          const total = scoreJson?.total || scoreJson?.score || 0;

          if (assessment.instrument === 'phq9' && total >= 20) {
            indicators.push({
              id: crypto.randomUUID(),
              source: 'assessment',
              indicator: 'high_phq9_score',
              weight: 35,
              confidence: 0.9,
              detectedAt: now.toISOString(),
              context: `Score PHQ-9: ${total} (sévère)`,
            });
          }

          if (assessment.instrument === 'gad7' && total >= 15) {
            indicators.push({
              id: crypto.randomUUID(),
              source: 'assessment',
              indicator: 'high_gad7_score',
              weight: 30,
              confidence: 0.85,
              detectedAt: now.toISOString(),
              context: `Score GAD-7: ${total} (sévère)`,
            });
          }
        }
      }
    } catch (err) {
      logger.error('Behavior analysis failed', err as Error, 'CRISIS');
    }

    return indicators;
  }, [user]);

  // Calculate crisis level
  const calculateLevel = useCallback((score: number): CrisisLevel => {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    if (score >= 20) return 'low';
    return 'none';
  }, []);

  // Generate suggested actions
  const generateActions = useCallback((level: CrisisLevel): CrisisAction[] => {
    const actions: CrisisAction[] = [];

    switch (level) {
      case 'critical':
        actions.push(
          {
            id: 'call-3114',
            type: 'contact',
            title: 'Appeler le 3114',
            description: 'Ligne nationale de prévention du suicide, disponible 24h/24',
            urgency: 'immediate',
          },
          {
            id: 'emergency-contact',
            type: 'contact',
            title: 'Contacter votre proche de confiance',
            description: 'Parlez à quelqu\'un en qui vous avez confiance',
            urgency: 'immediate',
          },
          {
            id: 'go-to-er',
            type: 'professional',
            title: 'Se rendre aux urgences',
            description: 'Le service des urgences peut vous aider immédiatement',
            urgency: 'immediate',
          }
        );
        break;
      case 'high':
        actions.push(
          {
            id: 'call-professional',
            type: 'professional',
            title: 'Consulter un professionnel',
            description: 'Prenez rendez-vous avec un psychologue ou psychiatre dans les 48h',
            urgency: 'soon',
          },
          {
            id: 'breathing',
            type: 'technique',
            title: 'Exercice de respiration',
            description: 'La respiration 4-7-8 peut vous aider à vous calmer',
            urgency: 'immediate',
            actionUrl: '/app/breath',
          },
          {
            id: 'trusted-person',
            type: 'contact',
            title: 'Parler à quelqu\'un',
            description: 'Contactez un ami ou un membre de votre famille',
            urgency: 'soon',
          }
        );
        break;
      case 'medium':
        actions.push(
          {
            id: 'schedule-appointment',
            type: 'professional',
            title: 'Planifier un rendez-vous',
            description: 'Consultez un professionnel de santé mentale',
            urgency: 'when-ready',
          },
          {
            id: 'meditation',
            type: 'technique',
            title: 'Session de méditation',
            description: 'Prenez 10 minutes pour vous recentrer',
            urgency: 'soon',
            actionUrl: '/app/coach',
          },
          {
            id: 'journal',
            type: 'technique',
            title: 'Écrire dans votre journal',
            description: 'Exprimer vos pensées peut aider',
            urgency: 'soon',
            actionUrl: '/app/journal',
          }
        );
        break;
      case 'low':
        actions.push(
          {
            id: 'self-care',
            type: 'technique',
            title: 'Prendre soin de vous',
            description: 'Accordez-vous du temps pour des activités que vous aimez',
            urgency: 'when-ready',
          },
          {
            id: 'daily-breathing',
            type: 'technique',
            title: 'Respiration quotidienne',
            description: 'Maintenez une pratique régulière',
            urgency: 'when-ready',
            actionUrl: '/app/breath',
          }
        );
        break;
    }

    return actions;
  }, []);

  // Run full analysis
  const runAnalysis = useCallback(async (additionalText?: string): Promise<CrisisState> => {
    if (!user) return DEFAULT_STATE;

    setIsAnalyzing(true);

    try {
      let allIndicators: CrisisIndicator[] = [];

      // Analyze additional text if provided
      if (additionalText) {
        allIndicators.push(...analyzeText(additionalText, 'conversation'));
      }

      // Analyze recent journal entries
      const { data: journals } = await supabase
        .from('journal_entries')
        .select('content, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (journals) {
        for (const journal of journals) {
          allIndicators.push(...analyzeText(journal.content || '', 'journal'));
        }
      }

      // Analyze behavior
      const behaviorIndicators = await analyzeBehavior();
      allIndicators.push(...behaviorIndicators);

      // Deduplicate
      const uniqueIndicators = allIndicators.reduce<CrisisIndicator[]>((acc, ind) => {
        const exists = acc.find(a => a.indicator === ind.indicator && a.source === ind.source);
        if (!exists) acc.push(ind);
        return acc;
      }, []);

      // Calculate score (max 100)
      const totalWeight = uniqueIndicators.reduce((sum, ind) => sum + ind.weight, 0);
      const score = Math.min(100, totalWeight);
      const avgConfidence = uniqueIndicators.length > 0
        ? uniqueIndicators.reduce((sum, ind) => sum + ind.confidence, 0) / uniqueIndicators.length
        : 0;

      const level = calculateLevel(score);
      const actions = generateActions(level);

      // Determine trend
      let trend: CrisisState['trend'] = 'stable';
      const { data: history } = await supabase
        .from('user_settings')
        .select('value')
        .eq('user_id', user.id)
        .eq('key', 'crisis_score_history')
        .maybeSingle();

      if (history?.value) {
        try {
          const scores: number[] = JSON.parse(history.value);
          const recentAvg = scores.slice(-3).reduce((a, b) => a + b, 0) / 3;
          if (score > recentAvg + 10) trend = 'declining';
          else if (score < recentAvg - 10) trend = 'improving';
        } catch {}
      }

      const newState: CrisisState = {
        level,
        score,
        confidence: avgConfidence,
        indicators: uniqueIndicators.slice(0, 15),
        trend,
        lastAnalysis: new Date().toISOString(),
        suggestedActions: actions,
        emergencyResources: DEFAULT_RESOURCES,
        alertsSent: state.alertsSent,
      };

      // Save score history
      await saveScoreHistory(score);

      setState(newState);

      // Trigger alerts if needed
      if (level === 'critical' || level === 'high') {
        await triggerAlerts(newState);
      }

      logger.info('Crisis analysis complete', { level, score, indicators: uniqueIndicators.length }, 'CRISIS');

      return newState;
    } catch (err) {
      logger.error('Crisis analysis failed', err as Error, 'CRISIS');
      return DEFAULT_STATE;
    } finally {
      setIsAnalyzing(false);
    }
  }, [user, analyzeText, analyzeBehavior, calculateLevel, generateActions, state.alertsSent]);

  // Save score history
  const saveScoreHistory = async (score: number) => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('user_settings')
        .select('value')
        .eq('user_id', user.id)
        .eq('key', 'crisis_score_history')
        .maybeSingle();

      let history: number[] = data?.value ? JSON.parse(data.value) : [];
      history.push(score);
      history = history.slice(-30);

      await supabase.from('user_settings').upsert({
        user_id: user.id,
        key: 'crisis_score_history',
        value: JSON.stringify(history),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,key' });
    } catch {}
  };

  // Trigger alerts
  const triggerAlerts = async (crisisState: CrisisState): Promise<void> => {
    if (!user) return;

    const newAlerts: AlertRecord[] = [];

    try {
      // Call edge function to handle alerts
      const { data, error } = await supabase.functions.invoke('crisis-detection', {
        body: {
          action: 'alert',
          crisisState,
          emergencyContacts,
        },
      });

      if (!error && data?.alertsSent) {
        for (const alert of data.alertsSent) {
          newAlerts.push({
            id: crypto.randomUUID(),
            channel: alert.channel,
            sentAt: new Date().toISOString(),
            recipient: alert.recipient,
            status: 'sent',
          });
        }
      }

      setState(prev => ({
        ...prev,
        alertsSent: [...prev.alertsSent, ...newAlerts],
      }));

      logger.warn('Crisis alerts triggered', { level: crisisState.level, alertCount: newAlerts.length }, 'CRISIS');
    } catch (err) {
      logger.error('Failed to trigger alerts', err as Error, 'CRISIS');
    }
  };

  // Quick analyze (without saving)
  const quickAnalyze = useCallback((text: string): { level: CrisisLevel; score: number } => {
    const indicators = analyzeText(text, 'conversation');
    const score = Math.min(100, indicators.reduce((sum, ind) => sum + ind.weight, 0));
    return { level: calculateLevel(score), score };
  }, [analyzeText, calculateLevel]);

  // Start continuous monitoring
  const startMonitoring = useCallback(() => {
    if (isMonitoring) return;

    setIsMonitoring(true);
    monitoringIntervalRef.current = setInterval(() => {
      runAnalysis();
    }, 30 * 60 * 1000); // Every 30 minutes

    // Run immediately
    runAnalysis();

    logger.info('Crisis monitoring started', undefined, 'CRISIS');
  }, [isMonitoring, runAnalysis]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    if (monitoringIntervalRef.current) {
      clearInterval(monitoringIntervalRef.current);
    }
    setIsMonitoring(false);
    logger.info('Crisis monitoring stopped', undefined, 'CRISIS');
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (monitoringIntervalRef.current) {
        clearInterval(monitoringIntervalRef.current);
      }
    };
  }, []);

  // Save emergency contacts
  const saveEmergencyContacts = async (contacts: EmergencyContact[]): Promise<void> => {
    if (!user) return;

    try {
      await supabase.from('user_settings').upsert({
        user_id: user.id,
        key: 'emergency_contacts',
        value: JSON.stringify(contacts),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,key' });

      setEmergencyContacts(contacts);
      logger.info('Emergency contacts saved', { count: contacts.length }, 'CRISIS');
    } catch (err) {
      logger.error('Failed to save emergency contacts', err as Error, 'CRISIS');
    }
  };

  return {
    // State
    ...state,
    isAnalyzing,
    isMonitoring,
    emergencyContacts,

    // Analysis
    runAnalysis,
    quickAnalyze,
    analyzeText,

    // Monitoring
    startMonitoring,
    stopMonitoring,

    // Emergency contacts
    saveEmergencyContacts,

    // Helpers
    crisisLevelColor: {
      none: 'green',
      low: 'yellow',
      medium: 'orange',
      high: 'red',
      critical: 'purple',
    }[state.level],
  };
}

export default useCrisisDetectionEnriched;
