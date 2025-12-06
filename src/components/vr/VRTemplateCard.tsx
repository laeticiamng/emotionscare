// @ts-nocheck

import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VRSessionTemplate } from '@/types/vr';
import { formatDuration, getDifficultyClass } from './utils';

interface VRTemplateCardProps {
  template: VRSessionTemplate;
  isRecommended?: boolean;
  onSelect?: (template: VRSessionTemplate) => void;
  onDetails?: (template: VRSessionTemplate) => void;
  className?: string;
  compact?: boolean;
}

const VRTemplateCard: React.FC<VRTemplateCardProps> = ({
  template,
  isRecommended = false,
  onSelect,
  onDetails,
  className = "",
  compact = false
}) => {
  const handleSelect = () => {
    if (onSelect) onSelect(template);
  };
  
  const handleDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDetails) onDetails(template);
  };
  
  return (
    <Card 
      className={`${className} ${compact ? 'w-full' : 'w-full md:max-w-sm'} overflow-hidden transition-all hover:shadow-lg cursor-pointer`}
      onClick={handleSelect}
    >
      {isRecommended && (
        <div className="bg-primary text-primary-foreground text-xs font-medium py-1 px-4 text-center">
          Recommandé pour vous
        </div>
      )}
      
      <div className="relative">
        <div className={`${compact ? 'h-32' : 'aspect-video'} bg-muted relative overflow-hidden`}>
          {template.thumbnailUrl && (
            <img 
              src={template.thumbnailUrl} 
              alt={template.title}
              className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
            />
          )}
          <div className="absolute bottom-2 right-2">
            <Badge variant="secondary" className="opacity-90">
              {formatDuration(template.duration)}
            </Badge>
          </div>
        </div>
      </div>
      
      <CardHeader className={compact ? 'py-2 px-4' : ''}>
        <div className="flex justify-between items-start">
          <CardTitle className={compact ? 'text-base' : 'text-lg'}>{template.title}</CardTitle>
        </div>
        {!compact && (
          <CardDescription>{template.description}</CardDescription>
        )}
      </CardHeader>
      
      {!compact && (
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className={getDifficultyClass(template.difficulty)}>
              {template.difficulty}
            </Badge>
            
            {template.tags?.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      )}
      
      <CardFooter className={`${compact ? 'p-2' : ''} flex justify-between`}>
        <Button 
          variant="default" 
          size={compact ? 'sm' : 'default'}
          className={compact ? 'text-xs' : ''}
          onClick={handleSelect}
        >
          Commencer
        </Button>
        
        <Button 
          variant="outline" 
          size={compact ? 'sm' : 'default'}
          className={compact ? 'text-xs' : ''}
          onClick={handleDetails}
        >
          Détails
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VRTemplateCard;
