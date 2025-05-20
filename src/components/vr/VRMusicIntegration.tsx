
import React, { useEffect, useState } from 'react';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';
import { MusicPlaylist } from '@/types/music';
import { VRSessionTemplate } from '@/types/vr';

interface VRMusicIntegrationProps {
  template?: VRSessionTemplate;
  autoPlay?: boolean;
  sessionId?: string;
  emotionTarget?: string;
  onMusicReady?: () => void;
}

export const VRMusicIntegration: React.FC<VRMusicIntegrationProps> = ({
  template,
  autoPlay = true,
  sessionId,
  emotionTarget,
  onMusicReady
}) => {
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const { activateMusicForEmotion, isLoading } = useMusicEmotionIntegration();
  
  // Determine the emotional mood from the template
  const getMoodFromTemplate = (): string => {
    if (emotionTarget) {
      return emotionTarget;
    }
    
    if (template?.recommendedMood) {
      return template.recommendedMood;
    }
    
    // Fall back to categories or tags if no mood is set
    if (template?.category === 'relaxation' || (template?.tags && template.tags.includes('calm'))) {
      return 'calm';
    } else if (template?.category === 'energy' || (template?.tags && template.tags.includes('energize'))) {
      return 'energetic';
    } else if (template?.category === 'focus' || (template?.tags && template.tags.includes('focus'))) {
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
      let intensityValue = 0.5; // Default intensity
      
      // Check if template has intensity and convert it to a number between 0-1
      if (template && template.intensity) {
        const intensity = typeof template.intensity === 'number' 
          ? template.intensity 
          : parseFloat(template.intensity);
        
        if (!isNaN(intensity)) {
          // Normalize intensity to 0-1 range if it's on a different scale
          intensityValue = intensity > 10 ? intensity / 100 : intensity / 10;
        }
      }
      
      const result = await activateMusicForEmotion({ 
        emotion: mood,
        intensity: intensityValue
      });
      
      if (result) {
        setPlaylist(result);
        if (onMusicReady) {
          onMusicReady();
        }
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
