import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wind, Palette, Music, Leaf, Book, Cloud, Star, Lightbulb, Waves, Scan, Beaker, Sword, Sliders, Users, Trophy, Theater, Sprout, Filter, Zap, Home, Brain, Calendar, Heart, Monitor, Camera, Shield, MessageSquare, BarChart3, Grid3X3, Settings, Bell, Search, X, TrendingUp, Target, Award, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ParkAttraction } from '@/components/park/ParkAttraction';
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
import { Attraction, Zone, ZoneKey, ZoneProgressData, ParkStat, MoodOption } from '@/types/park';

/**
 * Carte du Parc Émotionnel — Monde des Modules
 * Chaque module = une attraction immersive
 */
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

  // Show tour modal for first-time users
  const [showTourModal, setShowTourModal] = useState(false);

  useEffect(() => {
    if (!tourCompleted && Object.keys(visitedAttractions).length === 0) {
      setShowTourModal(true);
    }
  }, [tourCompleted, visitedAttractions]);

  const attractions: Attraction[] = [
    {
      id: 'dashboard',
      title: 'Le Hall d\'Accueil',
      subtitle: 'Dashboard principal',
      description: 'Centre de contrôle de ton voyage émotionnel avec vue d\'ensemble personnalisée.',
      icon: Home,
      route: '/app/consumer/home',
      gradient: 'from-violet-500/20 to-indigo-500/20',
      collection: 'Tableau de bord personnalisé',
      zone: 'hub'
    },
    {
      id: 'home',
      title: 'La Salle des Cartes Vivantes',
      subtitle: 'Point de départ du parc',
      description: 'Tu pioche une carte mood hebdomadaire avec animation cosmique et son cristallin.',
      icon: Sparkles,
      route: '/app/home',
      gradient: 'from-violet-500/20 to-purple-500/20',
      collection: 'Grimoire de cartes vivantes',
      zone: 'hub'
    },
    {
      id: 'nyvee',
      title: 'La Bulle Respirante',
      subtitle: 'Mini-jeu de respiration',
      description: 'Bulle qui gonfle/dégonfle révélant des constellations cachées.',
      icon: Wind,
      route: '/app/nyvee',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      collection: 'Cocons rares (cristal, cosmos, nature)',
      zone: 'calm'
    },
    {
      id: 'scan',
      title: 'La Galerie des Masques',
      subtitle: 'Scan émotionnel',
      description: 'Chaque choix crée un masque vivant qui flotte autour de ton avatar.',
      icon: Palette,
      route: '/app/scan',
      gradient: 'from-pink-500/20 to-rose-500/20',
      collection: 'Skins de masques moods',
      zone: 'creative'
    },
    {
      id: 'music',
      title: 'La Forêt Sonore',
      subtitle: 'Thérapie musicale',
      description: 'Forêt magique où les arbres vibrent avec la musique. Chaque session = fragment mélodique rare.',
      icon: Music,
      route: '/app/music',
      gradient: 'from-green-500/20 to-emerald-500/20',
      collection: 'Playlist secrète de la forêt',
      zone: 'creative'
    },
    {
      id: 'coach',
      title: 'Le Jardin des Pensées',
      subtitle: 'Coach IA',
      description: 'Bulles translucides avec haïkus qui s\'évaporent avec sons zen.',
      icon: Leaf,
      route: '/app/coach',
      gradient: 'from-teal-500/20 to-green-500/20',
      collection: 'Grimoire des pensées',
      zone: 'wisdom'
    },
    {
      id: 'journal',
      title: 'La Bibliothèque des Émotions',
      subtitle: 'Journal voix/texte',
      description: 'Tes textes deviennent des pages volantes colorées. Chaque semaine, un nouveau chapitre s\'anime.',
      icon: Book,
      route: '/app/journal',
      gradient: 'from-amber-500/20 to-orange-500/20',
      collection: 'Livre émotionnel magique',
      zone: 'wisdom'
    },
    {
      id: 'voice-journal',
      title: 'L\'Écho des Paroles',
      subtitle: 'Journal vocal',
      description: 'Exprime-toi librement à voix haute, tes mots deviennent des vagues sonores.',
      icon: MessageSquare,
      route: '/app/voice-journal',
      gradient: 'from-orange-500/20 to-yellow-500/20',
      collection: 'Archives vocales',
      zone: 'wisdom'
    },
    {
      id: 'vr-breath',
      title: 'Le Temple de l\'Air',
      subtitle: 'VR Breath',
      description: 'Temple suspendu dans les nuages. Ton souffle peint une fresque murale unique.',
      icon: Cloud,
      route: '/app/vr-breath',
      gradient: 'from-sky-500/20 to-blue-500/20',
      collection: 'Fresques de souffle personnelles',
      zone: 'calm'
    },
    {
      id: 'vr-galaxy',
      title: 'La Constellation Émotionnelle',
      subtitle: 'VR Galaxy',
      description: 'Voyage cosmique où chaque émotion allume une étoile dans ta carte stellaire.',
      icon: Star,
      route: '/app/vr-galaxy',
      gradient: 'from-indigo-500/20 to-purple-500/20',
      collection: 'Constellations émotionnelles',
      zone: 'explore'
    },
    {
      id: 'flash-glow',
      title: 'La Chambre des Lumières',
      subtitle: 'Flash Glow',
      description: 'Salle obscure qui s\'illumine par tes cycles. Chaque respiration allume une lampe magique.',
      icon: Lightbulb,
      route: '/app/flash-glow',
      gradient: 'from-yellow-500/20 to-amber-500/20',
      collection: 'Mur de lumière + mantras',
      zone: 'energy'
    },
    {
      id: 'breath',
      title: 'L\'Océan Intérieur',
      subtitle: 'Breathwork',
      description: 'Océan vivant qui réagit à ton souffle. Surfer sur ses vagues internes.',
      icon: Waves,
      route: '/app/breath',
      gradient: 'from-blue-500/20 to-teal-500/20',
      collection: 'Badges respiratoires',
      zone: 'calm'
    },
    {
      id: 'meditation',
      title: 'Le Sanctuaire du Silence',
      subtitle: 'Méditation guidée',
      description: 'Espace sacré de silence et méditation guidée avec ambiances zen.',
      icon: Heart,
      route: '/app/meditation',
      gradient: 'from-rose-500/20 to-pink-500/20',
      collection: 'Collection de méditations',
      zone: 'calm'
    },
    {
      id: 'vr-standard',
      title: 'Le Portail Immersif',
      subtitle: 'VR Standard',
      description: 'Réalité virtuelle thérapeutique pour une immersion totale.',
      icon: Monitor,
      route: '/app/vr',
      gradient: 'from-purple-500/20 to-indigo-500/20',
      collection: 'Expériences VR premium',
      zone: 'calm'
    },
    {
      id: 'face-ar',
      title: 'La Chambre des Reflets',
      subtitle: 'AR Filters',
      description: 'Miroirs magiques, stickers réactifs. Clin d\'œil = pluie d\'étoiles.',
      icon: Camera,
      route: '/app/face-ar',
      gradient: 'from-fuchsia-500/20 to-pink-500/20',
      collection: 'Avatars rares issus de tes reflets',
      zone: 'creative'
    },
    {
      id: 'emotion-scan',
      title: 'L\'Analyseur d\'Émotions',
      subtitle: 'Scan facial avancé',
      description: 'IA de reconnaissance faciale qui lit tes émotions en temps réel.',
      icon: Scan,
      route: '/app/emotion-scan',
      gradient: 'from-blue-500/20 to-purple-500/20',
      collection: 'Historique de scans',
      zone: 'creative'
    },
    {
      id: 'bubble-beat',
      title: 'Le Labo des Bulles',
      subtitle: 'Bubble Beat',
      description: 'Laboratoire fun de bulles colorées. Fais flotter les bulles le plus longtemps possible.',
      icon: Beaker,
      route: '/app/bubble-beat',
      gradient: 'from-cyan-500/20 to-blue-500/20',
      collection: 'Bulles spéciales (couleurs rares)',
      zone: 'energy'
    },
    {
      id: 'screen-silk',
      title: 'Le Cocon Digital',
      subtitle: 'Pause écran',
      description: 'Protège tes yeux avec des pauses intelligentes et des visuels apaisants.',
      icon: Shield,
      route: '/app/screen-silk',
      gradient: 'from-teal-500/20 to-cyan-500/20',
      collection: 'Thèmes de pause',
      zone: 'energy'
    },
    {
      id: 'boss-grit',
      title: 'L\'Arène de la Persévérance',
      subtitle: 'Boss Level Grit',
      description: 'Mode RPG émotionnel. Chaque défi = mini-level avec feedback sonore.',
      icon: Sword,
      route: '/app/boss-grit',
      gradient: 'from-red-500/20 to-orange-500/20',
      collection: 'Transformation avatar de persévérance',
      zone: 'challenge'
    },
    {
      id: 'mood-mixer',
      title: 'Le Studio DJ des Émotions',
      subtitle: 'Mood Mixer',
      description: 'Deviens DJ de ton propre mood avec sliders musique + lumières en direct.',
      icon: Sliders,
      route: '/app/mood-mixer',
      gradient: 'from-purple-500/20 to-pink-500/20',
      collection: 'Mixes rares sauvegardés',
      zone: 'creative'
    },
    {
      id: 'community',
      title: 'Le Village Bienveillant',
      subtitle: 'Communauté',
      description: 'Chaque message = lumière dans une maison du village. Plus tu participes, plus ton maison-avatar s\'illumine.',
      icon: Users,
      route: '/app/community',
      gradient: 'from-emerald-500/20 to-green-500/20',
      collection: 'Badges de soutien',
      zone: 'social'
    },
    {
      id: 'leaderboard',
      title: 'Le Ciel des Auras',
      subtitle: 'Pas de classement',
      description: 'Ton aura flotte dans le ciel, change de couleur au fil des semaines.',
      icon: Star,
      route: '/app/leaderboard',
      gradient: 'from-indigo-500/20 to-violet-500/20',
      collection: 'Couleurs rares débloquées',
      zone: 'hub'
    },
    {
      id: 'ambition-arcade',
      title: 'La Salle des Défis',
      subtitle: 'Ambition Arcade',
      description: 'Salle arcade futuriste. Objectifs = mini-jeux rapides avec confettis et trophées.',
      icon: Trophy,
      route: '/app/ambition-arcade',
      gradient: 'from-orange-500/20 to-red-500/20',
      collection: 'Galerie de trophées émotionnels',
      zone: 'challenge'
    },
    {
      id: 'story-synth',
      title: 'Le Théâtre des Histoires',
      subtitle: 'Story Synth Lab',
      description: 'Théâtre vivant où chaque choix change la scène. Finir une histoire = fragment de conte.',
      icon: Theater,
      route: '/app/story-synth',
      gradient: 'from-violet-500/20 to-purple-500/20',
      collection: 'Bibliothèque de contes animés',
      zone: 'wisdom'
    },
    {
      id: 'bounce-back',
      title: 'Le Rebond Résilient',
      subtitle: 'Bounce Back Battle',
      description: 'Combat l\'adversité dans ce jeu de résilience émotionnelle.',
      icon: Shield,
      route: '/app/bounce-back',
      gradient: 'from-blue-500/20 to-indigo-500/20',
      collection: 'Médailles de résilience',
      zone: 'challenge'
    },
    {
      id: 'activity',
      title: 'Le Jardin des Saisons',
      subtitle: 'Activité hebdomadaire',
      description: 'Chaque semaine = une plante pousse. Après plusieurs semaines → jardin complet.',
      icon: Sprout,
      route: '/app/activity',
      gradient: 'from-green-500/20 to-lime-500/20',
      collection: 'Galerie de plantes rares',
      zone: 'hub'
    },
    {
      id: 'scores',
      title: 'La Carte des Humeurs',
      subtitle: 'Scores & vibes',
      description: 'Courbes d\'humeur et heatmap quotidienne de ton état émotionnel.',
      icon: Grid3X3,
      route: '/app/scores',
      gradient: 'from-purple-500/20 to-pink-500/20',
      collection: 'Historique d\'humeurs',
      zone: 'hub'
    },
    {
      id: 'insights',
      title: 'L\'Observatoire des Patterns',
      subtitle: 'Analyses approfondies',
      description: 'Découvre les patterns cachés de ton bien-être émotionnel.',
      icon: BarChart3,
      route: '/app/insights',
      gradient: 'from-cyan-500/20 to-blue-500/20',
      collection: 'Rapports détaillés',
      zone: 'hub'
    },
    {
      id: 'settings',
      title: 'Le Pavillon de Configuration',
      subtitle: 'Paramètres',
      description: 'Personnalise ton expérience dans le parc émotionnel.',
      icon: Settings,
      route: '/app/settings/general',
      gradient: 'from-gray-500/20 to-slate-500/20',
      collection: 'Préférences personnelles',
      zone: 'hub'
    },
    {
      id: 'profile',
      title: 'Le Miroir de l\'Identité',
      subtitle: 'Profil personnel',
      description: 'Ton identité dans le parc, tes informations et ton avatar.',
      icon: Users,
      route: '/app/profile',
      gradient: 'from-indigo-500/20 to-purple-500/20',
      collection: 'Profil personnalisé',
      zone: 'hub'
    },
    {
      id: 'privacy',
      title: 'Le Coffre-Fort des Secrets',
      subtitle: 'Confidentialité',
      description: 'Contrôle total sur tes données personnelles et ta vie privée.',
      icon: Shield,
      route: '/app/settings/privacy',
      gradient: 'from-emerald-500/20 to-teal-500/20',
      collection: 'Paramètres de confidentialité',
      zone: 'hub'
    },
    {
      id: 'notifications',
      title: 'La Tour des Messages',
      subtitle: 'Notifications',
      description: 'Gère tes alertes et rappels pour ne rien manquer.',
      icon: Bell,
      route: '/app/notifications',
      gradient: 'from-yellow-500/20 to-orange-500/20',
      collection: 'Centre de notifications',
      zone: 'hub'
    }
  ];

  const zones: Record<ZoneKey, Zone> = {
    hub: { name: 'Hub Central', color: 'violet', emoji: '🌌' },
    calm: { name: 'Zone de Sérénité', color: 'blue', emoji: '🫧' },
    creative: { name: 'Quartier Créatif', color: 'pink', emoji: '🎨' },
    wisdom: { name: 'Jardin de Sagesse', color: 'emerald', emoji: '🌿' },
    explore: { name: 'Espace Exploration', color: 'indigo', emoji: '🌠' },
    energy: { name: 'Zone d\'Énergie', color: 'amber', emoji: '⚡' },
    challenge: { name: 'Arène des Défis', color: 'red', emoji: '⚔️' },
    social: { name: 'Village Social', color: 'green', emoji: '🤝' }
  };

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
        value: Math.floor(Math.random() * 30) + 1,
        unit: 'jours',
        icon: Calendar,
        gradient: 'from-green-500/20 to-emerald-500/20',
        description: 'Continuité de ton engagement'
      }
    ];
  }, [attractions, visitedAttractions, unlockedBadges, zones]);

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
                >
                  <X className="h-4 w-4" />
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
            >
              <ChevronDown className={`h-4 w-4 transition-transform ${showStatistics ? 'rotate-180' : ''}`} />
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
                      className="relative overflow-hidden rounded-lg bg-gradient-to-br p-4 border border-border/50 hover:border-primary/50 transition-all"
                      style={{
                        backgroundImage: `linear-gradient(to bottom right, var(--${stat.gradient.split(' ')[1].split('-')[0]}), var(--${stat.gradient.split(' ')[3].split('-')[0]}))`
                      }}
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
            onClick={() => navigate('/app/leaderboard')}
            className="flex items-center gap-2"
          >
            <Trophy className="h-4 w-4" />
            Classement
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/app/daily-challenges')}
            className="flex items-center gap-2"
          >
            <Target className="h-4 w-4" />
            Défis
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/app/achievements')}
            className="flex items-center gap-2"
          >
            <Award className="h-4 w-4" />
            Succès
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
                          className={`relative ${tourActive && currentStep?.attractionId === attraction.id ? 'ring-4 ring-primary rounded-xl animate-pulse' : ''}`}
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
                            >
                              <Star className="h-3 w-3 fill-current" />
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
                      className="relative"
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
                        >
                          <Star className="h-3 w-3 fill-current" />
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
    </div>
  );
}
