import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, Pause, SkipForward, Square, Heart, Volume2, Loader2,
  SkipBack, Repeat, Shuffle, ListMusic, Share2, Download,
  History, Star, Clock, Music, Sliders, VolumeX, Volume1
} from '@/components/music/icons';
import { LazyMotionWrapper, m } from '@/utils/lazy-motion';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface SunoPlayerProps {
  src: string | null;
  loading: boolean;
  playing: boolean;
  onStart: () => void;
  onNext: () => void;
  onStop: () => void;
  onSave: () => void;
  canSave: boolean;
  trackInfo?: {
    title?: string;
    artist?: string;
    emotion?: string;
    duration?: number;
  };
}

interface QueueItem {
  id: string;
  src: string;
  title: string;
  emotion: string;
  addedAt: Date;
}

interface PlayHistory {
  id: string;
  title: string;
  emotion: string;
  playedAt: Date;
  duration: number;
  rating?: number;
}

const STORAGE_KEY = 'suno-player-data';

export const SunoPlayer: React.FC<SunoPlayerProps> = ({
  src,
  loading,
  playing,
  onStart,
  onNext,
  onStop,
  onSave,
  canSave,
  trackInfo
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [activeTab, setActiveTab] = useState('player');
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [playHistory, setPlayHistory] = useState<PlayHistory[]>([]);
  const [favorites, setFavorites] = useState<PlayHistory[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showEqualizer, setShowEqualizer] = useState(false);
  const [equalizerBands, setEqualizerBands] = useState([50, 50, 50, 50, 50]);
  const previousVolume = useRef(0.7);

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setQueue(data.queue || []);
      setPlayHistory(data.history || []);
      setFavorites(data.favorites || []);
      if (data.volume !== undefined) setVolume(data.volume);
      if (data.isRepeat !== undefined) setIsRepeat(data.isRepeat);
      if (data.isShuffle !== undefined) setIsShuffle(data.isShuffle);
    }
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      queue,
      history: playHistory,
      favorites,
      volume,
      isRepeat,
      isShuffle
    }));
  }, [queue, playHistory, favorites, volume, isRepeat, isShuffle]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setCurrentTime(0);
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else if (queue.length > 0) {
        // Play next in queue
        onNext();
      }
      
      // Add to history
      if (trackInfo) {
        const historyEntry: PlayHistory = {
          id: Date.now().toString(),
          title: trackInfo.title || 'Sans titre',
          emotion: trackInfo.emotion || 'unknown',
          playedAt: new Date(),
          duration: duration,
        };
        setPlayHistory(prev => [historyEntry, ...prev.slice(0, 49)]);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [src, isRepeat, queue.length, trackInfo, duration]);

  // Play/Pause sync
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;

    if (playing) {
      audio.play().catch(error => logger.error('Audio play error:', error));
    } else {
      audio.pause();
    }
  }, [playing, src]);

  // Volume control
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.code) {
        case 'Space':
        case 'KeyK':
          e.preventDefault();
          if (src) {
            playing ? onStop() : onStart();
          } else {
            onStart();
          }
          break;
        case 'KeyJ':
          e.preventDefault();
          if (audioRef.current) {
            audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
          }
          break;
        case 'KeyL':
          e.preventDefault();
          if (audioRef.current) {
            audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
          }
          break;
        case 'KeyN':
          e.preventDefault();
          onNext();
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'KeyR':
          e.preventDefault();
          setIsRepeat(!isRepeat);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [playing, src, duration, onStart, onStop, onNext, isRepeat]);

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressValue = () => {
    if (!duration || !isFinite(duration)) return 0;
    return (currentTime / duration) * 100;
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current && duration) {
      audioRef.current.currentTime = (value[0] / 100) * duration;
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(previousVolume.current);
      setIsMuted(false);
    } else {
      previousVolume.current = volume;
      setIsMuted(true);
    }
  };

  const toggleFavorite = () => {
    if (!trackInfo) return;
    
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      const entry: PlayHistory = {
        id: Date.now().toString(),
        title: trackInfo.title || 'Sans titre',
        emotion: trackInfo.emotion || 'unknown',
        playedAt: new Date(),
        duration: duration,
      };
      setFavorites(prev => [entry, ...prev]);
      toast.success('Ajouté aux favoris');
    } else {
      toast.info('Retiré des favoris');
    }
    onSave();
  };

  const handleShare = async () => {
    const text = `🎵 J'écoute "${trackInfo?.title || 'une création'}" sur EmotionsCare !`;
    
    if (navigator.share) {
      await navigator.share({ title: 'Ma musique', text });
    } else {
      await navigator.clipboard.writeText(text);
      toast.success('Copié dans le presse-papier');
    }
  };

  const rateTrack = (historyId: string, rating: number) => {
    setPlayHistory(prev => 
      prev.map(h => h.id === historyId ? { ...h, rating } : h)
    );
    toast.success(`Note ${rating}/5 enregistrée`);
  };

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <LazyMotionWrapper>
      <Card className="overflow-hidden">
        {src && (
          <audio
            ref={audioRef}
            src={src}
            preload="auto"
          />
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Music className="h-5 w-5 text-primary" />
                Lecteur Suno
              </CardTitle>
              <TabsList className="h-8">
                <TabsTrigger value="player" className="text-xs px-2">Lecteur</TabsTrigger>
                <TabsTrigger value="queue" className="text-xs px-2">File</TabsTrigger>
                <TabsTrigger value="history" className="text-xs px-2">Historique</TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <TabsContent value="player" className="mt-0 space-y-4">
              {/* Track info */}
              {trackInfo && (
                <m.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <h3 className="font-semibold text-lg">{trackInfo.title || 'Sans titre'}</h3>
                  {trackInfo.emotion && (
                    <Badge variant="secondary" className="mt-1">
                      {trackInfo.emotion}
                    </Badge>
                  )}
                </m.div>
              )}

              {/* Status badge */}
              <div className="text-center">
                <Badge 
                  variant={loading ? "default" : playing ? "default" : "secondary"}
                  className="mb-2"
                >
                  {loading ? "Génération..." : playing ? "En lecture" : "Prêt"}
                </Badge>
              </div>

              {/* Progress bar */}
              {src && (
                <div className="space-y-2">
                  <Slider
                    value={[getProgressValue()]}
                    onValueChange={handleSeek}
                    max={100}
                    step={0.1}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              )}

              {/* Main controls */}
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsShuffle(!isShuffle)}
                  className={cn('h-10 w-10', isShuffle && 'text-primary bg-primary/10')}
                  aria-label="Lecture aléatoire"
                >
                  <Shuffle className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  disabled={playHistory.length === 0}
                  aria-label="Piste précédente"
                >
                  <SkipBack className="w-4 h-4" />
                </Button>

                <Button
                  size="lg"
                  onClick={src ? (playing ? onStop : onStart) : onStart}
                  disabled={loading}
                  className="w-16 h-16 rounded-full"
                  aria-label={
                    src 
                      ? (playing ? "Pause (Espace)" : "Lecture (Espace)")
                      : "Démarrer (Espace)"
                  }
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : src && playing ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-0.5" />
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={onNext}
                  disabled={loading}
                  className="h-10 w-10"
                  aria-label="Piste suivante (N)"
                >
                  <SkipForward className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsRepeat(!isRepeat)}
                  className={cn('h-10 w-10', isRepeat && 'text-primary bg-primary/10')}
                  aria-label="Répéter (R)"
                >
                  <Repeat className="w-4 h-4" />
                </Button>
              </div>

              {/* Secondary controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={toggleMute}
                    aria-label={isMuted ? "Activer le son (M)" : "Couper le son (M)"}
                  >
                    <VolumeIcon className="w-4 h-4" />
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume * 100]}
                    onValueChange={(v) => {
                      setVolume(v[0] / 100);
                      setIsMuted(false);
                    }}
                    max={100}
                    className="w-24"
                    aria-label="Volume"
                  />
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setShowEqualizer(!showEqualizer)}
                    aria-label="Égaliseur"
                  >
                    <Sliders className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn('h-8 w-8', isFavorite && 'text-red-500')}
                    onClick={toggleFavorite}
                    disabled={!canSave}
                    aria-label="Favori"
                  >
                    <Heart className={cn('w-4 h-4', isFavorite && 'fill-current')} />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleShare}
                    aria-label="Partager"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Equalizer */}
              {showEqualizer && (
                <m.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="p-4 bg-muted/30 rounded-lg"
                >
                  <h4 className="text-sm font-medium mb-3">Égaliseur</h4>
                  <div className="flex justify-between gap-2">
                    {['60Hz', '230Hz', '910Hz', '4kHz', '14kHz'].map((freq, i) => (
                      <div key={freq} className="flex flex-col items-center gap-2">
                        <Slider
                          orientation="vertical"
                          value={[equalizerBands[i]]}
                          onValueChange={(v) => {
                            const newBands = [...equalizerBands];
                            newBands[i] = v[0];
                            setEqualizerBands(newBands);
                          }}
                          max={100}
                          className="h-20"
                        />
                        <span className="text-xs text-muted-foreground">{freq}</span>
                      </div>
                    ))}
                  </div>
                </m.div>
              )}

              {/* Audio visualizer */}
              {playing && (
                <m.div
                  className="flex justify-center gap-1 h-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <m.div
                      key={i}
                      className="w-1.5 bg-primary rounded-full"
                      animate={{
                        height: [8, 24, 8, 16, 8],
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </m.div>
              )}

              {/* Shortcuts */}
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Espace = Play/Pause • J/L = -/+ 10s • N = Suivant • M = Mute • R = Répéter
                </p>
              </div>
            </TabsContent>

            <TabsContent value="queue" className="mt-0">
              <ScrollArea className="h-48">
                {queue.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ListMusic className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">File d'attente vide</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {queue.map((item, i) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50"
                      >
                        <span className="text-sm text-muted-foreground w-6">{i + 1}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.title}</p>
                          <Badge variant="outline" className="text-xs">{item.emotion}</Badge>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <ScrollArea className="h-48">
                {playHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Aucun historique</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {playHistory.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.title}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(item.playedAt).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => rateTrack(item.id, star)}
                              className="p-0.5"
                            >
                              <Star
                                className={cn(
                                  'h-3 w-3',
                                  item.rating && item.rating >= star
                                    ? 'fill-yellow-500 text-yellow-500'
                                    : 'text-muted-foreground'
                                )}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </LazyMotionWrapper>
  );
};
