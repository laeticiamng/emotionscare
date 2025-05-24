
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Sliders, 
  Eye, 
  Type, 
  Headphones, 
  Maximize2,
  Heart,
  Share2,
  ListMusic,
  Shuffle,
  Repeat
} from 'lucide-react';
import { useMusic } from '@/hooks/useMusic';
import { useEnhancedMusicPlayer } from '@/hooks/useEnhancedMusicPlayer';
import EnhancedMusicPlayer from './EnhancedMusicPlayer';
import AdvancedEqualizer from './AdvancedEqualizer';
import ImmersiveVisualization from './ImmersiveVisualization';
import LyricsDisplay from './LyricsDisplay';
import SpatialAudioControls from './SpatialAudioControls';
import PlayerSettings from './PlayerSettings';

interface PremiumMusicPlayerProps {
  className?: string;
}

const PremiumMusicPlayer: React.FC<PremiumMusicPlayerProps> = ({ className }) => {
  const { currentTrack } = useMusic();
  const [activeTab, setActiveTab] = useState('player');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'track' | 'playlist'>('none');

  const {
    isExpanded,
    setIsExpanded,
    visualizerEnabled,
    setVisualizerEnabled,
    keyboardShortcutsEnabled,
    setKeyboardShortcutsEnabled,
    volume,
    setVolume
  } = useEnhancedMusicPlayer();

  const toggleRepeat = () => {
    const modes: Array<'none' | 'track' | 'playlist'> = ['none', 'track', 'playlist'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  if (!currentTrack) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-96 text-muted-foreground">
          <div className="text-center">
            <ListMusic className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Lecteur Premium</h3>
            <p>Sélectionnez une piste pour commencer</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`premium-music-player ${className}`}>
      {/* Quick Actions Bar */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-t-lg">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsShuffled(!isShuffled)}
          >
            <Shuffle className={`h-4 w-4 ${isShuffled ? 'text-primary' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleRepeat}
          >
            <Repeat className={`h-4 w-4 ${repeatMode !== 'none' ? 'text-primary' : ''}`} />
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsFullscreen(!isFullscreen)}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="player" className="flex items-center gap-1">
            <ListMusic className="h-4 w-4" />
            <span className="hidden sm:inline">Lecteur</span>
          </TabsTrigger>
          <TabsTrigger value="equalizer" className="flex items-center gap-1">
            <Sliders className="h-4 w-4" />
            <span className="hidden sm:inline">EQ</span>
          </TabsTrigger>
          <TabsTrigger value="visualizer" className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Visuel</span>
          </TabsTrigger>
          <TabsTrigger value="lyrics" className="flex items-center gap-1">
            <Type className="h-4 w-4" />
            <span className="hidden sm:inline">Paroles</span>
          </TabsTrigger>
          <TabsTrigger value="spatial" className="flex items-center gap-1">
            <Headphones className="h-4 w-4" />
            <span className="hidden sm:inline">3D</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Réglages</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="player" className="space-y-4">
            <EnhancedMusicPlayer 
              track={currentTrack}
              className="border-0 shadow-none"
            />
          </TabsContent>

          <TabsContent value="equalizer">
            <AdvancedEqualizer />
          </TabsContent>

          <TabsContent value="visualizer">
            <ImmersiveVisualization 
              fullscreen={isFullscreen}
              onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
            />
          </TabsContent>

          <TabsContent value="lyrics">
            <LyricsDisplay />
          </TabsContent>

          <TabsContent value="spatial">
            <SpatialAudioControls />
          </TabsContent>

          <TabsContent value="settings">
            <PlayerSettings
              visualizerEnabled={visualizerEnabled}
              onVisualizerToggle={setVisualizerEnabled}
              keyboardShortcutsEnabled={keyboardShortcutsEnabled}
              onKeyboardShortcutsToggle={setKeyboardShortcutsEnabled}
              volume={volume}
              onVolumeChange={setVolume}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default PremiumMusicPlayer;
