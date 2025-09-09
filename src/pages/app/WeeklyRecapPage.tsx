import React, { useState, useEffect } from 'react';
import { CalendarDays, TrendingUp, Award, RefreshCw, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

interface WeeklyInsight {
  id: string;
  title: string;
  description: string;
  type: 'progress' | 'habit' | 'recommendation';
  icon: any;
  color: string;
}

interface WeekSummary {
  weekNumber: number;
  weekStart: Date;
  weekEnd: Date;
  sessionsCount: number;
  totalMinutes: number;
  topModule: string;
  insights: WeeklyInsight[];
  mood: 'positive' | 'stable' | 'variable';
  hasEnoughData: boolean;
}

const WeeklyRecapPage = () => {
  const [currentWeekSummary, setCurrentWeekSummary] = useState<WeekSummary | null>(null);
  const [selectedWeekOffset, setSelectedWeekOffset] = useState(0); // 0 = current week, -1 = last week, etc.
  const [isGenerating, setIsGenerating] = useState(false);

  const generateWeeklySummary = (weekOffset: number = 0): WeekSummary => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + (weekOffset * 7)); // Dimanche de la semaine
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    // Simuler des données basées sur la semaine
    const baseSessionCount = Math.max(0, Math.floor(Math.random() * 15) + weekOffset * 2);
    const hasEnoughData = baseSessionCount >= 3;

    const possibleInsights: WeeklyInsight[] = [
      {
        id: 'breathing-progress',
        title: 'Respiration plus régulière',
        description: 'Vous avez pratiqué la respiration guidée 4 fois cette semaine. Votre régularité s\'améliore.',
        type: 'progress',
        icon: TrendingUp,
        color: 'from-green-500 to-emerald-500'
      },
      {
        id: 'music-habit',
        title: 'Nouvelle habitude musicale',
        description: 'La musicothérapie devient une routine. Vous trouvez vos ambiances préférées.',
        type: 'habit',
        icon: Award,
        color: 'from-purple-500 to-pink-500'
      },
      {
        id: 'scan-consistency',
        title: 'Meilleure conscience émotionnelle',
        description: 'Vos scans émotionnels montrent une progression dans la reconnaissance de vos états.',
        type: 'progress',
        icon: Sparkles,
        color: 'from-blue-500 to-cyan-500'
      },
      {
        id: 'journal-depth',
        title: 'Expression plus profonde',
        description: 'Vos entrées de journal gagnent en richesse et clarté d\'expression.',
        type: 'progress',
        icon: TrendingUp,
        color: 'from-orange-500 to-red-500'
      },
      {
        id: 'evening-routine',
        title: 'Routine du soir établie',
        description: 'Vous utilisez les outils de détente principalement en soirée. Excellente régularité.',
        type: 'habit',
        icon: Award,
        color: 'from-indigo-500 to-purple-500'
      },
      {
        id: 'stress-management',
        title: 'Gestion du stress améliorée',
        description: 'Flash Glow vous aide dans les moments intenses. Outil de secours bien adopté.',
        type: 'recommendation',
        icon: TrendingUp,
        color: 'from-yellow-500 to-amber-500'
      }
    ];

    const selectedInsights = hasEnoughData 
      ? possibleInsights.slice(0, 3).map(insight => ({
          ...insight,
          id: `${insight.id}-${weekOffset}`
        }))
      : [];

    return {
      weekNumber: getWeekNumber(weekStart),
      weekStart,
      weekEnd,
      sessionsCount: baseSessionCount,
      totalMinutes: baseSessionCount * (Math.floor(Math.random() * 20) + 10),
      topModule: ['Respiration', 'Musicothérapie', 'Scan émotionnel', 'Journal'][Math.floor(Math.random() * 4)],
      insights: selectedInsights,
      mood: hasEnoughData 
        ? (['positive', 'stable', 'variable'] as const)[Math.floor(Math.random() * 3)]
        : 'stable',
      hasEnoughData
    };
  };

  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const refreshRecap = async () => {
    setIsGenerating(true);
    
    // Simuler génération
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newSummary = generateWeeklySummary(selectedWeekOffset);
    setCurrentWeekSummary(newSummary);
    setIsGenerating(false);
  };

  // Charger la semaine au changement d'offset
  useEffect(() => {
    const summary = generateWeeklySummary(selectedWeekOffset);
    setCurrentWeekSummary(summary);
  }, [selectedWeekOffset]);

  const formatWeekRange = (weekStart: Date, weekEnd: Date) => {
    const startStr = weekStart.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short' 
    });
    const endStr = weekEnd.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
    return `${startStr} - ${endStr}`;
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'positive': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'variable': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300';
    }
  };

  const getMoodLabel = (mood: string) => {
    switch (mood) {
      case 'positive': return 'Tendance positive';
      case 'variable': return 'Évolution variable';
      default: return 'Stabilité émotionnelle';
    }
  };

  const getWeekTitle = (offset: number) => {
    if (offset === 0) return 'Cette semaine';
    if (offset === -1) return 'Semaine dernière';
    return `Il y a ${Math.abs(offset)} semaines`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header avec navigation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
            Weekly Recap
          </h1>
          <p className="text-muted-foreground mb-6">
            Votre synthèse hebdomadaire personnalisée
          </p>
          
          {/* Navigation semaines */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <Button
              onClick={() => setSelectedWeekOffset(selectedWeekOffset - 1)}
              variant="outline"
              size="sm"
              disabled={selectedWeekOffset <= -4} // Limite à 4 semaines passées
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="text-center min-w-[200px]">
              <div className="font-semibold">{getWeekTitle(selectedWeekOffset)}</div>
              {currentWeekSummary && (
                <div className="text-sm text-muted-foreground">
                  {formatWeekRange(currentWeekSummary.weekStart, currentWeekSummary.weekEnd)}
                </div>
              )}
            </div>
            
            <Button
              onClick={() => setSelectedWeekOffset(selectedWeekOffset + 1)}
              variant="outline" 
              size="sm"
              disabled={selectedWeekOffset >= 0} // Pas plus récent que cette semaine
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <Button
            onClick={refreshRecap}
            disabled={isGenerating}
            variant="secondary"
            size="sm"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Mise à jour...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </>
            )}
          </Button>
        </motion.div>

        <AnimatePresence mode="wait">
          {currentWeekSummary && (
            <motion.div
              key={selectedWeekOffset}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {!currentWeekSummary.hasEnoughData ? (
                /* Pas assez de données */
                <Card className="p-8 text-center bg-card/50 backdrop-blur-sm border-muted">
                  <CalendarDays className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Peu de sessions cette semaine</h3>
                  <p className="text-muted-foreground mb-6">
                    Nous avons besoin de plus d'activité pour générer un récapitulatif personnalisé.<br />
                    Utilisez quelques modules cette semaine pour voir apparaître vos insights.
                  </p>
                  <div className="text-sm text-muted-foreground">
                    Sessions enregistrées : {currentWeekSummary.sessionsCount} (minimum recommandé : 3)
                  </div>
                </Card>
              ) : (
                /* Récapitulatif complet */
                <>
                  {/* Statistiques de la semaine */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="p-6 text-center bg-card/50 backdrop-blur-sm border-muted">
                      <div className="text-3xl font-bold text-primary mb-2">
                        {currentWeekSummary.sessionsCount}
                      </div>
                      <div className="text-sm text-muted-foreground">Sessions pratiquées</div>
                    </Card>
                    
                    <Card className="p-6 text-center bg-card/50 backdrop-blur-sm border-muted">
                      <div className="text-3xl font-bold text-primary mb-2">
                        {currentWeekSummary.totalMinutes}
                      </div>
                      <div className="text-sm text-muted-foreground">Minutes de bien-être</div>
                    </Card>
                    
                    <Card className="p-6 text-center bg-card/50 backdrop-blur-sm border-muted">
                      <div className="text-lg font-semibold text-primary mb-2">
                        {currentWeekSummary.topModule}
                      </div>
                      <div className="text-sm text-muted-foreground">Module préféré</div>
                    </Card>
                  </div>

                  {/* Badge d'humeur */}
                  <div className="flex justify-center">
                    <Badge className={`${getMoodColor(currentWeekSummary.mood)} px-4 py-2`}>
                      {getMoodLabel(currentWeekSummary.mood)}
                    </Badge>
                  </div>

                  {/* Insights principales */}
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-center mb-6">
                      Vos 3 insights de la semaine
                    </h2>
                    
                    {currentWeekSummary.insights.map((insight, index) => {
                      const Icon = insight.icon;
                      
                      return (
                        <motion.div
                          key={insight.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.2 }}
                        >
                          <Card className="p-6 bg-card/30 backdrop-blur-sm border-muted">
                            <div className="flex gap-4">
                              <div className={`w-12 h-12 bg-gradient-to-r ${insight.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                                <Icon className="w-6 h-6 text-white" />
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold">{insight.title}</h3>
                                  <Badge variant="outline" className="text-xs">
                                    {insight.type === 'progress' && 'Progrès'}
                                    {insight.type === 'habit' && 'Habitude'}
                                    {insight.type === 'recommendation' && 'Conseil'}
                                  </Badge>
                                </div>
                                <p className="text-muted-foreground">{insight.description}</p>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Message d'encouragement */}
                  <Card className="p-6 text-center bg-gradient-to-r from-primary/10 to-primary/20 border-primary/20">
                    <Sparkles className="w-8 h-8 mx-auto text-primary mb-3" />
                    <p className="text-foreground font-medium">
                      {selectedWeekOffset === 0 
                        ? "Continuez sur cette belle lancée ! Chaque session compte pour votre bien-être."
                        : "Belle régularité cette semaine-là ! Votre constance dans les pratiques porte ses fruits."
                      }
                    </p>
                  </Card>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Informations */}
        <Card className="mt-8 p-6 bg-card/20 backdrop-blur-sm border-muted">
          <h3 className="font-semibold mb-3">À propos du Weekly Recap</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Synthèse automatique de vos pratiques hebdomadaires</li>
            <li>• Analyse bienveillante sans jugement ni comparaison</li>
            <li>• Focus sur vos progrès et habitudes positives</li>
            <li>• Génération basée sur minimum 3 sessions par semaine</li>
            <li>• Historique accessible jusqu'à 4 semaines passées</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default WeeklyRecapPage;