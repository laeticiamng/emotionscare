
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Heart, Star } from 'lucide-react';
import { VRSessionTemplate } from '@/types';
import { getVRTemplateThumbnail, getVRTemplateCompletionRate, getVRTemplateEmotionTarget } from '@/utils/compatibility';

interface VRTemplateCardProps {
  template: VRSessionTemplate;
  onSelect?: (template: VRSessionTemplate) => void;
  className?: string;
  compact?: boolean;
  showActions?: boolean;
}

const VRTemplateCard: React.FC<VRTemplateCardProps> = ({ 
  template, 
  onSelect, 
  className = '',
  compact = false,
  showActions = true
}) => {
  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
  };

  // Get thumbnail using helper
  const thumbnailUrl = getVRTemplateThumbnail(template);
  
  // Get emotion target using helper
  const emotionTarget = getVRTemplateEmotionTarget(template);

  const handleClick = () => {
    if (onSelect) {
      onSelect(template);
    }
  };

  return (
    <Card 
      className={`overflow-hidden transition-shadow hover:shadow-md ${compact ? 'h-full' : ''} ${className}`}
      onClick={handleClick}
    >
      <div className={`relative ${compact ? 'h-32' : 'h-48'}`}>
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={template.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-2xl text-muted-foreground">VR</span>
          </div>
        )}
        
        {template.difficulty && (
          <Badge variant="secondary" className="absolute top-3 right-3">
            {template.difficulty}
          </Badge>
        )}
        
        {emotionTarget && (
          <Badge variant="outline" className="absolute top-3 left-3 bg-background/80">
            {emotionTarget}
          </Badge>
        )}
      </div>
      
      <CardContent className={compact ? 'p-3' : 'p-4'}>
        <h3 className={`font-semibold ${compact ? 'text-sm' : 'text-lg'} mb-1`}>{template.title}</h3>
        
        {!compact && template.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{template.description}</p>
        )}
        
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> 
            {formatDuration(template.duration)}
          </Badge>
          
          {template.tags && template.tags.slice(0, compact ? 1 : 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          
          {getVRTemplateCompletionRate(template) > 0 && (
            <Badge variant="outline" className="ml-auto flex items-center gap-1">
              <Star className="w-3 h-3 fill-primary text-primary" /> 
              {Math.round(getVRTemplateCompletionRate(template) * 100)}%
            </Badge>
          )}
        </div>
      </CardContent>
      
      {showActions && !compact && (
        <CardFooter className="p-3 pt-0 flex justify-between">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={handleClick}
          >
            Démarrer
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default VRTemplateCard;
