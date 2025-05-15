
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Tag, Percent } from 'lucide-react';
import { VRSessionTemplate } from '@/types';

interface VRTemplateCardProps {
  template: VRSessionTemplate;
  onClick?: () => void;
  selected?: boolean;
  minimal?: boolean;
}

const VRTemplateCard: React.FC<VRTemplateCardProps> = ({
  template,
  onClick,
  selected = false,
  minimal = false
}) => {
  // Format duration in minutes
  const formatDuration = (seconds?: number): string => {
    if (!seconds) return '5 min';
    const minutes = Math.round(seconds / 60);
    return `${minutes} min`;
  };
  
  // Safely get template image URL
  const getImageUrl = (): string => {
    return template.imageUrl || 
           template.thumbnailUrl || 
           template.coverUrl || 
           template.preview_url ||
           '/images/vr-template-placeholder.jpg';
  };
  
  const cardClasses = `
    relative cursor-pointer transition-all 
    ${selected ? 'ring-2 ring-primary' : 'hover:shadow-md'} 
    ${minimal ? 'p-1' : ''}
  `;
  
  return (
    <Card 
      className={cardClasses} 
      onClick={onClick}
    >
      <CardContent className={minimal ? 'p-0' : 'p-3'}>
        <div className="flex gap-3">
          {/* Template Image */}
          <div 
            className={`rounded-md overflow-hidden flex-shrink-0 ${minimal ? 'w-16 h-16' : 'w-24 h-24'}`}
            style={{
              backgroundImage: `url(${getImageUrl()})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          
          {/* Template Details */}
          <div className="flex flex-col justify-between flex-grow">
            <div>
              <h3 className={`font-medium line-clamp-1 ${minimal ? 'text-sm' : 'text-base'}`}>
                {template.title}
              </h3>
              
              {!minimal && (
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {template.description || 'Immersive experience for emotional well-being'}
                </p>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {/* Duration */}
              <Badge variant="outline" className="text-xs flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDuration(template.duration)}
              </Badge>
              
              {/* Category/Difficulty */}
              {!minimal && template.difficulty && (
                <Badge variant="outline" className="text-xs">
                  {template.difficulty}
                </Badge>
              )}
              
              {/* Completion Rate */}
              {!minimal && (template.completionRate !== undefined || template.completion_rate !== undefined) && (
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  <Percent className="h-3 w-3" />
                  {template.completionRate || template.completion_rate || 0}% complete
                </Badge>
              )}
              
              {/* Emotion Tag */}
              {!minimal && template.emotion && (
                <Badge className="text-xs bg-primary/20 text-primary flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {template.emotion}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VRTemplateCard;
