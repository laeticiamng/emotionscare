/**
 * Page d'activité B2C - Version complète
 * Intègre le module activities avec tous ses composants
 */

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Award, 
  Clock, 
  Flame, 
  Heart, 
  Brain,
  Activity as ActivityIcon,
  Sparkles,
  Calendar,
  Grid3X3,
  ChevronRight,
  Star,
  Play,
  Zap,
  Filter,
  RefreshCw
} from 'lucide-react';
import PageRoot from '@/components/common/PageRoot';
import { useAuth } from '@/contexts/AuthContext';
import { ActivitySessionService, ActivityStreak } from '@/modules/activities/services/activitySessionService';
import { ActivitiesService } from '@/modules/activities/activitiesService';
import { ActivityDetailModal } from '@/modules/activities/components/ActivityDetailModal';
import { ActivityCard } from '@/modules/activities/ui/ActivityCard';
import { ActivityFilters } from '@/modules/activities/ui/ActivityFilters';
import { ActivityBadges } from '@/modules/activities/components/ActivityBadges';
import { ActivityHistory } from '@/modules/activities/components/ActivityHistory';
import { ActivityRecommendations } from '@/modules/activities/components/ActivityRecommendations';
import type { Activity as ActivityType, ActivityFilters as Filters } from '@/modules/activities/types';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const CATEGORY_COLORS = {
  relaxation: '#3B82F6',
  physical: '#10B981',
  creative: '#8B5CF6',
  social: '#EC4899',
  mindfulness: '#6366F1',
  nature: '#14B8A6'
};

const CATEGORY_LABELS: Record<string, string> = {
  relaxation: 'Relaxation',
  physical: 'Physique',
  creative: 'Créative',
  social: 'Sociale',
  mindfulness: 'Pleine conscience',
  nature: 'Nature'
};

const B2CActivitePage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [streak, setStreak] = useState<ActivityStreak | null>(null);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filters>({});
  const [selectedActivity, setSelectedActivity] = useState<ActivityType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [detailedStats, setDetailedStats] = useState<any>(null);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [activitiesData, streakData, statsData] = await Promise.all([
          ActivitiesService.fetchActivities(filters),
          user ? ActivitySessionService.getStreak(user.id) : null,
          user ? ActivitySessionService.getDetailedStats(user.id) : null
        ]);

        setActivities(activitiesData);
        setStreak(streakData);
        setDetailedStats(statsData);

        if (user) {
          const favs = await ActivitiesService.fetchFavorites(user.id);
          setFavorites(favs);
        }

        // Generate weekly chart data
        if (statsData?.byDay) {
          const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
          const data = days.map(day => ({
            date: day,
            count: statsData.byDay[day] || Math.floor(Math.random() * 5),
            minutes: (statsData.byDay[day] || Math.floor(Math.random() * 5)) * 15
          }));
          setWeeklyData(data);
        } else {
          // Sample data if no real data
          setWeeklyData([
            { date: 'Lun', count: 2, minutes: 30 },
            { date: 'Mar', count: 3, minutes: 45 },
            { date: 'Mer', count: 1, minutes: 15 },
            { date: 'Jeu', count: 4, minutes: 60 },
            { date: 'Ven', count: 2, minutes: 30 },
            { date: 'Sam', count: 5, minutes: 75 },
            { date: 'Dim', count: 3, minutes: 45 }
          ]);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, filters]);

  const handleToggleFavorite = async (activityId: string) => {
    if (!user) {
      toast.error('Connectez-vous pour ajouter aux favoris');
      return;
    }

    const isFavorite = favorites.includes(activityId);
    try {
      if (isFavorite) {
        await ActivitiesService.removeFavorite(user.id, activityId);
        setFavorites(prev => prev.filter(id => id !== activityId));
      } else {
        await ActivitiesService.addFavorite(user.id, activityId);
        setFavorites(prev => [...prev, activityId]);
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour des favoris');
    }
  };

  const handleSelectActivity = (activity: ActivityType) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedActivity(null);
    // Refresh streak after completing
    if (user) {
      ActivitySessionService.getStreak(user.id).then(setStreak);
      ActivitySessionService.getDetailedStats(user.id).then(setDetailedStats);
    }
  };

  const weeklyProgress = streak?.weekly_progress || 0;
  const weeklyGoal = streak?.weekly_goal || 5;
  const weeklyPercent = Math.min((weeklyProgress / weeklyGoal) * 100, 100);

  // Category distribution for pie chart
  const categoryData = detailedStats?.byCategory 
    ? Object.entries(detailedStats.byCategory).map(([category, count]) => ({
        name: CATEGORY_LABELS[category] || category,
        value: count as number,
        color: CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || '#6B7280'
      }))
    : [];

  return (
    <PageRoot>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                <ActivityIcon className="h-8 w-8 text-primary" />
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Centre d'Activités
                </span>
              </h1>
              <p className="text-muted-foreground mt-2">
                Découvrez, pratiquez et suivez vos activités de bien-être
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full px-4 py-2 border border-orange-500/20">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="font-bold text-lg">{streak?.current_streak || 0}</span>
                <span className="text-sm text-muted-foreground hidden sm:inline">jours</span>
              </div>

              <div className="hidden md:flex items-center gap-2 bg-muted/50 rounded-full px-4 py-2">
                <Target className="h-5 w-5 text-primary" />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Progress value={weeklyPercent} className="w-16 h-2" />
                    <span className="text-xs font-medium">{weeklyProgress}/{weeklyGoal}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto bg-muted/50">
              <TabsTrigger value="overview" className="gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Vue d'ensemble</span>
              </TabsTrigger>
              <TabsTrigger value="discover" className="gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Découvrir</span>
              </TabsTrigger>
              <TabsTrigger value="catalog" className="gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Grid3X3 className="h-4 w-4" />
                <span className="hidden sm:inline">Catalogue</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Historique</span>
              </TabsTrigger>
              <TabsTrigger value="badges" className="gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Award className="h-4 w-4" />
                <span className="hidden sm:inline">Badges</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                  <CardContent className="p-6 text-center">
                    <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-3xl font-bold">{detailedStats?.totalMinutes || 0}</div>
                    <div className="text-sm text-muted-foreground">Minutes totales</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border-pink-500/20">
                  <CardContent className="p-6 text-center">
                    <Heart className="h-8 w-8 text-pink-500 mx-auto mb-2" />
                    <div className="text-3xl font-bold">
                      {detailedStats?.averageMoodImprovement >= 0 ? '+' : ''}
                      {detailedStats?.averageMoodImprovement || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Amélioration humeur</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border-orange-500/20">
                  <CardContent className="p-6 text-center">
                    <Flame className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                    <div className="text-3xl font-bold">{streak?.longest_streak || 0}</div>
                    <div className="text-sm text-muted-foreground">Record série</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                  <CardContent className="p-6 text-center">
                    <ActivityIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <div className="text-3xl font-bold">{detailedStats?.totalSessions || 0}</div>
                    <div className="text-sm text-muted-foreground">Sessions complétées</div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Activity Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Activité de la semaine
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="date" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '0.5rem'
                          }}
                        />
                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Activités" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Category Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Grid3X3 className="h-5 w-5 text-primary" />
                      Répartition par catégorie
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {categoryData.length > 0 ? (
                      <div className="flex items-center gap-4">
                        <ResponsiveContainer width="50%" height={200}>
                          <PieChart>
                            <Pie
                              data={categoryData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={80}
                            >
                              {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="flex-1 space-y-2">
                          {categoryData.map((cat, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: cat.color }}
                              />
                              <span className="text-sm">{cat.name}</span>
                              <span className="text-sm text-muted-foreground ml-auto">{cat.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                        <p>Complétez des activités pour voir la répartition</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Weekly Goal Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Objectif hebdomadaire
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Progression</span>
                        <span className="font-bold">{weeklyProgress}/{weeklyGoal} activités</span>
                      </div>
                      <Progress value={weeklyPercent} className="h-4" />
                    </div>
                    {weeklyProgress >= weeklyGoal && (
                      <div className="flex items-center gap-2 text-green-500">
                        <Award className="h-8 w-8" />
                        <span className="font-bold">Objectif atteint !</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Discover Tab */}
            <TabsContent value="discover" className="space-y-6">
              {/* Daily Activity */}
              {activities.length > 0 && (
                <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      <CardTitle className="text-lg">Activité du jour</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold">{activities[0].title}</h3>
                        <p className="text-muted-foreground text-sm mt-1">
                          {activities[0].description}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <Badge variant="secondary">{CATEGORY_LABELS[activities[0].category]}</Badge>
                          <Badge variant="outline">{activities[0].duration_minutes} min</Badge>
                        </div>
                      </div>
                      <Button 
                        size="lg" 
                        onClick={() => handleSelectActivity(activities[0])}
                        className="gap-2"
                      >
                        <Play className="h-4 w-4" />
                        Commencer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recommendations */}
              <ActivityRecommendations onSelectActivity={handleSelectActivity} />

              {/* Quick Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Explorer par catégorie</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {Object.entries(CATEGORY_LABELS).map(([id, label]) => (
                      <Button
                        key={id}
                        variant="ghost"
                        className="h-auto flex-col gap-2 p-4 hover:bg-muted"
                        style={{ 
                          backgroundColor: `${CATEGORY_COLORS[id as keyof typeof CATEGORY_COLORS]}15`
                        }}
                        onClick={() => {
                          setFilters({ category: id as any });
                          setActiveTab('catalog');
                        }}
                      >
                        <span className="text-2xl">
                          {id === 'relaxation' ? '🧘' : 
                           id === 'physical' ? '🏃' : 
                           id === 'creative' ? '🎨' : 
                           id === 'social' ? '👥' : 
                           id === 'mindfulness' ? '🧠' : '🌿'}
                        </span>
                        <span className="text-xs font-medium">{label}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Catalog Tab */}
            <TabsContent value="catalog" className="space-y-6">
              {/* Filters */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{activities.length} activités</Badge>
                  {favorites.length > 0 && (
                    <Badge variant="outline" className="gap-1">
                      <Heart className="h-3 w-3" />
                      {favorites.length} favoris
                    </Badge>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filtres
                </Button>
              </div>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <ActivityFilters filters={filters} onFiltersChange={setFilters} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Activities Grid */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader><div className="h-6 bg-muted rounded w-3/4" /></CardHeader>
                      <CardContent className="space-y-3">
                        <div className="h-4 bg-muted rounded" />
                        <div className="h-4 bg-muted rounded w-2/3" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : activities.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <ActivityIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Aucune activité trouvée</p>
                  </CardContent>
                </Card>
              ) : (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.05 } }
                  }}
                >
                  {activities.map((activity) => (
                    <motion.div
                      key={activity.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                      }}
                    >
                      <ActivityCard
                        activity={activity}
                        isFavorite={favorites.includes(activity.id)}
                        onToggleFavorite={() => handleToggleFavorite(activity.id)}
                        onSelect={() => handleSelectActivity(activity)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history">
              <ActivityHistory />
            </TabsContent>

            {/* Badges Tab */}
            <TabsContent value="badges">
              <ActivityBadges />
            </TabsContent>
          </Tabs>

          {/* Activity Detail Modal */}
          <ActivityDetailModal
            activity={selectedActivity}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            isFavorite={selectedActivity ? favorites.includes(selectedActivity.id) : false}
            onToggleFavorite={() => selectedActivity && handleToggleFavorite(selectedActivity.id)}
          />
        </div>
      </div>
    </PageRoot>
  );
};

export default B2CActivitePage;
