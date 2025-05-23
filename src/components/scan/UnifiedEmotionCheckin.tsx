
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Heart, TrendingUp, Calendar, Target, Award } from 'lucide-react';

interface EmotionStats {
  totalScans: number;
  averageScore: number;
  streak: number;
  lastScan: string | null;
  weeklyTrend: number;
}

const UnifiedEmotionCheckin: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<EmotionStats>({
    totalScans: 0,
    averageScore: 0,
    streak: 0,
    lastScan: null,
    weeklyTrend: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentEmotions, setRecentEmotions] = useState([]);

  useEffect(() => {
    if (user) {
      loadEmotionStats();
    }
  }, [user]);

  const loadEmotionStats = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data: emotions, error } = await supabase
        .from('emotions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      if (emotions && emotions.length > 0) {
        const totalScans = emotions.length;
        const averageScore = Math.round(
          emotions.reduce((acc, emotion) => acc + (emotion.score || 50), 0) / totalScans
        );
        
        // Calculer la série
        let streak = 0;
        const today = new Date();
        const oneDay = 24 * 60 * 60 * 1000;
        
        for (let i = 0; i < emotions.length; i++) {
          const emotionDate = new Date(emotions[i].date);
          const daysDiff = Math.floor((today.getTime() - emotionDate.getTime()) / oneDay);
          
          if (daysDiff === i) {
            streak++;
          } else {
            break;
          }
        }

        // Calculer la tendance hebdomadaire
        const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const weekEmotions = emotions.filter(e => new Date(e.date) > lastWeek);
        const weeklyAverage = weekEmotions.length > 0 
          ? weekEmotions.reduce((acc, e) => acc + (e.score || 50), 0) / weekEmotions.length
          : averageScore;
        
        const weeklyTrend = Math.round(weeklyAverage - averageScore);

        setStats({
          totalScans,
          averageScore,
          streak,
          lastScan: emotions[0].date,
          weeklyTrend
        });

        setRecentEmotions(emotions.slice(0, 5));
      }
    } catch (error) {
      console.error('Erreur chargement stats émotions:', error);
      toast.error('Erreur lors du chargement des statistiques');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-32 bg-muted rounded-lg mb-4"></div>
          <div className="h-24 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="h-6 w-6 mr-2 text-red-500" />
            Votre bien-être émotionnel
          </CardTitle>
          <CardDescription>
            Suivez votre évolution et vos progrès
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Score global */}
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-24 h-24 mb-4">
                <Progress 
                  value={stats.averageScore} 
                  className="w-20 h-20 rounded-full"
                />
                <span className="absolute text-xl font-bold">
                  {stats.averageScore}%
                </span>
              </div>
              <h3 className="font-semibold mb-1">Score global</h3>
              <p className="text-sm text-muted-foreground">
                Basé sur {stats.totalScans} scan{stats.totalScans > 1 ? 's' : ''}
              </p>
            </div>

            {/* Série */}
            <div className="text-center">
              <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 bg-orange-100 rounded-full">
                <Award className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-1">Série actuelle</h3>
              <p className="text-2xl font-bold text-orange-600">{stats.streak}</p>
              <p className="text-sm text-muted-foreground">jour{stats.streak > 1 ? 's' : ''}</p>
            </div>

            {/* Tendance */}
            <div className="text-center">
              <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 bg-blue-100 rounded-full">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-1">Tendance hebdo</h3>
              <div className="flex items-center justify-center space-x-1">
                <span className={`text-2xl font-bold ${stats.weeklyTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.weeklyTrend >= 0 ? '+' : ''}{stats.weeklyTrend}%
                </span>
              </div>
              <p className="text-sm text-muted-foreground">vs moyenne</p>
            </div>
          </div>

          {stats.lastScan && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Dernier scan :</span>
                  <span className="text-sm font-medium">
                    {new Date(stats.lastScan).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <Badge variant="outline">
                  {Math.floor((Date.now() - new Date(stats.lastScan).getTime()) / (1000 * 60 * 60))}h
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historique récent */}
      {recentEmotions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Scans récents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentEmotions.map((emotion: any) => (
                <div key={emotion.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{emotion.emojis || '😐'}</span>
                    <div>
                      <p className="font-medium">Score: {emotion.score}%</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(emotion.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  
                  {emotion.text && (
                    <div className="max-w-xs">
                      <p className="text-sm truncate">{emotion.text}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Objectifs et conseils */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Objectif du jour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Effectuez votre scan quotidien pour maintenir votre série
            </p>
            <Progress value={(stats.streak % 7) * 14.3} className="mb-2" />
            <p className="text-xs text-muted-foreground">
              {stats.streak % 7}/7 jours cette semaine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conseil personnalisé</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {stats.averageScore > 70 
                ? "Excellent ! Continuez sur cette lancée et n'hésitez pas à partager vos astuces bien-être." 
                : stats.averageScore > 50
                ? "Votre bien-être s'améliore. Pensez à prendre des pauses régulières dans votre journée."
                : "Prenez soin de vous. N'hésitez pas à parler à quelqu'un si vous en ressentez le besoin."
              }
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UnifiedEmotionCheckin;
