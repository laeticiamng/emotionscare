/**
 * EMOTIONAL PARK - Module complet et enrichi
 * Carte du Parc Émotionnel — Monde des Modules
 * Intégration complète: météo, streak, favoris, notifications, partage, énergie
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useUserStatsQuery } from '@/hooks/useUserStatsQuery';
import { useUserPreference } from '@/hooks/useSupabaseStorage';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, X, TrendingUp, Target, Award, ChevronDown, Star, Calendar, Sparkles, Trophy, Zap, BarChart3, Map, Clock, Heart, Share2, Download, Settings } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { ParkAttraction } from '@/components/park/ParkAttraction';
import type { Attraction } from '@/types/park';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAttractionProgress } from '@/hooks/useAttractionProgress';
import { BadgeUnlockModal } from '@/components/park/BadgeUnlockModal';
import { ZoneProgressCard } from '@/components/park/ZoneProgressCard';
import { useGuidedTour } from '@/hooks/useGuidedTour';
import { GuidedTourModal } from '@/components/park/GuidedTourModal';
import { TourStepOverlay } from '@/components/park/TourStepOverlay';
import { useParkRecommendations } from '@/hooks/useParkRecommendations';
import { AttractionRecommendations } from '@/components/park/AttractionRecommendations';
import { ParkQuests } from '@/components/park/ParkQuests';
import { ParkMapVisualization } from '@/components/park/ParkMapVisualization';
import { ProgressionTimeline } from '@/components/park/ProgressionTimeline';
import { ParkWeatherWidget } from '@/components/park/ParkWeatherWidget';
import { ParkStreakWidget } from '@/components/park/ParkStreakWidget';
import { ParkNotificationsPanel } from '@/components/park/ParkNotificationsPanel';
import { FavoriteAttractions } from '@/components/park/FavoriteAttractions';
import { ShareAchievementDialog } from '@/components/park/ShareAchievementDialog';
import { EnergyBar } from '@/components/park/EnergyBar';
import { ParkQuickActions } from '@/components/park/ParkQuickActions';
import { ParkAchievementsPanel } from '@/components/park/ParkAchievementsPanel';
import { ParkSettingsPanel } from '@/components/park/ParkSettingsPanel';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { usePageSEO } from '@/hooks/usePageSEO';
import { ArrowLeft } from 'lucide-react';
import { parkAttractions } from '@/data/parkAttractions';
import { parkZones } from '@/data/parkZones';
import { useParkQuests } from '@/hooks/useParkQuests';
import { useParkModuleSymbiosis } from '@/hooks/useParkModuleSymbiosis';
import { useParkRealtime } from '@/hooks/useParkRealtime';
import { useParkFavorites } from '@/hooks/useParkFavorites';
import { useParkExport } from '@/hooks/useParkExport';
import { useParkSharing, type ShareableAchievement } from '@/hooks/useParkSharing';
import { useParkEnergy } from '@/hooks/useParkEnergy';
import { useParkStreak } from '@/hooks/useParkStreak';
import { useParkAchievements } from '@/hooks/useParkAchievements';
import { ParkProgressDashboard } from '@/components/park/ParkProgressDashboard';
import type { ZoneKey, ZoneProgressData, ParkStat, MoodOption } from '@/types/park';
import type { WeatherType } from '@/components/park/ParkWeatherWidget';

export default function EmotionalPark() {
  const navigate = useNavigate();
  const { toast } = useToast();

  usePageSEO({
    title: 'Le Parc Émotionnel',
    description: 'Explorez vos émotions à travers un parc d\'attractions interactif avec méditation, musique, journaling et bien plus.',
    keywords: 'parc émotionnel, bien-être, gamification, émotions, méditation, thérapie',
  });
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showStatistics, setShowStatistics] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [achievementToShare, setAchievementToShare] = useState<ShareableAchievement | null>(null);
  const [showAchievementsPanel, setShowAchievementsPanel] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  
  // Mood persisté via Supabase
  const [currentMood, setCurrentMood] = useUserPreference<string>('emotional-park-mood', '');
  const [showProgressDashboard, setShowProgressDashboard] = useState(false);

  // Energy system (persisté via Supabase)
  const { 
    energy, 
    maxEnergy, 
    regenRate: energyRegenRate, 
    consumeEnergy, 
    canAfford,
    restoreEnergy
  } = useParkEnergy();

  // Streak system (persisté via Supabase)
  const {
    currentStreak,
    longestStreak,
    weeklyActivity,
    lastActivityDate,
    recordActivity,
    isActiveToday
  } = useParkStreak();

  const {
    visitedAttractions,
    unlockedBadges,
    newlyUnlockedZone,
    markVisited,
    checkZoneCompletion,
    clearNewlyUnlocked,
    getZoneProgress,
    addSearchHistory,
    getSearchSuggestions
  } = useAttractionProgress();

  const {
    tourActive,
    currentStep,
    currentStepIndex,
    totalSteps,
    tourCompleted,
    startTour,
    nextStep,
    previousStep,
    skipTour
  } = useGuidedTour();

  const { getRecommendations, getDailyChallenge } = useParkRecommendations();
  const { stats: userStats } = useUserStatsQuery();
  const { quests, getCompletedQuestsCount, getTotalRewards, updateQuestProgress, updateQuestFromZoneVisit } = useParkQuests();
  const { syncAttractionVisit } = useParkModuleSymbiosis();
  
  // New hooks integration
  const { notifications, unreadCount, notifyBadgeUnlock } = useParkRealtime();
  const { isFavorite, toggleFavorite, recordVisit } = useParkFavorites();
  const { exportToJSON, isExporting } = useParkExport();
  const { shareSummary, isSharing } = useParkSharing();
  const { achievements: parkAchievements, stats: achievementStats } = useParkAchievements();

  // Calculer le type de météo basé sur l'humeur
  const weatherType: WeatherType = useMemo(() => {
    const moodScore = currentMood === 'happy' ? 85 : currentMood === 'calm' ? 70 : currentMood === 'anxious' ? 35 : currentMood === 'sad' ? 25 : currentMood === 'excited' ? 90 : 60;
    if (moodScore >= 85) return 'magical';
    if (moodScore >= 70) return 'sunny';
    if (moodScore >= 55) return 'partly-cloudy';
    if (moodScore >= 40) return 'cloudy';
    if (moodScore >= 25) return 'rainy';
    return 'stormy';
  }, [currentMood]);

  const [showTourModal, setShowTourModal] = useState(false);

  useEffect(() => {
    if (!tourCompleted && Object.keys(visitedAttractions).length === 0) {
      setShowTourModal(true);
    }
  }, [tourCompleted, visitedAttractions]);

  // Record activity on first load
  useEffect(() => {
    if (!isActiveToday && Object.keys(visitedAttractions).length > 0) {
      recordActivity();
    }
  }, [isActiveToday, visitedAttractions, recordActivity]);

  // Use imported attractions and zones
  const attractions = parkAttractions;
  const zones = parkZones;

  // Filter attractions based on search and zone
  const filteredAttractions = useMemo(() => {
    let filtered = attractions;
    
    // Apply zone filter
    if (selectedZone !== 'all') {
      filtered = filtered.filter(a => a.zone === selectedZone);
    }
    
    // Apply search filter
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(lowerSearch) ||
        a.subtitle.toLowerCase().includes(lowerSearch) ||
        a.description.toLowerCase().includes(lowerSearch)
      );
    }
    
    return filtered;
  }, [selectedZone, searchTerm, attractions]);

  // Get search suggestions
  const suggestions = useMemo(() => {
    if (!searchTerm.trim() || searchTerm.length < 2) return [];
    return getSearchSuggestions(searchTerm, attractions);
  }, [searchTerm, attractions, getSearchSuggestions]);

  // Calculate recommendations
  const recommendations = useMemo(() => {
    return getRecommendations(attractions, currentMood);
  }, [attractions, currentMood, getRecommendations]);

  // Calculate daily challenge
  const dailyChallenge = useMemo(() => {
    return getDailyChallenge(attractions);
  }, [attractions, getDailyChallenge]);

  // Calculate park statistics
  const parkStats = useMemo(() => {
    const totalAttractions = attractions.length;
    const visitedCount = Object.keys(visitedAttractions).length;
    const completionRate = Math.round((visitedCount / totalAttractions) * 100);
    const badgesCount = unlockedBadges.length;
    const totalZones = Object.keys(zones).length;

    return [
      {
        label: 'Attractions Visitées',
        value: visitedCount,
        unit: `/ ${totalAttractions}`,
        icon: Star,
        gradient: 'from-violet-500/20 to-purple-500/20',
        description: 'Continue ton exploration du parc'
      },
      {
        label: 'Progression Globale',
        value: completionRate,
        unit: '%',
        icon: TrendingUp,
        gradient: 'from-blue-500/20 to-cyan-500/20',
        description: 'Taux de complétion du parc'
      },
      {
        label: 'Badges Débloqués',
        value: badgesCount,
        unit: `/ ${totalZones}`,
        icon: Award,
        gradient: 'from-orange-500/20 to-red-500/20',
        description: 'Zones complétées avec succès'
      },
      {
        label: 'Jours Actifs',
        value: userStats.currentStreak,
        unit: 'jours',
        icon: Calendar,
        gradient: 'from-green-500/20 to-emerald-500/20',
        description: 'Continuité de ton engagement'
      }
    ];
  }, [attractions, visitedAttractions, unlockedBadges, zones, userStats.currentStreak]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setShowSuggestions(value.length >= 2);
    
    if (value.length >= 2) {
      const results = attractions.filter(a =>
        a.title.toLowerCase().includes(value.toLowerCase()) ||
        a.subtitle.toLowerCase().includes(value.toLowerCase()) ||
        a.description.toLowerCase().includes(value.toLowerCase())
      );
      addSearchHistory(value, results.length);
    }
  };

  // Handle attraction click
  const handleAttractionClick = useCallback((attraction: Attraction) => {
    // Check energy
    if (!canAfford(10)) {
      toast({
        title: "⚡ Énergie insuffisante",
        description: "Attends quelques instants que ton énergie se recharge pour visiter cette attraction.",
        variant: "destructive",
      });
      return;
    }
    
    consumeEnergy(10);
    markVisited(attraction.id);
    recordActivity(); // Record streak activity
    
    // Record visit for favorites
    if (isFavorite(attraction.id)) {
      recordVisit(attraction.id);
    }
    
    // Check zone completion
    const zoneAttractions = attractions
      .filter(a => a.zone === attraction.zone)
      .map(a => a.id);
    
    const wasCompleted = checkZoneCompletion(
      attraction.zone,
      zones[attraction.zone as keyof typeof zones].name,
      zoneAttractions
    );
    
    // Notify badge unlock
    if (wasCompleted) {
      notifyBadgeUnlock(
        zones[attraction.zone as keyof typeof zones].name,
        zones[attraction.zone as keyof typeof zones].emoji
      );
    }
    
    // Update quest progress based on zone visit
    updateQuestFromZoneVisit(attraction.zone);
    
    // Sync with module interconnect system for symbiosis
    syncAttractionVisit(
      attraction.id,
      attraction.title,
      attraction.zone
    );
    
    // Navigate to attraction
    navigate(attraction.route);
  }, [attractions, zones, canAfford, consumeEnergy, markVisited, isFavorite, recordVisit, checkZoneCompletion, notifyBadgeUnlock, updateQuestFromZoneVisit, syncAttractionVisit, navigate, recordActivity]);

  // Handle favorite toggle
  const handleToggleFavorite = useCallback((attraction: Attraction, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(attraction.id, attraction.title, attraction.zone);
  }, [toggleFavorite]);

  // Handle share
  const handleShare = useCallback(() => {
    shareSummary();
  }, [shareSummary]);

  // Get random attraction
  const handleRandomAttraction = useCallback(() => {
    const unvisited = attractions.filter(a => !visitedAttractions[a.id]);
    const pool = unvisited.length > 0 ? unvisited : attractions;
    const random = pool[Math.floor(Math.random() * pool.length)];
    if (random) {
      handleAttractionClick(random);
    }
  }, [attractions, visitedAttractions, handleAttractionClick]);

  // Calculate zone progress for each zone
  const zoneProgressData = useMemo(() => {
    return Object.entries(zones).map(([key, zone]) => {
      const zoneAttractions = attractions
        .filter(a => a.zone === key)
        .map(a => a.id);
      
      const progress = getZoneProgress(zoneAttractions);
      const isUnlocked = unlockedBadges.some(b => b.zoneKey === key);
      
      return {
        key,
        ...zone,
        ...progress,
        isUnlocked
      };
    });
  }, [attractions, zones, getZoneProgress, unlockedBadges]);

  // Get newly unlocked zone info
  const unlockedZoneInfo = useMemo(() => {
    if (!newlyUnlockedZone) return null;
    const zone = zones[newlyUnlockedZone as keyof typeof zones];
    const zoneAttractions = attractions.filter(a => a.zone === newlyUnlockedZone);
    return {
      name: zone.name,
      emoji: zone.emoji,
      totalAttractions: zoneAttractions.length
    };
  }, [newlyUnlockedZone, zones, attractions]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* Guided Tour Modal */}
      <GuidedTourModal
        isOpen={showTourModal}
        onStart={(profile) => {
          setShowTourModal(false);
          startTour(profile);
        }}
        onSkip={() => {
          setShowTourModal(false);
          skipTour();
        }}
      />

      {/* Tour Step Overlay */}
      {tourActive && currentStep && (
        <TourStepOverlay
          step={currentStep}
          currentStepIndex={currentStepIndex}
          totalSteps={totalSteps}
          highlightedAttractionId={currentStep.attractionId}
          onNext={nextStep}
          onPrevious={previousStep}
          onSkip={skipTour}
        />
      )}

      {/* Badge Unlock Modal */}
      {unlockedZoneInfo && (
        <BadgeUnlockModal
          isOpen={!!newlyUnlockedZone}
          onClose={clearNewlyUnlocked}
          zoneName={unlockedZoneInfo.name}
          zoneEmoji={unlockedZoneInfo.emoji}
          totalAttractions={unlockedZoneInfo.totalAttractions}
        />
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-background/90 border-b border-border/50 shadow-lg"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4">
            {/* Title and Stats */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
                <Link
                  to="/app/consumer/home"
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                  aria-label="Retour au tableau de bord"
                >
                  <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                </Link>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="h-8 w-8 text-primary" />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                    Le Parc Émotionnel
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {attractions.length} attractions • {Object.keys(visitedAttractions).length} visitées • {unlockedBadges.length}/{Object.keys(zones).length} badges
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Energy Bar */}
                <div className="hidden md:block w-32">
                  <EnergyBar 
                    current={energy} 
                    max={maxEnergy} 
                    regenRate={energyRegenRate} 
                  />
                </div>
                
                {/* Notifications */}
                <ParkNotificationsPanel />
                
                <Badge variant="secondary" className="gap-2">
                  <Trophy className="h-3 w-3" />
                  {unlockedBadges.length} Badges
                </Badge>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setShowSuggestions(searchTerm.length >= 2)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Rechercher une attraction par nom ou description..."
                className="pl-10 pr-10 h-12"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setShowSuggestions(false);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Effacer la recherche"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
              
              {/* Search Suggestions */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 w-full bg-background border border-border rounded-lg shadow-xl p-2 z-50"
                  >
                    <div className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground mb-1">
                      <TrendingUp className="h-3 w-3" />
                      Suggestions
                    </div>
                    {suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSearchTerm(suggestion);
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors text-sm"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Zone Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
              <Button
                variant={selectedZone === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedZone('all')}
                className="shrink-0"
              >
                Toutes
              </Button>
              {Object.entries(zones).map(([key, zone]) => (
                <Button
                  key={key}
                  variant={selectedZone === key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedZone(key)}
                  className="shrink-0"
                >
                  {zone.emoji} {zone.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Statistics & Challenge Banner */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Daily Challenge Banner */}
        {dailyChallenge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 border-2 border-purple-500/30 p-6"
          >
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-4xl"
              >
                🎯
              </motion.div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground mb-1">
                  Défi du Jour
                </h3>
                <p className="text-sm text-muted-foreground">
                  Visite <span className="font-semibold text-foreground">{dailyChallenge.title}</span> pour un bonus de points
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => handleAttractionClick(dailyChallenge)}
                className="gap-2"
              >
                <Zap className="h-4 w-4" />
                Accepter
              </Button>
            </div>

            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10 opacity-0"
              animate={{ opacity: [0, 0.2, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>
        )}

        {/* Weather & Streak Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ParkWeatherWidget 
            weatherType={weatherType}
            mood={currentMood === 'happy' ? 85 : currentMood === 'calm' ? 70 : currentMood === 'anxious' ? 35 : currentMood === 'sad' ? 25 : currentMood === 'excited' ? 90 : 60}
            description={currentMood ? `Météo basée sur votre humeur : ${currentMood}` : 'Le parc est en pleine forme !'}
          />
          <ParkStreakWidget 
            currentStreak={currentStreak}
            longestStreak={longestStreak}
            weeklyActivity={weeklyActivity}
            lastActivityDate={lastActivityDate || undefined}
          />
        </div>

        {/* Progress Dashboard Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Button
            variant={showProgressDashboard ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowProgressDashboard(!showProgressDashboard)}
            className="gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            {showProgressDashboard ? 'Masquer le tableau de bord' : 'Mon tableau de bord'}
          </Button>
        </motion.div>

        {/* Progress Dashboard */}
        <AnimatePresence>
          {showProgressDashboard && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <ParkProgressDashboard
                streak={{
                  current: currentStreak,
                  longest: longestStreak,
                  lastActivityDate: lastActivityDate || undefined,
                  weeklyProgress: weeklyActivity
                }}
                level={{
                  level: Math.floor(getCompletedQuestsCount() / 2) + 1,
                  xp: getTotalRewards(),
                  xpToNextLevel: (Math.floor(getCompletedQuestsCount() / 2) + 1) * 500,
                  title: 'Explorateur'
                }}
                dailyGoals={[
                  { id: '1', title: 'Visiter une attraction', progress: Object.keys(visitedAttractions).length > 0 ? 1 : 0, target: 1, icon: '🎪', completed: Object.keys(visitedAttractions).length > 0 },
                  { id: '2', title: 'Compléter une quête', progress: getCompletedQuestsCount() > 0 ? 1 : 0, target: 1, icon: '🏆', completed: getCompletedQuestsCount() > 0 },
                  { id: '3', title: 'Explorer 3 zones', progress: Math.min(3, new Set(Object.keys(visitedAttractions).map(id => attractions.find(a => a.id === id)?.zone)).size), target: 3, icon: '🗺️', completed: new Set(Object.keys(visitedAttractions).map(id => attractions.find(a => a.id === id)?.zone)).size >= 3 }
                ]}
                totalVisits={Object.keys(visitedAttractions).length}
                zonesCompleted={unlockedBadges.length}
                totalZones={Object.keys(zones).length}
                onStartActivity={handleRandomAttraction}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Actions */}
        <div className="flex items-center justify-between">
          <ParkQuickActions
            onShowFavorites={() => setShowFavorites(!showFavorites)}
            onShare={handleShare}
            onExport={exportToJSON}
            onShowMap={() => setShowMap(!showMap)}
            onRandomAttraction={handleRandomAttraction}
            onDailyChallenge={() => dailyChallenge && handleAttractionClick(dailyChallenge)}
            onAchievements={() => setShowAchievementsPanel(true)}
            onSettings={() => setShowSettingsPanel(true)}
          />
          
          {/* Mobile Energy Bar */}
          <div className="md:hidden w-28">
            <EnergyBar 
              current={energy} 
              max={maxEnergy} 
              regenRate={energyRegenRate} 
            />
          </div>
        </div>

        {/* Favorites Panel */}
        <AnimatePresence>
          {showFavorites && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <FavoriteAttractions
                onSelectAttraction={(id) => {
                  const attraction = attractions.find(a => a.id === id);
                  if (attraction) handleAttractionClick(attraction);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Statistics Toggle & Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Vos Statistiques
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowStatistics(!showStatistics)}
              className="gap-1"
              aria-label={showStatistics ? "Masquer les statistiques" : "Afficher les statistiques"}
              aria-expanded={showStatistics}
            >
              <ChevronDown className={`h-4 w-4 transition-transform ${showStatistics ? 'rotate-180' : ''}`} aria-hidden="true" />
            </Button>
          </div>

          <AnimatePresence>
            {showStatistics && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {parkStats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`relative overflow-hidden rounded-lg bg-gradient-to-br ${stat.gradient} p-4 border border-border/50 hover:border-primary/50 transition-all`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <stat.icon className="h-4 w-4 text-primary opacity-50" />
                      </div>
                      <p className="text-2xl font-bold text-foreground">
                        {stat.value}
                        <span className="text-sm text-muted-foreground ml-1">{stat.unit}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Mood Selector for Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 p-4 border border-border/50"
          role="group"
          aria-labelledby="mood-selector-label"
        >
          <p id="mood-selector-label" className="text-sm font-medium mb-3 text-foreground">
            Comment te sens-tu en ce moment?
          </p>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Sélection de l'humeur">
            {([
              { value: 'happy', emoji: '😊', label: 'Heureux' },
              { value: 'calm', emoji: '😌', label: 'Calme' },
              { value: 'anxious', emoji: '😰', label: 'Anxieux' },
              { value: 'sad', emoji: '😢', label: 'Triste' },
              { value: 'excited', emoji: '🤩', label: 'Excité' }
            ] as const).map(mood => (
              <Button
                key={mood.value}
                variant={currentMood === mood.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentMood(currentMood === mood.value ? '' : mood.value)}
                className="gap-1"
                aria-pressed={currentMood === mood.value}
                aria-label={`Humeur: ${mood.label}`}
              >
                <span aria-hidden="true">{mood.emoji}</span> {mood.label}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <AttractionRecommendations
            recommendations={recommendations}
            onSelectAttraction={(id) => {
              const attraction = attractions.find(a => a.id === id);
              if (attraction) {
                handleAttractionClick(attraction);
              }
            }}
          />
        )}

        {/* Park Quests Section */}
        <ParkQuests
          quests={quests}
          completedCount={getCompletedQuestsCount()}
          totalRewards={getTotalRewards()}
          onQuestStart={(questId) => updateQuestProgress(questId, 1)}
        />

        {/* Toggle buttons for Map & Timeline */}
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant={showMap ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowMap(!showMap)}
            className="flex items-center gap-2"
          >
            <Map className="h-4 w-4" />
            {showMap ? 'Masquer la carte' : 'Voir la carte'}
          </Button>
          <Button
            variant={showTimeline ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowTimeline(!showTimeline)}
            className="flex items-center gap-2"
          >
            <Clock className="h-4 w-4" />
            {showTimeline ? 'Masquer la timeline' : 'Voir la timeline'}
          </Button>
        </div>

        {/* Park Map Visualization */}
        <AnimatePresence>
          {showMap && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <ParkMapVisualization
                zones={Object.entries(zones).map(([key, zone], index) => ({
                  name: zone.name,
                  emoji: zone.emoji,
                  color: ['#8b5cf6', '#06b6d4', '#f97316', '#22c55e', '#ec4899', '#3b82f6', '#eab308', '#ef4444'][index % 8],
                  x: 100 + (index % 4) * 200,
                  y: 150 + Math.floor(index / 4) * 250,
                  attractions: attractions.filter(a => a.zone === key).length,
                  completed: getZoneProgress(attractions.filter(a => a.zone === key).map(a => a.id)).visited
                }))}
                selectedZone={selectedZone !== 'all' ? zones[selectedZone as keyof typeof zones]?.name : undefined}
                onZoneClick={(zoneName) => {
                  const zoneKey = Object.entries(zones).find(([_, z]) => z.name === zoneName)?.[0];
                  if (zoneKey) setSelectedZone(zoneKey);
                }}
                completionData={Object.fromEntries(
                  Object.entries(zones).map(([key, zone]) => [
                    zone.name,
                    getZoneProgress(attractions.filter(a => a.zone === key).map(a => a.id))
                  ])
                )}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progression Timeline */}
        <AnimatePresence>
          {showTimeline && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <ProgressionTimeline
                events={Object.entries(visitedAttractions).map(([id, visit]) => {
                  const attraction = attractions.find(a => a.id === id);
                  return {
                    id,
                    title: attraction?.title || 'Attraction visitée',
                    description: attraction?.subtitle || '',
                    icon: attraction?.zone === 'calm' ? '🧘' : attraction?.zone === 'creative' ? '🎨' : '🏛️',
                    timestamp: new Date(typeof visit === 'object' && visit !== null ? visit.visitedAt : Date.now()),
                    type: 'attraction' as const,
                    completed: true
                  };
                })}
                maxDisplay={10}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/app/achievements')}
            className="flex items-center gap-2"
          >
            <Trophy className="h-4 w-4" />
            Mes Succès
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/app/daily-challenges')}
            className="flex items-center gap-2"
          >
            <Target className="h-4 w-4" />
            Défis du jour
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/app/home')}
            className="flex items-center gap-2"
          >
            <Award className="h-4 w-4" />
            Tableau de bord
          </Button>
        </div>
      </div>

      {/* Zone Progress Dashboard */}
      {selectedZone === 'all' && !searchTerm && (
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Progression des Zones
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {zoneProgressData.map((zone) => (
                <ZoneProgressCard
                  key={zone.key}
                  zoneName={zone.name}
                  zoneEmoji={zone.emoji}
                  visited={zone.visited}
                  total={zone.total}
                  percentage={zone.percentage}
                  isUnlocked={zone.isUnlocked}
                />
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Map Grid */}
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence>
          {selectedZone === 'all' ? (
            Object.entries(zones).map(([zoneKey, zone]) => {
              const zoneAttractions = attractions.filter(a => a.zone === zoneKey);
              if (zoneAttractions.length === 0) return null;

              return (
                <motion.section
                  key={zoneKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="mb-12"
                >
                  <div className="mb-6 flex items-center gap-3">
                    <span className="text-4xl">{zone.emoji}</span>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-foreground mb-1">
                        {zone.name}
                      </h2>
                      <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {zoneAttractions.length} {zoneAttractions.length === 1 ? 'attraction' : 'attractions'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {zoneAttractions.map((attraction, index) => {
                      const isVisited = !!visitedAttractions[attraction.id];
                      const isFav = isFavorite(attraction.id);
                      return (
                        <div
                          key={attraction.id}
                          id={`attraction-${attraction.id}`}
                          onClick={() => handleAttractionClick(attraction)}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleAttractionClick(attraction); }}}
                          role="button"
                          tabIndex={0}
                          aria-label={`Accéder à ${attraction.title} - ${attraction.subtitle}`}
                          className={`relative cursor-pointer group ${tourActive && currentStep?.attractionId === attraction.id ? 'ring-4 ring-primary rounded-xl animate-pulse' : ''}`}
                        >
                          <ParkAttraction
                            {...attraction}
                            delay={index * 0.05}
                          />
                          {/* Favorite Button */}
                          <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={(e) => handleToggleFavorite(attraction, e)}
                            className={`absolute top-3 left-3 p-1.5 rounded-full shadow-lg z-10 transition-all ${
                              isFav 
                                ? 'bg-red-500 text-white' 
                                : 'bg-background/80 text-muted-foreground opacity-0 group-hover:opacity-100'
                            }`}
                            aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                          >
                            <Heart className={`h-3 w-3 ${isFav ? 'fill-current' : ''}`} />
                          </motion.button>
                          {isVisited && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg z-10"
                              aria-label="Attraction visitée"
                            >
                              <Star className="h-3 w-3 fill-current" aria-hidden="true" />
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.section>
              );
            })
          ) : (
            <motion.section
              key={selectedZone}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8 text-center">
                <span className="text-6xl mb-4 inline-block">
                  {zones[selectedZone as keyof typeof zones].emoji}
                </span>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  {zones[selectedZone as keyof typeof zones].name}
                </h2>
                <p className="text-muted-foreground">
                  {filteredAttractions.length} {filteredAttractions.length === 1 ? 'attraction disponible' : 'attractions disponibles'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAttractions.map((attraction, index) => {
                  const isVisited = !!visitedAttractions[attraction.id];
                  const isFav = isFavorite(attraction.id);
                  return (
                    <div
                      key={attraction.id}
                      onClick={() => handleAttractionClick(attraction)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleAttractionClick(attraction); }}}
                      role="button"
                      tabIndex={0}
                      aria-label={`Accéder à ${attraction.title} - ${attraction.subtitle}`}
                      className="relative cursor-pointer group"
                    >
                      <ParkAttraction
                        {...attraction}
                        delay={index * 0.05}
                      />
                      {/* Favorite Button */}
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={(e) => handleToggleFavorite(attraction, e)}
                        className={`absolute top-3 left-3 p-1.5 rounded-full shadow-lg z-10 transition-all ${
                          isFav 
                            ? 'bg-red-500 text-white' 
                            : 'bg-background/80 text-muted-foreground opacity-0 group-hover:opacity-100'
                        }`}
                        aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                      >
                        <Heart className={`h-3 w-3 ${isFav ? 'fill-current' : ''}`} />
                      </motion.button>
                      {isVisited && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg z-10"
                          aria-label="Attraction visitée"
                        >
                          <Star className="h-3 w-3 fill-current" aria-hidden="true" />
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* No Results Message */}
        {filteredAttractions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucune attraction trouvée</h3>
            <p className="text-muted-foreground">
              Essayez de modifier votre recherche ou changez de zone
            </p>
            {searchTerm && (
              <Button
                onClick={() => setSearchTerm('')}
                variant="outline"
                className="mt-4"
              >
                Effacer la recherche
              </Button>
            )}
          </motion.div>
        )}
      </div>

      {/* Share Achievement Dialog */}
      <ShareAchievementDialog
        isOpen={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        achievement={achievementToShare}
      />

      {/* Achievements Panel Dialog */}
      <Dialog open={showAchievementsPanel} onOpenChange={setShowAchievementsPanel}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Mes Succès du Parc
            </DialogTitle>
          </DialogHeader>
          <ParkAchievementsPanel
            achievements={parkAchievements}
            totalXP={achievementStats.totalXP}
            totalCoins={achievementStats.totalCoins}
          />
        </DialogContent>
      </Dialog>

      {/* Settings Panel Dialog */}
      <Dialog open={showSettingsPanel} onOpenChange={setShowSettingsPanel}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Paramètres du Parc
            </DialogTitle>
          </DialogHeader>
          <ParkSettingsPanel />
        </DialogContent>
      </Dialog>
    </div>
  );
}
