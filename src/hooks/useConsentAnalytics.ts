// @ts-nocheck
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ConsentAnalytics {
  conversionRates: {
    channel: string;
    total: number;
    granted: number;
    rate: number;
  }[];
  purposeStats: {
    purpose: string;
    granted: number;
    withdrawn: number;
    total: number;
  }[];
  timelineData: {
    date: string;
    granted: number;
    withdrawn: number;
  }[];
  channelPreferences: {
    channel: string;
    count: number;
    percentage: number;
  }[];
  recentActivity: {
    date: string;
    changes: number;
  }[];
}

export const useConsentAnalytics = () => {
  return useQuery({
    queryKey: ['consent-analytics'],
    queryFn: async (): Promise<ConsentAnalytics> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Récupérer tous les consentements
      const { data: preferences, error: prefError } = await supabase
        .from('user_consent_preferences')
        .select(`
          *,
          channel:consent_channels(channel_code, channel_name),
          purpose:consent_purposes(purpose_code, purpose_name)
        `);

      if (prefError) throw prefError;

      // Récupérer l'historique
      const { data: history, error: histError } = await supabase
        .from('consent_history')
        .select(`
          *,
          channel:consent_channels(channel_code, channel_name),
          purpose:consent_purposes(purpose_code, purpose_name)
        `)
        .order('created_at', { ascending: false })
        .limit(500);

      if (histError) throw histError;

      // Calculer les taux de conversion par canal
      const channelStats = new Map();
      preferences?.forEach(pref => {
        const channelCode = pref.channel.channel_code;
        if (!channelStats.has(channelCode)) {
          channelStats.set(channelCode, {
            channel: pref.channel.channel_name,
            total: 0,
            granted: 0,
          });
        }
        const stats = channelStats.get(channelCode);
        stats.total++;
        if (pref.consent_given) stats.granted++;
      });

      const conversionRates = Array.from(channelStats.values()).map(stats => ({
        ...stats,
        rate: stats.total > 0 ? (stats.granted / stats.total) * 100 : 0,
      }));

      // Statistiques par finalité
      const purposeStats = new Map();
      preferences?.forEach(pref => {
        const purposeCode = pref.purpose.purpose_code;
        if (!purposeStats.has(purposeCode)) {
          purposeStats.set(purposeCode, {
            purpose: pref.purpose.purpose_name,
            granted: 0,
            withdrawn: 0,
            total: 0,
          });
        }
        const stats = purposeStats.get(purposeCode);
        stats.total++;
        if (pref.consent_given) {
          stats.granted++;
        } else {
          stats.withdrawn++;
        }
      });

      // Timeline des changements (derniers 30 jours)
      const timelineMap = new Map();
      const now = new Date();
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        timelineMap.set(dateStr, { date: dateStr, granted: 0, withdrawn: 0 });
      }

      history?.forEach(item => {
        const dateStr = item.created_at.split('T')[0];
        if (timelineMap.has(dateStr)) {
          const day = timelineMap.get(dateStr);
          if (item.new_consent) {
            day.granted++;
          } else {
            day.withdrawn++;
          }
        }
      });

      // Préférences de canaux
      const channelPrefs = new Map();
      preferences?.forEach(pref => {
        if (pref.consent_given) {
          const channelName = pref.channel.channel_name;
          channelPrefs.set(channelName, (channelPrefs.get(channelName) || 0) + 1);
        }
      });

      const totalPrefs = Array.from(channelPrefs.values()).reduce((sum, count) => sum + count, 0);
      const channelPreferences = Array.from(channelPrefs.entries()).map(([channel, count]) => ({
        channel,
        count,
        percentage: totalPrefs > 0 ? (count / totalPrefs) * 100 : 0,
      }));

      // Activité récente (7 derniers jours)
      const recentActivityMap = new Map();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        recentActivityMap.set(dateStr, { date: dateStr, changes: 0 });
      }

      history?.forEach(item => {
        const dateStr = item.created_at.split('T')[0];
        if (recentActivityMap.has(dateStr)) {
          recentActivityMap.get(dateStr).changes++;
        }
      });

      return {
        conversionRates,
        purposeStats: Array.from(purposeStats.values()),
        timelineData: Array.from(timelineMap.values()),
        channelPreferences,
        recentActivity: Array.from(recentActivityMap.values()),
      };
    },
    refetchInterval: 60000, // Rafraîchir toutes les minutes
  });
};
