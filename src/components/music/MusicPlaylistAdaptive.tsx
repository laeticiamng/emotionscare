/**
 * Playlists adaptatives par humeur
 * Génère des playlists basées sur l'état émotionnel
 */

import { memo, useState } from 'react';
import { 
  Music2, 
  Heart, 
  Zap, 
  Moon, 
  Sun,
  CloudRain,
  Sparkles,
  Play,
  Pause,
  SkipForward,
  Shuffle,
  Clock,
  Plus
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface MoodPlaylist {
  id: string;
  mood: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  trackCount: number;
  duration: string;
  coverGradient: string;
  isPlaying?: boolean;
}

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  mood: string;
  bpm: number;
  imageUrl?: string;
}

const MOOD_PLAYLISTS: MoodPlaylist[] = [
  {
    id: 'energize',
    mood: 'energetic',
    name: 'Boost d\'Énergie',
    description: 'Pour vous dynamiser et vous motiver',
    icon: Zap,
    color: 'text-yellow-500',
    trackCount: 25,
    duration: '1h 42min',
    coverGradient: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'calm',
    mood: 'calm',
    name: 'Sérénité',
    description: 'Musiques apaisantes pour se détendre',
    icon: Moon,
    color: 'text-blue-500',
    trackCount: 30,
    duration: '2h 15min',
    coverGradient: 'from-blue-500 to-indigo-500',
  },
  {
    id: 'focus',
    mood: 'focused',
    name: 'Concentration',
    description: 'Sons pour améliorer la productivité',
    icon: Sun,
    color: 'text-purple-500',
    trackCount: 20,
    duration: '1h 30min',
    coverGradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 'melancholy',
    mood: 'sad',
    name: 'Réconfort',
    description: 'Accompagnement pour les moments difficiles',
    icon: CloudRain,
    color: 'text-slate-500',
    trackCount: 18,
    duration: '1h 10min',
    coverGradient: 'from-slate-500 to-slate-700',
  },
  {
    id: 'happy',
    mood: 'happy',
    name: 'Joie Pure',
    description: 'Célébrez les bons moments',
    icon: Heart,
    color: 'text-pink-500',
    trackCount: 22,
    duration: '1h 25min',
    coverGradient: 'from-pink-500 to-rose-500',
  },
  {
    id: 'sleep',
    mood: 'sleepy',
    name: 'Sommeil Profond',
    description: 'Pour un endormissement paisible',
    icon: Moon,
    color: 'text-indigo-500',
    trackCount: 15,
    duration: '1h 45min',
    coverGradient: 'from-indigo-700 to-purple-900',
  },
];

const DEMO_TRACKS: Track[] = [
  { id: '1', title: 'Ondes de Paix', artist: 'Ambient Dreams', duration: '4:32', mood: 'calm', bpm: 60 },
  { id: '2', title: 'Lever de Soleil', artist: 'Natural Sounds', duration: '5:18', mood: 'energetic', bpm: 100 },
  { id: '3', title: 'Méditation Profonde', artist: 'Zen Master', duration: '8:45', mood: 'calm', bpm: 50 },
  { id: '4', title: 'Focus Flow', artist: 'Brain Beats', duration: '6:22', mood: 'focused', bpm: 80 },
  { id: '5', title: 'Énergie Positive', artist: 'Motivation Mix', duration: '3:55', mood: 'happy', bpm: 120 },
];

interface MusicPlaylistAdaptiveProps {
  currentMood?: string;
  onPlayPlaylist?: (playlist: MoodPlaylist) => void;
  onPlayTrack?: (track: Track) => void;
  className?: string;
}

export const MusicPlaylistAdaptive = memo(function MusicPlaylistAdaptive({
  currentMood = 'calm',
  onPlayPlaylist,
  onPlayTrack,
  className
}: MusicPlaylistAdaptiveProps) {
  const [selectedPlaylist, setSelectedPlaylist] = useState<MoodPlaylist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState([75]);

  const suggestedPlaylist = MOOD_PLAYLISTS.find(p => p.mood === currentMood) || MOOD_PLAYLISTS[0];

  const handlePlayPlaylist = (playlist: MoodPlaylist) => {
    setSelectedPlaylist(playlist);
    setIsPlaying(true);
    setCurrentTrackIndex(0);
    onPlayPlaylist?.(playlist);
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DEMO_TRACKS.length);
  };

  return (
    <Card className={cn("border-border/50", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Music2 className="h-5 w-5 text-primary" />
          <CardTitle>Playlists Adaptatives</CardTitle>
        </div>
        <CardDescription>
          Musique personnalisée selon votre état émotionnel
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Suggested Playlist */}
        <div 
          className={cn(
            "relative overflow-hidden rounded-xl p-6 cursor-pointer transition-all hover:scale-[1.02]",
            `bg-gradient-to-br ${suggestedPlaylist.coverGradient}`
          )}
          onClick={() => handlePlayPlaylist(suggestedPlaylist)}
        >
          <div className="absolute top-2 right-2">
            <Badge className="bg-white/20 text-white border-white/30">
              <Sparkles className="h-3 w-3 mr-1" />
              Recommandé
            </Badge>
          </div>
          <div className="text-white">
            <suggestedPlaylist.icon className="h-10 w-10 mb-3 opacity-90" />
            <h3 className="text-xl font-bold mb-1">{suggestedPlaylist.name}</h3>
            <p className="text-white/80 text-sm mb-3">{suggestedPlaylist.description}</p>
            <div className="flex items-center gap-4 text-sm text-white/70">
              <span>{suggestedPlaylist.trackCount} titres</span>
              <span>•</span>
              <span>{suggestedPlaylist.duration}</span>
            </div>
          </div>
          <Button 
            size="lg" 
            className="absolute bottom-4 right-4 rounded-full h-14 w-14 bg-white text-black hover:bg-white/90"
          >
            <Play className="h-6 w-6 ml-1" />
          </Button>
        </div>

        {/* All Playlists Grid */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Toutes les playlists</h4>
          <ScrollArea className="h-[200px]">
            <div className="grid grid-cols-2 gap-3">
              {MOOD_PLAYLISTS.map((playlist) => {
                const Icon = playlist.icon;
                const isActive = selectedPlaylist?.id === playlist.id;
                
                return (
                  <button
                    key={playlist.id}
                    onClick={() => handlePlayPlaylist(playlist)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg text-left transition-all",
                      isActive 
                        ? "bg-primary/10 ring-2 ring-primary" 
                        : "bg-muted/50 hover:bg-muted"
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-lg",
                      `bg-gradient-to-br ${playlist.coverGradient}`
                    )}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{playlist.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {playlist.trackCount} titres
                      </div>
                    </div>
                    {isActive && isPlaying && (
                      <div className="flex gap-0.5">
                        <div className="w-1 h-3 bg-primary rounded-full animate-pulse" />
                        <div className="w-1 h-4 bg-primary rounded-full animate-pulse delay-75" />
                        <div className="w-1 h-2 bg-primary rounded-full animate-pulse delay-150" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Mini Player */}
        {selectedPlaylist && (
          <div className="p-4 rounded-xl bg-muted/50 space-y-4">
            <div className="flex items-center gap-4">
              <div className={cn(
                "h-12 w-12 rounded-lg flex items-center justify-center",
                `bg-gradient-to-br ${selectedPlaylist.coverGradient}`
              )}>
                <selectedPlaylist.icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">
                  {DEMO_TRACKS[currentTrackIndex]?.title}
                </div>
                <div className="text-sm text-muted-foreground truncate">
                  {DEMO_TRACKS[currentTrackIndex]?.artist}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setCurrentTrackIndex(prev => Math.max(0, prev - 1))}>
                  <SkipForward className="h-4 w-4 rotate-180" />
                </Button>
                <Button 
                  size="icon" 
                  className="rounded-full"
                  onClick={handleTogglePlay}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={handleNextTrack}>
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <Slider
                value={[35]}
                max={100}
                step={1}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>1:42</span>
                <span>{DEMO_TRACKS[currentTrackIndex]?.duration}</span>
              </div>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-3">
              <Music2 className="h-4 w-4 text-muted-foreground" />
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="w-24"
              />
              <Shuffle className="h-4 w-4 text-muted-foreground ml-auto cursor-pointer hover:text-primary" />
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Plus className="h-4 w-4 mr-1" />
            Créer une playlist
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Clock className="h-4 w-4 mr-1" />
            Historique
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});
