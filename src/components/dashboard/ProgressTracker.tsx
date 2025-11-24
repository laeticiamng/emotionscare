// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Trophy,
  Target,
  Flame,
  Star,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Award,
  CheckCircle,
  Circle,
  Zap,
  Heart,
  Brain,
  Music,
  BookOpen,
  Wind,
  Users,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'wellness' | 'mindfulness' | 'activity' | 'social';
  target: number;
  current: number;
  unit: string;
  deadline?: string;
  streak?: number;
  isCompleted: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

interface DailyProgress {
  date: string;
  scans: number;
  minutes: number;
  activities: number;
  score: number;
}

const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Scan quotidien',
    description: 'Effectuer un scan motionnel chaque jour',
    category: 'wellness',
    target: 7,
    current: 5,
    unit: 'jours',
    streak: 5,
    isCompleted: false,
  },
  {
    id: '2',
    title: 'Minutes de mditation',
    description: 'Atteindre 30 minutes de mditation cette semaine',
    category: 'mindfulness',
    target: 30,
    current: 22,
    unit: 'min',
    isCompleted: false,
  },
  {
    id: '3',
    title: 'Sessions de respiration',
    description: 'Complter 10 sessions de respiration',
    category: 'activity',
    target: 10,
    current: 10,
    unit: 'sessions',
    isCompleted: true,
  },
  {
    id: '4',
    title: 'Interactions communautaires',
    description: 'Participer  5 discussions communautaires',
    category: 'social',
    target: 5,
    current: 3,
    unit: 'interactions',
    isCompleted: false,
  },
];

const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'Premier Scan',
    description: 'Effectuer votre premier scan motionnel',
    icon: '🔍',
    rarity: 'common',
    unlockedAt: '2024-11-01',
    progress: 1,
    maxProgress: 1,
  },
  {
    id: '2',
    title: 'Srie de 7 jours',
    description: 'Maintenir une srie de 7 jours conscutifs',
    icon: '🔥',
    rarity: 'rare',
    unlockedAt: '2024-11-10',
    progress: 7,
    maxProgress: 7,
  },
  {
    id: '3',
    title: 'Matre Zen',
    description: 'Complter 50 sessions de mditation',
    icon: '🧘',
    rarity: 'epic',
    progress: 35,
    maxProgress: 50,
  },
  {
    id: '4',
    title: 'Lgende du Bien-tre',
    description: 'Atteindre 100 jours d\'utilisation',
    icon: '👑',
    rarity: 'legendary',
    progress: 42,
    maxProgress: 100,
  },
];

const mockDailyProgress: DailyProgress[] = [
  { date: 'Lun', scans: 2, minutes: 15, activities: 3, score: 72 },
  { date: 'Mar', scans: 1, minutes: 20, activities: 4, score: 78 },
  { date: 'Mer', scans: 3, minutes: 25, activities: 5, score: 82 },
  { date: 'Jeu', scans: 2, minutes: 18, activities: 3, score: 75 },
  { date: 'Ven', scans: 2, minutes: 30, activities: 6, score: 85 },
  { date: 'Sam', scans: 1, minutes: 35, activities: 4, score: 88 },
  { date: 'Dim', scans: 2, minutes: 22, activities: 3, score: 80 },
];

const mockRadarData = [
  { subject: 'Bien-tre', current: 85, previous: 78, fullMark: 100 },
  { subject: 'Stress', current: 35, previous: 45, fullMark: 100 },
  { subject: 'nergie', current: 78, previous: 72, fullMark: 100 },
  { subject: 'Concentration', current: 82, previous: 75, fullMark: 100 },
  { subject: 'Sommeil', current: 70, previous: 65, fullMark: 100 },
  { subject: 'Social', current: 65, previous: 60, fullMark: 100 },
];

const categoryIcons: Record<string, React.ElementType> = {
  wellness: Heart,
  mindfulness: Brain,
  activity: Zap,
  social: Users,
};

const categoryColors: Record<string, string> = {
  wellness: 'text-pink-500 bg-pink-500/10',
  mindfulness: 'text-purple-500 bg-purple-500/10',
  activity: 'text-yellow-500 bg-yellow-500/10',
  social: 'text-blue-500 bg-blue-500/10',
};

const rarityColors: Record<string, string> = {
  common: 'border-gray-300 bg-gray-50',
  rare: 'border-blue-400 bg-blue-50',
  epic: 'border-purple-400 bg-purple-50',
  legendary: 'border-yellow-400 bg-yellow-50',
};

const rarityGradients: Record<string, string> = {
  common: 'from-gray-200 to-gray-300',
  rare: 'from-blue-200 to-blue-400',
  epic: 'from-purple-300 to-purple-500',
  legendary: 'from-yellow-300 to-orange-400',
};

export const ProgressTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const totalPoints = useMemo(() => {
    return mockAchievements
      .filter((a) => a.progress === a.maxProgress)
      .reduce((sum, a) => {
        const rarityPoints = { common: 10, rare: 25, epic: 50, legendary: 100 };
        return sum + rarityPoints[a.rarity];
      }, 0);
  }, []);

  const weeklyScore = useMemo(() => {
    return Math.round(
      mockDailyProgress.reduce((sum, d) => sum + d.score, 0) /
        mockDailyProgress.length
    );
  }, []);

  const streakDays = 12; // Mock streak

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-primary/20">
                <Flame className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{streakDays}</p>
                <p className="text-sm text-muted-foreground">Jours conscutifs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/10 to-success/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-success/20">
                <Target className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{weeklyScore}</p>
                <p className="text-sm text-muted-foreground">Score hebdomadaire</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/10 to-warning/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-warning/20">
                <Trophy className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalPoints}</p>
                <p className="text-sm text-muted-foreground">Points gagns</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-accent/20">
                <Award className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {mockAchievements.filter((a) => a.progress === a.maxProgress).length}
                </p>
                <p className="text-sm text-muted-foreground">Succs dbloqus</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="goals">Objectifs</TabsTrigger>
          <TabsTrigger value="achievements">Succs</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Weekly Progress Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Progression de la semaine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={mockDailyProgress}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#6366f1"
                    fill="url(#colorScore)"
                    strokeWidth={2}
                    name="Score"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Quick Goals Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockGoals.slice(0, 4).map((goal) => {
              const Icon = categoryIcons[goal.category];
              const progress = (goal.current / goal.target) * 100;

              return (
                <Card
                  key={goal.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    goal.isCompleted ? 'border-success/50' : ''
                  }`}
                  onClick={() => setSelectedGoal(goal)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-2 rounded-lg ${categoryColors[goal.category]}`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">{goal.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {goal.description}
                          </p>
                        </div>
                      </div>
                      {goal.isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : (
                        <Badge variant="outline">
                          {goal.current}/{goal.target} {goal.unit}
                        </Badge>
                      )}
                    </div>
                    <Progress value={Math.min(progress, 100)} className="h-2" />
                    {goal.streak && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-orange-500">
                        <Flame className="h-3 w-3" />
                        Srie de {goal.streak} jours
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 gap-4">
            {mockGoals.map((goal, index) => {
              const Icon = categoryIcons[goal.category];
              const progress = (goal.current / goal.target) * 100;

              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`transition-all hover:shadow-md ${
                      goal.isCompleted ? 'bg-success/5 border-success/30' : ''
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-3 rounded-lg ${categoryColors[goal.category]}`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{goal.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {goal.description}
                              </p>
                            </div>
                            {goal.isCompleted ? (
                              <Badge className="bg-success">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Complt
                              </Badge>
                            ) : (
                              <Badge variant="outline">En cours</Badge>
                            )}
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>
                                {goal.current} / {goal.target} {goal.unit}
                              </span>
                              <span className="font-medium">
                                {Math.round(progress)}%
                              </span>
                            </div>
                            <Progress
                              value={Math.min(progress, 100)}
                              className="h-3"
                            />
                          </div>

                          <div className="flex items-center gap-4 mt-3">
                            {goal.streak && (
                              <div className="flex items-center gap-1 text-sm text-orange-500">
                                <Flame className="h-4 w-4" />
                                {goal.streak} jours
                              </div>
                            )}
                            {goal.deadline && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {goal.deadline}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <Button className="w-full" variant="outline">
            <Target className="h-4 w-4 mr-2" />
            Crer un nouvel objectif
          </Button>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockAchievements.map((achievement, index) => {
              const isUnlocked = achievement.progress === achievement.maxProgress;
              const progress =
                (achievement.progress / achievement.maxProgress) * 100;

              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`relative overflow-hidden ${
                      isUnlocked
                        ? rarityColors[achievement.rarity]
                        : 'bg-muted/30 border-dashed'
                    }`}
                  >
                    {isUnlocked && (
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${
                          rarityGradients[achievement.rarity]
                        } opacity-10`}
                      />
                    )}
                    <CardContent className="p-4 relative">
                      <div className="flex items-center gap-4">
                        <div
                          className={`text-4xl ${
                            isUnlocked ? '' : 'grayscale opacity-50'
                          }`}
                        >
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4
                              className={`font-semibold ${
                                isUnlocked ? '' : 'text-muted-foreground'
                              }`}
                            >
                              {achievement.title}
                            </h4>
                            <Badge
                              variant="outline"
                              className={`text-xs capitalize ${
                                isUnlocked ? '' : 'opacity-50'
                              }`}
                            >
                              {achievement.rarity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {achievement.description}
                          </p>

                          {!isUnlocked && (
                            <div className="mt-2">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span>
                                  {achievement.progress}/{achievement.maxProgress}
                                </span>
                                <span>{Math.round(progress)}%</span>
                              </div>
                              <Progress value={progress} className="h-1.5" />
                            </div>
                          )}

                          {isUnlocked && achievement.unlockedAt && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Dbloqu le{' '}
                              {new Date(achievement.unlockedAt).toLocaleDateString(
                                'fr-FR'
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6 mt-6">
          {/* Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                Profil Bien-tre
              </CardTitle>
              <CardDescription>
                Comparaison avec la semaine prcdente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={mockRadarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Cette semaine"
                    dataKey="current"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Semaine prcdente"
                    dataKey="previous"
                    stroke="#94a3b8"
                    fill="#94a3b8"
                    fillOpacity={0.2}
                  />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Activity Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Brain className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Scans effectus</p>
                    <p className="text-2xl font-bold">
                      {mockDailyProgress.reduce((sum, d) => sum + d.scans, 0)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-green-500">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12% vs semaine prcdente
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Clock className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Minutes de pratique
                    </p>
                    <p className="text-2xl font-bold">
                      {mockDailyProgress.reduce((sum, d) => sum + d.minutes, 0)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-green-500">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +8% vs semaine prcdente
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <Zap className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Activits compltes
                    </p>
                    <p className="text-2xl font-bold">
                      {mockDailyProgress.reduce((sum, d) => sum + d.activities, 0)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-red-500">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  -3% vs semaine prcdente
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgressTracker;
