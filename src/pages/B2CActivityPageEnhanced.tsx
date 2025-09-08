import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { 
  Activity, 
  TrendingUp, 
  Clock, 
  Target,
  Calendar as CalendarIcon,
  BarChart3,
  LineChart,
  PieChart,
  Award,
  Flame,
  Zap,
  Heart,
  Brain,
  Eye,
  Moon,
  Sun,
  Coffee,
  Sparkles,
  Trophy
} from 'lucide-react';

interface ActivityData {
  date: string;
  emotionScans: number;
  musicSessions: number;
  breathingSessions: number;
  journalEntries: number;
  coachInteractions: number;
  stressReduction: number;
  focusImprovement: number;
  energyLevel: number;
  sleepQuality: number;
  totalMinutes: number;
}

interface WeeklyStats {
  week: string;
  totalActivities: number;
  avgStressReduction: number;
  avgFocusImprovement: number;
  streakDays: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  completed: boolean;
  progress: number;
  maxProgress: number;
  date?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export default function B2CActivityPageEnhanced() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [selectedMetric, setSelectedMetric] = useState<string>('all');

  // Mock data - would come from API
  const [activityData] = useState<ActivityData[]>([
    {
      date: '2025-01-08',
      emotionScans: 3,
      musicSessions: 2,
      breathingSessions: 1,
      journalEntries: 1,
      coachInteractions: 4,
      stressReduction: 25,
      focusImprovement: 18,
      energyLevel: 78,
      sleepQuality: 85,
      totalMinutes: 45
    },
    {
      date: '2025-01-07',
      emotionScans: 2,
      musicSessions: 3,
      breathingSessions: 2,
      journalEntries: 0,
      coachInteractions: 2,
      stressReduction: 30,
      focusImprovement: 22,
      energyLevel: 82,
      sleepQuality: 78,
      totalMinutes: 38
    },
    // ... more data
  ]);

  const [weeklyStats] = useState<WeeklyStats[]>([
    { week: 'Cette semaine', totalActivities: 28, avgStressReduction: 27, avgFocusImprovement: 20, streakDays: 5 },
    { week: 'Semaine passée', totalActivities: 25, avgStressReduction: 22, avgFocusImprovement: 15, streakDays: 4 },
    { week: 'Il y a 2 sem.', totalActivities: 31, avgStressReduction: 35, avgFocusImprovement: 28, streakDays: 7 },
  ]);

  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'Première Semaine',
      description: 'Complétez 7 jours d\'activités',
      icon: Calendar,
      completed: true,
      progress: 7,
      maxProgress: 7,
      date: '2025-01-01',
      rarity: 'common'
    },
    {
      id: '2',
      title: 'Maître de la Sérénité',
      description: 'Atteignez 100 sessions de méditation',
      icon: Brain,
      completed: false,
      progress: 67,
      maxProgress: 100,
      rarity: 'epic'
    },
    {
      id: '3',
      title: 'Explorateur Émotionnel',
      description: 'Effectuez 50 scans d\'émotion',
      icon: Eye,
      completed: true,
      progress: 50,
      maxProgress: 50,
      date: '2025-01-05',
      rarity: 'rare'
    },
    {
      id: '4',
      title: 'Légende du Bien-être',
      description: 'Maintenez une série de 30 jours',
      icon: Trophy,
      completed: false,
      progress: 12,
      maxProgress: 30,
      rarity: 'legendary'
    }
  ]);

  const currentStreak = 12;
  const longestStreak = 18;

  const getTodayData = () => {
    const today = new Date().toISOString().split('T')[0];
    return activityData.find(data => data.date === today) || {
      date: today,
      emotionScans: 0,
      musicSessions: 0,
      breathingSessions: 0,
      journalEntries: 0,
      coachInteractions: 0,
      stressReduction: 0,
      focusImprovement: 0,
      energyLevel: 0,
      sleepQuality: 0,
      totalMinutes: 0
    };
  };

  const todayData = getTodayData();

  const activityTypes = [
    { key: 'emotionScans', label: 'Scans Émotion', icon: Eye, color: 'hsl(221.2 83.2% 53.3%)' },
    { key: 'musicSessions', label: 'Sessions Musique', icon: Heart, color: 'hsl(142 76% 36%)' },
    { key: 'breathingSessions', label: 'Respiration', icon: Zap, color: 'hsl(45 93% 47%)' },
    { key: 'journalEntries', label: 'Journal', icon: Coffee, color: 'hsl(250 100% 60%)' },
    { key: 'coachInteractions', label: 'Coach IA', icon: Brain, color: 'hsl(0 84.2% 60.2%)' }
  ];

  const metrics = [
    { key: 'stressReduction', label: 'Réduction Stress', icon: Heart, unit: '%', color: 'hsl(142 76% 36%)' },
    { key: 'focusImprovement', label: 'Amélioration Focus', icon: Target, unit: '%', color: 'hsl(221.2 83.2% 53.3%)' },
    { key: 'energyLevel', label: 'Niveau Énergie', icon: Zap, unit: '%', color: 'hsl(45 93% 47%)' },
    { key: 'sleepQuality', label: 'Qualité Sommeil', icon: Moon, unit: '%', color: 'hsl(250 100% 60%)' }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'hsl(var(--muted-foreground))';
      case 'rare': return 'hsl(221.2 83.2% 53.3%)';
      case 'epic': return 'hsl(250 100% 60%)';
      case 'legendary': return 'hsl(45 93% 47%)';
      default: return 'hsl(var(--foreground))';
    }
  };

  const getTotalActivitiesToday = () => {
    return todayData.emotionScans + todayData.musicSessions + 
           todayData.breathingSessions + todayData.journalEntries + 
           todayData.coachInteractions;
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-primary/10 backdrop-blur-sm">
              <Activity className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Suivi d'Activité
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Visualisez vos progrès et découvrez vos habitudes de bien-être
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Card className="premium-card">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Flame className="h-8 w-8 text-orange-500" />
              </div>
              <div className="text-2xl font-bold">{currentStreak}</div>
              <div className="text-sm text-muted-foreground">Série Actuelle</div>
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold">{longestStreak}</div>
              <div className="text-sm text-muted-foreground">Record</div>
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="h-8 w-8 text-blue-500" />
              </div>
              <div className="text-2xl font-bold">{getTotalActivitiesToday()}</div>
              <div className="text-sm text-muted-foreground">Aujourd'hui</div>
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-8 w-8 text-green-500" />
              </div>
              <div className="text-2xl font-bold">{todayData.totalMinutes}</div>
              <div className="text-sm text-muted-foreground">Minutes</div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* View Mode Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="premium-card p-6"
            >
              <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="daily">Quotidien</TabsTrigger>
                  <TabsTrigger value="weekly">Hebdomadaire</TabsTrigger>
                  <TabsTrigger value="monthly">Mensuel</TabsTrigger>
                </TabsList>

                <TabsContent value="daily" className="space-y-6 mt-6">
                  <h3 className="text-lg font-semibold">Activités d'Aujourd'hui</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {activityTypes.map((type) => {
                      const value = todayData[type.key as keyof ActivityData] as number;
                      const Icon = type.icon;
                      return (
                        <div key={type.key} className="p-4 rounded-xl bg-card border">
                          <div className="flex items-center gap-3 mb-2">
                            <Icon className="h-5 w-5" style={{ color: type.color }} />
                            <span className="text-sm font-medium">{type.label}</span>
                          </div>
                          <div className="text-2xl font-bold" style={{ color: type.color }}>
                            {value}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Métriques de Bien-être</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {metrics.map((metric) => {
                        const value = todayData[metric.key as keyof ActivityData] as number;
                        const Icon = metric.icon;
                        return (
                          <div key={metric.key} className="p-4 rounded-xl bg-card border">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" style={{ color: metric.color }} />
                                <span className="text-sm">{metric.label}</span>
                              </div>
                              <span className="font-bold" style={{ color: metric.color }}>
                                {value}{metric.unit}
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${value}%`,
                                  backgroundColor: metric.color
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="weekly" className="space-y-6 mt-6">
                  <h3 className="text-lg font-semibold">Progression Hebdomadaire</h3>
                  <div className="space-y-4">
                    {weeklyStats.map((week, index) => (
                      <motion.div
                        key={week.week}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-xl bg-card border"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold">{week.week}</h4>
                          <Badge>{week.totalActivities} activités</Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">
                              -{week.avgStressReduction}%
                            </div>
                            <div className="text-xs text-muted-foreground">Stress</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">
                              +{week.avgFocusImprovement}%
                            </div>
                            <div className="text-xs text-muted-foreground">Focus</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-orange-600">
                              {week.streakDays}j
                            </div>
                            <div className="text-xs text-muted-foreground">Série</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="monthly" className="space-y-6 mt-6">
                  <h3 className="text-lg font-semibold">Vue Mensuelle</h3>
                  <div className="p-6 rounded-xl bg-card border">
                    <div className="text-center space-y-4">
                      <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Graphiques détaillés et analyses mensuelles disponibles prochainement
                      </p>
                      <Button variant="outline">
                        Activer les Analytics Avancés
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="premium-card p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Activité Récente</h3>
              <div className="space-y-3">
                <AnimatePresence mode="sync">
                  {[
                    { time: '14:30', action: 'Session de respiration guidée', duration: '10 min', icon: Zap, color: 'hsl(45 93% 47%)' },
                    { time: '12:15', action: 'Écoute musicale thérapeutique', duration: '25 min', icon: Heart, color: 'hsl(142 76% 36%)' },
                    { time: '09:45', action: 'Scan émotionnel matinal', duration: '3 min', icon: Eye, color: 'hsl(221.2 83.2% 53.3%)' },
                    { time: '08:30', action: 'Conversation avec le coach IA', duration: '15 min', icon: Brain, color: 'hsl(250 100% 60%)' },
                  ].map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-4 p-3 rounded-lg bg-accent/30"
                      >
                        <div className="p-2 rounded-lg" style={{ backgroundColor: `${activity.color}20` }}>
                          <Icon className="h-4 w-4" style={{ color: activity.color }} />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{activity.action}</div>
                          <div className="text-xs text-muted-foreground">{activity.time}</div>
                        </div>
                        <Badge variant="outline">{activity.duration}</Badge>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Calendar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="premium-card p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Calendrier</h3>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="premium-card p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Succès</h3>
              </div>

              <div className="space-y-3">
                {achievements.slice(0, 3).map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className={`p-4 rounded-xl border transition-all ${
                        achievement.completed 
                          ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' 
                          : 'bg-card'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          achievement.completed ? 'bg-green-500' : 'bg-muted'
                        }`}>
                          <Icon 
                            className="h-4 w-4" 
                            style={{ 
                              color: achievement.completed 
                                ? 'white' 
                                : getRarityColor(achievement.rarity) 
                            }} 
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm truncate">
                              {achievement.title}
                            </h4>
                            {achievement.completed && (
                              <Sparkles className="h-3 w-3 text-green-500" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {achievement.description}
                          </p>
                          
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>{achievement.progress}/{achievement.maxProgress}</span>
                              <span>{Math.round((achievement.progress / achievement.maxProgress) * 100)}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5">
                              <div 
                                className="h-1.5 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                                  backgroundColor: achievement.completed 
                                    ? 'hsl(142 76% 36%)' 
                                    : getRarityColor(achievement.rarity)
                                }}
                              />
                            </div>
                          </div>

                          {achievement.completed && achievement.date && (
                            <div className="text-xs text-green-600 dark:text-green-400 mt-2">
                              Débloqué le {new Date(achievement.date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <Button variant="outline" className="w-full mt-4">
                Voir tous les succès
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}