
import React, { useEffect, useState } from 'react';
import { useMusic } from '@/contexts/music';
import { useCoach } from '@/contexts/coach';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface MusicEmotionSyncProps {
  className?: string;
}

const MusicEmotionSync: React.FC<MusicEmotionSyncProps> = ({ className }) => {
  const [isSynced, setIsSynced] = useState(false);
  const { loadPlaylistForEmotion, setEmotion } = useMusic();
  const { lastEmotion } = useCoach();
  
  // Sync music with emotion when enabled and emotion changes
  useEffect(() => {
    if (isSynced && lastEmotion) {
      loadPlaylistForEmotion(lastEmotion);
      setEmotion(lastEmotion);
    }
  }, [isSynced, lastEmotion, loadPlaylistForEmotion, setEmotion]);
  
  const handleToggle = (checked: boolean) => {
    setIsSynced(checked);
    
    if (checked && lastEmotion) {
      // Immediately sync when enabling
      loadPlaylistForEmotion(lastEmotion);
      setEmotion(lastEmotion);
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
