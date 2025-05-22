
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HeartPulse, BarChart2, Clock, CalendarCheck } from 'lucide-react';
import Shell from '@/Shell';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const emotions = [
  { name: 'Joie', color: 'bg-yellow-100 dark:bg-yellow-900/20', value: 0 },
  { name: 'Tristesse', color: 'bg-blue-100 dark:bg-blue-900/20', value: 0 },
  { name: 'Colère', color: 'bg-red-100 dark:bg-red-900/20', value: 0 },
  { name: 'Peur', color: 'bg-purple-100 dark:bg-purple-900/20', value: 0 },
  { name: 'Dégoût', color: 'bg-green-100 dark:bg-green-900/20', value: 0 },
  { name: 'Surprise', color: 'bg-orange-100 dark:bg-orange-900/20', value: 0 },
];

const ScanPage = () => {
  const { user } = useAuth();
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [emotionValues, setEmotionValues] = useState(emotions.map(e => ({ ...e })));
  const [dominantEmotion, setDominantEmotion] = useState<string | null>(null);

  const handleStartScan = () => {
    setScanning(true);
    setScanComplete(false);
    
    // Simulate a scan process
    setTimeout(() => {
      const newValues = emotions.map(emotion => ({
        ...emotion,
        value: Math.floor(Math.random() * 100)
      }));
      
      setEmotionValues(newValues);
      setScanning(false);
      setScanComplete(true);
      
      // Find dominant emotion
      const dominant = [...newValues].sort((a, b) => b.value - a.value)[0];
      setDominantEmotion(dominant.name);
    }, 3000);
  };

  return (
    <Shell>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <motion.h1 
            className="text-3xl font-bold mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Scan Émotionnel
          </motion.h1>
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Analysez votre état émotionnel actuel pour mieux vous comprendre
          </motion.p>
        </header>

        <Tabs defaultValue="scan" className="space-y-8">
          <TabsList>
            <TabsTrigger value="scan">Nouveau scan</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scan" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HeartPulse className="mr-2 h-5 w-5 text-primary" />
                  Analyse émotionnelle
                </CardTitle>
                <CardDescription>
                  Notre algorithme avancé analysera vos expressions faciales pour détecter votre état émotionnel actuel.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!scanning && !scanComplete && (
                  <div className="text-center py-12">
                    <div className="mb-6">
                      <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <HeartPulse className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <p className="mb-6">Prêt à découvrir votre état émotionnel actuel ?</p>
                    <Button onClick={handleStartScan} size="lg">
                      Commencer le scan
                    </Button>
                  </div>
                )}
                
                {scanning && (
                  <div className="text-center py-12">
                    <div className="mb-6">
                      <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                        <HeartPulse className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <p className="mb-2">Analyse en cours...</p>
                    <p className="text-sm text-muted-foreground">Veuillez patienter quelques instants</p>
                  </div>
                )}
                
                {scanComplete && (
                  <div className="space-y-6">
                    <div className="text-center mb-4">
                      <p className="text-lg font-medium">Résultats de votre scan</p>
                      {dominantEmotion && (
                        <p className="text-sm text-muted-foreground">
                          Émotion dominante : <span className="font-medium text-primary">{dominantEmotion}</span>
                        </p>
                      )}
                    </div>
                    
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                      {emotionValues.map((emotion) => (
                        <div 
                          key={emotion.name} 
                          className={`p-4 rounded-md ${emotion.color}`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{emotion.name}</span>
                            <span className="text-sm">{emotion.value}%</span>
                          </div>
                          <div className="w-full bg-background rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${emotion.value}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
                      <Button onClick={handleStartScan}>
                        Nouveau scan
                      </Button>
                      <Link to="/journal/new">
                        <Button variant="outline">
                          Ajouter au journal
                        </Button>
                      </Link>
                      <Link to="/music">
                        <Button variant="outline">
                          Musicothérapie recommandée
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-primary" />
                  Historique de vos scans
                </CardTitle>
                <CardDescription>
                  Visualisez l'évolution de vos émotions au fil du temps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p>Vos scans émotionnels apparaîtront ici.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Commencez par effectuer votre premier scan !
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button 
                  onClick={() => document.querySelector('[value="scan"]')?.dispatchEvent(new Event('click'))}
                  variant="outline"
                >
                  Faire un scan
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart2 className="mr-2 h-5 w-5 text-primary" />
                  Insights émotionnels
                </CardTitle>
                <CardDescription>
                  Découvrez des tendances et des insights basés sur vos scans émotionnels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p>
                    Des analyses détaillées apparaîtront ici après plusieurs scans émotionnels.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Effectuez des scans régulièrement pour obtenir des insights personnalisés.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button 
                  onClick={() => document.querySelector('[value="scan"]')?.dispatchEvent(new Event('click'))}
                  variant="outline"
                >
                  Faire un scan
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
};

export default ScanPage;
