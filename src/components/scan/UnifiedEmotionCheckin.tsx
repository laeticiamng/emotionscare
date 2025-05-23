
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmotionResult } from '@/types/emotion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BarChart, Calendar, LineChart, ListMusic } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart as ReChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const UnifiedEmotionCheckin: React.FC = () => {
  const { user } = useAuth();
  const [emotions, setEmotions] = useState<EmotionResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<string>('week');

  const getTimeRangeFilter = () => {
    const now = new Date();
    switch (timeRange) {
      case 'day':
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        return yesterday.toISOString();
      case 'week':
        const lastWeek = new Date(now);
        lastWeek.setDate(now.getDate() - 7);
        return lastWeek.toISOString();
      case 'month':
        const lastMonth = new Date(now);
        lastMonth.setMonth(now.getMonth() - 1);
        return lastMonth.toISOString();
      case 'year':
        const lastYear = new Date(now);
        lastYear.setFullYear(now.getFullYear() - 1);
        return lastYear.toISOString();
      default:
        return null;
    }
  };

  const fetchEmotions = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);
      
      let query = supabase
        .from('emotions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      const timeFilter = getTimeRangeFilter();
      if (timeFilter) {
        query = query.gte('date', timeFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      setEmotions(data || []);
    } catch (err) {
      console.error('Error fetching emotions:', err);
      setError('Impossible de charger vos données émotionnelles');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmotions();
  }, [user, timeRange]);

  // Prepare chart data
  const chartData = emotions.map(emotion => ({
    date: format(new Date(emotion.date), 'dd/MM'),
    score: emotion.score
  })).reverse();

  // Calculate emotion stats
  const averageScore = emotions.length 
    ? Math.round(emotions.reduce((acc, emotion) => acc + emotion.score, 0) / emotions.length) 
    : 0;

  const getScoreClass = (score: number) => {
    if (score >= 75) return 'text-green-600';
    if (score > 50) return 'text-blue-600';
    if (score > 35) return 'text-orange-600';
    return 'text-red-600';
  };

  if (!user) {
    return (
      <Alert>
        <AlertTitle>Connexion requise</AlertTitle>
        <AlertDescription>
          Veuillez vous connecter pour voir votre historique d'émotions
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold">Historique émotionnel</h2>
        
        <div className="flex gap-2">
          <Select
            value={timeRange}
            onValueChange={setTimeRange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Dernières 24h</SelectItem>
              <SelectItem value="week">7 derniers jours</SelectItem>
              <SelectItem value="month">30 derniers jours</SelectItem>
              <SelectItem value="year">12 derniers mois</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={fetchEmotions}>
            Actualiser
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-[200px] w-full rounded-lg" />
          <Skeleton className="h-[100px] w-full rounded-lg" />
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <>
          {emotions.length === 0 ? (
            <Alert>
              <AlertTitle>Aucune donnée</AlertTitle>
              <AlertDescription>
                Vous n'avez pas encore d'historique d'émotions. Utilisez le scanner d'émotions pour commencer à suivre votre bien-être.
              </AlertDescription>
            </Alert>
          ) : (
            <Tabs defaultValue="graph">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="graph" className="flex items-center gap-2">
                  <LineChart className="h-4 w-4" />
                  <span className="hidden sm:inline">Graphique</span>
                </TabsTrigger>
                <TabsTrigger value="stats" className="flex items-center gap-2">
                  <BarChart className="h-4 w-4" />
                  <span className="hidden sm:inline">Statistiques</span>
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Historique</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="graph" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Évolution émotionnelle</CardTitle>
                    <CardDescription>
                      Visualisez l'évolution de vos émotions au fil du temps
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <ReChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip 
                          formatter={(value) => [`${value}/100`, 'Score']}
                          labelFormatter={(label) => `Date: ${label}`}
                        />
                      </ReChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="stats" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Score moyen</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className={`text-3xl font-bold ${getScoreClass(averageScore)}`}>
                        {averageScore}/100
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Entrées totales</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{emotions.length}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Dernière analyse</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {emotions.length > 0 ? (
                        <p className="text-lg">
                          {format(new Date(emotions[0].date), 'dd MMMM yyyy', { locale: fr })}
                        </p>
                      ) : (
                        <p>-</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="list" className="mt-6">
                <div className="space-y-4">
                  {emotions.map((emotion) => (
                    <Card key={emotion.id} className="overflow-hidden">
                      <div className="flex border-l-4 h-full" style={{
                        borderLeftColor: emotion.score >= 75 
                          ? '#22c55e' 
                          : emotion.score > 50 
                            ? '#3b82f6' 
                            : emotion.score > 35 
                              ? '#f97316' 
                              : '#ef4444'
                      }}>
                        <div className="py-4 px-6 flex-1">
                          <div className="flex justify-between">
                            <div>
                              <p className="text-sm text-gray-500">
                                {format(new Date(emotion.date), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                              </p>
                              
                              {emotion.text && (
                                <p className="mt-1 line-clamp-2">{emotion.text}</p>
                              )}
                              
                              {emotion.emojis && (
                                <p className="mt-1 text-xl">{emotion.emojis}</p>
                              )}
                            </div>
                            
                            <div className={`text-lg font-semibold ${getScoreClass(emotion.score)}`}>
                              {emotion.score}/100
                            </div>
                          </div>
                          
                          {emotion.audio_url && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="mt-2"
                              onClick={() => {
                                const audio = new Audio(emotion.audio_url);
                                audio.play();
                              }}
                            >
                              <ListMusic className="h-4 w-4 mr-2" />
                              Écouter l'audio
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </>
      )}
    </div>
  );
};

export default UnifiedEmotionCheckin;
