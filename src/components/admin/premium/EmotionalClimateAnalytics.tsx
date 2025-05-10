import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cloud, CloudRain, CloudSun, Sun, ThermometerSun } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmotionalClimateAnalyticsProps {
  isActive: boolean;
  onClick: () => void;
  visualStyle: 'minimal' | 'artistic';
  zenMode: boolean;
}

// Mock data for the emotional climate trends
const emotionalData = [
  { date: '1 Mai', score: 78, positivity: 72, anxiety: 28, energy: 62 },
  { date: '2 Mai', score: 75, positivity: 68, anxiety: 32, energy: 58 },
  { date: '3 Mai', score: 72, positivity: 64, anxiety: 38, energy: 55 },
  { date: '4 Mai', score: 68, positivity: 60, anxiety: 45, energy: 48 },
  { date: '5 Mai', score: 65, positivity: 58, anxiety: 48, energy: 45 },
  { date: '6 Mai', score: 62, positivity: 55, anxiety: 52, energy: 42 },
  { date: '7 Mai', score: 64, positivity: 60, anxiety: 50, energy: 45 },
  { date: '8 Mai', score: 68, positivity: 64, anxiety: 45, energy: 55 },
  { date: '9 Mai', score: 72, positivity: 68, anxiety: 40, energy: 60 },
  { date: '10 Mai', score: 76, positivity: 72, anxiety: 35, energy: 65 },
];

// Determine the weather icon based on emotional scores
const getWeatherIcon = (score: number) => {
  if (score >= 80) return <Sun className="text-yellow-400" />;
  if (score >= 70) return <CloudSun className="text-yellow-300" />;
  if (score >= 60) return <Cloud className="text-blue-300" />;
  if (score >= 50) return <Cloud className="text-gray-400" />;
  return <CloudRain className="text-gray-500" />;
};

export const EmotionalClimateAnalytics: React.FC<EmotionalClimateAnalyticsProps> = ({
  isActive,
  onClick,
  visualStyle,
  zenMode
}) => {
  const [currentTab, setCurrentTab] = useState('overall');
  const [weatherTrend, setWeatherTrend] = useState('improving');
  
  // Calculate the weather trend
  useEffect(() => {
    const recentData = emotionalData.slice(-3);
    const trend = recentData[2].score - recentData[0].score;
    
    if (trend > 5) setWeatherTrend('improving');
    else if (trend < -5) setWeatherTrend('worsening');
    else setWeatherTrend('stable');
  }, []);

  return (
    <Card 
      className={cn(
        "premium-card overflow-hidden relative transition-all ease-in-out", 
        isActive ? "shadow-xl border-primary/20" : "",
        zenMode ? "bg-background/70 backdrop-blur-lg border-border/50" : ""
      )}
      onClick={onClick}
    >
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-xl">
            <div className="w-10 h-10 mr-3 rounded-full bg-primary/10 flex items-center justify-center">
              {getWeatherIcon(emotionalData[emotionalData.length - 1].score)}
            </div>
            Climat émotionnel
          </CardTitle>
          
          {/* Weather trend indicator */}
          <div className="flex items-center gap-2">
            <motion.div 
              className={`rounded-full p-1.5 
                ${weatherTrend === 'improving' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 
                  weatherTrend === 'worsening' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 
                  'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}
              animate={{ scale: [1, 1.1, 1], opacity: [1, 0.8, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            >
              <ThermometerSun size={16} />
            </motion.div>
            <span className="text-sm text-muted-foreground">
              {weatherTrend === 'improving' ? 'En amélioration' : 
               weatherTrend === 'worsening' ? 'En baisse' : 'Stable'}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overall">Vue globale</TabsTrigger>
            <TabsTrigger value="departments">Par service</TabsTrigger>
            <TabsTrigger value="timeline">Évolution</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overall">
            <div className="h-80 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                {visualStyle === 'minimal' ? (
                  <LineChart data={emotionalData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" 
                           tickMargin={8} 
                           tick={{ fontSize: 12 }} />
                    <YAxis 
                           domain={[30, 90]}
                           tickMargin={8} 
                           tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--background)', 
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                      labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="var(--primary)" 
                      strokeWidth={3}
                      dot={{ strokeWidth: 2, r: 4 }}
                      activeDot={{ strokeWidth: 0, r: 6, fill: 'var(--primary)' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="positivity" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ strokeWidth: 1, r: 3 }}
                      activeDot={{ strokeWidth: 0, r: 5, fill: '#10b981' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="anxiety" 
                      stroke="#f43f5e" 
                      strokeWidth={2}
                      dot={{ strokeWidth: 1, r: 3 }}
                      activeDot={{ strokeWidth: 0, r: 5, fill: '#f43f5e' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="energy" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      dot={{ strokeWidth: 1, r: 3 }}
                      activeDot={{ strokeWidth: 0, r: 5, fill: '#f59e0b' }}
                    />
                  </LineChart>
                ) : (
                  <AreaChart data={emotionalData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorPositivity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" 
                           tickMargin={8} 
                           tick={{ fontSize: 12 }} />
                    <YAxis 
                           domain={[30, 90]}
                           tickMargin={8} 
                           tick={{ fontSize: 12 }} />
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--background)', 
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                      labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="positivity" 
                      stroke="#10b981" 
                      fillOpacity={1}
                      fill="url(#colorPositivity)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke="var(--primary)" 
                      fillOpacity={1}
                      fill="url(#colorScore)" 
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="flex flex-col items-center p-4 rounded-lg bg-primary/5 border border-primary/10"
              >
                <h3 className="text-sm font-medium text-muted-foreground">Score moyen</h3>
                <p className="text-2xl font-semibold mt-1">
                  {emotionalData[emotionalData.length - 1].score}%
                </p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="flex flex-col items-center p-4 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30"
              >
                <h3 className="text-sm font-medium text-muted-foreground">Positivité</h3>
                <p className="text-2xl font-semibold text-green-600 dark:text-green-400 mt-1">
                  {emotionalData[emotionalData.length - 1].positivity}%
                </p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="flex flex-col items-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30"
              >
                <h3 className="text-sm font-medium text-muted-foreground">Vitalité</h3>
                <p className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400 mt-1">
                  {emotionalData[emotionalData.length - 1].energy}%
                </p>
              </motion.div>
            </div>
          </TabsContent>
          
          <TabsContent value="departments">
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Sélectionnez un département pour voir les détails
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="timeline">
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Analysez l'évolution émotionnelle sur le temps
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
