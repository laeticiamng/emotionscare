
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Camera, Mic, Activity, Sparkles, Target, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ScanPage: React.FC = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResults, setScanResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('face');

  const startScan = (type: string) => {
    setIsScanning(true);
    setScanProgress(0);
    setScanResults(null);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setScanResults({
            emotionalState: 'Calme et concentré',
            stressLevel: 25,
            energyLevel: 78,
            recommendations: [
              'Continuez votre bonne hygiène de sommeil',
              'Prenez une pause créative dans 2h',
              'Hydratez-vous régulièrement'
            ]
          });
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Scanner Émotionnel IA
            </h1>
            <Sparkles className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez votre état émotionnel en temps réel grâce à notre intelligence artificielle avancée
          </p>
        </motion.div>

        {/* Scan Types */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="face" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Analyse Faciale
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Analyse Vocale
            </TabsTrigger>
            <TabsTrigger value="combined" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Analyse Complète
            </TabsTrigger>
          </TabsList>

          <TabsContent value="face">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-blue-600" />
                  Scan Émotionnel par Reconnaissance Faciale
                </CardTitle>
                <CardDescription>
                  Analysez vos micro-expressions pour détecter votre état émotionnel actuel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-6">
                  <div className="w-64 h-48 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl border-4 border-dashed border-blue-300 flex items-center justify-center">
                    {isScanning ? (
                      <div className="text-center">
                        <div className="animate-pulse text-blue-600 mb-2">
                          <Camera className="h-12 w-12 mx-auto" />
                        </div>
                        <p className="text-sm text-gray-600">Analyse en cours...</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Camera className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Prêt pour l'analyse</p>
                      </div>
                    )}
                  </div>
                  
                  {isScanning && (
                    <div className="space-y-2">
                      <Progress value={scanProgress} className="w-full" />
                      <p className="text-sm text-gray-600">{scanProgress}% complété</p>
                    </div>
                  )}
                  
                  <Button 
                    onClick={() => startScan('face')}
                    disabled={isScanning}
                    size="lg"
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isScanning ? 'Analyse en cours...' : 'Démarrer l\'analyse faciale'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="voice">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5 text-purple-600" />
                  Analyse Émotionnelle Vocale
                </CardTitle>
                <CardDescription>
                  Analysez le ton et les inflexions de votre voix pour évaluer votre état émotionnel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-6">
                  <div className="w-64 h-48 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl border-4 border-dashed border-purple-300 flex items-center justify-center">
                    {isScanning ? (
                      <div className="text-center">
                        <div className="animate-pulse text-purple-600 mb-2">
                          <Mic className="h-12 w-12 mx-auto" />
                        </div>
                        <div className="flex gap-1 justify-center">
                          {[...Array(5)].map((_, i) => (
                            <div 
                              key={i}
                              className="w-2 h-8 bg-purple-400 rounded-full animate-pulse"
                              style={{ animationDelay: `${i * 0.1}s` }}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Mic className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Prêt pour l'écoute</p>
                      </div>
                    )}
                  </div>
                  
                  {isScanning && (
                    <div className="space-y-2">
                      <Progress value={scanProgress} className="w-full" />
                      <p className="text-sm text-gray-600">Parlez maintenant... {scanProgress}%</p>
                    </div>
                  )}
                  
                  <Button 
                    onClick={() => startScan('voice')}
                    disabled={isScanning}
                    size="lg"
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isScanning ? 'Écoute en cours...' : 'Démarrer l\'analyse vocale'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="combined">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Analyse Émotionnelle Complète
                </CardTitle>
                <CardDescription>
                  Combinez analyse faciale et vocale pour un diagnostic émotionnel précis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl border-2 border-dashed border-blue-300 flex items-center justify-center">
                      <Camera className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="w-full h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl border-2 border-dashed border-purple-300 flex items-center justify-center">
                      <Mic className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                  
                  {isScanning && (
                    <div className="space-y-2">
                      <Progress value={scanProgress} className="w-full" />
                      <p className="text-sm text-gray-600">Analyse multi-modale en cours... {scanProgress}%</p>
                    </div>
                  )}
                  
                  <Button 
                    onClick={() => startScan('combined')}
                    disabled={isScanning}
                    size="lg"
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  >
                    {isScanning ? 'Analyse complète...' : 'Analyse complète (Recommandé)'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Results */}
        {scanResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Résultats de l'Analyse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {scanResults.emotionalState}
                    </div>
                    <p className="text-gray-600">État émotionnel détecté</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {scanResults.stressLevel}%
                    </div>
                    <p className="text-gray-600">Niveau de stress</p>
                    <Badge variant={scanResults.stressLevel < 30 ? 'default' : 'destructive'}>
                      {scanResults.stressLevel < 30 ? 'Faible' : 'Modéré'}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-2">
                      {scanResults.energyLevel}%
                    </div>
                    <p className="text-gray-600">Niveau d'énergie</p>
                    <Badge variant="default">Élevé</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Recommandations Personnalisées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {scanResults.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <p className="text-gray-700">{rec}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex gap-3">
                  <Button onClick={() => navigate('/coach')} className="flex-1">
                    Parler au Coach IA
                  </Button>
                  <Button onClick={() => navigate('/music')} variant="outline" className="flex-1">
                    Musicothérapie
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ScanPage;
