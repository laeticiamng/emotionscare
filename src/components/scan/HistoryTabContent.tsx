
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmotionResult } from '@/types/emotion';
import { scanService } from '@/services/scanService';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmotionTrendChart } from './EmotionTrendChart';

const HistoryTabContent = () => {
  const [emotionHistory, setEmotionHistory] = useState<EmotionResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const history = await scanService.getEmotionalHistory('user-1', period);
        setEmotionHistory(history);

        // Process data for the chart
        const processedData = history.map(item => ({
          date: new Date(item.timestamp as string).toLocaleDateString(),
          emotion: item.emotion,
          score: item.score,
          value: item.score,
        }));
        
        setChartData(processedData);
      } catch (error) {
        console.error("Error fetching emotional history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [period]);

  const getEmotionColor = (emotion: string): string => {
    const colors: Record<string, string> = {
      joy: '#22c55e',
      neutral: '#6b7280',
      anxiety: '#ef4444',
      sadness: '#3b82f6',
      frustration: '#f97316',
      excitement: '#8b5cf6',
      gratitude: '#f59e0b',
    };
    return colors[emotion] || '#6b7280';
  };

  const getEmotionName = (emotion: string): string => {
    const names: Record<string, string> = {
      joy: 'Joie',
      neutral: 'Neutre',
      anxiety: 'Anxiété',
      sadness: 'Tristesse',
      frustration: 'Frustration',
      excitement: 'Enthousiasme',
      gratitude: 'Gratitude',
    };
    return names[emotion] || emotion;
  };

  const countEmotions = () => {
    const counts: Record<string, number> = {};
    emotionHistory.forEach(item => {
      counts[item.emotion] = (counts[item.emotion] || 0) + 1;
    });
    return counts;
  };

  const emotionCounts = countEmotions();
  const dominantEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Historique Émotionnel</h2>
        <Select defaultValue={period} onValueChange={(value) => setPeriod(value as 'week' | 'month' | 'year')}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Semaine</SelectItem>
            <SelectItem value="month">Mois</SelectItem>
            <SelectItem value="year">Année</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Tendance émotionnelle</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      formatter={(value: any, name: any, props: any) => {
                        const entry = props.payload;
                        return [
                          `Score: ${value}`,
                          `Émotion: ${getEmotionName(entry.emotion)}`
                        ];
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#2563EB" 
                      strokeWidth={2} 
                      dot={(props) => {
                        const emotion = props.payload.emotion;
                        const color = getEmotionColor(emotion);
                        return (
                          <circle 
                            cx={props.cx} 
                            cy={props.cy} 
                            r={4} 
                            fill={color} 
                            stroke="white" 
                            strokeWidth={2} 
                          />
                        );
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aperçu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Émotion dominante</p>
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-2" 
                    style={{ backgroundColor: getEmotionColor(dominantEmotion) }}
                  ></div>
                  <span className="font-medium">{getEmotionName(dominantEmotion)}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total des entrées</p>
                <p className="font-medium">{emotionHistory.length}</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Répartition</p>
                <div className="space-y-1">
                  {Object.entries(emotionCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([emotion, count]) => (
                      <div key={emotion} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: getEmotionColor(emotion) }}
                          ></div>
                          <span className="text-sm">{getEmotionName(emotion)}</span>
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {emotionHistory.length > 0 && (
        <EmotionTrendChart emotions={emotionHistory} period={period} />
      )}

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="joy">Joie</TabsTrigger>
          <TabsTrigger value="anxiety">Anxiété</TabsTrigger>
          <TabsTrigger value="sadness">Tristesse</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-4 w-1/2 bg-muted rounded"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 w-3/4 bg-muted rounded mb-2"></div>
                    <div className="h-4 w-1/2 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              emotionHistory.slice(0, 6).map((item) => (
                <Card key={item.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div 
                        className="px-2 py-1 text-xs rounded-full"
                        style={{ 
                          backgroundColor: `${getEmotionColor(item.emotion)}20`,
                          color: getEmotionColor(item.emotion)
                        }}
                      >
                        {getEmotionName(item.emotion)}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.timestamp as string).toLocaleDateString()}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{ 
                            width: `${(item.score || 0) * 100}%`,
                            backgroundColor: getEmotionColor(item.emotion)
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium">
                        {Math.round((item.score || 0) * 100)}%
                      </span>
                    </div>
                    {item.feedback && (
                      <p className="text-sm text-muted-foreground mt-2">{item.feedback}</p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="joy" className="space-y-4">
          {emotionHistory.filter(item => item.emotion === 'joy').length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">Aucune entrée avec cette émotion</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {emotionHistory
                .filter(item => item.emotion === 'joy')
                .map((item) => (
                  <Card key={item.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <div 
                          className="px-2 py-1 text-xs rounded-full"
                          style={{ 
                            backgroundColor: `${getEmotionColor(item.emotion)}20`,
                            color: getEmotionColor(item.emotion)
                          }}
                        >
                          {getEmotionName(item.emotion)}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.timestamp as string).toLocaleDateString()}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{ 
                              width: `${(item.score || 0) * 100}%`,
                              backgroundColor: getEmotionColor(item.emotion)
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium">
                          {Math.round((item.score || 0) * 100)}%
                        </span>
                      </div>
                      {item.feedback && (
                        <p className="text-sm text-muted-foreground mt-2">{item.feedback}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
        
        {/* Similar TabsContent for other emotion tabs */}
      </Tabs>
    </div>
  );
};

export default HistoryTabContent;
