
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, BarChart3, Smile, Frown, MehIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { EmotionResult } from '@/types/emotion';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface UnifiedEmotionCheckinProps {
  onNewCheckIn?: () => void;
}

const UnifiedEmotionCheckin: React.FC<UnifiedEmotionCheckinProps> = ({
  onNewCheckIn
}) => {
  const { user } = useAuth();
  const [todayEmotion, setTodayEmotion] = useState<EmotionResult | null>(null);
  const [recentEmotions, setRecentEmotions] = useState<EmotionResult[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchEmotionData = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Fetch today's emotion
        const { data: todayData, error: todayError } = await supabase
          .from('emotions')
          .select('*')
          .eq('user_id', user.id)
          .gte('date', today.toISOString())
          .order('date', { ascending: false })
          .limit(1);
          
        if (todayError) throw todayError;
        
        if (todayData && todayData.length > 0) {
          setTodayEmotion(todayData[0] as EmotionResult);
        }
        
        // Fetch recent emotions
        const { data: recentData, error: recentError } = await supabase
          .from('emotions')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .limit(5);
          
        if (recentError) throw recentError;
        
        setRecentEmotions(recentData as EmotionResult[] || []);
      } catch (error) {
        console.error('Error fetching emotion data:', error);
        toast.error('Erreur lors du chargement des données émotionnelles');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmotionData();
  }, [user]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
    });
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const getEmotionIcon = (emotion: string) => {
    const positiveEmotions = ['joy', 'happiness', 'content', 'excited'];
    const negativeEmotions = ['sadness', 'anger', 'fear', 'disgust'];
    
    if (positiveEmotions.includes(emotion.toLowerCase())) {
      return <Smile className="h-5 w-5 text-green-500" />;
    } else if (negativeEmotions.includes(emotion.toLowerCase())) {
      return <Frown className="h-5 w-5 text-red-500" />;
    } else {
      return <MehIcon className="h-5 w-5 text-amber-500" />;
    }
  };
  
  const getEmotionColor = (score: number | undefined) => {
    if (score === undefined) return 'bg-gray-200 text-gray-700';
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-lime-100 text-lime-800';
    if (score >= 40) return 'bg-amber-100 text-amber-800';
    if (score >= 20) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Votre check-in émotionnel</CardTitle>
          <CardDescription>
            Suivez votre bien-être émotionnel quotidien
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-40" />
            </div>
          ) : todayEmotion ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {formatDate(todayEmotion.date!)}
                    </span>
                    <Clock className="h-5 w-5 text-muted-foreground ml-2" />
                    <span className="text-muted-foreground">
                      {formatTime(todayEmotion.date!)}
                    </span>
                  </div>
                  
                  <div className="flex items-center mt-2">
                    <h3 className="text-xl font-semibold mr-2">
                      {todayEmotion.emotion && getEmotionIcon(todayEmotion.emotion)}
                      <span className="ml-2">{todayEmotion.emotion}</span>
                    </h3>
                    {todayEmotion.score && (
                      <Badge className={getEmotionColor(todayEmotion.score)}>
                        {todayEmotion.score}/100
                      </Badge>
                    )}
                  </div>
                </div>
                
                <Button 
                  variant="outline"
                  className="mt-2 sm:mt-0"
                  onClick={onNewCheckIn}
                >
                  Mettre à jour
                </Button>
              </div>
              
              {todayEmotion.text && (
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm">{todayEmotion.text}</p>
                </div>
              )}
              
              {todayEmotion.ai_feedback && (
                <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
                  <p className="text-sm font-medium mb-1">Feedback IA:</p>
                  <p className="text-sm">{todayEmotion.ai_feedback}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Pas encore de check-in aujourd'hui</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Effectuez votre premier check-in émotionnel de la journée
              </p>
              <Button 
                className="mt-4"
                onClick={onNewCheckIn}
              >
                Faire un check-in
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {recentEmotions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historique récent</CardTitle>
            <CardDescription>
              Vos derniers check-ins émotionnels
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {recentEmotions.map((emotion, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between border-b pb-3 last:border-0"
                  >
                    <div>
                      <div className="flex items-center">
                        {emotion.emotion && getEmotionIcon(emotion.emotion)}
                        <span className="ml-2 font-medium">{emotion.emotion}</span>
                        {emotion.score && (
                          <Badge className={`ml-2 ${getEmotionColor(emotion.score)}`}>
                            {emotion.score}/100
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(emotion.date!)}</span>
                        <Clock className="h-4 w-4 ml-2 mr-1" />
                        <span>{formatTime(emotion.date!)}</span>
                      </div>
                    </div>
                    
                    {emotion.emojis && (
                      <div className="text-2xl">{emotion.emojis}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UnifiedEmotionCheckin;
