/**
 * Advanced Music Queue - Gestion avancée de la queue de lecture
 * Drag-and-drop, shuffle, repeat modes, prévisualisation
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Shuffle,
  Repeat,
  Repeat1,
  Trash2,
  GripVertical,
  Play,
  Pause,
  Music,
  Clock,
  X,
  Download,
  Share2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QueueTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  mood?: string;
  color?: string;
}

type RepeatMode = 'off' | 'all' | 'one';
type ShuffleMode = 'off' | 'on';

interface AdvancedMusicQueueProps {
  tracks: QueueTrack[];
  currentTrackId?: string;
  onTrackSelect?: (trackId: string) => void;
  onQueueChange?: (tracks: QueueTrack[]) => void;
  onPlayPause?: () => void;
  isPlaying?: boolean;
}

export const AdvancedMusicQueue: React.FC<AdvancedMusicQueueProps> = ({
  tracks: initialTracks,
  currentTrackId,
  onTrackSelect,
  onQueueChange,
  onPlayPause,
  isPlaying = false,
}) => {
  const { toast } = useToast();
  const [queue, setQueue] = useState<QueueTrack[]>(initialTracks);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [shuffleMode, setShuffleMode] = useState<ShuffleMode>('off');
  const [filteredQueue, setFilteredQueue] = useState<QueueTrack[]>(initialTracks);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  // Handle drag-and-drop reordering
  const handleReorder = useCallback((newOrder: QueueTrack[]) => {
    setQueue(newOrder);
    setFilteredQueue(newOrder);
    onQueueChange?.(newOrder);
  }, [onQueueChange]);

  // Toggle repeat mode
  const toggleRepeatMode = () => {
    const modes: RepeatMode[] = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setRepeatMode(nextMode);

    const messages: Record<RepeatMode, string> = {
      off: '🔁 Pas de répétition',
      all: '🔁 Répéter tous les titres',
      one: '🔂 Répéter ce titre',
    };
    toast({
      title: 'Mode de répétition',
      description: messages[nextMode],
    });
  };

  // Toggle shuffle mode
  const toggleShuffle = () => {
    if (shuffleMode === 'off') {
      setShuffleMode('on');
      const shuffled = [...queue].sort(() => Math.random() - 0.5);
      setQueue(shuffled);
      setFilteredQueue(shuffled);
      onQueueChange?.(shuffled);
      toast({
        title: '🔀 Shuffle activé',
        description: 'Queue mélangée',
      });
    } else {
      setShuffleMode('off');
      toast({
        title: '🔀 Shuffle désactivé',
        description: 'Ordre original restauré',
      });
    }
  };

  // Remove track from queue
  const removeTrack = (trackId: string) => {
    const newQueue = queue.filter((t) => t.id !== trackId);
    setQueue(newQueue);
    setFilteredQueue(newQueue.filter((t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.artist.toLowerCase().includes(searchQuery.toLowerCase())
    ));
    onQueueChange?.(newQueue);

    toast({
      title: '❌ Titre supprimé',
      description: 'Retiré de la queue',
    });
  };

  // Clear entire queue
  const clearQueue = () => {
    if (confirm('Êtes-vous sûr ? Cela vide complètement la queue.')) {
      setQueue([]);
      setFilteredQueue([]);
      onQueueChange?.([]);
      toast({
        title: '🗑️ Queue vidée',
        description: 'Tous les titres ont été supprimés',
      });
    }
  };

  // Search and filter
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = queue.filter(
        (t) =>
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          t.artist.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredQueue(filtered);
    } else {
      setFilteredQueue(queue);
    }
  };

  // Calculate total duration
  const totalDuration = queue.reduce((acc, t) => acc + t.duration, 0);
  const totalMinutes = Math.floor(totalDuration / 60);
  const totalHours = Math.floor(totalMinutes / 60);

  // Move track to top
  const moveToTop = (trackId: string) => {
    const track = queue.find((t) => t.id === trackId);
    if (track) {
      const newQueue = [track, ...queue.filter((t) => t.id !== trackId)];
      setQueue(newQueue);
      setFilteredQueue(newQueue);
      onQueueChange?.(newQueue);
      toast({
        title: '⬆️ Déplacé au sommet',
        description: `${track.title} sera joué ensuite`,
      });
    }
  };

  // Export queue
  const exportQueue = () => {
    const m3uContent = `#EXTM3U
${queue
  .map(
    (track) =>
      `#EXTINF:${track.duration},${track.artist} - ${track.title}\n${track.id}`
  )
  .join('\n')}`;

    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(m3uContent)
    );
    element.setAttribute('download', `queue-${Date.now()}.m3u`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: '📥 Queue exportée',
      description: 'Fichier M3U téléchargé',
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Queue de Lecture
              <Badge variant="secondary" className="ml-2">
                {queue.length} titres
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Durée totale: {totalHours > 0 ? `${totalHours}h ` : ''}
              {Math.floor((totalMinutes % 60))} min
            </p>
          </div>

          {/* Top Controls */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={shuffleMode === 'on' ? 'default' : 'outline'}
              onClick={toggleShuffle}
              title="Mélanger la queue"
              className="gap-1"
            >
              <Shuffle className="h-4 w-4" />
              <span className="hidden sm:inline text-xs">Mix</span>
            </Button>

            <Button
              size="sm"
              variant={repeatMode !== 'off' ? 'default' : 'outline'}
              onClick={toggleRepeatMode}
              title="Mode répétition"
              className="gap-1"
            >
              {repeatMode === 'one' ? (
                <Repeat1 className="h-4 w-4" />
              ) : (
                <Repeat className="h-4 w-4" />
              )}
              <span className="hidden sm:inline text-xs">
                {repeatMode === 'off' ? 'Rép.' : repeatMode === 'one' ? '1×' : 'Tt'}
              </span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
              className="gap-1"
            >
              {isExpanded ? '↓' : '↑'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="space-y-4">
              {/* Search Bar */}
              <Input
                placeholder="Rechercher dans la queue..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="h-9"
              />

              {/* Queue List */}
              {filteredQueue.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  <Reorder.Group
                    axis="y"
                    values={filteredQueue}
                    onReorder={handleReorder}
                    className="space-y-2"
                  >
                    <AnimatePresence>
                      {filteredQueue.map((track, index) => {
                        const isCurrentTrack = track.id === currentTrackId;
                        return (
                          <Reorder.Item
                            key={track.id}
                            value={track}
                            as="div"
                          >
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-move ${
                                isCurrentTrack
                                  ? 'bg-accent/10 border-accent'
                                  : 'bg-muted/30 hover:bg-muted/50 border-muted'
                              }`}
                            >
                              {/* Drag Handle */}
                              <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />

                              {/* Index */}
                              <span className="text-xs font-semibold text-muted-foreground w-6">
                                {index + 1}
                              </span>

                              {/* Current Track Indicator */}
                              {isCurrentTrack && (
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 1, repeat: Infinity }}
                                >
                                  {isPlaying ? (
                                    <Pause className="h-4 w-4 text-accent flex-shrink-0" />
                                  ) : (
                                    <Play className="h-4 w-4 text-accent flex-shrink-0" />
                                  )}
                                </motion.div>
                              )}

                              {/* Track Info */}
                              <div
                                className="flex-1 min-w-0 cursor-pointer hover:opacity-75 transition"
                                onClick={() => onTrackSelect?.(track.id)}
                              >
                                <p className="text-sm font-medium truncate text-foreground">
                                  {track.title}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {track.artist}
                                </p>
                              </div>

                              {/* Duration Badge */}
                              <Badge
                                variant="secondary"
                                className="text-xs flex-shrink-0"
                              >
                                <Clock className="h-3 w-3 mr-1" />
                                {Math.floor(track.duration / 60)}:
                                {(track.duration % 60).toString().padStart(2, '0')}
                              </Badge>

                              {/* Mood Badge */}
                              <Badge
                                variant="outline"
                                className="text-xs flex-shrink-0 hidden sm:flex"
                                style={{ borderColor: track.color, color: track.color }}
                              >
                                {track.mood}
                              </Badge>

                              {/* Actions */}
                              <div className="flex gap-1 flex-shrink-0">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0"
                                  onClick={() => moveToTop(track.id)}
                                  title="Jouer ensuite"
                                >
                                  ⬆️
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0"
                                  onClick={() => removeTrack(track.id)}
                                  title="Supprimer"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </motion.div>
                          </Reorder.Item>
                        );
                      })}
                    </AnimatePresence>
                  </Reorder.Group>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Music className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    {searchQuery ? 'Aucun titre ne correspond' : 'Queue vide'}
                  </p>
                </div>
              )}

              {/* Bottom Actions */}
              {queue.length > 0 && (
                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={exportQueue}
                  >
                    <Download className="h-4 w-4" />
                    Exporter
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-2"
                    disabled
                  >
                    <Share2 className="h-4 w-4" />
                    Partager
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="gap-2"
                    onClick={clearQueue}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default AdvancedMusicQueue;
