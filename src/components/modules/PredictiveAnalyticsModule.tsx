import React, { useState, useEffect } from 'react';
import { usePredictiveAnalytics } from '@/providers/PredictiveAnalyticsProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, TrendingUp, Target, Lightbulb, Settings, 
  BarChart3, Zap, Eye, Clock, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export const PredictiveAnalyticsModule: React.FC = () => {
  const {
    currentPredictions,
    recommendations,
    availableFeatures,
    isLoading,
    error,
    isEnabled,
    setEnabled,
    generatePrediction,
    resetPredictions
  } = usePredictiveAnalytics();

  const [autoGenerate, setAutoGenerate] = useState(false);

  // Génération automatique périodique
  useEffect(() => {
    if (autoGenerate && isEnabled) {
      const interval = setInterval(() => {
        generatePrediction();
      }, 30000); // Toutes les 30 secondes

      return () => clearInterval(interval);
    }
  }, [autoGenerate, isEnabled, generatePrediction]);

  const handleGeneratePrediction = async () => {
    try {
      await generatePrediction();
      toast.success('Nouvelle prédiction générée');
    } catch (error) {
      toast.error('Erreur lors de la génération');
    }
  };

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      'calm': 'bg-blue-100 text-blue-800',
      'energetic': 'bg-orange-100 text-orange-800',
      'happy': 'bg-yellow-100 text-yellow-800',
      'sad': 'bg-gray-100 text-gray-800',
      'focused': 'bg-purple-100 text-purple-800',
      'stressed': 'bg-red-100 text-red-800',
      'creative': 'bg-pink-100 text-pink-800',
      'tired': 'bg-indigo-100 text-indigo-800'
    };
    return colors[emotion.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 0.8) return { label: 'Très élevée', color: 'text-green-600' };
    if (confidence >= 0.6) return { label: 'Élevée', color: 'text-blue-600' };
    if (confidence >= 0.4) return { label: 'Moyenne', color: 'text-yellow-600' };
    return { label: 'Faible', color: 'text-red-600' };
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Analytics Prédictives</h1>
            <p className="text-muted-foreground">
              Intelligence artificielle prédictive pour anticiper vos besoins émotionnels
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm">Module actif:</span>
          <Switch
            checked={isEnabled}
            onCheckedChange={setEnabled}
          />
        </div>
      </div>

      {!isEnabled ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Analytics Prédictives Désactivées</h3>
            <p className="text-muted-foreground mb-4">
              Activez ce module pour recevoir des prédictions émotionnelles personnalisées
            </p>
            <Button onClick={() => setEnabled(true)}>
              Activer les Analytics Prédictives
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="predictions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="predictions" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Prédictions
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Recommandations
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="predictions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Prédiction actuelle */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Prédiction Actuelle</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGeneratePrediction}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Analyse...' : 'Nouvelle Prédiction'}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-8"
                      >
                        <Brain className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
                        <p className="text-sm text-muted-foreground">
                          Analyse des patterns comportementaux...
                        </p>
                      </motion.div>
                    ) : currentPredictions ? (
                      <motion.div
                        key="prediction"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <div className="text-center">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEmotionColor(currentPredictions.emotion)}`}>
                            {currentPredictions.emotion}
                          </div>
                          <div className="mt-2">
                            <div className="text-2xl font-bold">
                              {Math.round(currentPredictions.confidence * 100)}%
                            </div>
                            <p className={`text-sm ${getConfidenceLevel(currentPredictions.confidence).color}`}>
                              Confiance {getConfidenceLevel(currentPredictions.confidence).label}
                            </p>
                          </div>
                        </div>

                        <Progress value={currentPredictions.confidence * 100} className="w-full" />

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Source:</span>
                            <span>{currentPredictions.source}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Timestamp:</span>
                            <span>{new Date(currentPredictions.timestamp).toLocaleTimeString()}</span>
                          </div>
                          {currentPredictions.context && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Contexte:</span>
                              <span>{currentPredictions.context}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8 text-muted-foreground"
                      >
                        <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Aucune prédiction disponible</p>
                        <p className="text-sm">Cliquez sur "Nouvelle Prédiction" pour commencer</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {error && (
                    <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contrôles avancés */}
              <Card>
                <CardHeader>
                  <CardTitle>Contrôles Avancés</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Génération automatique</p>
                      <p className="text-sm text-muted-foreground">
                        Prédictions toutes les 30 secondes
                      </p>
                    </div>
                    <Switch
                      checked={autoGenerate}
                      onCheckedChange={setAutoGenerate}
                    />
                  </div>

                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={resetPredictions}
                      disabled={!currentPredictions}
                    >
                      Réinitialiser les prédictions
                    </Button>
                  </div>

                  <div className="pt-4 border-t space-y-3">
                    <h4 className="font-medium">Statistiques de session</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Prédictions:</div>
                        <div className="font-medium">
                          {currentPredictions ? 1 : 0}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Statut:</div>
                        <Badge variant={isLoading ? "secondary" : "default"} className="text-xs">
                          {isLoading ? "Analyse..." : "Prêt"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Recommandations Personnalisées
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recommendations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendations.map((rec) => (
                      <motion.div
                        key={rec.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 border rounded-lg space-y-3 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium">{rec.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {rec.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {rec.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Priorité: {rec.priority}/10
                            </span>
                          </div>
                          {rec.actionUrl && (
                            <Button size="sm" variant="outline">
                              {rec.actionLabel || 'Voir'}
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune recommandation disponible</p>
                    <p className="text-sm">Générez d'abord une prédiction pour recevoir des recommandations</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration des Fonctionnalités</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {availableFeatures.map((feature) => (
                  <div key={feature.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{feature.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          Priorité {feature.priority}/10
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                    <Switch
                      checked={feature.enabled}
                      onCheckedChange={(checked) => feature.toggleFeature(checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};