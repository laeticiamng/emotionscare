
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { lineChartDemo } from '@/data/line-chart-data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar, Download, Info, Sun, Loader2, Cloud } from "lucide-react";

const EmotionalClimateAnalytics: React.FC = () => {
  const [loading, setLoading] = React.useState(false);

  // Simulate loading when tab changes
  const handleTabChange = (value: string) => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  const handleSwitchView = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 600);
  };

  const getRandomPercentage = (min = 60, max = 95) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center">
              <Cloud className="mr-2 h-5 w-5 text-primary" />
              Climat émotionnel
            </CardTitle>
            <CardDescription>Vue d'ensemble de l'état émotionnel de l'équipe</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8">
              <Calendar className="mr-2 h-3.5 w-3.5" />
              <span>Mois précédent</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              <Download className="mr-2 h-3.5 w-3.5" />
              <span>Export</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tendances" onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="tendances">Tendances</TabsTrigger>
            <TabsTrigger value="analyse">Analyse IA</TabsTrigger>
            <TabsTrigger value="emotions">Émotions</TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="h-[280px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <TabsContent value="tendances" className="space-y-4">
                <div className="h-[280px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={lineChartDemo}
                      margin={{
                        top: 5,
                        right: 10,
                        left: 10,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) => value.substring(5)}
                        className="text-xs fill-muted-foreground"
                      />
                      <YAxis
                        width={35}
                        tickFormatter={(value) => `${value}%`}
                        domain={[0, 100]}
                        className="text-xs fill-muted-foreground"
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-background p-2 shadow-sm">
                                <div className="flex flex-col">
                                  <span className="text-xs text-muted-foreground">
                                    {payload[0].payload.date}
                                  </span>
                                  <span className="font-bold text-sm">
                                    {payload[0].value}%
                                  </span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="wellbeing"
                        stroke="#0ea5e9"
                        strokeWidth={2}
                        activeDot={{ r: 6, className: "fill-primary stroke-background stroke-2" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-muted/20 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground mb-1">Bien-être</div>
                    <div className="text-2xl font-medium">{getRandomPercentage()}%</div>
                    <div className="text-xs text-green-500">+2.5%</div>
                  </div>
                  
                  <div className="bg-muted/20 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground mb-1">Engagement</div>
                    <div className="text-2xl font-medium">{getRandomPercentage()}%</div>
                    <div className="text-xs text-green-500">+1.8%</div>
                  </div>
                  
                  <div className="bg-muted/20 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground mb-1">Satisfaction</div>
                    <div className="text-2xl font-medium">{getRandomPercentage(70, 90)}%</div>
                    <div className="text-xs text-amber-500">-0.5%</div>
                  </div>
                  
                  <div className="bg-muted/20 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground mb-1">Épanouissement</div>
                    <div className="text-2xl font-medium">{getRandomPercentage(65, 85)}%</div>
                    <div className="text-xs text-green-500">+3.2%</div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="analyse">
                <div className="p-4 bg-muted/20 rounded-lg mt-4">
                  <h3 className="font-medium flex items-center mb-2">
                    <Sun className="mr-2 h-4 w-4 text-amber-500" />
                    Analyse hebdomadaire
                  </h3>
                  
                  <div className="space-y-3 text-sm">
                    <p>
                      L'analyse IA révèle une amélioration notable du bien-être collectif (+2,5%) par rapport à la période précédente. 
                      Les collaborateurs montrent une perception positive des initiatives bien-être récemment lancées.
                    </p>
                    
                    <p>
                      <strong>Points forts identifiés :</strong> La flexibilité horaire et les ateliers de respiration sont
                      particulièrement appréciés. L'équipe marketing présente le niveau de bien-être le plus élevé (+8%).
                    </p>
                    
                    <p>
                      <strong>Points d'attention :</strong> L'équipe développement montre des signes de fatigue accrue (-3% sur le score d'énergie).
                      Le vendredi est systématiquement le jour avec la plus faible énergie collective.
                    </p>
                    
                    <div className="border-t pt-2 mt-3">
                      <p className="italic text-muted-foreground">
                        "L'amélioration constante est comme une respiration : un cycle continu d'observation, de réflexion et d'adaptation."
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="h-8">
                    <Download className="mr-2 h-3.5 w-3.5" />
                    <span>Exporter l'analyse</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-8">
                    <Info className="mr-2 h-3.5 w-3.5" />
                    <span>Recommandations</span>
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="emotions">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                  <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-lg p-3">
                    <div className="font-medium text-blue-800 dark:text-blue-300">Sérénité</div>
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-400 mt-1">28%</div>
                    <div className="text-xs text-blue-600 dark:text-blue-500 mt-1">+2.1% vs période préc.</div>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900 rounded-lg p-3">
                    <div className="font-medium text-green-800 dark:text-green-300">Enthousiasme</div>
                    <div className="text-2xl font-bold text-green-700 dark:text-green-400 mt-1">24%</div>
                    <div className="text-xs text-green-600 dark:text-green-500 mt-1">+5.3% vs période préc.</div>
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 rounded-lg p-3">
                    <div className="font-medium text-amber-800 dark:text-amber-300">Concentration</div>
                    <div className="text-2xl font-bold text-amber-700 dark:text-amber-400 mt-1">18%</div>
                    <div className="text-xs text-amber-600 dark:text-amber-500 mt-1">-1.2% vs période préc.</div>
                  </div>
                  
                  <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 rounded-lg p-3">
                    <div className="font-medium text-indigo-800 dark:text-indigo-300">Gratitude</div>
                    <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 mt-1">14%</div>
                    <div className="text-xs text-indigo-600 dark:text-indigo-500 mt-1">+3.7% vs période préc.</div>
                  </div>
                  
                  <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 rounded-lg p-3">
                    <div className="font-medium text-red-800 dark:text-red-300">Frustration</div>
                    <div className="text-2xl font-bold text-red-700 dark:text-red-400 mt-1">8%</div>
                    <div className="text-xs text-red-600 dark:text-red-500 mt-1">-6.1% vs période préc.</div>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900 rounded-lg p-3">
                    <div className="font-medium text-purple-800 dark:text-purple-300">Autres</div>
                    <div className="text-2xl font-bold text-purple-700 dark:text-purple-400 mt-1">8%</div>
                    <div className="text-xs text-purple-600 dark:text-purple-500 mt-1">-3.8% vs période préc.</div>
                  </div>
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between text-xs text-muted-foreground">
        <div>Dernière mise à jour: aujourd'hui à 09:34</div>
        <Button variant="link" size="sm" className="h-auto p-0" onClick={handleSwitchView}>
          Changer de vue
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmotionalClimateAnalytics;
