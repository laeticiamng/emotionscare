
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Eye, Camera, Mic, Heart, Brain, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const ScanPage: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<any>(null);
  
  const scanMethods = [
    {
      id: 'facial',
      name: 'Scan Facial',
      description: 'Analysez vos émotions via votre expression faciale',
      icon: Camera,
      color: 'from-blue-500 to-blue-600',
      accuracy: 92,
      duration: '30 secondes'
    },
    {
      id: 'voice',
      name: 'Analyse Vocale',
      description: 'Détectez votre état émotionnel par votre voix',
      icon: Mic,
      color: 'from-green-500 to-green-600',
      accuracy: 88,
      duration: '1 minute'
    },
    {
      id: 'text',
      name: 'Analyse de Texte',
      description: 'Évaluez vos émotions à partir de votre écriture',
      icon: Eye,
      color: 'from-purple-500 to-purple-600',
      accuracy: 85,
      duration: '2 minutes'
    }
  ];

  const recentScans = [
    { date: 'Aujourd\'hui 14:30', emotion: 'Calme', score: 8.2, method: 'facial' },
    { date: 'Aujourd\'hui 10:15', emotion: 'Énergique', score: 7.8, method: 'voice' },
    { date: 'Hier 16:45', emotion: 'Stressé', score: 4.3, method: 'facial' },
    { date: 'Hier 09:20', emotion: 'Joyeux', score: 9.1, method: 'text' }
  ];

  const emotionTrends = [
    { emotion: 'Joie', percentage: 35, color: 'bg-yellow-500' },
    { emotion: 'Calme', percentage: 28, color: 'bg-blue-500' },
    { emotion: 'Énergie', percentage: 20, color: 'bg-green-500' },
    { emotion: 'Stress', percentage: 12, color: 'bg-red-500' },
    { emotion: 'Tristesse', percentage: 5, color: 'bg-gray-500' }
  ];

  const startScan = async (method: string) => {
    setIsScanning(true);
    
    // Simulation du scan
    setTimeout(() => {
      const mockResult = {
        emotion: ['Calme', 'Joyeux', 'Énergique', 'Concentré'][Math.floor(Math.random() * 4)],
        confidence: 85 + Math.random() * 15,
        score: 6 + Math.random() * 4,
        recommendations: [
          'Continuez vos bonnes habitudes de bien-être',
          'Prenez une pause de 5 minutes toutes les heures',
          'Pratiquez la respiration profonde'
        ]
      };
      setScanResults(mockResult);
      setIsScanning(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Scanner Émotionnel</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Analysez votre état émotionnel en temps réel avec notre technologie d'IA avancée
          </p>
        </motion.div>

        <Tabs defaultValue="scan" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
            <TabsTrigger value="scan">Nouveau Scan</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
            <TabsTrigger value="trends">Tendances</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="scan">
            {!isScanning && !scanResults && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {scanMethods.map((method, index) => (
                  <motion.div
                    key={method.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader className="text-center">
                        <div className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                          <method.icon className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle>{method.name}</CardTitle>
                        <CardDescription>{method.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="text-center space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Précision</span>
                            <span className="font-semibold">{method.accuracy}%</span>
                          </div>
                          <Progress value={method.accuracy} className="h-2" />
                        </div>
                        <Badge variant="outline">{method.duration}</Badge>
                        <Button
                          className={`w-full bg-gradient-to-r ${method.color}`}
                          onClick={() => startScan(method.id)}
                        >
                          Commencer le Scan
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {isScanning && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"
                  />
                  <Heart className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyse en cours...</h2>
                <p className="text-gray-600">Nous analysons vos données émotionnelles</p>
              </motion.div>
            )}

            {scanResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto"
              >
                <Card className="border-2 border-green-200 bg-green-50">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-green-800">
                      Résultats du Scan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {scanResults.emotion}
                      </div>
                      <div className="text-lg text-gray-600">
                        Score: {scanResults.score.toFixed(1)}/10
                      </div>
                      <div className="text-sm text-gray-500">
                        Confiance: {scanResults.confidence.toFixed(0)}%
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Recommandations:</h3>
                      <ul className="space-y-2">
                        {scanResults.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="flex items-center text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex space-x-3">
                      <Button 
                        className="flex-1"
                        onClick={() => {
                          setScanResults(null);
                        }}
                      >
                        Nouveau Scan
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Sauvegarder
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Historique des Scans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentScans.map((scan, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-semibold">{scan.emotion}</div>
                        <div className="text-sm text-gray-600">{scan.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{scan.score}/10</div>
                        <Badge variant="outline" className="text-xs">
                          {scan.method}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Distribution Émotionnelle
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {emotionTrends.map((trend, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{trend.emotion}</span>
                          <span className="font-semibold">{trend.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${trend.color} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${trend.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Statistiques Hebdomadaires
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">28</div>
                        <div className="text-sm text-gray-600">Scans Total</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">7.4</div>
                        <div className="text-sm text-gray-600">Score Moyen</div>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">+12%</div>
                      <div className="text-sm text-gray-600">Amélioration vs semaine dernière</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    Insights Personnalisés
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                      <h3 className="font-semibold text-blue-800">Pattern Détecté</h3>
                      <p className="text-blue-700 text-sm mt-1">
                        Votre bien-être est généralement meilleur le matin. Planifiez vos tâches importantes avant 11h.
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
                      <h3 className="font-semibold text-green-800">Amélioration Notable</h3>
                      <p className="text-green-700 text-sm mt-1">
                        Vos scores de bien-être ont augmenté de 15% depuis que vous pratiquez la méditation quotidienne.
                      </p>
                    </div>
                    <div className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
                      <h3 className="font-semibold text-orange-800">Recommandation</h3>
                      <p className="text-orange-700 text-sm mt-1">
                        Considérez ajouter des pauses plus fréquentes les après-midis pour maintenir votre énergie.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ScanPage;
