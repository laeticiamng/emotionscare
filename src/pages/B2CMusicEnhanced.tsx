/**
 * B2C MUSIC ENHANCED - EmotionsCare
 * Interface vinyles thérapeutiques avec player audio unifié
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePageSEO } from '@/hooks/usePageSEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Play, 
  Music,
  Disc3,
  Heart,
  Brain,
  Zap,
  Sparkles,
  ArrowLeft,
  Loader2,
  Clock,
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMusic } from '@/hooks/useMusic';
import { useMusicFavorites } from '@/hooks/useMusicFavorites';
import { useAudioUrls } from '@/hooks/useAudioUrls';
import { UniverseEngine } from '@/components/universe/UniverseEngine';
import { RewardSystem } from '@/components/rewards/RewardSystem';
import { getOptimizedUniverse } from '@/data/universes/config';
import { useOptimizedAnimation } from '@/hooks/useOptimizedAnimation';
import { UnifiedMusicPlayer } from '@/components/music/UnifiedMusicPlayer';
import { EmotionalMusicGenerator } from '@/components/music/EmotionalMusicGenerator';
import { MusicJourneyPlayer } from '@/components/music/MusicJourneyPlayer';
import { AutoMixPlayer } from '@/components/music/AutoMixPlayer';
import { FocusFlowPlayer } from '@/components/music/FocusFlowPlayer';
import { CollaborativeSessionLobby } from '@/components/focus/CollaborativeSessionLobby';
import { FocusAnalyticsDashboard } from '@/components/analytics/FocusAnalyticsDashboard';
import { PushNotificationSetup } from '@/components/notifications/PushNotificationSetup';
import { VoiceCoach } from '@/components/coach/VoiceCoach';
import VoiceCommands from '@/components/voice/VoiceCommands';
import { MLRecommendationsPanel } from '@/components/ml/MLRecommendationsPanel';
import MusicGamificationPanel from '@/components/gamification/MusicGamificationPanel';
import { QuestsPanel } from '@/components/gamification/QuestsPanel';
import { LeaderboardPanel } from '@/components/gamification/LeaderboardPanel';
import { SunoServiceStatus } from '@/components/music/SunoServiceStatus';
import type { MusicTrack } from '@/types/music';
import { logger } from '@/lib/logger';
import { useMusicJourney } from '@/hooks/useMusicJourney';
import { useGamification } from '@/hooks/useGamification';

interface VinylTrack extends MusicTrack {
  category: 'doux' | 'énergique' | 'créatif' | 'guérison';
  color: string;
  vinylColor: string;
  description: string;
  waveform?: number[];
}

// Configuration des URLs audio avec mapping Supabase + fallback
const AUDIO_URL_CONFIG = {
  'vinyl-1': {
    fileName: 'ambient-soft.mp3',
    fallbackUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  'vinyl-2': {
    fileName: 'focus-clarity.mp3',
    fallbackUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  'vinyl-3': {
    fileName: 'creative-flow.mp3',
    fallbackUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  'vinyl-4': {
    fileName: 'healing-waves.mp3',
    fallbackUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  }
} as const;

// Tracks de base (sans URLs, seront ajoutées dynamiquement)
const vinylTracksBase: Omit<VinylTrack, 'url' | 'audioUrl'>[] = [
  {
    id: 'vinyl-1',
    title: 'Sérénité Fluide',
    artist: 'Studio EmotionsCare',
    duration: 180,
    category: 'doux',
    mood: 'Calme océanique',
    color: 'from-blue-500 to-cyan-400',
    vinylColor: 'bg-gradient-to-br from-blue-400 via-cyan-300 to-blue-200',
    description: 'Ambiance douce et apaisante',
    waveform: Array.from({ length: 100 }, () => Math.random() * 0.8 + 0.2),
  },
  {
    id: 'vinyl-2',
    title: 'Énergie Vibrante',
    artist: 'Studio EmotionsCare',
    duration: 210,
    category: 'énergique',
    mood: 'Dynamisme positif',
    color: 'from-orange-500 to-red-400',
    vinylColor: 'bg-gradient-to-br from-orange-400 via-red-300 to-orange-200',
    description: 'Boost d\'énergie et motivation',
    waveform: Array.from({ length: 100 }, () => Math.random() * 0.9 + 0.3),
  },
  {
    id: 'vinyl-3',
    title: 'Focus Mental',
    artist: 'Studio EmotionsCare',
    duration: 240,
    category: 'créatif',
    mood: 'Concentration pure',
    color: 'from-purple-500 to-indigo-400',
    vinylColor: 'bg-gradient-to-br from-purple-400 via-indigo-300 to-purple-200',
    description: 'Concentration optimale pour créer',
    waveform: Array.from({ length: 100 }, () => Math.random() * 0.7 + 0.3),
  },
  {
    id: 'vinyl-4',
    title: 'Réparation Émotionnelle',
    artist: 'Studio EmotionsCare',
    duration: 270,
    category: 'guérison',
    mood: 'Bien-être intérieur',
    color: 'from-green-500 to-emerald-400',
    vinylColor: 'bg-gradient-to-br from-green-400 via-emerald-300 to-green-200',
    description: 'Sons thérapeutiques pour guérir',
    waveform: Array.from({ length: 100 }, () => Math.random() * 0.6 + 0.4),
  },
];

const categoryIcons = {
  doux: Heart,
  créatif: Sparkles,
  énergique: Zap,
  guérison: Brain,
};

const B2CMusicEnhanced: React.FC = () => {
  usePageSEO({
    title: 'Musicothérapie IA - Musique personnalisée',
    description: 'Écoutez des musiques générées par IA adaptées à vos émotions. Bibliothèque personnalisée, playlists bien-être, recommandations intelligentes.',
    keywords: 'musicothérapie, musique IA, playlists émotions, bien-être musical'
  });

  const { toast } = useToast();
  const musicFavorites = useMusicFavorites();
  
  // Charger les URLs audio de manière asynchrone avec fallback
  const { urls: audioUrls, isLoading: audioUrlsLoading } = useAudioUrls(AUDIO_URL_CONFIG);
  
  // Créer les tracks avec les URLs chargées
  const vinylTracks: VinylTrack[] = useMemo(() => {
    return vinylTracksBase.map(track => ({
      ...track,
      url: audioUrls[track.id] || AUDIO_URL_CONFIG[track.id as keyof typeof AUDIO_URL_CONFIG]?.fallbackUrl || '',
      audioUrl: audioUrls[track.id] || AUDIO_URL_CONFIG[track.id as keyof typeof AUDIO_URL_CONFIG]?.fallbackUrl || ''
    }));
  }, [audioUrls]);
  
  // Protection du contexte Music
  let musicContext;
  try {
    musicContext = useMusic();
  } catch (error) {
    logger.error('MusicContext not available', error as Error, 'MUSIC');
    return (
      <div className="min-h-full bg-background p-8 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center space-y-4">
            <Music className="h-12 w-12 mx-auto text-muted-foreground" />
            <h2 className="text-xl font-semibold text-foreground">Service musical indisponible</h2>
            <p className="text-muted-foreground">Le service de musique n'est pas disponible actuellement.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { updateChallengeProgress } = useGamification();
  
  const { state, play, setPlaylist } = musicContext;
  const { createJourney, getUserJourneys } = useMusicJourney();
  
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem('music:favorites');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [lastPlayedId, setLastPlayedId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem('music:lastPlayed');
    } catch {
      return null;
    }
  });

  const [showReward, setShowReward] = useState(false);
  const [playerVisible, setPlayerVisible] = useState(false);
  const [loadingTrackId, setLoadingTrackId] = useState<string | null>(null);
  const [showJourney, setShowJourney] = useState(false);
  const [activeJourneyId, setActiveJourneyId] = useState<string | null>(null);
  const [playHistory, setPlayHistory] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem('music:history');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [voiceCoachEnabled, setVoiceCoachEnabled] = useState(true);
  const [sessionState, setSessionState] = useState<'idle' | 'active' | 'break' | 'completed'>('idle');

  const universe = getOptimizedUniverse('music');
  const { entranceVariants, cleanupAnimation } = useOptimizedAnimation({
    enableComplexAnimations: !prefersReducedMotion,
    useCSSAnimations: true,
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    // Set playlist on mount
    setPlaylist(vinylTracks);
  }, [setPlaylist]);

  useEffect(() => {
    return () => cleanupAnimation();
  }, [cleanupAnimation]);

  const resumeTrack = lastPlayedId ? vinylTracks.find(track => track.id === lastPlayedId) ?? null : null;

  const startTrack = async (track: VinylTrack) => {
    setLoadingTrackId(track.id);
    try {
      setPlayerVisible(true); // Afficher le player AVANT la lecture
      await play(track);
      setLastPlayedId(track.id);
      
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem('music:lastPlayed', track.id);
        } catch {}
      }

      // Gamification: incrémenter défi d'écoute quotidienne
      await updateChallengeProgress('1', 1);

      toast({
        title: "Vinyle en rotation ♪",
        description: `${track.title} compose ton aura sonore`,
      });
    } catch (error) {
      logger.error('Failed to start track', error as Error, 'MUSIC');
      toast({
        title: "Erreur de lecture",
        description: "Impossible de lire ce vinyle. Essaie un autre.",
        variant: "destructive"
      });
    } finally {
      setLoadingTrackId(null);
    }
  };

  const handleBackToSelection = () => {
    setPlayerVisible(false);
  };

  return (
    <div className="min-h-full bg-background p-8">
      {showReward && (
        <RewardSystem
          type="crystal"
          message="Harmonie créée ♪"
          onComplete={() => setShowReward(false)}
        />
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-accent to-accent/80">
            <Music className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Musicothérapie</h1>
            <p className="text-muted-foreground">Playlists thérapeutiques personnalisées</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <TooltipProvider>
        <div>
          {!playerVisible ? (
            <div className="space-y-12">
              {/* Introduction */}
            <div className="text-center space-y-6">
              <div
                className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
                style={{ 
                  background: `linear-gradient(135deg, ${universe.ambiance.colors.primary}, ${universe.ambiance.colors.accent})` 
                }}
              >
                <Disc3 className="h-10 w-10 text-primary-foreground" />
              </div>
              
              <h2 className="text-4xl font-light text-foreground tracking-wide">
                Vinyles en Apesanteur
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
                Choisis ton vinyle et laisse-le composer ton aura sonore.
                Chaque mélodie s'adapte à ton état pour créer l'harmonie parfaite.
              </p>
            </div>

            {/* Suno Service Status */}
            <div className="max-w-4xl mx-auto mb-8">
              <SunoServiceStatus />
            </div>

            {/* AI Emotional Music Generator */}
            <div className="max-w-4xl mx-auto">
              <EmotionalMusicGenerator />
            </div>

            {/* ML Recommendations Panel */}
            <div className="max-w-4xl mx-auto mt-8">
              <MLRecommendationsPanel 
                currentEmotion={state.currentTrack?.emotion || 'calm'}
                userId="demo-user"
                onApplySunoParams={(params) => {
                  toast({
                    title: 'Paramètres Suno appliqués',
                    description: `Style: ${params.optimalStyle}, BPM: ${params.optimalBpm}`,
                  });
                  logger.info('Suno params applied', params, 'ML');
                }}
              />
            </div>

            {/* Gamification Panel */}
            <div className="max-w-4xl mx-auto mt-8 space-y-6">
              <MusicGamificationPanel />
              
              {/* Quêtes quotidiennes et hebdomadaires */}
              <QuestsPanel />
              
              {/* Leaderboard social */}
              <LeaderboardPanel />
            </div>

            {/* Journey Section */}
            <Card className="max-w-4xl mx-auto bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-purple-500" />
                  Parcours Musical Guidé
                </CardTitle>
                <p className="text-muted-foreground">
                  Un voyage progressif de 3 à 5 étapes pour transformer votre état émotionnel
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {!showJourney ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Button
                        variant="outline"
                        className="h-auto py-4 flex-col gap-2"
                        onClick={async () => {
                          const journey = await createJourney('anxious', 'calm');
                          if (journey) {
                            setActiveJourneyId(journey.id);
                            setShowJourney(true);
                          }
                        }}
                      >
                        <span className="text-2xl">😰 → 😌</span>
                        <span className="text-xs">Anxiété → Calme</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-auto py-4 flex-col gap-2"
                        onClick={async () => {
                          const journey = await createJourney('sad', 'joy');
                          if (journey) {
                            setActiveJourneyId(journey.id);
                            setShowJourney(true);
                          }
                        }}
                      >
                        <span className="text-2xl">😢 → 😊</span>
                        <span className="text-xs">Tristesse → Joie</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-auto py-4 flex-col gap-2"
                        onClick={async () => {
                          const journey = await createJourney('anger', 'calm');
                          if (journey) {
                            setActiveJourneyId(journey.id);
                            setShowJourney(true);
                          }
                        }}
                      >
                        <span className="text-2xl">😠 → 😌</span>
                        <span className="text-xs">Colère → Calme</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-auto py-4 flex-col gap-2"
                        onClick={async () => {
                          const journey = await createJourney('stressed', 'energetic');
                          if (journey) {
                            setActiveJourneyId(journey.id);
                            setShowJourney(true);
                          }
                        }}
                      >
                        <span className="text-2xl">😓 → ⚡</span>
                        <span className="text-xs">Stress → Énergie</span>
                      </Button>
                    </div>
                    <p className="text-sm text-center text-muted-foreground">
                      Choisissez votre parcours pour commencer
                    </p>
                  </div>
                ) : activeJourneyId ? (
                  <div className="space-y-4">
                    <Button
                      variant="ghost"
                      onClick={() => setShowJourney(false)}
                      className="mb-4"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Retour aux parcours
                    </Button>
                    <MusicJourneyPlayer 
                      journeyId={activeJourneyId}
                      onComplete={() => {
                        setShowJourney(false);
                        setActiveJourneyId(null);
                        toast({ 
                          title: '🎉 Parcours terminé !',
                          description: 'Félicitations pour votre progression'
                        });
                      }}
                    />
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {/* AutoMix Section */}
            <div className="max-w-4xl mx-auto">
              <AutoMixPlayer />
            </div>

            {/* Focus Flow Section */}
            <div className="max-w-4xl mx-auto">
              <FocusFlowPlayer />
            </div>

            {/* Collaborative Focus Section */}
            <div className="max-w-6xl mx-auto">
              <CollaborativeSessionLobby />
            </div>

            {/* Focus Analytics Dashboard */}
            <div className="max-w-6xl mx-auto">
              <FocusAnalyticsDashboard />
            </div>

            {/* Push Notifications */}
            <div className="max-w-4xl mx-auto">
              <PushNotificationSetup />
            </div>

            {/* Favorites Section */}
            {musicFavorites.favorites.length > 0 && (
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <h3 className="text-lg font-semibold text-foreground">Tes Favoris</h3>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {vinylTracks.filter(t => musicFavorites.isFavorite(t.id)).map(track => (
                    <Card
                      key={track.id}
                      className="min-w-[200px] cursor-pointer hover:shadow-lg transition-all"
                      onClick={() => startTrack(track)}
                    >
                      <CardContent className="p-4 space-y-2">
                        <div
                          className="w-16 h-16 mx-auto rounded-full"
                          style={{ background: track.vinylColor }}
                        />
                        <p className="text-sm font-medium text-center truncate">{track.title}</p>
                        <Button size="sm" className="w-full" disabled={loadingTrackId === track.id}>
                          {loadingTrackId === track.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Play className="h-3 w-3" />
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* History Section */}
            {playHistory.length > 0 && (
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold text-foreground">Récemment Écoutés</h3>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {vinylTracks.filter(t => playHistory.includes(t.id))
                    .sort((a, b) => playHistory.indexOf(a.id) - playHistory.indexOf(b.id))
                    .slice(0, 5)
                    .map(track => (
                      <Card
                        key={track.id}
                        className="min-w-[200px] cursor-pointer hover:shadow-lg transition-all"
                        onClick={() => startTrack(track)}
                      >
                        <CardContent className="p-4 space-y-2">
                          <div
                            className="w-16 h-16 mx-auto rounded-full"
                            style={{ background: track.vinylColor }}
                          />
                          <p className="text-sm font-medium text-center truncate">{track.title}</p>
                          <Button size="sm" className="w-full" disabled={loadingTrackId === track.id}>
                            {loadingTrackId === track.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Play className="h-3 w-3" />
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            )}

            {resumeTrack && (
              <div className="flex justify-center">
                <Button
                  variant="secondary"
                  onClick={() => startTrack(resumeTrack)}
                  className="px-6"
                  disabled={loadingTrackId === resumeTrack.id}
                >
                  {loadingTrackId === resumeTrack.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Chargement...
                    </>
                  ) : (
                    'Reprendre la session'
                  )}
                </Button>
              </div>
            )}

            {/* Vinyl Collection */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
              {vinylTracks.map((track, index) => {
                const Icon = categoryIcons[track.category];
                const isFavorite = musicFavorites.isFavorite(track.id);
                const isLoading = loadingTrackId === track.id;
                
                return (
                  <Tooltip key={track.id}>
                    <TooltipTrigger asChild>
                      <div>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Card
                            role="button"
                            tabIndex={0}
                            aria-label={`Lancer le vinyle ${track.title} de ${track.artist}, catégorie ${track.category}`}
                            className="h-full bg-card/90 backdrop-blur-md hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                            onClick={() => !isLoading && startTrack(track)}
                            onKeyDown={(e) => {
                              if (!isLoading && (e.key === 'Enter' || e.key === ' ')) {
                                e.preventDefault();
                                startTrack(track);
                              }
                            }}
                          >
                            <CardContent className="p-6 space-y-4">
                              {/* Vinyl Disc */}
                              <div className="relative">
                                <motion.div
                                  animate={isLoading ? { rotate: 360 } : {}}
                                  transition={isLoading ? { duration: 2, repeat: Infinity, ease: "linear" } : {}}
                                  className="w-24 h-24 mx-auto rounded-full relative overflow-hidden"
                                  style={{ background: track.vinylColor }}
                                >
                                  {/* Vinyl grooves */}
                                  <div className="absolute inset-2 rounded-full border-2 border-foreground/20" />
                                  <div className="absolute inset-4 rounded-full border border-foreground/20" />
                                  <div className="absolute inset-6 rounded-full border border-foreground/20" />
                                  
                                  {/* Center hole */}
                                  <div className="absolute top-1/2 left-1/2 w-6 h-6 -mt-3 -ml-3 rounded-full bg-card border-2 border-foreground/30 flex items-center justify-center">
                                    {isLoading ? (
                                      <Loader2 className="w-3 h-3 animate-spin" style={{ color: track.color }} />
                                    ) : (
                                      <Icon className="w-3 h-3" style={{ color: track.color }} />
                                    )}
                                  </div>
                                </motion.div>
                                
                                {/* Floating effect */}
                                <div 
                                  className="absolute -inset-2 rounded-full opacity-30 blur-md"
                                  style={{ background: track.vinylColor }}
                                />
                              </div>
                        
                        <div className="text-center space-y-2">
                          <h3 className="text-lg font-medium text-foreground">
                            {track.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {track.artist}
                          </p>
                          
                          <Badge
                            variant="secondary"
                            className="text-xs"
                            style={{
                              backgroundColor: `${track.color}20`,
                              color: track.color
                            }}
                          >
                            {track.mood}
                          </Badge>

                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {track.description}
                          </p>

                          <div className="pt-2 space-y-2">
                            <Button
                              size="sm"
                              className="w-full"
                              aria-label={`Lancer ${track.title}`}
                              disabled={isLoading}
                              style={{
                                backgroundColor: `${track.color}15`,
                                color: track.color,
                                borderColor: `${track.color}30`
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                startTrack(track);
                              }}
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="h-3 w-3 mr-2 animate-spin" aria-hidden="true" />
                                  Chargement...
                                </>
                              ) : (
                                <>
                                  <Play className="h-3 w-3 mr-2" aria-hidden="true" />
                                  Lancer le vinyle
                                </>
                              )}
                            </Button>
                            <Button
                              variant={isFavorite ? 'secondary' : 'ghost'}
                              size="sm"
                              className="w-full"
                              aria-label={isFavorite ? `Retirer ${track.title} des favoris` : `Ajouter ${track.title} aux favoris`}
                              aria-pressed={isFavorite}
                              disabled={musicFavorites.isLoading}
                              onClick={(e) => {
                                e.stopPropagation();
                                musicFavorites.toggleFavorite(track);
                              }}
                            >
                              <Heart className={`h-3 w-3 mr-2 ${isFavorite ? 'fill-current text-destructive' : ''}`} aria-hidden="true" />
                              {isFavorite ? 'Favori' : 'Ajouter'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <div className="space-y-1">
                  <p className="font-semibold">{track.title}</p>
                  <p className="text-xs text-muted-foreground">{track.description}</p>
                  <p className="text-xs">
                    <span className="font-medium">Mood:</span> {track.mood}
                  </p>
                  <p className="text-xs">
                    <span className="font-medium">Durée:</span> {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
                );
              })}
            </div>
          </div>
        ) : (
          <div
            className="max-w-2xl mx-auto space-y-6"
          >
            <Button
              variant="ghost"
              onClick={handleBackToSelection}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux vinyles
            </Button>

            <UnifiedMusicPlayer />
          </div>
        )}
      </div>

      <VoiceCoach
        sessionState={sessionState}
        enabled={voiceCoachEnabled}
        onToggle={setVoiceCoachEnabled}
      />
      
      <VoiceCommands />
    </TooltipProvider>
    </div>
  );
};

export default B2CMusicEnhanced;
