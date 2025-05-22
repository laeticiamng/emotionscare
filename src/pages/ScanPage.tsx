
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
                      Le scan rapide prend environ 5 secondes et vous donne un aperçu de votre niveau de stress et d'équilibre émotionnel.
                    </p>
                    <Button onClick={startScan} size="lg">
                      Démarrer le scan
                    </Button>
                  </motion.div>
                ) : scanning ? (
                  <motion.div 
                    className="flex flex-col items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div 
                      className="w-32 h-32 border-4 border-primary border-t-transparent rounded-full mb-6"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    <p className="text-lg font-medium">Scan en cours...</p>
                    <p className="text-muted-foreground">Veuillez patienter quelques instants</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-xl font-medium mb-6 text-center">Résultats du scan</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center">
                            <Activity className="h-5 w-5 mr-2 text-blue-500" />
                            Niveau de stress
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold">38%</span>
                            <div className="h-2 flex-1 bg-muted rounded-full mx-4 overflow-hidden">
                              <div className="h-full bg-blue-500 rounded-full" style={{ width: '38%' }}></div>
                            </div>
                            <span className="text-muted-foreground">Modéré</span>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center">
                            <Heart className="h-5 w-5 mr-2 text-red-500" />
                            Équilibre émotionnel
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold">72%</span>
                            <div className="h-2 flex-1 bg-muted rounded-full mx-4 overflow-hidden">
                              <div className="h-full bg-green-500 rounded-full" style={{ width: '72%' }}></div>
                            </div>
                            <span className="text-muted-foreground">Bon</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="text-center">
                      <p className="mb-6 text-muted-foreground">
                        Votre niveau de stress est modéré, et votre équilibre émotionnel est bon. Nous vous recommandons une session de musique relaxante pour réduire votre niveau de stress.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button onClick={resetScan} variant="outline">
                          Nouveau scan
                        </Button>
                        <Button>
                          Voir recommandations
                        </Button>
                      </div>
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
                  Une analyse approfondie de votre état émotionnel, nécessitant 1-2 minutes
                </CardDescription>
              </CardHeader>
              <CardContent className="py-8 text-center">
                <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="mb-8 text-muted-foreground">
                  Le scan détaillé analyse votre fréquence cardiaque, vos expressions faciales, votre voix et d'autres facteurs pour fournir une analyse complète de votre état émotionnel.
                </p>
                <Button size="lg">Démarrer le scan détaillé</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Historique des scans</CardTitle>
                <CardDescription>
                  Visualisez et analysez vos résultats précédents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { date: 'Aujourd'hui, 10:30', stress: 38, balance: 72 },
                    { date: 'Hier, 14:15', stress: 42, balance: 68 },
                    { date: '20 mai, 09:00', stress: 55, balance: 62 },
                    { date: '18 mai, 19:45', stress: 30, balance: 78 },
                  ].map((entry, i) => (
                    <div key={i} className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium">{entry.date}</h4>
                        <Button variant="ghost" size="sm">Détails</Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Niveau de stress</p>
                          <div className="flex items-center">
                            <span className="mr-2 font-medium">{entry.stress}%</span>
                            <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${entry.stress}%` }}></div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Équilibre émotionnel</p>
                          <div className="flex items-center">
                            <span className="mr-2 font-medium">{entry.balance}%</span>
                            <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-green-500 rounded-full" style={{ width: `${entry.balance}%` }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <BarChart className="h-4 w-4 mr-2" />
                  Voir l'analyse sur la durée
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ScanPage;
