
import React, { useEffect, useState } from 'react';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';
import { MusicPlaylist } from '@/types/music';
import { VRSessionTemplate } from '@/types/vr';

interface VRMusicIntegrationProps {
  template: VRSessionTemplate;
  autoPlay?: boolean;
}

export const VRMusicIntegration: React.FC<VRMusicIntegrationProps> = ({
  template,
  autoPlay = true
}) => {
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const { activateMusicForEmotion, isLoading } = useMusicEmotionIntegration();
  
  // Determine the emotional mood from the template
  const getMoodFromTemplate = (): string => {
    if (template.recommendedMood) {
      return template.recommendedMood;
    }
    
    // Fall back to categories or tags if no mood is set
    if (template.category === 'relaxation' || template.tags.includes('calm')) {
      return 'calm';
    } else if (template.category === 'energy' || template.tags.includes('energize')) {
      return 'energetic';
    } else if (template.category === 'focus' || template.tags.includes('focus')) {
      return 'focused';
    }
    
    return 'calm'; // Default mood if nothing matches
  };
  
  useEffect(() => {
    if (autoPlay) {
      loadTemplateMusic();
    }
  }, [template, autoPlay]);
  
  const loadTemplateMusic = async () => {
    const mood = getMoodFromTemplate();
    
    try {
      const result = await activateMusicForEmotion({ 
        emotion: mood,
        intensity: template.intensity / 10 // Normalize to 0-1 range
      });
      
      if (result) {
        setPlaylist(result);
      }
    } catch (error) {
      console.error('Error loading VR template music:', error);
    }
  };
  
  return (
    <div className="vr-music-integration">
      {isLoading && <p>Chargement de l'ambiance musicale...</p>}
      {playlist && <p>Ambiance musicale activée: {playlist.name}</p>}
    </div>
  );
};

export default VRMusicIntegration;
