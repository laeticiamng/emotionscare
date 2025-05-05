
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { VRSessionTemplate } from '@/types';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';
import YoutubeEmbed from './YoutubeEmbed';
import VRAudioSession from './VRAudioSession';
import VRSessionProgress from './VRSessionProgress';
import VRSessionControls from './VRSessionControls';
import VRMusicTrackInfo from './VRMusicTrackInfo';
import { useVRSessionTimer } from '@/hooks/useVRSessionTimer';

interface VRSessionWithMusicProps {
  template: VRSessionTemplate;
  onCompleteSession: () => void;
}

const VRSessionWithMusic: React.FC<VRSessionWithMusicProps> = ({ template, onCompleteSession }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const { loadPlaylistForEmotion, openDrawer, isPlaying, pauseTrack, playTrack, currentTrack } = useMusic();
  const { toast } = useToast();
  
  const totalDurationSeconds = template.duration * 60;
  
  const { percentageComplete, formatTimeRemaining } = useVRSessionTimer({
    totalDurationSeconds,
    isPaused,
    onComplete: onCompleteSession
  });

  const togglePlayPause = () => {
    setIsPaused(!isPaused);
    setIsAudioPlaying(!isPaused);
  };
  
  const toggleAmbianceMusic = () => {
    if (isMusicPlaying) {
      pauseTrack();
      setIsMusicPlaying(false);
      toast({
        title: "Musique d'ambiance désactivée",
        description: "La musique a été mise en pause"
      });
    } else {
      // Map VR template themes to music playlists
      const musicTypeMap: Record<string, string> = {
        'Forêt apaisante': 'calm',
        'Plage relaxante': 'calm',
        'Méditation guidée': 'focused',
        'Respiration profonde': 'focused',
        'Montagne': 'calm',
        'Espace': 'focused',
        'Urbain Zen': 'calm'
      };
      
      const musicType = musicTypeMap[template.theme] || 'calm';
      
      loadPlaylistForEmotion(musicType);
      setIsMusicPlaying(true);
      toast({
        title: "Musique d'ambiance activée",
        description: `Playlist "${musicType}" ajoutée à votre expérience VR`
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4 text-center">
          <h2 className="text-xl font-semibold">{template.theme}</h2>
          
          <div className="space-y-6">
            <div className="relative rounded-xl overflow-hidden border border-muted">
              {template.is_audio_only ? (
                <VRAudioSession
                  template={template}
                  isPaused={isPaused}
                  onTogglePause={togglePlayPause}
                  onComplete={onCompleteSession}
                />
              ) : (
                <AspectRatio ratio={16/9} className="max-w-4xl mx-auto">
                  <YoutubeEmbed 
                    videoUrl={template.preview_url}
                    autoplay={true}
                    controls={true}
                    showInfo={false}
                    loop={true}
                  />
                </AspectRatio>
              )}
            </div>

            <VRSessionProgress 
              percentageComplete={percentageComplete} 
              timeRemaining={formatTimeRemaining()}
            />

            <VRSessionControls
              isAudioOnly={template.is_audio_only || false}
              isPaused={isPaused}
              isMusicPlaying={isMusicPlaying}
              onTogglePause={togglePlayPause}
              onToggleMusic={toggleAmbianceMusic}
              onComplete={onCompleteSession}
            />
            
            {isMusicPlaying && currentTrack && (
              <VRMusicTrackInfo currentTrack={currentTrack} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VRSessionWithMusic;
