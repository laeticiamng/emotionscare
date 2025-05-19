
import React, { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';

interface MusicEmotionSyncProps {
  className?: string;
  lastEmotion?: string;
}

const MusicEmotionSync: React.FC<MusicEmotionSyncProps> = ({ className, lastEmotion }) => {
  const [isSynced, setIsSynced] = useState(false);
  const { activateMusicForEmotion } = useMusicEmotionIntegration();
  
  // Sync music with emotion when enabled and emotion changes
  useEffect(() => {
    if (isSynced && lastEmotion) {
      activateMusicForEmotion(lastEmotion);
    }
  }, [isSynced, lastEmotion, activateMusicForEmotion]);
  
  const handleToggle = (checked: boolean) => {
    setIsSynced(checked);
    
    if (checked && lastEmotion) {
      // Immediately sync when enabling
      activateMusicForEmotion(lastEmotion);
    }
  };
  
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Switch
        id="emotion-music-sync"
        checked={isSynced}
        onCheckedChange={handleToggle}
      />
      <Label htmlFor="emotion-music-sync">Synchroniser la musique avec mes émotions</Label>
    </div>
  );
};

export default MusicEmotionSync;
