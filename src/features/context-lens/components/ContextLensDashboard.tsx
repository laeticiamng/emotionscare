/**
 * Context Lens Dashboard - Vue principale du module
 * Affiche insights, patterns et émotions en temps réel
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, TrendingUp, AlertCircle, FileText, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useContextLens, useEmotionPatterns, useWeeklyReport } from '../hooks/useContextLens';
import InsightCard from './InsightCard';
import EmotionGauge from './EmotionGauge';
import PatternCard from './PatternCard';
import { cn } from '@/lib/utils';

const ContextLensDashboard: React.FC = memo(() => {
  const { insights, unreadInsights, currentEmotions, dominantEmotion, markInsightRead } = useContextLens();
  const { patterns, detectPatterns, isDetecting } = useEmotionPatterns();
  const { report, status: reportStatus, progress: reportProgress, generate: generateReport } = useWeeklyReport();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Context Lens
          </h1>
          <p className="text-muted-foreground">
            Analyse des patterns émotionnels et insights personnalisés
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => detectPatterns()}
            disabled={isDetecting}
          >
            {isDetecting ? (
              <>
                <Activity className="h-4 w-4 mr-2 animate-pulse" />
                Analyse...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Détecter patterns
              </>
            )}
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={() => generateReport()}
            disabled={reportStatus === 'generating'}
          >
            <FileText className="h-4 w-4 mr-2" />
            {reportStatus === 'generating' ? 'Génération...' : 'Rapport hebdo'}
          </Button>
        </div>
      </div>

      {/* Report Progress */}
      {reportStatus === 'generating' && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-4">
            <div className="flex items-center gap-4">
              <Activity className="h-5 w-5 animate-pulse text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">Génération du rapport en cours...</p>
                <Progress value={reportProgress} className="mt-2" />
              </div>
              <span className="text-sm text-muted-foreground">{reportProgress}%</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Emotions Widget */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            État émotionnel actuel
          </CardTitle>
          <CardDescription>Analyse en temps réel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {currentEmotions && (
              <>
                <EmotionGauge
                  emotion="Joie"
                  value={currentEmotions.joy}
                  color="hsl(var(--success))"
                  isActive={dominantEmotion === 'joy'}
                />
                <EmotionGauge
                  emotion="Anxiété"
                  value={currentEmotions.anxiety}
                  color="hsl(var(--warning))"
                  isActive={dominantEmotion === 'anxiety'}
                />
                <EmotionGauge
                  emotion="Tristesse"
                  value={currentEmotions.sadness}
                  color="hsl(var(--info))"
                  isActive={dominantEmotion === 'sadness'}
                />
                <EmotionGauge
                  emotion="Colère"
                  value={currentEmotions.anger}
                  color="hsl(var(--destructive))"
                  isActive={dominantEmotion === 'anger'}
                />
                <EmotionGauge
                  emotion="Dégoût"
                  value={currentEmotions.disgust}
                  color="hsl(var(--muted-foreground))"
                  isActive={dominantEmotion === 'disgust'}
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insights" className="relative">
            Insights
            {unreadInsights > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                {unreadInsights}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          {insights.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Aucun insight disponible pour le moment.
                  <br />
                  Continuez à utiliser l'application pour générer des analyses.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {insights.map((insight, index) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <InsightCard
                    insight={insight}
                    onMarkRead={() => markInsightRead(insight.id)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Patterns Tab */}
        <TabsContent value="patterns" className="space-y-4">
          {patterns.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Aucun pattern émotionnel détecté.
                  <br />
                  Utilisez l'application régulièrement pour identifier vos tendances.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => detectPatterns()}
                  disabled={isDetecting}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Lancer l'analyse
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {patterns.map((pattern, index) => (
                <motion.div
                  key={pattern.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PatternCard pattern={pattern} />
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Historique émotionnel</CardTitle>
              <CardDescription>Évolution sur les 7 derniers jours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <Activity className="h-8 w-8 mr-2" />
                Graphique d'évolution à venir
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
});

ContextLensDashboard.displayName = 'ContextLensDashboard';

export default ContextLensDashboard;
