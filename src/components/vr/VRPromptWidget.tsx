
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { VRSessionTemplate } from '@/types/vr';
import { durationToNumber, formatDuration } from './utils';

interface VRPromptWidgetProps {
  template: VRSessionTemplate;
  onStart?: () => void;
  onSkip?: () => void;
  className?: string;
}

const VRPromptWidget: React.FC<VRPromptWidgetProps> = ({
  template,
  onStart,
  onSkip,
  className = "",
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl">Session recommandée</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video rounded-lg bg-gray-100 overflow-hidden">
          {template.thumbnailUrl && (
            <img
              src={template.thumbnailUrl}
              alt={template.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-medium">{template.title}</h3>
          <p className="text-sm text-muted-foreground">{template.description}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-muted/50 p-2 rounded text-center">
            <span className="block text-xs text-muted-foreground">Durée</span>
            <span className="font-medium">{formatDuration(template.duration)}</span>
          </div>
          <div className="bg-muted/50 p-2 rounded text-center">
            <span className="block text-xs text-muted-foreground">Difficulté</span>
            <span className="font-medium">{template.difficulty}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={onSkip}
        >
          Pas maintenant
        </Button>
        <Button
          onClick={onStart}
        >
          Commencer
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VRPromptWidget;
