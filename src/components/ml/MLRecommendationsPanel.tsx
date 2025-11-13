import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMLRecommendations } from '@/hooks/useMLRecommendations';
import { Brain, TrendingUp, Sparkles, Settings, Calendar, Clock, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MLRecommendationsPanelProps {
  currentEmotion?: string;
  userId?: string;
  onApplySunoParams?: (params: any) => void;
}

export const MLRecommendationsPanel: React.FC<MLRecommendationsPanelProps> = ({
  currentEmotion = 'calm',
  userId,
  onApplySunoParams,
}) => {
  const {
    isTraining,
    predictions,
    optimizedParams,
    proactiveSuggestions,
    userHistory,
    trainAndPredict,
    optimizeSunoForEmotion,
    getProactiveSuggestions,
  } = useMLRecommendations(userId);

  const [activeTab, setActiveTab] = useState('predictions');

  const handleTrainAndPredict = async () => {
    await trainAndPredict(currentEmotion);
    await getProactiveSuggestions(currentEmotion);
  };

  const handleOptimizeSuno = async () => {
    const params = await optimizeSunoForEmotion(currentEmotion);
    if (params && onApplySunoParams) {
      onApplySunoParams(params);
    }
  };

  return (
    <Card className="w-full bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Recommandations ML Avancées</CardTitle>
              <CardDescription>
                Intelligence prédictive & auto-optimisation Suno
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="gap-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            {userHistory.length} sessions
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Actions rapides */}
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={handleTrainAndPredict}
              disabled={isTraining || userHistory.length === 0}
              size="sm"
              variant="default"
            >
              {isTraining ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Entraînement...
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Générer Prédictions
                </>
              )}
            </Button>

            <Button
              onClick={handleOptimizeSuno}
              disabled={isTraining || userHistory.length === 0}
              size="sm"
              variant="outline"
            >
              <Settings className="h-4 w-4 mr-2" />
              Optimiser Suno
            </Button>

            <Button
              onClick={() => getProactiveSuggestions(currentEmotion)}
              disabled={isTraining}
              size="sm"
              variant="outline"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Suggestions
            </Button>
          </div>

          {/* Tabs de contenu */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="predictions">
                <Calendar className="h-4 w-4 mr-2" />
                Prédictions
              </TabsTrigger>
              <TabsTrigger value="suggestions">
                <Target className="h-4 w-4 mr-2" />
                Suggestions
              </TabsTrigger>
              <TabsTrigger value="optimization">
                <Settings className="h-4 w-4 mr-2" />
                Optimisation
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[400px] mt-4">
              <TabsContent value="predictions" className="space-y-4">
                <AnimatePresence mode="wait">
                  {predictions ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      {/* Patterns émotionnels */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Patterns Détectés</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <div className="text-sm font-medium mb-2">Cycles:</div>
                            {predictions.emotionalPatterns.cycles.map((cycle, i) => (
                              <Badge key={i} variant="secondary" className="mr-2 mb-2">
                                {cycle}
                              </Badge>
                            ))}
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-2">Triggers:</div>
                            {predictions.emotionalPatterns.triggers.map((trigger, i) => (
                              <Badge key={i} variant="outline" className="mr-2 mb-2">
                                {trigger}
                              </Badge>
                            ))}
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-2">Moments critiques:</div>
                            {predictions.emotionalPatterns.criticalMoments.map((moment, i) => (
                              <Badge key={i} variant="destructive" className="mr-2 mb-2">
                                <Clock className="h-3 w-3 mr-1" />
                                {moment}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Prédictions 7 jours */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Prédictions 7 prochains jours</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {predictions.nextSevenDays.map((day, i) => (
                            <div key={i} className="border-l-2 border-primary/30 pl-3 py-2">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-sm">
                                  {new Date(day.date).toLocaleDateString('fr-FR', { 
                                    weekday: 'short', 
                                    day: 'numeric', 
                                    month: 'short' 
                                  })}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {Math.round(day.confidence * 100)}% confiance
                                </Badge>
                              </div>
                              {Object.entries(day.predictedEmotions)
                                .sort(([, a], [, b]) => b - a)
                                .slice(0, 3)
                                .map(([emotion, prob]) => (
                                  <div key={emotion} className="mb-1">
                                    <div className="flex justify-between text-xs mb-1">
                                      <span className="capitalize">{emotion}</span>
                                      <span>{Math.round(prob * 100)}%</span>
                                    </div>
                                    <Progress value={prob * 100} className="h-1" />
                                  </div>
                                ))}
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      {/* Recommandations */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Sessions Recommandées</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {predictions.recommendations.map((rec, i) => (
                            <div key={i} className="p-3 rounded-lg bg-muted/50 border">
                              <div className="flex items-start justify-between mb-2">
                                <div className="font-medium text-sm">{rec.sessionType}</div>
                                <Badge variant="secondary">{rec.duration} min</Badge>
                              </div>
                              <div className="text-xs text-muted-foreground mb-1">
                                <Clock className="h-3 w-3 inline mr-1" />
                                {rec.timing}
                              </div>
                              <div className="text-xs">{rec.expectedBenefit}</div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12 text-muted-foreground"
                    >
                      <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Cliquez sur "Générer Prédictions" pour analyser votre historique</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>

              <TabsContent value="suggestions" className="space-y-4">
                <AnimatePresence mode="wait">
                  {proactiveSuggestions.length > 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      {proactiveSuggestions.map((suggestion, i) => (
                        <motion.div
                          key={suggestion.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Card className="border-l-4 border-l-primary">
                            <CardContent className="pt-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Sparkles className="h-4 w-4 text-primary" />
                                    <span className="font-medium">{suggestion.title}</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {suggestion.description}
                                  </p>
                                </div>
                                <Badge 
                                  variant={
                                    suggestion.priority === 'high' ? 'destructive' :
                                    suggestion.priority === 'medium' ? 'default' : 'secondary'
                                  }
                                >
                                  {suggestion.priority}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {suggestion.timing}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Target className="h-3 w-3" />
                                  {suggestion.emotionTarget}
                                </span>
                                <span>{suggestion.estimatedDuration} min</span>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12 text-muted-foreground"
                    >
                      <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Aucune suggestion proactive pour le moment</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>

              <TabsContent value="optimization" className="space-y-4">
                <AnimatePresence mode="wait">
                  {optimizedParams ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">
                            Paramètres Suno Optimisés pour "{optimizedParams.emotion}"
                          </CardTitle>
                          <CardDescription>
                            Basés sur {userHistory.length} sessions analysées
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="text-sm font-medium text-muted-foreground">BPM Optimal</div>
                              <div className="text-2xl font-bold">{optimizedParams.optimalBpm}</div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm font-medium text-muted-foreground">Intensité</div>
                              <div className="text-2xl font-bold">
                                {Math.round(optimizedParams.intensity * 100)}%
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm font-medium">Style Musical</div>
                            <Badge variant="secondary" className="text-base">
                              {optimizedParams.optimalStyle}
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm font-medium">Mood</div>
                            <Badge variant="outline" className="text-base">
                              {optimizedParams.optimalMood}
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm font-medium">Tags Recommandés</div>
                            <div className="flex flex-wrap gap-2">
                              {optimizedParams.optimalTags.map((tag, i) => (
                                <Badge key={i} variant="secondary">{tag}</Badge>
                              ))}
                            </div>
                          </div>

                          <div className="pt-4 border-t">
                            <div className="text-sm text-muted-foreground mb-3">
                              Confiance: {Math.round(optimizedParams.confidence * 100)}%
                            </div>
                            <Progress value={optimizedParams.confidence * 100} />
                          </div>

                          {onApplySunoParams && (
                            <Button 
                              onClick={() => onApplySunoParams(optimizedParams)}
                              className="w-full"
                            >
                              <Settings className="h-4 w-4 mr-2" />
                              Appliquer ces paramètres
                            </Button>
                          )}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Raisonnement ML</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {optimizedParams.reasoning}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12 text-muted-foreground"
                    >
                      <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Cliquez sur "Optimiser Suno" pour générer les paramètres optimaux</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};
