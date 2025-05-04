
import React from 'react';
import { Clock, Play, CheckCircle, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import YoutubeEmbed from './YoutubeEmbed';
import { VRSessionTemplate } from '@/types';

interface VRTemplateDetailProps {
  template: VRSessionTemplate;
  heartRate: number;
  onStartSession: () => void;
  onBack: () => void;
}

const VRTemplateDetail: React.FC<VRTemplateDetailProps> = ({ 
  template, 
  heartRate, 
  onStartSession, 
  onBack 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card>
          <CardContent className="p-0">
            <AspectRatio ratio={16/9}>
              <YoutubeEmbed 
                videoUrl={template.preview_url}
                controls={true}
                showInfo={false}
              />
            </AspectRatio>
            <div className="p-6">
              <h2 className="text-xl font-semibold">{template.theme}</h2>
              <div className="flex items-center mt-2 text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                <span>{template.duration} minutes</span>
              </div>
              <Button 
                className="mt-4 flex items-center" 
                onClick={onStartSession}
              >
                <Play className="h-4 w-4 mr-2" /> Démarrer la session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2">Bénéfices</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 text-primary flex-shrink-0" />
                <span>Réduction du stress</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 text-primary flex-shrink-0" />
                <span>Amélioration de la concentration</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 text-primary flex-shrink-0" />
                <span>Récupération mentale</span>
              </li>
            </ul>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Suivi santé</h3>
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-500" />
                <span>Rythme cardiaque: {heartRate} bpm</span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full mt-4" 
              onClick={onBack}
            >
              Retour aux templates
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VRTemplateDetail;
