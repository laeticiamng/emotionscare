
import React from 'react';
import { Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import YoutubeEmbed from './YoutubeEmbed';
import { VRSessionTemplate } from '@/types';

interface VRTemplateCardProps {
  template: VRSessionTemplate;
  onClick: (template: VRSessionTemplate) => void;
}

const VRTemplateCard: React.FC<VRTemplateCardProps> = ({ template, onClick }) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
      onClick={() => onClick(template)}
    >
      <CardContent className="p-0">
        <AspectRatio ratio={16/9}>
          <YoutubeEmbed 
            videoUrl={template.preview_url} 
            controls={true}
            mute={true}
            showInfo={false}
          />
        </AspectRatio>
        <div className="p-4">
          <h3 className="font-medium">{template.theme}</h3>
          <div className="flex items-center mt-2 text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>{template.duration} minutes</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VRTemplateCard;
