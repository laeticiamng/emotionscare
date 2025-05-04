
import React from 'react';
import { Clock, Headphones } from 'lucide-react';
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
        <AspectRatio ratio={16/9} className="relative">
          {template.is_audio_only ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-600 text-white">
              <Headphones className="h-12 w-12 opacity-75" />
            </div>
          ) : (
            <YoutubeEmbed 
              videoUrl={template.preview_url} 
              controls={true}
              mute={true}
              showInfo={false}
            />
          )}
          {template.is_audio_only && (
            <div className="absolute top-2 right-2 bg-purple-800 text-white text-xs px-2 py-1 rounded-full">
              Audio uniquement
            </div>
          )}
        </AspectRatio>
        <div className="p-4">
          <h3 className="font-medium">{template.theme}</h3>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>{template.duration} minutes</span>
            </div>
            {template.completion_rate !== undefined && (
              <div className="text-xs text-muted-foreground">
                Complété {template.completion_rate}%
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VRTemplateCard;
