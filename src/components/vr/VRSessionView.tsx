
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { VRSession, VRSessionTemplate } from '@/types/vr';
import { durationToNumber, formatDuration } from './utils';

interface VRSessionViewProps {
  session?: VRSession;
  template?: VRSessionTemplate;
  onContinue?: () => void;
  onCompleteSession?: () => void; // Added this prop
  className?: string;
}

const VRSessionView: React.FC<VRSessionViewProps> = ({
  session,
  template,
  onContinue,
  onCompleteSession, // Added this prop
  className = "",
}) => {
  // Calculate progress percentage
  const calculateProgress = (): number => {
    if (!session) return 0;
    
    if (session.completed) return 100;
    
    if (session.startTime && session.endTime) {
      const startTimestamp = new Date(session.startTime).getTime();
      const endTimestamp = new Date(session.endTime).getTime();
      const totalDuration = endTimestamp - startTimestamp;
      const elapsed = Date.now() - startTimestamp;
      return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
    }
    
    // If template has duration, use that
    if (template) {
      const durationMs = durationToNumber(template.duration) * 60 * 1000; // convert to ms
      const startTimestamp = new Date(session?.startTime || new Date()).getTime();
      const elapsed = Date.now() - startTimestamp;
      return Math.min(100, Math.max(0, (elapsed / durationMs) * 100));
    }
    
    return 0;
  };

  const handleContinue = () => {
    if (onContinue) onContinue();
  };

  const handleComplete = () => {
    if (onCompleteSession) onCompleteSession();
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">
          {template?.title || "Session VR"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video rounded-lg relative bg-muted overflow-hidden">
          {template?.thumbnailUrl && (
            <img
              src={template.thumbnailUrl}
              alt={template.title}
              className="w-full h-full object-cover opacity-80"
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <Badge 
              className={`text-lg py-2 px-4 ${
                session?.completed ? 'bg-green-500' : 'bg-blue-500'
              }`}
            >
              {session?.completed ? 'Terminée' : 'En cours'}
            </Badge>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Progression</span>
            <span>{Math.round(calculateProgress())}%</span>
          </div>
          <Progress value={calculateProgress()} className="h-2" />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="border rounded p-2">
            <span className="text-xs text-muted-foreground block">Début</span>
            <span className="font-medium">
              {session?.startTime ? new Date(session.startTime).toLocaleString() : new Date().toLocaleString()}
            </span>
          </div>
          <div className="border rounded p-2">
            <span className="text-xs text-muted-foreground block">Durée</span>
            <span className="font-medium">
              {template ? formatDuration(template.duration) : "Non spécifiée"}
            </span>
          </div>
        </div>
        
        {session?.completed ? (
          <Button
            variant="outline"
            className="w-full"
            onClick={handleComplete}
          >
            Recommencer cette session
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={handleContinue}
          >
            Continuer la session
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default VRSessionView;
