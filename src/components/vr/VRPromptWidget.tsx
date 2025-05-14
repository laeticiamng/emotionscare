
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Timer } from 'lucide-react';
import { VRSessionTemplate, VRSession } from '@/types/vr';
import { useRouter } from '@/hooks/router';

interface VRPromptWidgetProps {
  template?: VRSessionTemplate;
  latestSession?: VRSession;
  className?: string;
}

const VRPromptWidget: React.FC<VRPromptWidgetProps> = ({
  template,
  latestSession,
  className
}) => {
  const router = useRouter();
  
  const handleStartSession = () => {
    router.push(`/vr/session/${template?.id || 'new'}`);
  };
  
  const formatSessionDuration = (duration: number) => {
    if (duration < 60) return `${duration} sec`;
    return `${Math.floor(duration / 60)} min`;
  };
  
  const hasRecentSession = latestSession && !latestSession.completed;
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center">
          <Brain className="mr-2 h-5 w-5" />
          Micro-pause bien-être
        </CardTitle>
        <CardDescription>
          Prenez quelques minutes pour vous ressourcer
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        {template ? (
          <div className="space-y-3">
            <div className="font-medium">{template.title}</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Timer className="mr-1 h-4 w-4" />
              {formatSessionDuration(template.duration)}
            </div>
            {template.description && (
              <p className="text-sm">{template.description}</p>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="text-sm text-muted-foreground">
              Réduisez votre stress avec une micro-pause adaptée à votre état émotionnel
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleStartSession} 
          className="w-full" 
          variant={template ? "default" : "outline"}
        >
          {hasRecentSession ? "Reprendre ma session" : "Démarrer une session"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VRPromptWidget;
