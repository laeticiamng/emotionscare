
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, PieChart, TrendingUp, Download, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface AnalyticsTabProps {
  className?: string;
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ className }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [analyticsType, setAnalyticsType] = useState('mood');
  const [timeRange, setTimeRange] = useState('month');
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Simuler un appel API
        await new Promise(resolve => setTimeout(resolve, 1200));
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des analytics :", error);
        setHasError(true);
        setIsLoading(false);
        toast.error("Impossible de charger les données d'analyse", {
          description: "Veuillez réessayer ultérieurement"
        });
      }
    };
    
    loadData();
  }, [analyticsType, timeRange]);
  
  const handleExport = (format: string) => {
    toast.success(`Export ${format.toUpperCase()} démarré`, {
      description: "Vos données seront téléchargées dans quelques instants"
    });
    
    setTimeout(() => {
      toast.success(`Export ${format.toUpperCase()} terminé`, {
        description: "Le fichier a été téléchargé"
      });
    }, 2000);
  };
  
  // Gestion de l'erreur
  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-full mb-4">
          <BarChart3 className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Impossible de charger les analytiques</h2>
        <p className="text-muted-foreground mb-6 text-center">
          Une erreur s'est produite lors du chargement des données d'analyse. Veuillez réessayer.
        </p>
        <Button onClick={() => window.location.reload()} variant="default">
          Actualiser les données
        </Button>
      </div>
    );
  }
  
  return (
    <div className={className}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytiques</h2>
          <p className="text-muted-foreground">
            Visualisez et analysez vos données de bien-être
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Tabs value={timeRange} onValueChange={setTimeRange}>
            <TabsList>
              <TabsTrigger value="week">Semaine</TabsTrigger>
              <TabsTrigger value="month">Mois</TabsTrigger>
              <TabsTrigger value="year">Année</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filtres</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => handleExport('csv')}>
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Exporter</span>
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs value={analyticsType} onValueChange={setAnalyticsType}>
        <TabsList className="mb-6">
          <TabsTrigger value="mood" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Humeur
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Activités
          </TabsTrigger>
          <TabsTrigger value="impact" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Impact
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="mood" className="space-y-6">
          {isLoading ? (
            <Card className="w-full h-[400px] animate-pulse">
              <CardHeader>
                <div className="h-7 bg-muted rounded-md w-1/3 mb-2"></div>
                <div className="h-4 bg-muted rounded-md w-1/2"></div>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-[300px]">
                <div className="w-full h-64 bg-muted/50 rounded-md"></div>
              </CardContent>
            </Card>
          ) : (
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Évolution de l'humeur</CardTitle>
                <CardDescription>
                  Visualisation de votre état émotionnel au fil du temps
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2 h-[300px]">
                <div className="h-full w-full flex items-end px-2">
                  {Array.from({ length: 30 }).map((_, i) => {
                    const value = Math.random() * 60 + 20;
                    return (
                      <motion.div 
                        key={i}
                        className="flex-1 mx-0.5 flex flex-col items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.02, duration: 0.5 }}
                      >
                        <motion.div 
                          className="w-full bg-primary/80 rounded-t"
                          style={{ height: `${value}%` }}
                          initial={{ height: 0 }}
                          animate={{ height: `${value}%` }}
                          transition={{ delay: 0.2 + (i * 0.02), duration: 0.8 }}
                        />
                        {i % 5 === 0 && (
                          <span className="text-[10px] mt-2 text-muted-foreground">
                            {i + 1}
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between text-sm text-muted-foreground">
                <span>Données basées sur vos entrées quotidiennes</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleExport('pdf')}
                >
                  PDF
                </Button>
              </CardFooter>
            </Card>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Émotion dominante</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="h-24 w-24 bg-muted rounded-full"></div>
                    <div className="h-5 bg-muted rounded-md w-1/2"></div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-6 mb-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                      >
                        <div className="text-3xl">😌</div>
                      </motion.div>
                    </div>
                    <h3 className="text-xl font-semibold text-center">Calme</h3>
                    <p className="text-sm text-muted-foreground text-center mt-1">
                      45% de vos entrées
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Score moyen</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="h-24 w-24 bg-muted rounded-full"></div>
                    <div className="h-5 bg-muted rounded-md w-1/2"></div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="relative h-24 w-24 mb-4"
                    >
                      <div className="absolute inset-0 rounded-full border-8 border-blue-100 dark:border-blue-900/20"></div>
                      <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-primary"
                        style={{ transform: "rotate(45deg)" }}></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">7.6</span>
                      </div>
                    </motion.div>
                    <h3 className="text-xl font-semibold text-center">Bien</h3>
                    <p className="text-sm text-muted-foreground text-center mt-1">
                      +0.4 vs mois précédent
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Variance</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="h-24 w-24 bg-muted rounded-full"></div>
                    <div className="h-5 bg-muted rounded-md w-1/2"></div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="h-24 w-24 mb-4 flex items-end"
                    >
                      {[1, 2, 3, 4, 5].map((value) => (
                        <motion.div
                          key={value}
                          className="flex-1 mx-0.5 bg-primary/60"
                          style={{ height: `${(Math.sin(value) * 0.5 + 0.5) * 100}%` }}
                          initial={{ height: 0 }}
                          animate={{ height: `${(Math.sin(value) * 0.5 + 0.5) * 100}%` }}
                          transition={{ delay: 0.3 + (value * 0.1), duration: 0.5 }}
                        />
                      ))}
                    </motion.div>
                    <h3 className="text-xl font-semibold text-center">Faible</h3>
                    <p className="text-sm text-muted-foreground text-center mt-1">
                      Émotions stables
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="activities" className="space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="h-[400px] animate-pulse">
                <CardHeader>
                  <div className="h-7 bg-muted rounded-md w-1/3 mb-2"></div>
                  <div className="h-4 bg-muted rounded-md w-1/2"></div>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[300px]">
                  <div className="w-full h-64 bg-muted/50 rounded-md"></div>
                </CardContent>
              </Card>
              <Card className="h-[400px] animate-pulse">
                <CardHeader>
                  <div className="h-7 bg-muted rounded-md w-1/3 mb-2"></div>
                  <div className="h-4 bg-muted rounded-md w-1/2"></div>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[300px]">
                  <div className="w-full h-64 bg-muted/50 rounded-md"></div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Répartition des activités</CardTitle>
                  <CardDescription>
                    Distribution de vos différentes activités de bien-être
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-center">
                    <div className="relative h-64 w-64">
                      <div className="absolute inset-0 rounded-full border-8 border-primary/10"></div>
                      {[
                        { color: "bg-blue-500", percent: 40, label: "Méditation" },
                        { color: "bg-green-500", percent: 25, label: "Exercice" },
                        { color: "bg-yellow-500", percent: 20, label: "Journal" },
                        { color: "bg-purple-500", percent: 15, label: "Musique" }
                      ].map((segment, i, arr) => {
                        const rotation = arr.slice(0, i).reduce((acc, s) => acc + s.percent, 0) * 3.6;
                        return (
                          <motion.div
                            key={i}
                            className={`absolute inset-0 ${segment.color}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.8 }}
                            transition={{ delay: 0.3 + (i * 0.1), duration: 0.5 }}
                            style={{
                              clipPath: `conic-gradient(from ${rotation}deg, currentColor ${segment.percent * 3.6}deg, transparent 0)`,
                              color: "currentColor"
                            }}
                          />
                        );
                      })}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-background h-40 w-40 rounded-full flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-lg font-medium">Activités</p>
                            <p className="text-sm text-muted-foreground">7 derniers jours</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 space-y-2">
                    {[
                      { color: "bg-blue-500", label: "Méditation", value: "8h 20min" },
                      { color: "bg-green-500", label: "Exercice", value: "5h 10min" },
                      { color: "bg-yellow-500", label: "Journal", value: "4h 05min" },
                      { color: "bg-purple-500", label: "Musique", value: "3h 15min" }
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 ${item.color} rounded-full mr-2`} />
                          <span className="text-sm">{item.label}</span>
                        </div>
                        <span className="text-sm font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Impact sur le bien-être</CardTitle>
                  <CardDescription>
                    Effets des activités sur votre score de bien-être
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-6">
                    {[
                      { label: "Méditation", impact: 85 },
                      { label: "Musique", impact: 75 },
                      { label: "Journal", impact: 65 },
                      { label: "Exercice", impact: 90 }
                    ].map((activity, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{activity.label}</span>
                          <span className="text-sm">{activity.impact}%</span>
                        </div>
                        <div className="h-2 bg-primary/20 rounded-full">
                          <motion.div
                            className="h-full bg-primary rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${activity.impact}%` }}
                            transition={{ delay: 0.4 + (i * 0.1), duration: 0.8 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 border-t pt-6">
                    <h4 className="font-medium mb-4">Recommandations</h4>
                    <div className="space-y-3">
                      {[
                        "Augmentez vos sessions de méditation matinales",
                        "Essayez de nouvelles playlists musicales",
                        "Consignez vos émotions plus régulièrement"
                      ].map((reco, i) => (
                        <motion.div 
                          key={i}
                          className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-md"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + (i * 0.1), duration: 0.5 }}
                        >
                          <div className="text-sm flex gap-2">
                            <div className="text-blue-500">💡</div>
                            {reco}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="impact" className="space-y-6">
          {isLoading ? (
            <Card className="w-full h-[400px] animate-pulse">
              <CardHeader>
                <div className="h-7 bg-muted rounded-md w-1/3 mb-2"></div>
                <div className="h-4 bg-muted rounded-md w-1/2"></div>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-[300px]">
                <div className="w-full h-64 bg-muted/50 rounded-md"></div>
              </CardContent>
            </Card>
          ) : (
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Impact de votre bien-être</CardTitle>
                <CardDescription>
                  Comment vos activités affectent votre productivité et votre humeur
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <div className="flex flex-col items-center">
                      <div className="relative w-32 h-32">
                        <div className="absolute inset-0 rounded-full border-8 border-muted"></div>
                        <motion.div
                          className="absolute inset-0 rounded-full border-8 border-transparent border-t-primary"
                          initial={{ transform: "rotate(0deg)" }}
                          animate={{ transform: "rotate(300deg)" }}
                          transition={{ delay: 0.5, duration: 1.5, type: "spring" }}
                        ></motion.div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-3xl font-bold">83%</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-medium mt-4">Productivité</h3>
                      <p className="text-sm text-muted-foreground">+12% ce mois-ci</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex flex-col items-center">
                      <div className="relative w-32 h-32">
                        <div className="absolute inset-0 rounded-full border-8 border-muted"></div>
                        <motion.div
                          className="absolute inset-0 rounded-full border-8 border-transparent border-t-green-500"
                          initial={{ transform: "rotate(0deg)" }}
                          animate={{ transform: "rotate(270deg)" }}
                          transition={{ delay: 0.7, duration: 1.5, type: "spring" }}
                        ></motion.div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-3xl font-bold">75%</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-medium mt-4">Énergie</h3>
                      <p className="text-sm text-muted-foreground">+8% ce mois-ci</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex flex-col items-center">
                      <div className="relative w-32 h-32">
                        <div className="absolute inset-0 rounded-full border-8 border-muted"></div>
                        <motion.div
                          className="absolute inset-0 rounded-full border-8 border-transparent border-t-blue-500"
                          initial={{ transform: "rotate(0deg)" }}
                          animate={{ transform: "rotate(330deg)" }}
                          transition={{ delay: 0.9, duration: 1.5, type: "spring" }}
                        ></motion.div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-3xl font-bold">92%</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-medium mt-4">Focus</h3>
                      <p className="text-sm text-muted-foreground">+15% ce mois-ci</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-12">
                  <h3 className="font-medium mb-6">Corrélation activités-impact</h3>
                  <div className="grid gap-4">
                    {[
                      { activity: "Méditation matinale", impact: "Productivité +18%" },
                      { activity: "Musique pendant le travail", impact: "Focus +22%" },
                      { activity: "Exercices de respiration", impact: "Stress -15%" },
                      { activity: "Journal émotionnel", impact: "Clarté mentale +12%" }
                    ].map((item, i) => (
                      <motion.div 
                        key={i}
                        className="p-4 border rounded-lg flex justify-between items-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + (i * 0.1) }}
                      >
                        <span className="font-medium">{item.activity}</span>
                        <span className="text-sm text-green-600 dark:text-green-400">{item.impact}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsTab;
