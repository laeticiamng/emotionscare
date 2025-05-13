
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Award, Sparkles, TrendingUp, Flame } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { EmotionGamificationStats } from '@/types/scan';
import { useToast } from '@/components/ui/use-toast';

export interface GamificationWidgetProps {
  collapsed: boolean;
  onToggle: () => void;
  userId?: string;
}

const GamificationWidget: React.FC<GamificationWidgetProps> = ({ collapsed, onToggle, userId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<EmotionGamificationStats>({
    total_scans: 0,
    streak_days: 0,
    points: 0,
    level: 1,
    next_milestone: 100,
    badges_earned: [],
    highest_emotion: 'neutral',
    emotional_balance: 50
  });
  const [isLoading, setIsLoading] = useState(true);

  // Get emotional gamification stats
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
            total_scans: emotionsData.length,
            streak_days: streakDays,
            points,
            level,
            next_milestone,
            badges_earned,
            highest_emotion: highestEmotion,
            emotional_balance: emotionalBalance
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
  
  // Calculate streak days
  const calculateStreakDays = (emotionsData: any[]): number => {
    if (!emotionsData.length) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streakDays = 0;
    let currentDate = new Date(today);
    
    // Check for consecutive days with entries
    while (true) {
      // Format the date as yyyy-MM-dd to match with dates in the database
      const dateString = currentDate.toISOString().split('T')[0];
      
      // Find if there's an entry for this date
      const hasEntryForDate = emotionsData.some(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.toISOString().split('T')[0] === dateString;
      });
      
      if (hasEntryForDate) {
        streakDays++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streakDays;
  };
  
  // Calculate the progress percentage for the level bar
  const progressToNextLevel = Math.min(
    100, 
    Math.round(((stats.points % 100) / 100) * 100)
  );
  
  // Get level color
  const getLevelColor = (level: number): string => {
    if (level < 3) return 'bg-emerald-500';
    if (level < 5) return 'bg-blue-500';
    if (level < 10) return 'bg-purple-500';
    return 'bg-amber-500';
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Award className="mr-2 h-5 w-5 text-amber-500" />
            Gamification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            <Award className="mr-2 h-5 w-5 text-amber-500" />
            Gamification Émotionnelle
          </div>
          <Badge variant="outline" className="ml-2 bg-primary/10">
            Niveau {stats.level}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Level Progress */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>{stats.points} points</span>
              <span>{stats.next_milestone} points</span>
            </div>
            <Progress value={progressToNextLevel} className={`h-2 ${getLevelColor(stats.level)}`} />
            <p className="text-xs text-muted-foreground mt-1 text-center">
              {stats.next_milestone - stats.points} points jusqu'au niveau {stats.level + 1}
            </p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/30 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Séries</span>
                <Flame className="h-4 w-4 text-orange-500" />
              </div>
              <div className="mt-1">
                <span className="text-2xl font-bold">{stats.streak_days}</span>
                <span className="text-xs text-muted-foreground ml-1">jours</span>
              </div>
            </div>
            
            <div className="bg-muted/30 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Scans</span>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </div>
              <div className="mt-1">
                <span className="text-2xl font-bold">{stats.total_scans}</span>
                <span className="text-xs text-muted-foreground ml-1">total</span>
              </div>
            </div>
          </div>
          
          {/* Emotional Balance */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Équilibre émotionnel</span>
              <span className="text-xs bg-primary/10 px-2 py-0.5 rounded-full">
                {stats.emotional_balance}%
              </span>
            </div>
            <Progress value={stats.emotional_balance} className="h-2" />
          </div>
          
          {/* Badges Section */}
          {stats.badges_earned.length > 0 && (
            <div className="mt-2">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Sparkles className="h-3 w-3 mr-1 text-amber-400" />
                Badges gagnés
              </h4>
              <div className="flex flex-wrap gap-2">
                {stats.badges_earned.map((badge, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GamificationWidget;
