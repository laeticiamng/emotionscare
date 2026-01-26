import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Target, TrendingUp, TrendingDown, Share2, Calendar, Loader2, Minus } from 'lucide-react';
import { EmotionResult } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface PostScanAnalysisProps {
  scanResult: EmotionResult;
  onScheduleFollowUp?: () => void;
  onShareWithCoach?: () => void;
}

interface TrendData {
  weeklyChange: number;
  dominantEmotion: string;
  bestTimeOfDay: string;
  totalScans: number;
}

const PostScanAnalysis: React.FC<PostScanAnalysisProps> = ({
  scanResult,
  onScheduleFollowUp,
  onShareWithCoach
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [trendData, setTrendData] = useState<TrendData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTrendData();
    }
  }, [user]);

  const loadTrendData = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

      // Récupérer les données de la semaine actuelle
      const { data: currentWeek, error: currentError } = await supabase
        .from('clinical_signals')
        .select('valence, arousal, created_at, metadata')
        .eq('user_id', user.id)
        .gte('created_at', oneWeekAgo.toISOString())
        .order('created_at', { ascending: false });

      // Récupérer les données de la semaine précédente
      const { data: previousWeek, error: previousError } = await supabase
        .from('clinical_signals')
        .select('valence')
        .eq('user_id', user.id)
        .gte('created_at', twoWeeksAgo.toISOString())
        .lt('created_at', oneWeekAgo.toISOString());

      if (currentError || previousError) {
        throw currentError || previousError;
      }

      // Calculer le changement hebdomadaire
      const currentAvg = currentWeek && currentWeek.length > 0
        ? currentWeek.reduce((sum, s) => sum + s.valence, 0) / currentWeek.length
        : 50;
      
      const previousAvg = previousWeek && previousWeek.length > 0
        ? previousWeek.reduce((sum, s) => sum + s.valence, 0) / previousWeek.length
        : currentAvg;

      const weeklyChange = previousAvg > 0 
        ? Math.round(((currentAvg - previousAvg) / previousAvg) * 100)
        : 0;

      // Trouver l'émotion dominante
      const emotionCounts: Record<string, number> = {};
      (currentWeek || []).forEach(signal => {
        const emotion = (signal.metadata as any)?.summary || 'Neutre';
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      });
      
      const dominantEmotion = Object.entries(emotionCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Neutre';

      // Trouver le meilleur moment de la journée
      const timeSlots: Record<string, { count: number; totalValence: number }> = {
        'Matin': { count: 0, totalValence: 0 },
        'Après-midi': { count: 0, totalValence: 0 },
        'Soir': { count: 0, totalValence: 0 }
      };

      (currentWeek || []).forEach(signal => {
        const hour = new Date(signal.created_at).getHours();
        let slot = 'Matin';
        if (hour >= 12 && hour < 18) slot = 'Après-midi';
        else if (hour >= 18) slot = 'Soir';
        
        timeSlots[slot].count++;
        timeSlots[slot].totalValence += signal.valence;
      });

      const bestTime = Object.entries(timeSlots)
        .filter(([_, data]) => data.count > 0)
        .sort((a, b) => (b[1].totalValence / b[1].count) - (a[1].totalValence / a[1].count))
        [0]?.[0] || 'Matinée';

      setTrendData({
        weeklyChange,
        dominantEmotion,
        bestTimeOfDay: bestTime,
        totalScans: currentWeek?.length || 0
      });
    } catch (error) {
      console.error('Failed to load trend data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      'joy': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'happy': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'calm': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'serene': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
      'stress': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'anxious': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      'sad': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
      'energetic': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'excited': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
      'neutral': 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
    };
    return colors[emotion?.toLowerCase()] || 'bg-muted text-muted-foreground';
  };

  const getPersonalizedAdvice = (emotion: string, intensity: number) => {
    const baseAdvice: Record<string, string[]> = {
      'stress': [
        'Prenez 5 minutes pour pratiquer la respiration profonde',
        'Écoutez une playlist relaxante',
        'Planifiez une courte pause dans votre journée'
      ],
      'anxious': [
        'Essayez la technique de respiration 4-7-8',
        'Notez vos pensées dans un journal',
        'Faites une courte promenade si possible'
      ],
      'joy': [
        'Partagez cette énergie positive avec vos proches',
        'Profitez de ce moment pour accomplir des tâches importantes',
        'Notez ce qui vous rend heureux dans votre journal'
      ],
      'happy': [
        'Capitalisez sur cette bonne humeur',
        'C\'est le moment idéal pour les activités créatives',
        'Partagez votre positivité avec les autres'
      ],
      'calm': [
        'Maintenez cet état avec une méditation guidée',
        'C\'est le moment idéal pour de la réflexion',
        'Planifiez vos objectifs de la journée'
      ],
      'sad': [
        'Permettez-vous de ressentir cette émotion',
        'Contactez un proche de confiance',
        'Une activité physique légère peut aider'
      ]
    };

    let advice = baseAdvice[emotion?.toLowerCase()] || [
      'Prenez un moment pour vous reconnecter avec vous-même',
      'Consultez votre coach IA pour des conseils personnalisés'
    ];

    // Ajuster selon l'intensité
    if (intensity > 80) {
      advice = ['Cette émotion est très intense - prenez du temps pour vous', ...advice];
    }

    return advice;
  };

  const handleShareWithCoach = () => {
    if (onShareWithCoach) {
      onShareWithCoach();
    } else {
      // Navigation par défaut vers le coach avec contexte
      navigate('/app/coach', { 
        state: { 
          fromScan: true, 
          emotion: scanResult.emotion,
          intensity: scanResult.intensity 
        } 
      });
      toast({
        title: 'Redirection vers le Coach',
        description: 'Votre état émotionnel a été partagé avec le coach IA.'
      });
    }
  };

  const handleScheduleFollowUp = () => {
    if (onScheduleFollowUp) {
      onScheduleFollowUp();
    } else {
      // Navigation par défaut vers le calendrier
      navigate('/app/calendar');
      toast({
        title: 'Planification',
        description: 'Vous pouvez programmer un rappel de suivi dans le calendrier.'
      });
    }
  };

  const getTrendIcon = () => {
    if (!trendData) return <Minus className="h-4 w-4 text-muted-foreground" />;
    if (trendData.weeklyChange > 5) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trendData.weeklyChange < -5) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Analyse Personnalisée
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge className={getEmotionColor(scanResult.emotion)}>
              {scanResult.emotion}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Intensité: {scanResult.intensity}%
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Conseils Immédiats
              </h4>
              <ul className="space-y-2">
                {getPersonalizedAdvice(scanResult.emotion, scanResult.intensity).map((advice, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    {advice}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Tendance Récente
              </h4>
              {isLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Chargement...
                </div>
              ) : trendData ? (
                <div className="text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <span>Cette semaine:</span>
                    <span className={`font-medium flex items-center gap-1 ${
                      trendData.weeklyChange > 0 ? 'text-green-600' : 
                      trendData.weeklyChange < 0 ? 'text-red-600' : 'text-muted-foreground'
                    }`}>
                      {getTrendIcon()}
                      {trendData.weeklyChange > 0 ? '+' : ''}{trendData.weeklyChange}%
                    </span>
                  </div>
                  <p>Émotion dominante: <span className="font-medium">{trendData.dominantEmotion}</span></p>
                  <p>Meilleur moment: <span className="font-medium">{trendData.bestTimeOfDay}</span></p>
                  <p className="text-xs text-muted-foreground">
                    Basé sur {trendData.totalScans} scans cette semaine
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Effectuez plus de scans pour voir les tendances
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <Button 
              onClick={handleShareWithCoach}
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Partager avec Coach IA
            </Button>
            <Button 
              onClick={handleScheduleFollowUp}
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Programmer suivi
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostScanAnalysis;
