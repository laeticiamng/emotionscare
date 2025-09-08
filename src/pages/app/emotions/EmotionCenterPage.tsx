/**
 * 🎭 CENTRE ÉMOTIONNEL
 * Hub central pour l'analyse et la gestion des émotions
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Camera, 
  BarChart3, 
  Heart, 
  Smile,
  Frown,
  Meh,
  Angry,
  AlertCircle,
  Zap,
  TrendingUp,
  Calendar
} from 'lucide-react';

const emotionData = [
  { name: 'Joie', value: 65, color: 'bg-yellow-500', icon: Smile, trend: '+5%' },
  { name: 'Calme', value: 78, color: 'bg-blue-500', icon: Meh, trend: '+12%' },
  { name: 'Stress', value: 23, color: 'bg-red-500', icon: Frown, trend: '-8%' },
  { name: 'Énergie', value: 82, color: 'bg-green-500', icon: Zap, trend: '+15%' },
  { name: 'Surprise', value: 45, color: 'bg-purple-500', icon: AlertCircle, trend: '+2%' },
  { name: 'Colère', value: 12, color: 'bg-orange-500', icon: Angry, trend: '-18%' }
];

const recentAnalyses = [
  { time: 'Il y a 2h', emotion: 'Joie', confidence: 92, context: 'Réunion d\'équipe' },
  { time: 'Il y a 5h', emotion: 'Calme', confidence: 87, context: 'Pause déjeuner' },
  { time: 'Hier 18h', emotion: 'Stress', confidence: 78, context: 'Deadline projet' },
  { time: 'Hier 14h', emotion: 'Énergie', confidence: 95, context: 'Après exercice' }
];

export const EmotionCenterPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Centre Émotionnel - Analyse Avancée | EmotionsCare</title>
        <meta name="description" content="Centre de contrôle pour analyser, comprendre et optimiser vos émotions avec notre technologie IA avancée." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Centre d'Analyse Émotionnelle
            </h1>
            <p className="text-muted-foreground">
              Analysez et comprenez vos émotions en temps réel grâce à notre IA avancée
            </p>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 group border-primary/20">
              <CardContent className="p-6 text-center">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full w-fit mx-auto mb-4">
                  <Camera className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Scan Instantané</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Analysez votre état émotionnel en temps réel
                </p>
                <Button className="w-full">
                  Démarrer le scan
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 group border-primary/20">
              <CardContent className="p-6 text-center">
                <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full w-fit mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Analyse Détaillée</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Rapport complet de vos patterns émotionnels
                </p>
                <Button variant="outline" className="w-full">
                  Voir les rapports
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 group border-primary/20">
              <CardContent className="p-6 text-center">
                <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full w-fit mx-auto mb-4">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Recommandations</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Conseils personnalisés pour votre bien-être
                </p>
                <Button variant="outline" className="w-full">
                  Voir les conseils
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Current Emotional State */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  État Émotionnel Actuel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {emotionData.map((emotion, index) => (
                    <motion.div
                      key={emotion.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 ${emotion.color} rounded-lg`}>
                            <emotion.icon className="h-4 w-4 text-white" />
                          </div>
                          <span className="font-medium">{emotion.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={emotion.trend.startsWith('+') ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {emotion.trend}
                          </Badge>
                          <span className="text-sm font-semibold">{emotion.value}%</span>
                        </div>
                      </div>
                      <Progress value={emotion.value} className="h-2" />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Analyses Récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAnalyses.map((analysis, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{analysis.emotion}</span>
                          <Badge variant="outline" className="text-xs">
                            {analysis.confidence}% confiance
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {analysis.time} • {analysis.context}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  <Button variant="outline" className="w-full">
                    Voir l'historique complet
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Insights & Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Insights & Recommandations IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Patterns Détectés</h4>
                    <div className="space-y-3">
                      <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-sm">
                          <strong>Pic d'énergie matinal</strong> - Vous êtes plus productif entre 9h et 11h
                        </p>
                      </div>
                      <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-sm">
                          <strong>Amélioration du bien-être</strong> - +25% de joie cette semaine
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">Recommandations</h4>
                    <div className="space-y-3">
                      <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                        <p className="text-sm">
                          <strong>Session de méditation</strong> - Pour maintenir votre niveau de calme
                        </p>
                      </div>
                      <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                        <p className="text-sm">
                          <strong>Exercice de respiration</strong> - Réduire le stress de 15%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default EmotionCenterPage;