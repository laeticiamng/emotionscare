
import React, { useState, useEffect } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { MusicPlaylist, MusicTrack } from '@/types';
import { Slider } from '@/components/ui/slider';

interface VRMusicIntegrationProps {
  emotion?: string;
  autoplay?: boolean;
}

const VRMusicIntegration: React.FC<VRMusicIntegrationProps> = ({
  emotion = 'calm',
  autoplay = false
}) => {
  const { 
    loadPlaylistForEmotion, 
    playTrack,
    pauseTrack,
    isPlaying, 
    currentTrack,
    nextTrack,
    previousTrack,
    volume,
    setVolume
  } = useMusic();
  
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [loading, setLoading] = useState(false);
  const [muted, setMuted] = useState(false);
  const prevVolume = React.useRef(volume);
  
  // Load appropriate playlist when emotion changes
  useEffect(() => {
    const fetchPlaylist = async () => {
      setLoading(true);
      try {
        const result = await loadPlaylistForEmotion(emotion);
        if (result) {
          setPlaylist(result);
          
          // Autoplay if needed
          if (autoplay && result.tracks && result.tracks.length > 0) {
            playTrack(result.tracks[0]);
          }
        }
      } catch (error) {
        console.error('Error loading VR music:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlaylist();
  }, [emotion, loadPlaylistForEmotion, autoplay, playTrack]);

  const togglePlay = () => {
    if (isPlaying) {
      pauseTrack();
    } else if (currentTrack) {
      playTrack(currentTrack);
    } else if (playlist?.tracks && playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0]);
    }
  };

  const toggleMute = () => {
    if (muted) {
      setVolume(prevVolume.current);
      setMuted(false);
    } else {
      prevVolume.current = volume;
      setVolume(0);
      setMuted(true);
    }
  };

  return (
    <div className="rounded-lg p-4 bg-black/10 backdrop-blur">
      <div className="flex items-center justify-between mb-3">
        <div className="text-lg font-medium">
          {playlist?.name || "Ambiance musicale VR"}
        </div>
        <div className="text-sm text-muted-foreground">
          {currentTrack ? `${currentTrack.title} - ${currentTrack.artist}` : 'Aucune piste en cours'}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => previousTrack()} disabled={loading || !playlist?.tracks?.length}>
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button 
            variant={isPlaying ? "secondary" : "default"}
            onClick={togglePlay}
            disabled={loading || !playlist?.tracks?.length}
          >
            {isPlaying ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
            {isPlaying ? "Pause" : "Play"}
          </Button>
          
          <Button variant="outline" size="icon" onClick={() => nextTrack()} disabled={loading || !playlist?.tracks?.length}>
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2 w-32">
          <Button variant="ghost" size="icon" onClick={toggleMute}>
            {muted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Slider
            defaultValue={[volume * 100]}
            max={100}
            step={1}
            onValueChange={(values) => {
              const newVolume = values[0] / 100;
              setVolume(newVolume);
              setMuted(newVolume === 0);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default VRMusicIntegration;
