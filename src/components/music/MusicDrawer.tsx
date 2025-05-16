
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Drawer, 
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose
} from '@/components/ui/drawer';
import { MusicDrawerProps, MusicTrack } from '@/types';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import MusicProgressBar from './MusicProgressBar';
import VolumeControl from './VolumeControl';

const MusicDrawer: React.FC<MusicDrawerProps> = ({
  children,
  side = 'bottom',
  open = false,
  isOpen = false,
  onClose,
  onOpenChange,
  currentTrack,
  playlist
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Use either the open prop or isOpen prop
  const drawerOpen = open || isOpen;
  
  // Handle prop changes
  useEffect(() => {
    if (currentTrack && playlist) {
      // Find the index of the current track in the playlist
      const index = playlist.tracks.findIndex(track => track.id === currentTrack.id);
      if (index !== -1) {
        setActiveTrackIndex(index);
      }
    }
  }, [currentTrack, playlist]);
  
  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => handleNext();
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);
  
  // Play/pause control
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.play().catch(err => console.error('Play error:', err));
    } else {
      audio.pause();
    }
  }, [isPlaying]);
  
  // Volume control
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);
  
  // Get the current track URL
  const getCurrentTrackUrl = () => {
    if (!playlist || !playlist.tracks.length || activeTrackIndex >= playlist.tracks.length) {
      return '';
    }
    
    const track = playlist.tracks[activeTrackIndex];
    return track.track_url || track.audioUrl || track.url || '';
  };
  
  // Handlers
  const handleTogglePlay = () => setIsPlaying(prev => !prev);
  
  const handleSeek = (value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };
  
  const handlePrevious = () => {
    if (!playlist || !playlist.tracks.length) return;
    
    const newIndex = activeTrackIndex <= 0 ? playlist.tracks.length - 1 : activeTrackIndex - 1;
    setActiveTrackIndex(newIndex);
    setIsPlaying(true);
  };
  
  const handleNext = () => {
    if (!playlist || !playlist.tracks.length) return;
    
    const newIndex = activeTrackIndex >= playlist.tracks.length - 1 ? 0 : activeTrackIndex + 1;
    setActiveTrackIndex(newIndex);
    setIsPlaying(true);
  };
  
  const handleVolumeChange = (value: number) => {
    setVolume(value);
    if (value > 0 && isMuted) {
      setIsMuted(false);
    }
  };
  
  const handleToggleMute = () => setIsMuted(prev => !prev);
  
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getCurrentTrack = () => {
    if (!playlist || !playlist.tracks.length || activeTrackIndex >= playlist.tracks.length) {
      return null;
    }
    return playlist.tracks[activeTrackIndex];
  };
  
  const track = getCurrentTrack();

  return (
    <>
      <Drawer open={drawerOpen} onOpenChange={onOpenChange}>
        <DrawerContent side={side}>
          <div className="mx-auto w-full max-w-lg p-6">
            <DrawerHeader>
              <DrawerTitle>
                {playlist?.name || playlist?.title || "Playlist musicale"}
              </DrawerTitle>
              <DrawerDescription>
                {track ? `${activeTrackIndex + 1}/${playlist?.tracks.length} - ${track.title}` : "Aucune piste"}
              </DrawerDescription>
            </DrawerHeader>

            <div className="py-6">
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-blue-500 to-purple-700 shadow-lg" />
              </div>
              
              {track && (
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold">{track.title}</h3>
                  <p className="text-muted-foreground">{track.artist}</p>
                </div>
              )}
              
              <div className="space-y-4">
                <MusicProgressBar
                  progress={currentTime}
                  max={duration || track?.duration || 0}
                  currentTime={currentTime}
                  duration={duration || track?.duration || 0}
                  onSeek={handleSeek}
                  formatTime={formatTime}
                  showTimestamps
                  className="w-full"
                />
                
                <div className="flex justify-center items-center space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrevious}
                    disabled={!playlist?.tracks.length}
                  >
                    <SkipBack className="h-6 w-6" />
                  </Button>
                  
                  <Button
                    size="lg"
                    className="h-14 w-14 rounded-full"
                    onClick={handleTogglePlay}
                    disabled={!playlist?.tracks.length}
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6 ml-1" />
                    )}
                  </Button>
                  
                  <Button
                    variant="outline" 
                    size="icon"
                    onClick={handleNext}
                    disabled={!playlist?.tracks.length}
                  >
                    <SkipForward className="h-6 w-6" />
                  </Button>
                </div>
                
                <div className="w-48 mx-auto mt-4">
                  <VolumeControl
                    volume={volume}
                    onChange={handleVolumeChange}
                    isMuted={isMuted}
                    onMuteToggle={handleToggleMute}
                    className="w-full"
                    showLabel
                  />
                </div>
              </div>
            </div>

            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline" onClick={onClose}>Fermer</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      <audio
        ref={audioRef}
        src={getCurrentTrackUrl()}
        preload="metadata"
        style={{ display: 'none' }}
      />

      {children}
    </>
  );
};

export default MusicDrawer;
