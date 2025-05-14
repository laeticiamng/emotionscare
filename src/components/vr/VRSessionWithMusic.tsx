
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useMusic } from '@/contexts/MusicContext';
import { VRSessionWithMusicProps } from '@/types/types';

const VRSessionWithMusic: React.FC<VRSessionWithMusicProps> = ({ 
  template, 
  onComplete, 
  session, 
  onSessionComplete, 
  isAudioOnly, 
  videoUrl, 
  audioUrl, 
  emotion 
}) => {
  // Utiliser les props directes ou depuis le template
  const activeTemplate = session || template;
  const handleComplete = onSessionComplete || onComplete;
  
  const targetEmotion = emotion || (
    activeTemplate?.emotion || 'calm'
  );
  
  const { loadPlaylistForEmotion, isPlaying, playTrack, pauseTrack } = useMusic();
  
  useEffect(() => {
    // Charger une playlist basée sur l'émotion cible de la session
    const loadMusic = async () => {
      try {
        if (targetEmotion) {
          const playlist = await loadPlaylistForEmotion?.(targetEmotion);
          
          if (playlist && playlist.tracks.length > 0) {
            // S'assurer que la track a les propriétés requises
            const track = {
              ...playlist.tracks[0],
              duration: playlist.tracks[0].duration || 0,
              url: playlist.tracks[0].url || '',
              audioUrl: playlist.tracks[0].audioUrl || playlist.tracks[0].url || '',
              coverUrl: playlist.tracks[0].coverUrl || ''
            };
            playTrack(track);
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la musique pour VR:", error);
      }
    };
    
    loadMusic();
    
    // Nettoyage
    return () => {
      pauseTrack();
    };
  }, [activeTemplate, targetEmotion, loadPlaylistForEmotion, playTrack, pauseTrack]);
  
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Musique adaptative</h3>
            <p className="text-sm text-muted-foreground">
              {isPlaying ? 
                'Lecture en cours - Musique adaptée à votre session' : 
                'La musique démarrera automatiquement'}
            </p>
          </div>
          
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="animate-pulse">🎵</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VRSessionWithMusic;
