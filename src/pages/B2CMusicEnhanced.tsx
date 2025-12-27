/**
 * B2C MUSIC ENHANCED - EmotionsCare
 * Interface vinyles thérapeutiques avec player audio unifié
 * Refactorisé avec lazy loading et composants modulaires
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageSEO } from '@/hooks/usePageSEO';
import { useOptimizedPage } from '@/hooks/useOptimizedPage';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Music, ArrowLeft, Loader2, Heart, Brain, Zap, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMusic } from '@/hooks/useMusic';
import { useMusicFavorites } from '@/hooks/useMusicFavorites';
import { useAudioUrls } from '@/hooks/useAudioUrls';
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

// Composants de page modulaires
import {
  MusicPageHeader,
  VinylIntroduction,
  VinylCollection,
  MusicFavoritesSection,
  MusicHistorySection,
  MusicJourneySection,
  MusicGamificationSection,
  MusicFocusSection,
  MusicGeneratorSection
} from '@/components/music/page';

// Types
interface VinylTrack extends MusicTrack {
  category: 'doux' | 'énergique' | 'créatif' | 'guérison';
  color: string;
  vinylColor: string;
  description: string;
  waveform?: number[];
}

// Configuration audio
const AUDIO_URL_CONFIG = {
  'vinyl-1': { fileName: 'ambient-soft.mp3', fallbackUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  'vinyl-2': { fileName: 'focus-clarity.mp3', fallbackUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  'vinyl-3': { fileName: 'creative-flow.mp3', fallbackUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  'vinyl-4': { fileName: 'healing-waves.mp3', fallbackUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' }
} as const;

// Données vinyles
const vinylTracksBase: Omit<VinylTrack, 'url' | 'audioUrl'>[] = [
  { id: 'vinyl-1', title: 'Sérénité Fluide', artist: 'Studio EmotionsCare', duration: 180, category: 'doux', mood: 'Calme océanique', color: 'from-blue-500 to-cyan-400', vinylColor: 'bg-gradient-to-br from-blue-400 via-cyan-300 to-blue-200', description: 'Ambiance douce et apaisante' },
  { id: 'vinyl-2', title: 'Énergie Vibrante', artist: 'Studio EmotionsCare', duration: 210, category: 'énergique', mood: 'Dynamisme positif', color: 'from-orange-500 to-red-400', vinylColor: 'bg-gradient-to-br from-orange-400 via-red-300 to-orange-200', description: 'Boost d\'énergie et motivation' },
  { id: 'vinyl-3', title: 'Focus Mental', artist: 'Studio EmotionsCare', duration: 240, category: 'créatif', mood: 'Concentration pure', color: 'from-purple-500 to-indigo-400', vinylColor: 'bg-gradient-to-br from-purple-400 via-indigo-300 to-purple-200', description: 'Concentration optimale pour créer' },
  { id: 'vinyl-4', title: 'Réparation Émotionnelle', artist: 'Studio EmotionsCare', duration: 270, category: 'guérison', mood: 'Bien-être intérieur', color: 'from-green-500 to-emerald-400', vinylColor: 'bg-gradient-to-br from-green-400 via-emerald-300 to-green-200', description: 'Sons thérapeutiques pour guérir' },
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
  
  const { urls: audioUrls, sources: audioSources } = useAudioUrls(AUDIO_URL_CONFIG);
  
  const vinylTracks: VinylTrack[] = useMemo(() => {
    return vinylTracksBase.map(track => ({
      ...track,
      url: audioUrls[track.id] || AUDIO_URL_CONFIG[track.id as keyof typeof AUDIO_URL_CONFIG]?.fallbackUrl || '',
      audioUrl: audioUrls[track.id] || AUDIO_URL_CONFIG[track.id as keyof typeof AUDIO_URL_CONFIG]?.fallbackUrl || ''
    }));
  }, [audioUrls]);
  
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
  const [playHistory, setPlayHistory] = useState<string[]>(() => {
    try { return JSON.parse(window.localStorage.getItem('music:history') || '[]'); } catch { return []; }
  });
  const [voiceCoachEnabled, setVoiceCoachEnabled] = useState(true);
  const [sessionState] = useState<'idle' | 'active' | 'break' | 'completed'>('idle');
  
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

  // Handlers
  const startTrack = async (track: VinylTrack) => {
    setLoadingTrackId(track.id);
    try {
      setPlayerVisible(true);
      await play(track);
      window.localStorage.setItem('music:lastPlayed', track.id);
      await updateChallengeProgress('1', 1);
      toast({ title: "Vinyle en rotation ♪", description: `${track.title} compose ton aura sonore` });
    } catch (error) {
      logger.error('Failed to start track', error as Error, 'MUSIC');
      toast({ title: "Erreur de lecture", description: "Impossible de lire ce vinyle.", variant: "destructive" });
    } finally {
      setLoadingTrackId(null);
    }
  };

  return (
    <div className="min-h-full bg-background p-8">
      {showReward && <RewardSystem type="crystal" message="Harmonie créée ♪" onComplete={() => setShowReward(false)} />}

      <MusicPageHeader 
        hasPreferences={hasPreferences} 
        onOpenPreferences={() => setShowPreferencesModal(true)} 
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
            <div className="space-y-12">
              <VinylIntroduction />

              <MusicGeneratorSection 
                currentEmotion={state.currentTrack?.emotion || 'calm'} 
                userId={user?.id || 'anonymous'} 
              />

              <MusicGamificationSection />

              <MusicJourneySection />

              <MusicFocusSection />

              <MusicFavoritesSection
                tracks={vinylTracks}
                favoriteIds={musicFavorites.favorites.map(f => typeof f === 'string' ? f : f.id)}
                loadingTrackId={loadingTrackId}
                onStartTrack={(track) => startTrack(track as VinylTrack)}
              />

              <MusicHistorySection
                tracks={vinylTracks}
                playHistory={playHistory}
                loadingTrackId={loadingTrackId}
                onStartTrack={(track) => startTrack(track as VinylTrack)}
              />

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
        <VoiceCommands />

        <FloatingMiniPlayer
          currentTrack={state.currentTrack}
          isPlaying={state.isPlaying}
          progress={state.progress}
          onPlayPause={() => state.currentTrack && !state.isPlaying && play(state.currentTrack)}
          onNext={() => {}}
          onPrevious={() => {}}
          onExpand={() => setPlayerVisible(true)}
          isDocked={playerVisible}
        />
      </TooltipProvider>
    </div>
  );
};

export default B2CMusicEnhanced;
