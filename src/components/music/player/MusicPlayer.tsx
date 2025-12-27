import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import PlayerControls from './PlayerControls';
import TrackInfo from './TrackInfo';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import { useMusicControls } from '@/hooks/useMusicControls';
import { 
  useMusicQueue, 
  useMusicPlayerFavorites, 
  useMusicPlayerStats 
} from '@/hooks/music/useMusicSettings';
import type { MusicTrack } from '@/types/music';
import { 
  Loader2, 
  ListMusic, 
  Heart, 
  History, 
  Shuffle, 
  Repeat, 
  Repeat1,
  Share2,
  Download,
  BarChart3,
  Clock,
  TrendingUp,
  ChevronUp,
  ChevronDown,
  X,
  Plus,
  GripVertical
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { logger } from '@/lib/logger';
import { useToast } from '@/hooks/use-toast';

interface QueueItem {
  id: string;
  track: MusicTrack;
  addedAt: string;
}

interface PlayHistory {
  id: string;
  track: MusicTrack;
  playedAt: string;
  duration: number;
}

interface MusicPlayerProps {
  track?: MusicTrack | null;
  className?: string;
}

type RepeatMode = 'off' | 'all' | 'one';

const MusicPlayer: React.FC<MusicPlayerProps> = ({ track, className }) => {
  const { toast } = useToast();
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLoading,
    play,
    pause,
    seek,
    setVolume,
    toggleMute
  } = useMusicControls();

  const [activeTab, setActiveTab] = useState('player');
  const [isExpanded, setIsExpanded] = useState(true);
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [history, setHistory] = useState<PlayHistory[]>([]);
  
  // Supabase-synced state via hooks
  const { value: queue, setValue: setQueue } = useMusicQueue();
  const { value: favorites, setValue: setFavorites } = useMusicPlayerFavorites();
  const { value: stats, setValue: setStats } = useMusicPlayerStats();

  // Track play history
  useEffect(() => {
    if (track && isPlaying) {
      const interval = setInterval(() => {
        setStats((prev) => ({
          ...prev,
          totalPlayTime: prev.totalPlayTime + 1,
          lastSession: new Date().toISOString()
        }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [track, isPlaying, setStats]);

  const handlePrevious = () => {
    if (history.length > 0) {
      const lastTrack = history[history.length - 1];
      logger.info('Previous track:', lastTrack.track.title);
      // Navigate to previous track
    } else {
      logger.info('No previous track');
    }
  };

  const handleNext = () => {
    if (queue.length > 0) {
      const nextItem = queue[0];
      setQueue((prev: QueueItem[]) => prev.slice(1));
      setHistory((prev: PlayHistory[]) => [...prev, {
        id: Date.now().toString(),
        track: track as MusicTrack,
        playedAt: new Date().toISOString(),
        duration: currentTime
      }]);
      setStats((prev: typeof stats) => ({ ...prev, tracksPlayed: prev.tracksPlayed + 1 }));
      logger.info('Next track:', nextItem.track.title);
    } else {
      logger.info('Queue is empty');
    }
  };

  const toggleRepeat = () => {
    const modes: RepeatMode[] = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
  };

  const addToQueue = (newTrack: MusicTrack) => {
    setQueue(prev => [...prev, {
      id: Date.now().toString(),
      track: newTrack,
      addedAt: new Date().toISOString()
    }]);
    toast({
      title: "Ajouté à la file",
      description: `"${newTrack.title}" a été ajouté à la file d'attente`
    });
  };

  const removeFromQueue = (id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id));
  };

  const clearQueue = () => {
    setQueue([]);
    toast({
      title: "File vidée",
      description: "La file d'attente a été vidée"
    });
  };

  const toggleFavorite = (favTrack: MusicTrack) => {
    const isFav = favorites.some(f => f.id === favTrack.id);
    if (isFav) {
      setFavorites(prev => prev.filter(f => f.id !== favTrack.id));
    } else {
      setFavorites(prev => [...prev, favTrack]);
    }
  };

  const sharePlayer = async () => {
    const shareData = {
      title: 'EmotionsCare Music',
      text: `J'écoute "${track?.title || 'de la musique relaxante'}" sur EmotionsCare`,
      url: window.location.href
    };
    
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        toast({
          title: "Lien copié",
          description: "Le lien a été copié dans le presse-papier"
        });
      }
    } catch (err) {
      logger.error('Share failed:', err);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}min`;
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isFavorite = track ? favorites.some(f => f.id === track.id) : false;

  return (
    <Card className={`overflow-hidden ${className}`}>
      {/* Header with controls */}
      <CardHeader className="p-3 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <ListMusic className="h-3 w-3" />
            {queue.length} en file
          </Badge>
          {isLoading && (
            <Badge variant="secondary" className="gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Chargement
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={shuffle ? 'default' : 'ghost'}
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setShuffle(!shuffle)}
                  aria-label={shuffle ? 'Désactiver la lecture aléatoire' : 'Activer la lecture aléatoire'}
                >
                  <Shuffle className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Lecture aléatoire</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={repeatMode !== 'off' ? 'default' : 'ghost'}
                  size="icon"
                  className="h-7 w-7"
                  onClick={toggleRepeat}
                  aria-label={`Mode répétition: ${repeatMode}`}
                >
                  {repeatMode === 'one' ? (
                    <Repeat1 className="h-3.5 w-3.5" />
                  ) : (
                    <Repeat className="h-3.5 w-3.5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {repeatMode === 'off' ? 'Répétition désactivée' : 
                 repeatMode === 'all' ? 'Répéter tout' : 'Répéter un seul'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={sharePlayer}
                  aria-label="Partager"
                >
                  <Share2 className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Partager</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Réduire le lecteur' : 'Agrandir le lecteur'}
          >
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronUp className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b h-9 px-3">
                <TabsTrigger value="player" className="text-xs gap-1">
                  <ListMusic className="h-3 w-3" />
                  Lecteur
                </TabsTrigger>
                <TabsTrigger value="queue" className="text-xs gap-1">
                  <ListMusic className="h-3 w-3" />
                  File ({queue.length})
                </TabsTrigger>
                <TabsTrigger value="history" className="text-xs gap-1">
                  <History className="h-3 w-3" />
                  Historique
                </TabsTrigger>
                <TabsTrigger value="favorites" className="text-xs gap-1">
                  <Heart className="h-3 w-3" />
                  Favoris ({favorites.length})
                </TabsTrigger>
                <TabsTrigger value="stats" className="text-xs gap-1">
                  <BarChart3 className="h-3 w-3" />
                  Stats
                </TabsTrigger>
              </TabsList>

              <TabsContent value="player" className="m-0">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <TrackInfo track={track} />
                    <Button
                      variant={isFavorite ? 'default' : 'ghost'}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => track && toggleFavorite(track)}
                      aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    >
                      <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                  
                  <ProgressBar
                    currentTime={currentTime}
                    duration={duration}
                    onSeek={seek}
                  />
                  
                  <div className="flex items-center justify-between">
                    <PlayerControls
                      isPlaying={isPlaying}
                      loadingTrack={isLoading}
                      onPlay={play}
                      onPause={pause}
                      onPrevious={handlePrevious}
                      onNext={handleNext}
                    />
                    
                    <VolumeControl
                      volume={volume}
                      isMuted={isMuted}
                      onVolumeChange={setVolume}
                      onMuteToggle={toggleMute}
                    />
                  </div>
                </CardContent>
              </TabsContent>

              <TabsContent value="queue" className="m-0">
                <ScrollArea className="h-[200px]">
                  <div className="p-3 space-y-2">
                    {queue.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <ListMusic className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">La file d'attente est vide</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted-foreground">
                            {queue.length} morceau{queue.length > 1 ? 'x' : ''} en attente
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={clearQueue}
                          >
                            Vider
                          </Button>
                        </div>
                        <Reorder.Group
                          axis="y"
                          values={queue}
                          onReorder={setQueue}
                          className="space-y-1"
                        >
                          {queue.map((item) => (
                            <Reorder.Item
                              key={item.id}
                              value={item}
                              className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg cursor-grab active:cursor-grabbing"
                            >
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {item.track.title}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {item.track.artist}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => removeFromQueue(item.id)}
                                aria-label="Retirer de la file"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Reorder.Item>
                          ))}
                        </Reorder.Group>
                      </>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="history" className="m-0">
                <ScrollArea className="h-[200px]">
                  <div className="p-3 space-y-1">
                    {history.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Aucun historique</p>
                      </div>
                    ) : (
                      [...history].reverse().map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded-lg"
                        >
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {item.track.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatTime(item.playedAt)} • {formatDuration(item.duration)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => addToQueue(item.track)}
                            aria-label="Ajouter à la file"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="favorites" className="m-0">
                <ScrollArea className="h-[200px]">
                  <div className="p-3 space-y-1">
                    {favorites.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Heart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Aucun favori</p>
                      </div>
                    ) : (
                      favorites.map((favTrack) => (
                        <div
                          key={favTrack.id}
                          className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded-lg"
                        >
                          <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {favTrack.title}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {favTrack.artist}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => addToQueue(favTrack)}
                            aria-label="Ajouter à la file"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="stats" className="m-0">
                <div className="p-4 grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gradient-to-br from-primary/10 to-transparent rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">Temps d'écoute</span>
                    </div>
                    <p className="text-lg font-bold">
                      {formatDuration(stats.totalPlayTime)}
                    </p>
                  </div>
                  
                  <div className="p-3 bg-gradient-to-br from-green-500/10 to-transparent rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <TrendingUp className="h-3 w-3" />
                      <span className="text-xs">Morceaux joués</span>
                    </div>
                    <p className="text-lg font-bold">{stats.tracksPlayed}</p>
                  </div>
                  
                  <div className="p-3 bg-gradient-to-br from-purple-500/10 to-transparent rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Heart className="h-3 w-3" />
                      <span className="text-xs">Favoris</span>
                    </div>
                    <p className="text-lg font-bold">{favorites.length}</p>
                  </div>
                  
                  <div className="p-3 bg-gradient-to-br from-amber-500/10 to-transparent rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <ListMusic className="h-3 w-3" />
                      <span className="text-xs">Genre préféré</span>
                    </div>
                    <p className="text-lg font-bold">{stats.favoriteGenre}</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default MusicPlayer;
