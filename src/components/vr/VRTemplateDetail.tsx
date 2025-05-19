
import React from 'react';
import { VRSessionTemplate } from '@/types/vr';
import { Button } from '@/components/ui/button';
import { Clock, Users, Star, ChevronLeft } from 'lucide-react';
import { formatDuration, getDifficultyClass } from './utils';
import { Badge } from '@/components/ui/badge';

interface VRTemplateDetailProps {
  template: VRSessionTemplate;
  heartRate?: number;
  onStart?: () => void;
  onBack?: () => void;
}

const VRTemplateDetail: React.FC<VRTemplateDetailProps> = ({
  template,
  heartRate,
  onStart,
  onBack
}) => {
  // Utilisons l'image disponible en suivant l'ordre de priorité
  const getImageUrl = () => {
    if (template.thumbnailUrl) return template.thumbnailUrl;
    if (template.imageUrl) return template.imageUrl;
    if (template.coverUrl) return template.coverUrl;
    if (template.cover_url) return template.cover_url;
    if (template.preview_url) return template.preview_url;
    return '/images/vr-placeholder.jpg';
  };

  // Gérer l'événement de début de session
  const handleStart = () => {
    if (onStart) onStart();
  };

  // Gérer l'événement de retour
  const handleBack = () => {
    if (onBack) onBack();
  };

  return (
    <div className="space-y-6">
      {onBack && (
        <Button variant="ghost" size="sm" onClick={handleBack} className="mb-2">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Retour
        </Button>
      )}
      
      <div className="relative h-48 md:h-64 rounded-lg overflow-hidden bg-muted">
        <img 
          src={getImageUrl()} 
          alt={template.title} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div>
        <h1 className="text-2xl font-bold">{template.title}</h1>
        <p className="text-muted-foreground mt-2">{template.description}</p>

        <div className="flex flex-wrap gap-2 mt-4">
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-1" />
            {formatDuration(template.duration)}
          </div>
          
          <div className="flex items-center text-sm">
            <Badge variant="outline" className={getDifficultyClass(template.difficulty)}>
              {template.difficulty}
            </Badge>
          </div>
          
          {template.rating && (
            <div className="flex items-center text-sm">
              <Star className="h-4 w-4 mr-1 text-amber-500" />
              {template.rating.toFixed(1)}
            </div>
          )}
        </div>

        {template.features && template.features.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Fonctionnalités</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {template.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}

        {template.tags && template.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-4">
            {template.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <Button onClick={handleStart} className="w-full mt-6">
          Démarrer la session
        </Button>
      </div>
    </div>
  );
};

export default VRTemplateDetail;
