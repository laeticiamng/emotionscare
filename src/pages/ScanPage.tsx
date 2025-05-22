
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Clock, Activity, BarChart } from 'lucide-react';

const ScanPage: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [activeTab, setActiveTab] = useState('quick');

  const startScan = () => {
    setScanning(true);
    // Simulation d'un scan de 3 secondes
    setTimeout(() => {
      setScanning(false);
      setScanComplete(true);
    }, 3000);
  };

  const resetScan = () => {
    setScanComplete(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Scanner émotionnel</h1>
        
        <Tabs defaultValue="quick" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quick">Scan rapide</TabsTrigger>
            <TabsTrigger value="detailed">Scan détaillé</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>
          
          <TabsContent value="quick" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Scan rapide</CardTitle>
                <CardDescription>
                  Obtenez un aperçu rapide de votre état émotionnel actuel
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-8">
                {!scanning && !scanComplete ? (
                  <motion.div 
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Heart className="h-24 w-24 text-primary mx-auto mb-6" />
                    <p className="mb-8 text-muted-foreground">
                      Appuyez sur le bouton ci-dessous pour démarrer un scan rapide de votre état émotionnel
                    </p>
                    <Button size="lg" onClick={startScan}>
                      Démarrer le scan
                    </Button>
                  </motion.div>
                ) : scanning ? (
                  <motion.div 
                    className="text-center"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="relative mx-auto mb-6">
                      <Heart className="h-24 w-24 text-primary mx-auto animate-pulse" />
                      <motion.div
                        className="absolute inset-0 rounded-full border-4 border-primary"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ 
                          repeat: Infinity,
                          duration: 2,
                          ease: "easeOut"
                        }}
                      />
                    </div>
                    <p className="text-lg font-medium mb-2">Scan en cours...</p>
                    <p className="text-muted-foreground">Veuillez patienter pendant que nous analysons votre état émotionnel</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-full mx-auto mb-6 w-24 h-24 flex items-center justify-center">
                      <Heart className="h-12 w-12 text-green-600 dark:text-green-500" fill="currentColor" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Résultat: Calme</h3>
                    <p className="mb-6 text-muted-foreground">
                      Vous semblez être dans un état de calme et de sérénité.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button variant="outline" onClick={resetScan}>
                        Nouveau scan
                      </Button>
                      <Button>
                        Voir les détails
                      </Button>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="detailed">
            <Card>
              <CardHeader>
                <CardTitle>Scan détaillé</CardTitle>
                <CardDescription>
                  Analysez en profondeur votre état émotionnel avec des données détaillées
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8 py-4">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Activity className="h-16 w-16 text-primary mb-4" />
                    <p className="mb-6 text-muted-foreground">
                      Le scan détaillé vous permet d'obtenir une analyse complète de votre état émotionnel,
                      y compris les tendances et les facteurs influents.
                    </p>
                    <Button onClick={startScan}>Démarrer le scan détaillé</Button>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="font-medium mb-2 flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                      Temps estimé
                    </h3>
                    <p className="text-muted-foreground ml-7">
                      Le scan détaillé prend généralement 2 à 3 minutes pour une analyse complète.
                    </p>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="font-medium mb-2 flex items-center">
                      <BarChart className="h-5 w-5 mr-2 text-muted-foreground" />
                      Méthode d'analyse
                    </h3>
                    <p className="text-muted-foreground ml-7">
                      Nous utilisons une combinaison d'intelligence artificielle et de techniques de psychologie 
                      comportementale pour analyser votre état émotionnel avec précision.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Historique des scans</CardTitle>
                  <CardDescription>
                    Suivez l'évolution de votre état émotionnel au fil du temps
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  Exporter les données
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-lg">
                    <p className="text-muted-foreground">Graphique d'évolution émotionnelle au fil du temps</p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Scans récents</h3>
                    <div className="space-y-3">
                      {[
                        { date: "22 mai 2023", emotion: "Calme", color: "bg-blue-500" },
                        { date: "20 mai 2023", emotion: "Joyeux", color: "bg-yellow-500" },
                        { date: "18 mai 2023", emotion: "Stressé", color: "bg-red-500" },
                        { date: "15 mai 2023", emotion: "Fatigué", color: "bg-purple-500" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center p-3 rounded-lg border">
                          <div className={`${item.color} w-3 h-3 rounded-full mr-3`} />
                          <div className="flex-1">
                            <p className="font-medium">{item.emotion}</p>
                            <p className="text-sm text-muted-foreground">{item.date}</p>
                          </div>
                          <Button variant="ghost" size="sm">Détails</Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Voir tous les scans</Button>
                <Button>Nouveau scan</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ScanPage;
