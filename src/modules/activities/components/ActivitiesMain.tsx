/**
 * Composant principal du module activities - Version complète
 * Intègre tous les sous-composants : Stats, Badges, History, Recommendations
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  Activity, 
  Award, 
  Calendar, 
  TrendingUp,
  Flame,
  Heart,
  Filter,
  Grid3X3,
  Star,
  Zap,
  Target,
  ChevronRight
} from 'lucide-react';
import { useActivities } from '../useActivities';
import { ActivityCard } from '../ui/ActivityCard';
import { ActivityFilters } from '../ui/ActivityFilters';
import { ActivityDetailModal } from './ActivityDetailModal';
import { ActivityStats } from './ActivityStats';
import { ActivityBadges } from './ActivityBadges';
import { ActivityHistory } from './ActivityHistory';
import { ActivityRecommendations } from './ActivityRecommendations';
import { ActivitySessionService, ActivityStreak } from '../services/activitySessionService';
import { useAuth } from '@/contexts/AuthContext';
import type { Activity as ActivityType } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

export function ActivitiesMain() {
  const { user } = useAuth();
  const {
    activities,
    favorites,
    filters,
    status,
    error,
    toggleFavorite,
    setFilters,
    loadActivities
  } = useActivities({ autoLoad: true });

  const [selectedActivity, setSelectedActivity] = useState<ActivityType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'all' | 'favorites'>('all');
  const [streak, setStreak] = useState<ActivityStreak | null>(null);
  const [dailyActivity, setDailyActivity] = useState<ActivityType | null>(null);
  const [activeTab, setActiveTab] = useState('discover');

  // Load streak data
  useEffect(() => {
    if (!user) return;
    
    ActivitySessionService.getStreak(user.id).then(setStreak).catch(console.error);
  }, [user]);

  // Set daily activity (random from activities)
  useEffect(() => {
    if (activities.length > 0 && !dailyActivity) {
      const today = new Date().toDateString();
      const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const index = seed % activities.length;
      setDailyActivity(activities[index]);
    }
  }, [activities, dailyActivity]);

  const handleSelectActivity = (activity: ActivityType) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedActivity(null);
    // Refresh data after completing an activity
    if (user) {
      ActivitySessionService.getStreak(user.id).then(setStreak).catch(console.error);
      loadActivities(filters);
    }
  };

  const filteredActivities = viewMode === 'favorites'
    ? activities.filter(a => favorites.includes(a.id))
    : activities;

  const weeklyProgress = streak?.weekly_progress || 0;
  const weeklyGoal = streak?.weekly_goal || 5;
  const weeklyPercent = Math.min((weeklyProgress / weeklyGoal) * 100, 100);

  return (
    <div className="container max-w-7xl mx-auto py-6 space-y-6">
      {/* Header with Streak */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            Activités Bien-être
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Découvrez des activités pour améliorer votre bien-être quotidien
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4">
          {/* Streak Badge */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full px-4 py-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <span className="font-bold">{streak?.current_streak || 0}</span>
            <span className="text-sm text-muted-foreground">jours</span>
          </div>

          {/* Weekly Progress */}
          <div className="hidden sm:flex items-center gap-2 bg-muted/50 rounded-full px-4 py-2">
            <Target className="h-5 w-5 text-primary" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Cette semaine</span>
              <div className="flex items-center gap-2">
                <Progress value={weeklyPercent} className="w-20 h-2" />
                <span className="text-xs font-medium">{weeklyProgress}/{weeklyGoal}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
          <TabsTrigger value="discover" className="gap-2 py-3">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Découvrir</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="gap-2 py-3">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Statistiques</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2 py-3">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Historique</span>
          </TabsTrigger>
          <TabsTrigger value="badges" className="gap-2 py-3">
            <Award className="h-4 w-4" />
            <span className="hidden sm:inline">Badges</span>
          </TabsTrigger>
          <TabsTrigger value="all" className="gap-2 py-3">
            <Grid3X3 className="h-4 w-4" />
            <span className="hidden sm:inline">Catalogue</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab: Discover */}
        <TabsContent value="discover" className="space-y-6">
          {/* Daily Activity */}
          {dailyActivity && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <CardTitle className="text-lg">Activité du jour</CardTitle>
                  </div>
                  <CardDescription>
                    Une suggestion personnalisée pour aujourd'hui
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{dailyActivity.title}</h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        {dailyActivity.description}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <Badge variant="secondary">{dailyActivity.category}</Badge>
                        <Badge variant="outline">{dailyActivity.duration_minutes} min</Badge>
                      </div>
                    </div>
                    <Button 
                      size="lg" 
                      onClick={() => handleSelectActivity(dailyActivity)}
                      className="gap-2"
                    >
                      Commencer
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Recommendations */}
          <ActivityRecommendations onSelectActivity={handleSelectActivity} />

          {/* Quick Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Grid3X3 className="h-5 w-5 text-primary" />
                Catégories populaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { id: 'relaxation', label: 'Relaxation', icon: '🧘', color: 'from-blue-500/20 to-cyan-500/20' },
                  { id: 'physical', label: 'Physique', icon: '🏃', color: 'from-green-500/20 to-emerald-500/20' },
                  { id: 'creative', label: 'Créative', icon: '🎨', color: 'from-purple-500/20 to-pink-500/20' },
                  { id: 'social', label: 'Sociale', icon: '👥', color: 'from-pink-500/20 to-rose-500/20' },
                  { id: 'mindfulness', label: 'Pleine conscience', icon: '🧠', color: 'from-indigo-500/20 to-violet-500/20' },
                  { id: 'nature', label: 'Nature', icon: '🌿', color: 'from-emerald-500/20 to-teal-500/20' },
                ].map(cat => (
                  <Button
                    key={cat.id}
                    variant="ghost"
                    className={`h-auto flex-col gap-2 p-4 bg-gradient-to-br ${cat.color} hover:opacity-80`}
                    onClick={() => {
                      setFilters({ category: cat.id as any });
                      setActiveTab('all');
                    }}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="text-xs font-medium">{cat.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Stats */}
        <TabsContent value="stats">
          <ActivityStats />
        </TabsContent>

        {/* Tab: History */}
        <TabsContent value="history">
          <ActivityHistory />
        </TabsContent>

        {/* Tab: Badges */}
        <TabsContent value="badges">
          <ActivityBadges />
        </TabsContent>

        {/* Tab: All Activities */}
        <TabsContent value="all" className="space-y-6">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('all')}
              >
                Toutes ({activities.length})
              </Button>
              <Button
                variant={viewMode === 'favorites' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('favorites')}
                className="gap-1"
              >
                <Heart className="h-4 w-4" />
                Favoris ({favorites.length})
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtres
              {Object.values(filters).some(v => v) && (
                <Badge variant="secondary" className="ml-1">
                  {Object.values(filters).filter(v => v).length}
                </Badge>
              )}
            </Button>
          </div>

          {/* Filters Panel */}
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
          {status === 'loading' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                    <div className="flex gap-2">
                      <div className="h-6 w-16 bg-muted rounded-full" />
                      <div className="h-6 w-16 bg-muted rounded-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : status === 'error' ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-destructive">{error}</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => loadActivities(filters)}
                >
                  Réessayer
                </Button>
              </CardContent>
            </Card>
          ) : filteredActivities.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {viewMode === 'favorites' 
                    ? "Vous n'avez pas encore d'activités favorites"
                    : "Aucune activité trouvée avec ces critères"}
                </p>
                {viewMode === 'favorites' && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setViewMode('all')}
                  >
                    Voir toutes les activités
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
            >
              {filteredActivities.map((activity) => (
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
                    onToggleFavorite={() => toggleFavorite(activity.id)}
                    onSelect={() => handleSelectActivity(activity)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </TabsContent>
      </Tabs>

      {/* Activity Detail Modal */}
      <ActivityDetailModal
        activity={selectedActivity}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isFavorite={selectedActivity ? favorites.includes(selectedActivity.id) : false}
        onToggleFavorite={() => selectedActivity && toggleFavorite(selectedActivity.id)}
      />
    </div>
  );
}

export default ActivitiesMain;
