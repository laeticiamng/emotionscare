import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import PremiumBackground from '@/components/premium/PremiumBackground';
import ImmersiveExperience from '@/components/premium/ImmersiveExperience';
import EnhancedEmotionScanner from '@/components/scan/EnhancedEmotionScanner';
import EmotionAnalyticsDashboard from '@/components/scan/EmotionAnalyticsDashboard';
import ScanHistoryViewer from '@/components/scan/ScanHistoryViewer';
import EmotionRecommendationEngine from '@/components/scan/EmotionRecommendationEngine';
import RealTimeEmotionStream from '@/components/scan/RealTimeEmotionStream';
import { useScanPage } from '@/hooks/useScanPage';
import { useEmotionAnalytics } from '@/hooks/useEmotionAnalytics';

const ScanPage: React.FC = () => {
  const { 
    currentEmotion, 
    recommendations, 
    alternativeRecommendations,
    scanHistory,
    handleScanComplete 
  } = useScanPage();
  
  const { 
    emotionTrends, 
    weeklyStats, 
    emotionPatterns,
    isLoading: analyticsLoading 
  } = useEmotionAnalytics();

  return (
    <div className="min-h-screen relative" data-testid="page-root">
      <PremiumBackground />
      
      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        <ImmersiveExperience
          title="Scanner Émotionnel IA Avancé"
          subtitle="Analysez et comprenez votre état émotionnel en temps réel avec notre IA de nouvelle génération"
          variant="scan"
        />

        {/* Stats rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Brain className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Scans Today</p>
                  <p className="text-xl font-bold">{scanHistory.length}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mood Trend</p>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    +12% Positive
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y:20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Accuracy</p>
                  <p className="text-xl font-bold">96.2%</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Insights</p>
                  <p className="text-xl font-bold">{recommendations.length}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Tabs defaultValue="scan" className="mt-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="scan">Scanner</TabsTrigger>
            <TabsTrigger value="realtime">Temps Réel</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
            <TabsTrigger value="insights">Insights IA</TabsTrigger>
          </TabsList>

          <TabsContent value="scan" className="space-y-6 mt-6">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Suspense fallback={<Skeleton className="h-96" />}>
                  <EnhancedEmotionScanner onScanComplete={handleScanComplete} />
                </Suspense>
              </div>
              <div className="space-y-6">
                <Suspense fallback={<Skeleton className="h-64" />}>
                  <EmotionRecommendationEngine 
                    currentEmotion={currentEmotion}
                    recommendations={recommendations}
                    alternativeRecommendations={alternativeRecommendations}
                  />
                </Suspense>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="realtime" className="mt-6">
            <Suspense fallback={<Skeleton className="h-96" />}>
              <RealTimeEmotionStream />
            </Suspense>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Suspense fallback={<Skeleton className="h-96" />}>
              <EmotionAnalyticsDashboard 
                trends={emotionTrends}
                weeklyStats={weeklyStats}
                patterns={emotionPatterns}
                isLoading={analyticsLoading}
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Suspense fallback={<Skeleton className="h-64" />}>
              <ScanHistoryViewer history={scanHistory} />
            </Suspense>
          </TabsContent>

          <TabsContent value="insights" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Insights Personnalisés IA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-blue-500">
                    <h4 className="font-semibold mb-2">Pattern Détecté</h4>
                    <p className="text-sm text-muted-foreground">
                      Vos émotions positives augmentent de 23% le matin entre 9h-11h. 
                      C'est votre moment optimal pour les tâches créatives.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border-l-4 border-green-500">
                    <h4 className="font-semibold mb-2">Recommandation Intelligente</h4>
                    <p className="text-sm text-muted-foreground">
                      Basé sur vos patterns, nous suggérons une session de méditation 
                      à 15h pour maintenir votre équilibre émotionnel.
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border-l-4 border-amber-500">
                    <h4 className="font-semibold mb-2">Alerte Prédictive</h4>
                    <p className="text-sm text-muted-foreground">
                      L'IA prédit une baisse de stress de 18% si vous prenez une pause 
                      de 10 minutes dans les prochaines 30 minutes.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Objectifs de Bien-être</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Équilibre émotionnel quotidien</span>
                      <span>7/10</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: '70%' }} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Moments de calme</span>
                      <span>5/8</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full" style={{ width: '62.5%' }} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Pics d'énergie positive</span>
                      <span>12/15</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full" style={{ width: '80%' }} />
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