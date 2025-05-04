
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import YoutubeEmbed from './YoutubeEmbed';
import { VRSessionTemplate } from '@/types';
import { extractYoutubeID } from '@/utils/vrUtils';

interface VRSessionViewProps {
  template: VRSessionTemplate;
  onCompleteSession: () => void;
}

const VRSessionView: React.FC<VRSessionViewProps> = ({ template, onCompleteSession }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4 text-center">
          <h2 className="text-xl font-semibold">{template.theme}</h2>
          
          <div className="relative rounded-xl overflow-hidden border border-muted">
            <AspectRatio ratio={16/9}>
              <YoutubeEmbed embedId={extractYoutubeID(template.preview_url || '')} />
            </AspectRatio>
          </div>
          
          <Button 
            onClick={onCompleteSession}
            className="mt-4"
          >
            Terminer la session
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VRSessionView;
