import React from 'react';
import { Clock, Play, CheckCircle, Heart, Headphones } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import YoutubeEmbed from './YoutubeEmbed';
import { VRSessionTemplate } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

interface VRTemplateDetailProps {
  template: VRSessionTemplate;
  heartRate: number;
  onStartSession: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

const VRTemplateDetail: React.FC<VRTemplateDetailProps> = ({ 
  template, 
  heartRate, 
  onStartSession, 
  onBack,
  isLoading = false
}) => {
  const title = template?.title || template?.theme || "Session VR";
  const duration = template?.duration || 0;
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-0">
              <Skeleton className="w-full aspect-video" />
              <div className="p-6">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-6" />
                <Skeleton className="h-10 w-40" />
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-1/2 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card>
          <CardContent className="p-0">
            {template.is_audio_only ? (
              <div className="aspect-video bg-gradient-to-br from-purple-900 to-indigo-600 flex items-center justify-center">
                <Headphones className="h-16 w-16 text-white opacity-75" />
              </div>
            ) : (
              <AspectRatio ratio={16/9}>
                <YoutubeEmbed 
                  videoUrl={template.preview_url}
                  controls={true}
                  showInfo={false}
                />
              </AspectRatio>
            )}
            
            <div className="p-6">
              <h2 className="text-xl font-semibold">{title}</h2>
              <div className="flex items-center mt-2 text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                <span>{duration} minutes</span>
                
                {template.is_audio_only && (
                  <span className="ml-3 flex items-center">
                    <Headphones className="h-4 w-4 mr-1" />
                    <span>Audio uniquement</span>
                  </span>
                )}
              </div>
              
              {template.description && (
                <p className="mt-3 text-sm text-muted-foreground">
                  {template.description}
                </p>
              )}
              
              {template.completion_rate !== undefined && (
                <div className="mt-3 text-sm text-muted-foreground">
                  Vous avez complété {template.completion_rate}% de ce type de session
                </div>
              )}
              
              <div className="flex gap-2 flex-wrap mt-4">
                <Button 
                  className="flex items-center" 
                  onClick={onStartSession}
                >
                  <Play className="h-4 w-4 mr-2" /> Démarrer la session
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={onBack}
                >
                  Retour
                </Button>
              </div>
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
              {template.is_audio_only && (
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-primary flex-shrink-0" />
                  <span>Pratique de pleine conscience</span>
                </li>
              )}
            </ul>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Suivi santé</h3>
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-500" />
                <span>Rythme cardiaque: {heartRate} bpm</span>
              </div>
            </div>
            
            {template.recommended_mood && (
              <div className="bg-primary/10 p-3 rounded-lg mt-6">
                <p className="text-sm">
                  <span className="font-medium">Ambiance recommandée:</span>{' '}
                  <span className="capitalize">{template.recommended_mood}</span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VRTemplateDetail;
