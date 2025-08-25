import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Camera, 
  Mic, 
  Heart, 
  Zap, 
  TrendingUp, 
  BarChart3,
  Clock,
  Target,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

/**
 * Hub de scan émotionnel - Fonctionnalité premium IA
 * États: loading, scanning, results, history
 */
const EmotionalScanHub: React.FC = () => {
  const { user } = useAuth();
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'results' | 'history'>('idle');
  const [scanProgress, setScanProgress] = useState(0);
  const [scanMethod, setScanMethod] = useState<'camera' | 'voice' | 'text'>('camera');

  // Mock data - à remplacer par React Query
  const scanResults = {
    dominantEmotion: 'Sérénité',
    confidence: 0.87,
    emotions: {
      joie: 0.65,
      sérénité: 0.87,
      énergie: 0.43,
      stress: 0.22,
      fatigue: 0.18,
    },
    insights: [
      'Votre niveau de sérénité est exceptionnellement élevé',
      'Légère tension détectée au niveau des épaules',
      'Rythme cardiaque stable et régulier',
    ],
    recommendations: [
      'Continuez vos pratiques de méditation',
      'Pensez à faire des pauses régulières',
      'Session de musicothérapie recommandée',
    ],
  };

  const scanHistory = [
    { id: 1, date: '2024-01-15T10:30', emotion: 'Joie', score: 8.2, method: 'camera' },
    { id: 2, date: '2024-01-14T15:45', emotion: 'Calme', score: 7.8, method: 'voice' },
    { id: 3, date: '2024-01-14T09:15', emotion: 'Énergie', score: 9.1, method: 'camera' },
    { id: 4, date: '2024-01-13T18:20', emotion: 'Fatigue', score: 4.3, method: 'text' },
  ];

  const startScan = async () => {
    setScanState('scanning');
    setScanProgress(0);
    
    // Simulation du scan
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanState('results');
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const resetScan = () => {
    setScanState('idle');
    setScanProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 px-4 py-2 rounded-full mb-4">
            <Brain className="h-5 w-5 text-purple-600" />
            <Badge variant="secondary" className="bg-purple-600 text-white">
              IA Premium
            </Badge>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Scan Émotionnel IA
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Analyse instantanée de votre état émotionnel avec notre IA multimodale de pointe
          </p>
        </motion.div>

        <Tabs defaultValue="scan" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="scan">Nouveau Scan</TabsTrigger>
            <TabsTrigger value="results">Résultats</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>

          {/* Onglet Nouveau Scan */}
          <TabsContent value="scan" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Zone de scan principale */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-purple-500" />
                        Zone d'analyse
                      </CardTitle>
                      <CardDescription>
                        Choisissez votre méthode d'analyse préférée
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      
                      {/* Sélection de méthode */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        {[
                          { id: 'camera', icon: Camera, label: 'Visuel', desc: 'Expression faciale' },
                          { id: 'voice', icon: Mic, label: 'Vocal', desc: 'Analyse vocale' },
                          { id: 'text', icon: Brain, label: 'Textuel', desc: 'Sentiment écrit' },
                        ].map((method) => (
                          <Card 
                            key={method.id}
                            className={cn(
                              "cursor-pointer transition-all duration-200 hover:shadow-md",
                              scanMethod === method.id 
                                ? "ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20" 
                                : "hover:bg-gray-50 dark:hover:bg-gray-800"
                            )}
                            onClick={() => setScanMethod(method.id as any)}
                          >
                            <CardContent className="p-4 text-center">
                              <method.icon className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                              <div className="font-medium text-sm">{method.label}</div>
                              <div className="text-xs text-gray-500 mt-1">{method.desc}</div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {/* Zone de capture */}
                      <div className="relative">
                        <div className={cn(
                          "aspect-video bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-xl border-2 border-dashed flex items-center justify-center",
                          scanState === 'scanning' && "border-purple-500 animate-pulse"
                        )}>
                          <AnimatePresence mode="wait">
                            {scanState === 'idle' && (
                              <motion.div
                                className="text-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                              >
                                <div className="h-16 w-16 bg-purple-200 dark:bg-purple-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                  {scanMethod === 'camera' && <Camera className="h-8 w-8 text-purple-600" />}
                                  {scanMethod === 'voice' && <Mic className="h-8 w-8 text-purple-600" />}
                                  {scanMethod === 'text' && <Brain className="h-8 w-8 text-purple-600" />}
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                  Prêt pour l'analyse {scanMethod === 'camera' ? 'visuelle' : scanMethod === 'voice' ? 'vocale' : 'textuelle'}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                  {scanMethod === 'camera' && 'Positionnez-vous face à la caméra'}
                                  {scanMethod === 'voice' && 'Préparez-vous à parler pendant 30 secondes'}
                                  {scanMethod === 'text' && 'Décrivez votre état émotionnel actuel'}
                                </p>
                              </motion.div>
                            )}

                            {scanState === 'scanning' && (
                              <motion.div
                                className="text-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                              >
                                <div className="h-16 w-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                  <Zap className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                  Analyse en cours...
                                </h3>
                                <Progress value={scanProgress} className="w-64 mx-auto mb-2" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {scanProgress}% - Traitement IA
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Contrôles */}
                        <div className="flex items-center justify-center gap-4 mt-6">
                          {scanState === 'idle' && (
                            <Button
                              onClick={startScan}
                              size="lg"
                              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            >
                              <Play className="h-5 w-5 mr-2" />
                              Lancer l'analyse
                            </Button>
                          )}

                          {scanState === 'scanning' && (
                            <Button
                              onClick={resetScan}
                              variant="outline"
                              size="lg"
                            >
                              <Pause className="h-5 w-5 mr-2" />
                              Arrêter
                            </Button>
                          )}

                          {scanState === 'results' && (
                            <Button
                              onClick={resetScan}
                              variant="outline"
                              size="lg"
                            >
                              <RotateCcw className="h-5 w-5 mr-2" />
                              Nouveau scan
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Panneau latéral */}
              <div className="space-y-6">
                
                {/* Conseils */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Conseils pour un scan optimal</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                        <div className="text-sm">
                          <strong>Éclairage :</strong> Privilégiez une lumière naturelle douce
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                        <div className="text-sm">
                          <strong>Position :</strong> Regardez directement la caméra
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                        <div className="text-sm">
                          <strong>Authenticité :</strong> Soyez naturel et détendu
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Dernier scan */}
                {scanHistory.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Dernier scan
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{scanHistory[0].emotion}</span>
                            <Badge variant="secondary">{scanHistory[0].score}/10</Badge>
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(scanHistory[0].date).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          <Progress value={scanHistory[0].score * 10} className="h-2 mt-2" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Onglet Résultats */}
          <TabsContent value="results" className="space-y-6">
            {scanState === 'results' ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                
                {/* Résultats principaux */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      Analyse émotionnelle
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {scanResults.dominantEmotion}
                      </div>
                      <div className="text-lg text-gray-600 dark:text-gray-400">
                        Confiance: {Math.round(scanResults.confidence * 100)}%
                      </div>
                    </div>

                    <div className="space-y-3">
                      {Object.entries(scanResults.emotions).map(([emotion, value]) => (
                        <div key={emotion} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{emotion}</span>
                            <span>{Math.round(value * 100)}%</span>
                          </div>
                          <Progress value={value * 100} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Insights et recommandations */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Insights IA</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {scanResults.insights.map((insight, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recommandations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {scanResults.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <Target className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                      
                      <Button className="w-full mt-4" variant="outline">
                        <Zap className="h-4 w-4 mr-2" />
                        Appliquer les recommandations
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Aucun résultat disponible
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Lancez un nouveau scan pour voir les résultats ici
                  </p>
                  <Button onClick={() => setScanState('idle')} variant="outline">
                    Retour au scan
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Onglet Historique */}
          <TabsContent value="history" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-500" />
                    Historique des analyses
                  </CardTitle>
                  <CardDescription>
                    Suivez l'évolution de votre bien-être émotionnel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {scanHistory.map((scan) => (
                      <div 
                        key={scan.id} 
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                            {scan.method === 'camera' && <Camera className="h-5 w-5 text-purple-600" />}
                            {scan.method === 'voice' && <Mic className="h-5 w-5 text-purple-600" />}
                            {scan.method === 'text' && <Brain className="h-5 w-5 text-purple-600" />}
                          </div>
                          
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {scan.emotion}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(scan.date).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-bold text-lg text-gray-900 dark:text-white">
                            {scan.score}/10
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {scan.method}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Voir l'analyse détaillée
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmotionalScanHub;