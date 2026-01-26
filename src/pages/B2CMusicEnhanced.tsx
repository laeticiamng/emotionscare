/**
 * B2C MUSIC ENHANCED - EmotionsCare
 * Interface vinyles thérapeutiques avec player audio unifié
 * Refactorisé avec lazy loading, memo et composants modulaires
 * Optimisé pour performance maximale
 */

import React, { useState, useEffect, useMemo, lazy, Suspense, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageSEO } from '@/hooks/usePageSEO';
import { useOptimizedPage } from '@/hooks/useOptimizedPage';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Music, ArrowLeft, Heart, Brain, Zap, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMusic } from '@/hooks/useMusic';
import { useMusicFavorites } from '@/hooks/useMusicFavorites';
import { useSunoVinyl } from '@/hooks/useSunoVinyl';
import { RewardSystem } from '@/components/rewards/RewardSystem';
import { useOptimizedAnimation } from '@/hooks/useOptimizedAnimation';
import { UnifiedMusicPlayer } from '@/components/music/UnifiedMusicPlayer';
import { VoiceCoach } from '@/components/coach/VoiceCoach';
import VoiceCommands from '@/components/voice/VoiceCommands';
import { FloatingMiniPlayer } from '@/components/music/FloatingMiniPlayer';
import { MusicPreferencesModal } from '@/components/music/MusicPreferencesModal';
import { TasteChangeNotification } from '@/components/music/TasteChangeNotification';
import type { MusicTrack } from '@/types/music';
import { logger } from '@/lib/logger';
import { useGamification } from '@/hooks/useGamification';
import { useUserMusicPreferences } from '@/hooks/useUserMusicPreferences';
import { useMusicPreferencesLearning } from '@/hooks/useMusicPreferencesLearning';
import { useTasteChangeNotifications } from '@/hooks/useTasteChangeNotifications';
import { useMusicHistory, useLastPlayedTrack } from '@/hooks/music/useMusicSettings';

// Lazy loading des sections - Optimisé pour first paint rapide
// Critique: Vinyles chargés immédiatement (above the fold)
const VinylCollection = lazy(() => import('@/components/music/page/VinylCollection').then(m => ({ default: m.VinylCollection })));

// Haute priorité - Visible rapidement
const MusicStatsSection = lazy(() => import('@/components/music/page/MusicStatsSection').then(m => ({ default: m.MusicStatsSection })));
const MusicSearchAndFilter = lazy(() => import('@/components/music/MusicSearchAndFilter').then(m => ({ default: m.MusicSearchAndFilter })));

// Moyenne priorité - Interaction utilisateur
const MusicGamificationSection = lazy(() => import('@/components/music/page/MusicGamificationSection').then(m => ({ default: m.MusicGamificationSection })));
const MusicJourneySection = lazy(() => import('@/components/music/page/MusicJourneySection').then(m => ({ default: m.MusicJourneySection })));

// Basse priorité - Chargé en idle
const MusicGeneratorSection = lazy(() => import('@/components/music/page/MusicGeneratorSection').then(m => ({ default: m.MusicGeneratorSection })));
const MusicFocusSection = lazy(() => import('@/components/music/page/MusicFocusSection').then(m => ({ default: m.MusicFocusSection })));
const CollaborativePlaylistSection = lazy(() => import('@/components/music/page/CollaborativePlaylistSection').then(m => ({ default: m.CollaborativePlaylistSection })));
const ExternalIntegrationsPanel = lazy(() => import('@/components/music/ExternalIntegrationsPanel').then(m => ({ default: m.ExternalIntegrationsPanel })));
const ImmersiveMode = lazy(() => import('@/components/music/ImmersiveMode').then(m => ({ default: m.ImmersiveMode })));

// Nouveaux composants enrichis
import { QuotaWarningBanner } from '@/components/music/QuotaWarningBanner';
import { EmotionLinkBanner } from '@/components/music/EmotionLinkBanner';
import { MusicPageHeaderEnhanced } from '@/components/music/MusicPageHeaderEnhanced';
import { MusicStatsDrawer } from '@/components/music/MusicStatsDrawer';

// Composants statiques chargés immédiatement
import {
  VinylIntroduction,
  MusicFavoritesSection,
  MusicHistorySection,
  MusicLibrarySection,
} from '@/components/music/page';

// Skeleton de chargement ultra-léger
const SectionSkeleton = memo(() => (
  <div className="p-4 rounded-lg border bg-card/50 animate-pulse">
    <div className="h-4 w-32 bg-muted/50 rounded mb-3" />
    <div className="h-20 bg-muted/30 rounded-lg" />
  </div>
));
SectionSkeleton.displayName = 'SectionSkeleton';

// Types
interface VinylTrack extends MusicTrack {
  category: 'doux' | 'énergique' | 'créatif' | 'guérison';
  color: string;
  vinylColor: string;
  description: string;
  waveform?: number[];
}

// Données vinyles - URL sera générée dynamiquement via Suno API
const vinylTracksBase: Omit<VinylTrack, 'url' | 'audioUrl'>[] = [
  // Catégorie Doux
  { id: 'vinyl-1', title: 'Sérénité Fluide', artist: 'Suno AI', duration: 180, category: 'doux', mood: 'Calme océanique', color: 'from-blue-500 to-cyan-400', vinylColor: 'bg-gradient-to-br from-blue-400 via-cyan-300 to-blue-200', description: 'Ambiance douce et apaisante' },
  { id: 'vinyl-5', title: 'Murmures du Soir', artist: 'Suno AI', duration: 200, category: 'doux', mood: 'Nuit paisible', color: 'from-indigo-400 to-blue-500', vinylColor: 'bg-gradient-to-br from-indigo-300 via-blue-200 to-indigo-100', description: 'Berceuse douce pour le sommeil' },
  { id: 'vinyl-9', title: 'Brume Matinale', artist: 'Suno AI', duration: 190, category: 'doux', mood: 'Éveil doux', color: 'from-slate-400 to-zinc-300', vinylColor: 'bg-gradient-to-br from-slate-300 via-zinc-200 to-slate-100', description: 'Réveil en douceur' },
  
  // Catégorie Énergique
  { id: 'vinyl-2', title: 'Énergie Vibrante', artist: 'Suno AI', duration: 210, category: 'énergique', mood: 'Dynamisme positif', color: 'from-orange-500 to-red-400', vinylColor: 'bg-gradient-to-br from-orange-400 via-red-300 to-orange-200', description: 'Boost d\'énergie et motivation' },
  { id: 'vinyl-6', title: 'Pulse Solaire', artist: 'Suno AI', duration: 195, category: 'énergique', mood: 'Énergie radiante', color: 'from-yellow-400 to-orange-500', vinylColor: 'bg-gradient-to-br from-yellow-300 via-orange-200 to-yellow-100', description: 'Vitalité du lever de soleil' },
  { id: 'vinyl-10', title: 'Feu Intérieur', artist: 'Suno AI', duration: 220, category: 'énergique', mood: 'Motivation intense', color: 'from-red-500 to-rose-400', vinylColor: 'bg-gradient-to-br from-red-400 via-rose-300 to-red-200', description: 'Puissance et détermination' },
  
  // Catégorie Créatif
  { id: 'vinyl-3', title: 'Focus Mental', artist: 'Suno AI', duration: 240, category: 'créatif', mood: 'Concentration pure', color: 'from-purple-500 to-indigo-400', vinylColor: 'bg-gradient-to-br from-purple-400 via-indigo-300 to-purple-200', description: 'Concentration optimale pour créer' },
  { id: 'vinyl-7', title: 'Étoiles Pensantes', artist: 'Suno AI', duration: 230, category: 'créatif', mood: 'Inspiration cosmique', color: 'from-violet-500 to-purple-400', vinylColor: 'bg-gradient-to-br from-violet-400 via-purple-300 to-violet-200', description: 'Créativité sans limites' },
  { id: 'vinyl-11', title: 'Flux Créatif', artist: 'Suno AI', duration: 215, category: 'créatif', mood: 'État de flow', color: 'from-fuchsia-500 to-pink-400', vinylColor: 'bg-gradient-to-br from-fuchsia-400 via-pink-300 to-fuchsia-200', description: 'Immersion créative totale' },
  
  // Catégorie Guérison
  { id: 'vinyl-4', title: 'Réparation Émotionnelle', artist: 'Suno AI', duration: 270, category: 'guérison', mood: 'Bien-être intérieur', color: 'from-green-500 to-emerald-400', vinylColor: 'bg-gradient-to-br from-green-400 via-emerald-300 to-green-200', description: 'Sons thérapeutiques pour guérir' },
  { id: 'vinyl-8', title: 'Souffle de Vie', artist: 'Suno AI', duration: 250, category: 'guérison', mood: 'Régénération profonde', color: 'from-teal-500 to-cyan-400', vinylColor: 'bg-gradient-to-br from-teal-400 via-cyan-300 to-teal-200', description: 'Respiration et renouveau' },
  { id: 'vinyl-12', title: 'Harmonie Cellulaire', artist: 'Suno AI', duration: 280, category: 'guérison', mood: 'Guérison holistique', color: 'from-lime-500 to-green-400', vinylColor: 'bg-gradient-to-br from-lime-400 via-green-300 to-lime-200', description: 'Fréquences de réparation' },
];

const categoryIcons = { doux: Heart, créatif: Sparkles, énergique: Zap, guérison: Brain };

const B2CMusicEnhanced: React.FC = () => {
  useOptimizedPage('B2CMusicEnhanced');
  usePageSEO({
    title: 'Musicothérapie IA - Musique personnalisée',
    description: 'Écoutez des musiques générées par IA adaptées à vos émotions.',
    keywords: 'musicothérapie, musique IA, playlists émotions, bien-être musical'
  });

  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const musicFavorites = useMusicFavorites();
  const { updateChallengeProgress } = useGamification();
  
  // Hook Suno pour générer la musique à la demande
  const { generateForVinyl, generationState, credits } = useSunoVinyl();
  
  // Les vinyles avec URL vide initialement - sera rempli après génération
  const vinylTracks: VinylTrack[] = useMemo(() => {
    return vinylTracksBase.map(track => ({
      ...track,
      url: '', // Sera généré dynamiquement
      audioUrl: ''
    }));
  }, []);
  
  // Mapper l'état de génération pour audioSources
  const audioSources = useMemo(() => {
    const sources: Record<string, 'supabase' | 'fallback'> = {};
    vinylTracks.forEach(track => {
      const state = generationState[track.id];
      sources[track.id] = state?.isFallback ? 'fallback' : 'supabase';
    });
    return sources;
  }, [vinylTracks, generationState]);
  
  // Protection contexte Music
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

  const { state, play, setPlaylist } = musicContext;
  
  // États locaux
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);
  const [showReward, setShowReward] = useState(false);
  const [playerVisible, setPlayerVisible] = useState(false);
  const [loadingTrackId, setLoadingTrackId] = useState<string | null>(null);
  const { value: playHistory } = useMusicHistory();
  const { setValue: setLastPlayed } = useLastPlayedTrack();
  const [voiceCoachEnabled, setVoiceCoachEnabled] = useState(true);
  const [voiceCommandsEnabled, setVoiceCommandsEnabled] = useState(false);
  const [sessionState] = useState<'idle' | 'active' | 'break' | 'completed'>('idle');
  const [showImmersive, setShowImmersive] = useState(false);
  const [showStatsDrawer, setShowStatsDrawer] = useState(false);
  
  // Préférences musicales
  const { hasPreferences, isLoading: prefsLoading, refreshPreferences } = useUserMusicPreferences();
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const { insights } = useMusicPreferencesLearning();
  const { notifications, dismissNotification } = useTasteChangeNotifications();

  const { cleanupAnimation } = useOptimizedAnimation({ enableComplexAnimations: !prefersReducedMotion, useCSSAnimations: true });

  // Effects
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => { setPlaylist(vinylTracks); }, [setPlaylist, vinylTracks]);
  useEffect(() => { return () => cleanupAnimation(); }, [cleanupAnimation]);

  useEffect(() => {
    if (!prefsLoading && !hasPreferences) {
      const timer = setTimeout(() => setShowPreferencesModal(true), 800);
      return () => clearTimeout(timer);
    }
  }, [prefsLoading, hasPreferences]);

  useEffect(() => {
    if (insights?.tasteChangeDetected && insights.confidence > 0.7) {
      toast({ title: '🎵 Évolution de vos goûts détectée', description: 'Vos préférences musicales ont évolué.' });
    }
  }, [insights, toast]);

  // Handler pour démarrer un vinyl - génère via Suno API puis joue
  const startTrack = useCallback(async (track: VinylTrack) => {
    setLoadingTrackId(track.id);
    try {
      // Générer la musique via Suno API
      const audioUrl = await generateForVinyl(track.id, track.category, track.title);
      
      if (!audioUrl) {
        throw new Error('Failed to generate audio');
      }
      
      // Créer une copie du track avec l'URL générée
      const trackWithUrl: VinylTrack = {
        ...track,
        url: audioUrl,
        audioUrl: audioUrl
      };
      
      setPlayerVisible(true);
      await play(trackWithUrl);
      setLastPlayed(track.id);
      await updateChallengeProgress('1', 1);
      
      const isFallback = generationState[track.id]?.isFallback;
      if (!isFallback) {
        toast({ title: "🎵 Musique IA générée", description: `${track.title} - créée par Suno AI` });
      }
    } catch (error) {
      logger.error('Failed to start track', error as Error, 'MUSIC');
      toast({ title: "Erreur de lecture", description: "Impossible de lire ce vinyle.", variant: "destructive" });
    } finally {
      setLoadingTrackId(null);
    }
  }, [play, setLastPlayed, updateChallengeProgress, toast, generateForVinyl, generationState]);

  // Handler pour next/previous via contexte
  const handleNext = useCallback(() => {
    if (musicContext?.next) {
      musicContext.next();
    }
  }, [musicContext]);

  const handlePrevious = useCallback(() => {
    if (musicContext?.previous) {
      musicContext.previous();
    }
  }, [musicContext]);

  const handlePlayPause = useCallback(() => {
    if (!state.currentTrack) return;
    if (state.isPlaying) {
      musicContext?.pause();
    } else {
      play(state.currentTrack);
    }
  }, [state.currentTrack, state.isPlaying, musicContext, play]);

  return (
    <div className="min-h-full bg-background p-8">
      {showReward && <RewardSystem type="crystal" message="Harmonie créée ♪" onComplete={() => setShowReward(false)} />}

      <MusicPageHeaderEnhanced 
        hasPreferences={hasPreferences} 
        onOpenPreferences={() => setShowPreferencesModal(true)}
        onOpenImmersive={() => state.currentTrack && setShowImmersive(true)}
        voiceEnabled={voiceCommandsEnabled}
        onToggleVoice={() => setVoiceCommandsEnabled(!voiceCommandsEnabled)}
        onOpenStats={() => setShowStatsDrawer(true)}
      />

      <MusicStatsDrawer 
        open={showStatsDrawer} 
        onClose={() => setShowStatsDrawer(false)} 
      />

      <MusicPreferencesModal
        open={showPreferencesModal}
        onClose={() => setShowPreferencesModal(false)}
        onComplete={() => {
          refreshPreferences();
          toast({ title: 'Préférences enregistrées !', description: 'Vos recommandations seront personnalisées.' });
        }}
      />

      {notifications.map(notification => (
        <TasteChangeNotification
          key={notification.id}
          suggestedGenres={notification.suggestedGenres}
          confidence={notification.confidence}
          onDismiss={() => dismissNotification(notification.id)}
          onViewAnalytics={() => navigate('/app/music/analytics')}
        />
      ))}

      <TooltipProvider>
        <div>
          {!playerVisible ? (
            <div className="space-y-8">
              {/* Quota Warning */}
              <QuotaWarningBanner 
                remaining={generationState ? Object.keys(generationState).length : credits.remaining}
                total={credits.total}
                onUseFallback={() => {
                  const demoTrack = vinylTracks[0];
                  if (demoTrack) startTrack(demoTrack);
                }}
              />

              {/* Lien avec émotions */}
              <EmotionLinkBanner
                onGenerateForEmotion={(mood) => {
                  // Trouver un vinyl correspondant à l'humeur
                  const moodMap: Record<string, string> = {
                    calm: 'doux',
                    energize: 'énergique',
                    focus: 'créatif',
                    meditation: 'guérison',
                  };
                  const category = moodMap[mood] || 'doux';
                  const matchingTrack = vinylTracks.find(t => t.category === category);
                  if (matchingTrack) startTrack(matchingTrack);
                }}
              />

              <VinylIntroduction />

              {/* Vinyles - Priorité haute */}
              <Suspense fallback={<SectionSkeleton />}>
                <VinylCollection
                  tracks={vinylTracks}
                  audioSources={audioSources}
                  loadingTrackId={loadingTrackId}
                  categoryIcons={categoryIcons}
                  isFavorite={(id) => musicFavorites.isFavorite(id)}
                  isLoadingFavorites={musicFavorites.isLoading}
                  onStartTrack={startTrack}
                  onToggleFavorite={(track) => musicFavorites.toggleFavorite(track)}
                />
              </Suspense>

              {/* Favoris & Historique - Immédiat */}
              <MusicFavoritesSection
                tracks={vinylTracks}
                favoriteIds={musicFavorites.favorites}
                loadingTrackId={loadingTrackId}
                onStartTrack={(track) => startTrack(track as VinylTrack)}
              />

              <MusicHistorySection
                tracks={vinylTracks}
                playHistory={playHistory}
                loadingTrackId={loadingTrackId}
                onStartTrack={(track) => startTrack(track as VinylTrack)}
              />

              {/* 🔥 BIBLIOTHÈQUE - Musiques générées sauvegardées */}
              <MusicLibrarySection 
                onPlayTrack={(track) => {
                  const vinylTrack: VinylTrack = {
                    ...track,
                    category: 'doux',
                    color: 'from-primary to-primary/50',
                    vinylColor: 'bg-gradient-to-br from-primary/40 via-primary/20 to-primary/10',
                    description: track.mood || 'Musique générée',
                  };
                  startTrack(vinylTrack);
                }}
              />

              {/* Stats - Priorité moyenne */}
              <Suspense fallback={<SectionSkeleton />}>
                <MusicStatsSection />
              </Suspense>

              {/* Gamification - Priorité moyenne */}
              <Suspense fallback={<SectionSkeleton />}>
                <MusicGamificationSection />
              </Suspense>

              {/* Parcours - Priorité moyenne */}
              <Suspense fallback={<SectionSkeleton />}>
                <MusicJourneySection />
              </Suspense>

              {/* Recherche */}
              <Suspense fallback={<SectionSkeleton />}>
                <MusicSearchAndFilter
                  tracks={vinylTracks}
                  onTrackSelect={(track) => startTrack(track as VinylTrack)}
                />
              </Suspense>

              {/* Sections basse priorité */}
              <Suspense fallback={<SectionSkeleton />}>
                <MusicGeneratorSection 
                  currentEmotion={state.currentTrack?.emotion || 'calm'} 
                  userId={user?.id || 'anonymous'} 
                />
              </Suspense>

              <Suspense fallback={<SectionSkeleton />}>
                <MusicFocusSection />
              </Suspense>

              <Suspense fallback={<SectionSkeleton />}>
                <CollaborativePlaylistSection />
              </Suspense>

              <Suspense fallback={<SectionSkeleton />}>
                <ExternalIntegrationsPanel />
              </Suspense>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-6">
              <Button variant="ghost" onClick={() => setPlayerVisible(false)} className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux vinyles
              </Button>
              <UnifiedMusicPlayer />
            </div>
          )}
        </div>

        <VoiceCoach sessionState={sessionState} enabled={voiceCoachEnabled} onToggle={setVoiceCoachEnabled} />
        {voiceCommandsEnabled && <VoiceCommands />}

        <FloatingMiniPlayer
          currentTrack={state.currentTrack}
          isPlaying={state.isPlaying}
          progress={state.progress}
          duration={state.currentTrack?.duration}
          volume={state.volume}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onExpand={() => setPlayerVisible(true)}
          onImmersive={() => setShowImmersive(true)}
          onSeek={(timeInSeconds) => musicContext?.seek?.(timeInSeconds)}
          onVolumeChange={(vol) => musicContext?.setVolume?.(vol)}
          isDocked={playerVisible}
        />

        {/* Immersive Mode */}
        <Suspense fallback={null}>
          <ImmersiveMode
            track={state.currentTrack || undefined}
            isPlaying={state.isPlaying}
            progress={state.progress}
            volume={state.volume * 100}
            isOpen={showImmersive}
            onClose={() => setShowImmersive(false)}
            onPlay={() => state.currentTrack && play(state.currentTrack)}
            onPause={() => musicContext?.pause()}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSeek={(pos) => musicContext?.seek?.(pos)}
            onVolumeChange={(vol) => musicContext?.setVolume?.(vol / 100)}
          />
        </Suspense>
      </TooltipProvider>
    </div>
  );
};

export default B2CMusicEnhanced;
