
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useVRSession } from '@/hooks/useVRSession';
import { VRSessionTemplate } from '@/types/vr';

interface VRPromptWidgetProps {
  template?: VRSessionTemplate;
}

const VRPromptWidget = ({ template }: VRPromptWidgetProps) => {
  const { toast } = useToast();
  const { 
    startSession,
    completeSession,
    currentSession 
  } = useVRSession('user-id'); // Provide a default user ID for now
  
  const isSessionActive = !!currentSession?.id && !currentSession?.completed;
  
  const handleStartSession = () => {
    if (template) {
      startSession(template.id);
      toast({
        title: 'Session VR démarrée',
        description: `Votre session de ${template.duration} minutes a commencé`
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Session VR</CardTitle>
      </CardHeader>
      <CardContent>
        {isSessionActive ? (
          <Button 
            onClick={() => completeSession(currentSession.id)}
            variant="destructive"
            className="w-full"
          >
            Terminer la session
          </Button>
        ) : (
          <Button 
            onClick={handleStartSession} 
            className="w-full"
            disabled={!template}
          >
            Démarrer une session
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default VRPromptWidget;
