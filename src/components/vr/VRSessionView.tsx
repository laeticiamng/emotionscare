
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VRSessionTemplate } from '@/types/vr';
import { Play } from 'lucide-react';

interface VRSessionViewProps {
  template: VRSessionTemplate;
  onCompleteSession?: () => void;
}

const VRSessionView: React.FC<VRSessionViewProps> = ({ 
  template, 
  onCompleteSession 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{template.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{template.description}</p>
        
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Play className="h-12 w-12 mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground">Session VR en cours</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={onCompleteSession} className="w-full">
            Terminer la session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VRSessionView;
