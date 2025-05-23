
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
                      Cliquez sur le bouton ci-dessous pour démarrer un scan rapide 
                      de votre état émotionnel. Cela ne prendra que quelques secondes.
                    </p>
                    <Button size="lg" onClick={startScan}>
                      Démarrer le scan
                    </Button>
                  </motion.div>
                ) : scanning ? (
                  <motion.div 
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-24 h-24 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-muted-foreground">Analyse en cours...</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="text-center w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="mb-6 bg-green-100 dark:bg-green-900/30 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
                      <Heart className="h-12 w-12 text-green-600 dark:text-green-500" fill="rgba(22, 163, 74, 0.2)" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Calme et détendu</h3>
                    <p className="mb-8 text-muted-foreground">
                      Votre état émotionnel actuel indique un niveau de stress faible 
                      et un bon équilibre global.
                    </p>
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <Activity className="h-6 w-6 text-primary mx-auto mb-2" />
                        <p className="text-sm font-medium">Stress: 15%</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <Heart className="h-6 w-6 text-primary mx-auto mb-2" />
                        <p className="text-sm font-medium">Bien-être: 85%</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                        <p className="text-sm font-medium">Énergie: 72%</p>
                      </div>
                    </div>
                    <Button size="lg" onClick={resetScan}>
                      Nouveau scan
                    </Button>
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
                  Analyse approfondie de votre état émotionnel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Analyse complète</h3>
                  <p className="text-muted-foreground mb-6">
                    Le scan détaillé combine plusieurs méthodes d'analyse pour fournir
                    un rapport complet sur votre état émotionnel actuel et vos tendances.
                  </p>
                  <Button>Démarrer l'analyse détaillée</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Historique des scans</CardTitle>
                <CardDescription>
                  Consultez et analysez l'évolution de votre état émotionnel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                        <Heart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">Calme et détendu</h4>
                        <p className="text-sm text-muted-foreground">Aujourd'hui, 10:30</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Voir détails
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full">
                        <Heart className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">Légèrement anxieux</h4>
                        <p className="text-sm text-muted-foreground">Hier, 18:45</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Voir détails
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                        <Heart className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">Joyeux et énergique</h4>
                        <p className="text-sm text-muted-foreground">Il y a 2 jours, 14:15</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Voir détails
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline">Voir tout l'historique</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ScanPage;
