/**
 * EMOTIONAL PARK - Refactorisé
 * Carte du Parc Émotionnel — Monde des Modules
 * 
 * Refactorisation: 1076 lignes → ~700 lignes (-35%)
 * Données extraites vers: src/data/parkAttractions.ts, src/data/parkZones.ts
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useUserStatsQuery } from '@/hooks/useUserStatsQuery';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, X, TrendingUp, Target, Award, ChevronDown, Star, Calendar, Sparkles, Trophy, Zap, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
import { ParkStatistics, ProgressStage } from '@/components/park/ParkStatistics';
import { parkAttractions } from '@/data/parkAttractions';
import { parkZones } from '@/data/parkZones';
import type { ZoneKey, ZoneProgressData, ParkStat, MoodOption } from '@/types/park';

export default function EmotionalPark() {
  const navigate = useNavigate();
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showStatistics, setShowStatistics] = useState(true);
  const [currentMood, setCurrentMood] = useState<string>('');

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

  const [showTourModal, setShowTourModal] = useState(false);

  useEffect(() => {
    if (!tourCompleted && Object.keys(visitedAttractions).length === 0) {
      setShowTourModal(true);
    }
  }, [tourCompleted, visitedAttractions]);

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
  const handleAttractionClick = (attraction: Attraction) => {
    markVisited(attraction.id);
    
    // Check zone completion
    const zoneAttractions = attractions
      .filter(a => a.zone === attraction.zone)
      .map(a => a.id);
    
    checkZoneCompletion(
      attraction.zone,
      zones[attraction.zone as keyof typeof zones].name,
      zoneAttractions
    );
    
    // Navigate to attraction
    navigate(attraction.route);
  };

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
              
              <Badge variant="secondary" className="gap-2">
                <Trophy className="h-3 w-3" />
                {unlockedBadges.length} Badges
              </Badge>
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
        >
          <p className="text-sm font-medium mb-3 text-foreground">
            Comment te sens-tu en ce moment?
          </p>
          <div className="flex flex-wrap gap-2">
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
              >
                {mood.emoji} {mood.label}
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
        <AnimatePresence mode="wait">
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
                      return (
                        <div
                          key={attraction.id}
                          id={`attraction-${attraction.id}`}
                          onClick={() => handleAttractionClick(attraction)}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleAttractionClick(attraction); }}}
                          role="button"
                          tabIndex={0}
                          aria-label={`Accéder à ${attraction.title} - ${attraction.subtitle}`}
                          className={`relative cursor-pointer ${tourActive && currentStep?.attractionId === attraction.id ? 'ring-4 ring-primary rounded-xl animate-pulse' : ''}`}
                        >
                          <ParkAttraction
                            {...attraction}
                            delay={index * 0.05}
                          />
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
                  return (
                    <div
                      key={attraction.id}
                      onClick={() => handleAttractionClick(attraction)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleAttractionClick(attraction); }}}
                      role="button"
                      tabIndex={0}
                      aria-label={`Accéder à ${attraction.title} - ${attraction.subtitle}`}
                      className="relative cursor-pointer"
                    >
                      <ParkAttraction
                        {...attraction}
                        delay={index * 0.05}
                      />
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

      {/* Footer */}
      <footer role="contentinfo" className="bg-card border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>© 2025 EmotionsCare - Le Parc Émotionnel</p>
            <nav aria-label="Liens footer">
              <div className="flex space-x-4">
                <a href="/legal/privacy" className="hover:text-foreground transition-colors">
                  Confidentialité
                </a>
                <a href="/legal/terms" className="hover:text-foreground transition-colors">
                  Conditions
                </a>
                <a href="/contact" className="hover:text-foreground transition-colors">
                  Support
                </a>
              </div>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
