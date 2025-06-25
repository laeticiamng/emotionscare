
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Brain, Heart, Activity, Camera, Mic, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const ScanPage: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResults, setScanResults] = useState<any>(null);
  const [scanHistory, setScanHistory] = useState<any[]>([]);

  const startEmotionScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    // Simulation du scan avec progression
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setScanResults({
            dominantEmotion: 'Calme',
            intensity: 75,
            confidence: 92,
            emotions: [
              { name: 'Calme', value: 75, color: 'bg-green-500' },
              { name: 'Focus', value: 60, color: 'bg-blue-500' },
              { name: 'Stress', value: 25, color: 'bg-red-500' },
              { name: 'Joie', value: 45, color: 'bg-yellow-500' }
            ],
            recommendations: [
              'Maintenir ce niveau de calme avec des exercices de respiration',
              'Prendre une pause de 5 minutes toutes les heures',
              'Écouter de la musique relaxante'
            ]
          });
          toast.success('Scan émotionnel terminé !');
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const mockScanHistory = [
    { id: 1, date: '2024-01-15 14:30', emotion: 'Calme', intensity: 75, trend: 'stable' },
    { id: 2, date: '2024-01-15 10:15', emotion: 'Énergique', intensity: 85, trend: 'up' },
    { id: 3, date: '2024-01-14 16:45', emotion: 'Fatigue', intensity: 40, trend: 'down' }
  ];

  useEffect(() => {
    setScanHistory(mockScanHistory);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4" data-testid="scan-page">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Scanner Émotionnel</h1>
          <p className="text-xl text-gray-600">Analysez votre état émotionnel en temps réel</p>
        </div>

        <Tabs defaultValue="scan" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="scan">Nouveau Scan</TabsTrigger>
            <TabsTrigger value="results">Résultats</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>

          <TabsContent value="scan" className="space-y-6">
            <Card className="relative overflow-hidden">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                  <Eye className="h-8 w-8 text-blue-600" />
                  Scanner Émotionnel IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <motion.div
                    className={`mx-auto w-32 h-32 rounded-full border-4 flex items-center justify-center ${
                      isScanning ? 'border-blue-500 animate-pulse' : 'border-gray-300'
                    }`}
                    animate={isScanning ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <Brain className={`h-16 w-16 ${isScanning ? 'text-blue-500' : 'text-gray-400'}`} />
                  </motion.div>
                </div>

                {isScanning && (
                  <div className="space-y-4">
                    <Progress value={scanProgress} className="w-full" />
                    <p className="text-center text-sm text-gray-600">
                      Analyse en cours... {scanProgress}%
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={startEmotionScan}
                    disabled={isScanning}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Camera className="mr-2 h-5 w-5" />
                    {isScanning ? 'Scan en cours...' : 'Commencer le Scan'}
                  </Button>
                  <Button variant="outline" size="lg">
                    <Mic className="mr-2 h-5 w-5" />
                    Scan Vocal
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="p-4 text-center">
                    <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <p className="font-medium">Rythme</p>
                    <p className="text-sm text-gray-600">Cardiaque</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <Activity className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="font-medium">Stress</p>
                    <p className="text-sm text-gray-600">Niveau</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <Brain className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <p className="font-medium">Focus</p>
                    <p className="text-sm text-gray-600">Mental</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <Eye className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <p className="font-medium">Émotion</p>
                    <p className="text-sm text-gray-600">Dominante</p>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <AnimatePresence>
              {scanResults && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-6 w-6" />
                        Résultats du Scan
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-center">
                        <Badge variant="secondary" className="text-lg px-4 py-2">
                          Émotion dominante: {scanResults.dominantEmotion}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-2">
                          Intensité: {scanResults.intensity}% | Confiance: {scanResults.confidence}%
                        </p>
                      </div>

                      <div className="space-y-4">
                        {scanResults.emotions.map((emotion: any, index: number) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="font-medium">{emotion.name}</span>
                              <span>{emotion.value}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`${emotion.color} h-2 rounded-full transition-all duration-500`}
                                style={{ width: `${emotion.value}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <Card className="bg-blue-50">
                        <CardHeader>
                          <CardTitle className="text-lg">Recommandations</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {scanResults.recommendations.map((rec: string, index: number) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-sm">{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {!scanResults && (
              <Card>
                <CardContent className="text-center py-12">
                  <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Aucun résultat disponible. Effectuez un scan pour voir vos résultats.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Historique des Scans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scanHistory.map((scan) => (
                    <div key={scan.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{scan.emotion}</p>
                        <p className="text-sm text-gray-600">{scan.date}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={scan.intensity > 70 ? 'default' : scan.intensity > 40 ? 'secondary' : 'destructive'}>
                          {scan.intensity}%
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">
                          Tendance: {scan.trend === 'up' ? '↗️' : scan.trend === 'down' ? '↘️' : '➡️'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ScanPage;
