
import React, { useState, useEffect } from 'react';
import { Badge, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VRSessionTemplate, VRSession } from '@/types';

interface VRActiveSessionProps {
  session?: VRSession;
  template?: VRSessionTemplate;
  onResume?: () => void;
  onCancel?: () => void;
}

const VRActiveSession: React.FC<VRActiveSessionProps> = ({
  session,
  template,
  onResume,
  onCancel
}) => {
  const [timeElapsed, setTimeElapsed] = useState<string>('');
  
  useEffect(() => {
    if (!session || !session.startTime) return;
    
    // Calculate time elapsed since session started
    const calculateTimeElapsed = () => {
      const start = new Date(session.startTime);
      const now = new Date();
      const diffMs = now.getTime() - start.getTime();
      
      // Format as HH:MM:SS
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
    
    // Update time elapsed every second
    const intervalId = setInterval(() => {
      setTimeElapsed(calculateTimeElapsed());
    }, 1000);
    
    // Initial calculation
    setTimeElapsed(calculateTimeElapsed());
    
    return () => clearInterval(intervalId);
  }, [session]);
  
  if (!session && !template) return null;
  
  const sessionTitle = template?.title || template?.name || 'Session en cours';
  
  return (
    <div className="p-4 border rounded-lg bg-muted/20">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">{sessionTitle}</h3>
        {session?.is_audio_only ? (
          <Badge variant="outline" className="px-2 py-1 text-xs">Audio</Badge>
        ) : (
          <Badge variant="outline" className="px-2 py-1 text-xs">VR</Badge>
        )}
      </div>
      
      <div className="flex items-center text-muted-foreground text-sm mb-3">
        <Clock className="h-4 w-4 mr-1" />
        <span>{timeElapsed || '00:00:00'} écoulées</span>
      </div>
      
      <div className="flex space-x-2">
        <Button variant="default" className="flex-1" onClick={onResume}>
          Reprendre
        </Button>
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </div>
  );
};

export default VRActiveSession;
