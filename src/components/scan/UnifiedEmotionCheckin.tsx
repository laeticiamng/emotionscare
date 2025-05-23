
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { EmotionResult } from '@/types/emotion';
import { toast } from 'sonner';

const UnifiedEmotionCheckin: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [emotionHistory, setEmotionHistory] = useState<EmotionResult[]>([]);
  const [latestEmotion, setLatestEmotion] = useState<EmotionResult | null>(null);

  useEffect(() => {
    const fetchEmotionData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch user's emotion data
        const { data, error } = await supabase
          .from('emotions')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .limit(10);
          
        if (error) throw error;
        
        setEmotionHistory(data || []);
        if (data && data.length > 0) {
          setLatestEmotion(data[0]);
        }
      } catch (error) {
        console.error('Error fetching emotion data:', error);
        toast.error('Erreur lors du chargement des données émotionnelles');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmotionData();
  }, [user]);

  // Process emotion data for chart
  const chartData = emotionHistory
    .map(entry => ({
      date: new Date(entry.date!).toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit' 
      }),
      score: entry.score || 50
    }))
    .reverse();

  const getScoreColor = (score: number | null | undefined) => {
    if (score === null || score === undefined) return 'text-muted-foreground';
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-lime-500';
    if (score >= 40) return 'text-amber-500';
    if (score >= 20) return 'text-orange-500';
    return 'text-red-500';
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Connectez-vous pour voir votre suivi émotionnel
          </p>
          <Button className="mt-4">Se connecter</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          Votre suivi émotionnel
        </h3>
        
        <Tabs defaultValue="today">
          <TabsList className="mb-4">
            <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>
          
          <TabsContent value="today" className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            ) : latestEmotion ? (
              <>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Dernière analyse
                    </div>
                    <div className="text-lg mt-1">
                      {new Date(latestEmotion.date!).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">
                      Score émotionnel
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(latestEmotion.score)}`}>
                      {latestEmotion.score}/100
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Émotion
                    </div>
                    <div className="text-lg mt-1">
                      {latestEmotion.emojis || "Non spécifié"}
                    </div>
                  </div>
                </div>
                
                {latestEmotion.ai_feedback && (
                  <div className="p-4 border rounded-lg bg-muted/10">
                    <div className="text-sm font-medium mb-2">Feedback IA</div>
                    <p className="text-sm">{latestEmotion.ai_feedback}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-10">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Aucune analyse aujourd'hui</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Commencez par analyser vos émotions
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            {loading ? (
              <Skeleton className="h-[250px] w-full" />
            ) : chartData.length > 0 ? (
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#8884d8"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-10">
                <BarChart className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Pas encore d'historique</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Effectuez plusieurs analyses pour voir votre évolution
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UnifiedEmotionCheckin;
