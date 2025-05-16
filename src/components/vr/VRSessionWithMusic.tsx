
import React, { useEffect, useState } from 'react';
import { VRSessionWithMusicPropsType } from '@/types';
import { useMusic } from '@/contexts/MusicContext';
import VRMusicTrackInfo from './VRMusicTrackInfo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VRMusicIntegration from './VRMusicIntegration';

const VRSessionWithMusic: React.FC<VRSessionWithMusicPropsType> = ({ 
  template,
  onComplete,
  onExit
}) => {
  const [musicEnabled, setMusicEnabled] = useState(false);
  const { loadPlaylistForEmotion, currentTrack, playTrack, pauseTrack } = useMusic();
  
  useEffect(() => {
    if (musicEnabled && template) {
      const emotion = template.emotionTarget || template.emotion_target || template.emotion || 'calm';
      loadPlaylistForEmotion(emotion);
    }
  }, [musicEnabled, template, loadPlaylistForEmotion]);
  
  const handleSessionComplete = (feedback: string, score: number) => {
    pauseTrack();
    if (onComplete) {
      onComplete(feedback, score);
    }
  };
  
  const handleToggleMusic = (enabled: boolean) => {
    setMusicEnabled(enabled);
    
    if (!enabled && currentTrack) {
      pauseTrack();
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-3">{template.title}</h2>
        <p className="text-muted-foreground">{template.description}</p>
        
        <div className="mt-6">
          <Tabs defaultValue="session">
            <TabsList className="mb-4">
              <TabsTrigger value="session">Session</TabsTrigger>
              <TabsTrigger value="music">Musique</TabsTrigger>
            </TabsList>
            
            <TabsContent value="session">
              <div className="min-h-[200px] flex items-center justify-center">
                <p>Contenu de la session VR...</p>
              </div>
            </TabsContent>
            
            <TabsContent value="music">
              <div className="space-y-6">
                <VRMusicIntegration 
                  session={template} 
                  onToggleMusic={handleToggleMusic}
                  musicEnabled={musicEnabled}
                />
                
                {musicEnabled && currentTrack && (
                  <div className="mt-4">
                    <VRMusicTrackInfo currentTrack={currentTrack} />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default VRSessionWithMusic;
