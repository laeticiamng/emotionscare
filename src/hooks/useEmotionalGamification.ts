
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { calculateStreakDays } from '@/utils/gamification/emotionCalculator';
import { EmotionGamificationStats } from '@/types/scan';

export const useEmotionalGamification = (userId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<EmotionGamificationStats>({
    totalScans: 0,
    streakDays: 0,
    points: 0,
    level: 1,
    next_milestone: 100,
    badges_earned: [],
    highest_emotion: 'neutral',
    emotional_balance: 50,
    emotionDiversity: 0,
    topEmotion: 'neutral',
    positiveRatio: 0,
    achievements: [],
    progress: 0,
    total_scans: 0,
    streak_days: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const activeUserId = userId || user?.id;
        if (!activeUserId) {
          setIsLoading(false);
          return;
        }

        setIsLoading(true);

        // Fetch emotion data from supabase
        const { data: emotionsData, error } = await supabase
          .from('emotions')
          .select('*')
          .eq('user_id', activeUserId)
          .order('date', { ascending: false });

        if (error) throw error;

        // Calculate stats from emotion data
        if (emotionsData && emotionsData.length > 0) {
          // Calculate streak days
          let streakDays = calculateStreakDays(emotionsData);
          
          // Calculate points based on scans, streaks and emotional balance
          let points = emotionsData.length * 5 + streakDays * 10;
          
          // Calculate level based on points
          let level = Math.floor(points / 100) + 1;
          
          // Calculate next milestone
          let next_milestone = level * 100;
          
          // Find highest emotion
          const emotionCounts: Record<string, number> = {};
          emotionsData.forEach(entry => {
            const emotion = entry.emojis || 'neutral';
            emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
          });
          
          const highestEmotion = Object.entries(emotionCounts)
            .sort(([, countA], [, countB]) => countB - countA)[0][0];
            
          // Calculate emotional balance score
          const positiveEmotions = ['😊', '😄', '😌', '🥰', '😎'];
          const negativeEmotions = ['😢', '😠', '😨', '😰', '🤢'];
          
          let positiveCount = 0;
          let negativeCount = 0;
          
          emotionsData.slice(0, 10).forEach(entry => {
            if (positiveEmotions.includes(entry.emojis)) positiveCount++;
            if (negativeEmotions.includes(entry.emojis)) negativeCount++;
          });
          
          const total = positiveCount + negativeCount;
          const emotionalBalance = total > 0 
            ? Math.round((positiveCount / total) * 100) 
            : 50;
          
          // Get earned badges
          const { data: badgesData } = await supabase
            .from('badges')
            .select('name')
            .eq('user_id', activeUserId);
            
          const badges_earned = badgesData?.map(b => b.name) || [];
            
          setStats({
            totalScans: emotionsData.length,
            streakDays: streakDays,
            total_scans: emotionsData.length,
            streak_days: streakDays,
            points,
            level,
            next_milestone,
            badges_earned,
            highest_emotion: highestEmotion,
            emotional_balance: emotionalBalance,
            emotionDiversity: Object.keys(emotionCounts).length,
            topEmotion: highestEmotion,
            positiveRatio: total > 0 ? (positiveCount / total) * 100 : 50,
            achievements: badges_earned,
            progress: (points % 100) / 100 * 100 // Progress to next level as percentage
          });
        }
      } catch (error) {
        console.error('Error fetching gamification stats:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les statistiques de gamification",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, [userId, user?.id, toast]);

  return {
    stats,
    isLoading
  };
};
