
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, Calendar, Target } from 'lucide-react';

const UnifiedEmotionCheckin: React.FC = () => {
  const [currentScore, setCurrentScore] = useState(7.5);
  const [weeklyAverage, setWeeklyAverage] = useState(7.2);
  const [streak, setStreak] = useState(5);

  const recentScans = [
    { date: 'Aujourd\'hui', score: 7.5, mood: 'Calme', time: '14:30' },
    { date: 'Hier', score: 8.2, mood: 'Joyeux', time: '09:15' },
    { date: 'Avant-hier', score: 6.8, mood: 'Pensif', time: '16:45' },
    { date: 'Il y a 3 jours', score: 7.1, mood: 'Neutre', time: '12:20' }
  ];

  const insights = [
    {
      title: 'Tendance positive',
      description: 'Votre bien-être s\'améliore cette semaine',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Régularité excellente',
      description: `${streak} jours consécutifs de check-ins`,
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      title: 'Objectif atteint',
      description: 'Score moyen supérieur à 7/10',
      icon: Target,
      color: 'text-purple-600'
    }
  ];

  const getMoodColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-blue-600 bg-blue-100';
    if (score >= 4) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Tableau de bord émotionnel
            </CardTitle>
            <CardDescription>
              Aperçu de votre bien-être émotionnel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {currentScore}/10
                </div>
                <div className="text-sm text-muted-foreground">Score actuel</div>
                <Progress value={currentScore * 10} className="mt-2" />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {weeklyAverage}/10
                </div>
                <div className="text-sm text-muted-foreground">Moyenne semaine</div>
                <div className="text-xs text-green-600 mt-1">+0.3 vs semaine dernière</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {streak}
                </div>
                <div className="text-sm text-muted-foreground">Jours consécutifs</div>
                <div className="text-xs text-muted-foreground mt-1">Record personnel</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Historique récent */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Historique récent</CardTitle>
              <CardDescription>
                Vos dernières analyses émotionnelles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentScans.map((scan, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{scan.date}</div>
                      <div className="text-xs text-muted-foreground">{scan.time}</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-xs px-2 py-1 rounded-full font-medium ${getMoodColor(scan.score)}`}>
                        {scan.mood}
                      </div>
                      <div className="text-sm font-semibold mt-1">{scan.score}/10</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Insights personnalisés</CardTitle>
              <CardDescription>
                Analyses de vos tendances émotionnelles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.map((insight, index) => {
                  const Icon = insight.icon;
                  return (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <Icon className={`h-5 w-5 mt-0.5 ${insight.color}`} />
                      <div>
                        <h4 className="font-medium text-sm">{insight.title}</h4>
                        <p className="text-xs text-muted-foreground">{insight.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recommandations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="bg-blue-50 dark:bg-blue-900/30">
          <CardHeader>
            <CardTitle>💡 Recommandations du jour</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-lg">
                <h4 className="font-medium text-sm mb-1">Maintenir votre élan</h4>
                <p className="text-xs text-muted-foreground">
                  Votre score est excellent ! Continuez vos pratiques de bien-être actuelles.
                </p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-800 rounded-lg">
                <h4 className="font-medium text-sm mb-1">Pause créative</h4>
                <p className="text-xs text-muted-foreground">
                  Accordez-vous 10 minutes de créativité pour stimuler votre humeur.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default UnifiedEmotionCheckin;
