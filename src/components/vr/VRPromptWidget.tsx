
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useVRSession } from '@/hooks/useVRSession';
import { VRSessionTemplate } from '@/types';

interface VRPromptWidgetProps {
  template?: VRSessionTemplate;
}

const VRPromptWidget = ({ template }: VRPromptWidgetProps) => {
  const { toast } = useToast();
  const { 
    activeTemplate,
    isSessionActive, 
    startSession,
    completeSession 
  } = useVRSession();
  
  const handleStartSession = () => {
    if (template) {
      startSession(template);
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
            onClick={() => completeSession()} 
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
