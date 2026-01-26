import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Maximize2, Users, BarChart3, Sparkles } from 'lucide-react';
import { useEnhancedMusicPlayer } from '@/hooks/useEnhancedMusicPlayer';
import { cn } from '@/lib/utils';

// Import des composants premium
import TrackDetails from './TrackDetails';
import PlayerControls from './PlayerControls';
import VolumeControl from './VolumeControl';
import ProgressBar from './ProgressBar';
import WaveformVisualizer from './WaveformVisualizer';
import PlayerSettings from './PlayerSettings';
import AIRecommendationEngine from './AIRecommendationEngine';
import CollaborativeSession from './CollaborativeSession';
import AudioAnalysisDisplay from './AudioAnalysisDisplay';
import PlayerKeyboardShortcuts from './PlayerKeyboardShortcuts';

interface PremiumMusicPlayerProps {
  className?: string;
  compact?: boolean;
}

const PremiumMusicPlayer: React.FC<PremiumMusicPlayerProps> = ({ 
  className, 
  compact = false 
}) => {
  const [activeTab, setActiveTab] = useState('player');
  const [_showFullscreen, setShowFullscreen] = useState(false);
  
  const {
    state,
    visualizerEnabled,
    setVisualizerEnabled,
    keyboardShortcutsEnabled,
    setKeyboardShortcutsEnabled,
    togglePlayer,
    nextTrackWithFeedback,
    previousTrackWithFeedback,
    setVolume,
    seek
  } = useEnhancedMusicPlayer();

  const { currentTrack, isPlaying, volume, currentTime, duration } = state;

  const [isMuted, setIsMuted] = useState(false);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      setVolume(0);
    } else {
      setVolume(0.7);
    }
  };

  if (compact) {
    return (
      <div className={cn("premium-music-player", className)}>
        <PlayerKeyboardShortcuts 
          enabled={keyboardShortcutsEnabled}
          showTooltips={false}
        />
        
        <div className="space-y-4">
          {currentTrack && (
            <TrackDetails track={currentTrack} size="sm" />
          )}
          
          <div className="space-y-3">
            {visualizerEnabled && (
              <div className="h-16">
                <WaveformVisualizer
                  isPlaying={isPlaying}
                  progress={(currentTime / duration) * 100}
                  onSeek={(values: number[]) => seek((values[0] / 100) * duration)}
                />
              </div>
            )}
            
            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              onSeek={seek}
            />
            
            <div className="flex items-center justify-between">
              <VolumeControl
                volume={volume}
                onVolumeChange={handleVolumeChange}
                isMuted={isMuted}
                onMuteToggle={handleMuteToggle}
              />
              
              <PlayerControls
                isPlaying={isPlaying}
                onPlay={togglePlayer}
                onPause={togglePlayer}
                onPrevious={previousTrackWithFeedback}
                onNext={nextTrackWithFeedback}
              />
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFullscreen(true)}
                aria-label="Plein écran"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className={cn("premium-music-player shadow-premium", className)}>
      <PlayerKeyboardShortcuts 
        enabled={keyboardShortcutsEnabled}
        showTooltips={true}
      />
      
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="player" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Lecteur
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              IA
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analyse
            </TabsTrigger>
            <TabsTrigger value="collaborative" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Social
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Réglages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="player" className="space-y-6">
            {currentTrack && (
              <TrackDetails track={currentTrack} size="lg" />
            )}
            
            {visualizerEnabled && (
              <div className="h-32 visualization-container">
                <WaveformVisualizer
                  isPlaying={isPlaying}
                  progress={(currentTime / duration) * 100}
                  onSeek={(values: number[]) => seek((values[0] / 100) * duration)}
                  className="h-full"
                />
              </div>
            )}
            
            <div className="space-y-4">
              <ProgressBar
                currentTime={currentTime}
                duration={duration}
                onSeek={seek}
                className="text-center"
              />
              
              <div className="flex items-center justify-center gap-8">
                <VolumeControl
                  volume={volume}
                  onVolumeChange={handleVolumeChange}
                  isMuted={isMuted}
                  onMuteToggle={handleMuteToggle}
                />
                
                <PlayerControls
                  isPlaying={isPlaying}
                  onPlay={togglePlayer}
                  onPause={togglePlayer}
                  onPrevious={previousTrackWithFeedback}
                  onNext={nextTrackWithFeedback}
                />
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowFullscreen(true)}
                  className="hover:bg-primary/10"
                  aria-label="Plein écran"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai">
            <AIRecommendationEngine />
          </TabsContent>

          <TabsContent value="analysis">
            <AudioAnalysisDisplay />
          </TabsContent>

          <TabsContent value="collaborative">
            <CollaborativeSession />
          </TabsContent>

          <TabsContent value="settings">
            <PlayerSettings
              visualizerEnabled={visualizerEnabled}
              onVisualizerToggle={setVisualizerEnabled}
              keyboardShortcutsEnabled={keyboardShortcutsEnabled}
              onKeyboardShortcutsToggle={setKeyboardShortcutsEnabled}
              volume={volume}
              onVolumeChange={handleVolumeChange}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PremiumMusicPlayer;
