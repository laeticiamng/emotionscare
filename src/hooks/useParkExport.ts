/**
 * useParkExport - Hook pour exporter l'historique et progression du parc
 */

import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ParkExportData {
  exportDate: string;
  userId: string;
  userName?: string;
  statistics: {
    totalVisits: number;
    attractionsVisited: number;
    badgesEarned: number;
    questsCompleted: number;
    totalXP: number;
    totalCoins: number;
    currentStreak: number;
    longestStreak: number;
    favoriteZone: string | null;
  };
  visitHistory: {
    attractionId: string;
    attractionName: string;
    zone: string;
    visitedAt: string;
    duration?: number;
  }[];
  badges: {
    id: string;
    name: string;
    earnedAt: string;
  }[];
  quests: {
    id: string;
    title: string;
    status: 'active' | 'completed' | 'expired';
    progress: number;
    completedAt?: string;
  }[];
}

export function useParkExport() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [lastExport, setLastExport] = useState<Date | null>(null);

  // Gather export data
  const gatherExportData = useCallback(async (): Promise<ParkExportData | null> => {
    if (!user) return null;

    try {
      // Get user settings for park progress
      const { data: settings } = await supabase
        .from('user_settings')
        .select('value')
        .eq('user_id', user.id)
        .eq('key', 'emotional_park_progress')
        .maybeSingle();

      // Get user stats
      const { data: statsData } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // Get achievements
      const { data: achievements } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);

      // Parse park progress from settings
      const parkProgress = settings?.value ? JSON.parse(settings.value) : {};

      const exportData: ParkExportData = {
        exportDate: new Date().toISOString(),
        userId: user.id,
        userName: user.email?.split('@')[0],
        statistics: {
          totalVisits: parkProgress.progress?.totalVisits || 0,
          attractionsVisited: parkProgress.progress?.attractionsCompleted || 0,
          badgesEarned: parkProgress.progress?.badges?.length || 0,
          questsCompleted: parkProgress.progress?.questsCompleted || 0,
          totalXP: parkProgress.progress?.xp || 0,
          totalCoins: parkProgress.progress?.coins || 0,
          currentStreak: statsData?.current_streak || 0,
          longestStreak: statsData?.longest_streak || 0,
          favoriteZone: parkProgress.progress?.favoriteZone || null
        },
        visitHistory: (parkProgress.attractions || [])
          .filter((a: { lastVisited: string | null }) => a.lastVisited)
          .map((a: { id: string; name: string; zone: string; lastVisited: string }) => ({
            attractionId: a.id,
            attractionName: a.name,
            zone: a.zone,
            visitedAt: a.lastVisited
          })),
        badges: (achievements || []).map((a: { achievement_id: string; unlocked_at: string }) => ({
          id: a.achievement_id,
          name: a.achievement_id,
          earnedAt: a.unlocked_at
        })),
        quests: (parkProgress.quests || []).map((q: { id: string; title: string; isCompleted: boolean; progress: number }) => ({
          id: q.id,
          title: q.title,
          status: q.isCompleted ? 'completed' : 'active',
          progress: q.progress
        }))
      };

      return exportData;
    } catch (error) {
      console.error('Failed to gather export data:', error);
      return null;
    }
  }, [user]);

  // Export to JSON
  const exportToJSON = useCallback(async () => {
    setIsExporting(true);
    try {
      const data = await gatherExportData();
      if (!data) {
        toast({
          title: 'Erreur',
          description: 'Impossible de récupérer les données',
          variant: 'destructive'
        });
        return;
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `emotional-park-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setLastExport(new Date());
      toast({
        title: 'Export réussi',
        description: 'Votre progression a été exportée'
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: 'Erreur',
        description: "L'export a échoué",
        variant: 'destructive'
      });
    } finally {
      setIsExporting(false);
    }
  }, [gatherExportData, toast]);

  // Export to CSV
  const exportToCSV = useCallback(async () => {
    setIsExporting(true);
    try {
      const data = await gatherExportData();
      if (!data) {
        toast({
          title: 'Erreur',
          description: 'Impossible de récupérer les données',
          variant: 'destructive'
        });
        return;
      }

      // Create CSV content
      const headers = ['Type', 'ID', 'Nom', 'Zone', 'Date', 'Statut'];
      const rows: string[][] = [];

      // Add visit history
      data.visitHistory.forEach(visit => {
        rows.push(['Visite', visit.attractionId, visit.attractionName, visit.zone, visit.visitedAt, 'completed']);
      });

      // Add badges
      data.badges.forEach(badge => {
        rows.push(['Badge', badge.id, badge.name, '', badge.earnedAt, 'earned']);
      });

      // Add quests
      data.quests.forEach(quest => {
        rows.push(['Quête', quest.id, quest.title, '', quest.completedAt || '', quest.status]);
      });

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `emotional-park-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setLastExport(new Date());
      toast({
        title: 'Export réussi',
        description: 'Votre progression a été exportée en CSV'
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: 'Erreur',
        description: "L'export a échoué",
        variant: 'destructive'
      });
    } finally {
      setIsExporting(false);
    }
  }, [gatherExportData, toast]);

  // Generate shareable summary
  const generateSummary = useCallback(async (): Promise<string> => {
    const data = await gatherExportData();
    if (!data) return '';

    return `🎢 Mon aventure au Parc Émotionnel

📊 Statistiques:
• ${data.statistics.attractionsVisited} attractions visitées
• ${data.statistics.badgesEarned} badges débloqués
• ${data.statistics.questsCompleted} quêtes accomplies
• ${data.statistics.totalXP} XP accumulés
• Série actuelle: ${data.statistics.currentStreak} jours 🔥

#EmotionalPark #BienEtre #EmotionsCare`;
  }, [gatherExportData]);

  return {
    isExporting,
    lastExport,
    exportToJSON,
    exportToCSV,
    generateSummary,
    gatherExportData
  };
}

export default useParkExport;
