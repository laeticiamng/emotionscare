
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, FileText, Mic, Smile, TrendingUp, Calendar } from 'lucide-react';
import EmotionScanForm from '@/components/scan/EmotionScanForm';
import { EmotionResult } from '@/types/emotion';
import LoadingAnimation from '@/components/ui/loading-animation';

const ScanPage: React.FC = () => {
  const [showScanForm, setShowScanForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<EmotionResult | null>(null);
  const [scanHistory, setScanHistory] = useState<EmotionResult[]>([
    {
      emotions: [
        { name: 'Calme', intensity: 78 },
        { name: 'Optimisme', intensity: 65 },
        { name: 'Sérénité', intensity: 72 }
      ],
      confidence: 82,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
      recommendations: 'Excellente journée ! Continuez sur cette lancée positive.',
      analysisType: 'text'
    },
    {
      emotions: [
        { name: 'Stress', intensity: 45 },
        { name: 'Fatigue', intensity: 60 },
        { name: 'Détermination', intensity: 70 }
      ],
      confidence: 75,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      recommendations: 'Prenez une pause et respirez profondément.',
      analysisType: 'audio'
    }
  ]);

  const handleScanComplete = (result: EmotionResult) => {
    setLastResult(result);
    setScanHistory(prev => [result, ...prev]);
    setShowScanForm(false);
  };

  const getEmotionColor = (intensity: number) => {
    if (intensity >= 70) return 'text-green-600 bg-green-100';
    if (intensity >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getAnalysisTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return <FileText className="h-4 w-4" />;
      case 'audio': return <Mic className="h-4 w-4" />;
      case 'emoji': return <Smile className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingAnimation text="Analyse de vos émotions en cours..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
            <Brain className="h-8 w-8 text-blue-600" />
            Scanner d'émotions
          </h1>
          <p className="text-muted-foreground">
            Analysez votre état émotionnel et obtenez des recommandations personnalisées
          </p>
        </div>
      </motion.div>

      {/* Action principale */}
      {!showScanForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="text-center">
            <CardContent className="p-8">
              <div className="mx-auto mb-6 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full w-fit">
                <Brain className="h-12 w-12 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">
                Comment vous sentez-vous en ce moment ?
              </h2>
              <p className="text-muted-foreground mb-6">
                Choisissez votre méthode d'analyse préférée pour scanner vos émotions
              </p>
              <Button 
                onClick={() => setShowScanForm(true)}
                size="lg"
                className="px-8"
              >
                Commencer l'analyse
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Formulaire de scan */}
      {showScanForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <EmotionScanForm 
            onComplete={handleScanComplete}
            onClose={() => setShowScanForm(false)}
          />
        </motion.div>
      )}

      {/* Dernier résultat */}
      {lastResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Votre dernière analyse
              </CardTitle>
              <CardDescription>
                Réalisée le {lastResult.timestamp.toLocaleDateString('fr-FR')} à {lastResult.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Émotions détectées</h3>
                  <div className="space-y-2">
                    {lastResult.emotions.map((emotion, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                        <span className="font-medium">{emotion.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-500"
                              style={{ width: `${emotion.intensity}%` }}
                            ></div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getEmotionColor(emotion.intensity)}`}>
                            {emotion.intensity}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-3">Recommandations</h3>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <p className="text-sm">{lastResult.recommendations}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                      {getAnalysisTypeIcon(lastResult.analysisType)}
                      <span>Analyse {lastResult.analysisType === 'text' ? 'textuelle' : lastResult.analysisType === 'audio' ? 'audio' : 'émoji'}</span>
                      <span>•</span>
                      <span>Confiance: {lastResult.confidence}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Historique des scans */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Historique de vos analyses
            </CardTitle>
            <CardDescription>
              Suivez l'évolution de votre état émotionnel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scanHistory.map((scan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      {getAnalysisTypeIcon(scan.analysisType)}
                      <span className="font-medium">
                        {scan.timestamp.toLocaleDateString('fr-FR')} - {scan.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <span className="text-xs bg-muted px-2 py-1 rounded-full">
                      Confiance: {scan.confidence}%
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Émotions principales</h4>
                      <div className="flex gap-2 flex-wrap">
                        {scan.emotions.slice(0, 3).map((emotion, emotionIndex) => (
                          <span
                            key={emotionIndex}
                            className={`text-xs px-2 py-1 rounded-full font-medium ${getEmotionColor(emotion.intensity)}`}
                          >
                            {emotion.name} ({emotion.intensity}%)
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Recommandation</h4>
                      <p className="text-sm text-muted-foreground">{scan.recommendations}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Conseils et informations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>💡 Comment optimiser vos analyses ?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-medium mb-1">Analyse textuelle</h3>
                <p className="text-sm text-muted-foreground">
                  Décrivez vos sentiments avec vos propres mots pour une analyse précise
                </p>
              </div>
              <div className="text-center">
                <Mic className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <h3 className="font-medium mb-1">Analyse vocale</h3>
                <p className="text-sm text-muted-foreground">
                  Parlez naturellement pendant 15-30 secondes pour capturer les nuances
                </p>
              </div>
              <div className="text-center">
                <Smile className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h3 className="font-medium mb-1">Sélection d'émojis</h3>
                <p className="text-sm text-muted-foreground">
                  Choisissez les émojis qui représentent le mieux votre état actuel
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ScanPage;
