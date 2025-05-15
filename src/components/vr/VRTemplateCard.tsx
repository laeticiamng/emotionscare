
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { VRSessionTemplate } from '@/types';
import { CheckCircle, Clock3 } from "lucide-react";

interface VRTemplateCardProps {
  template: VRSessionTemplate;
  onClick?: (template: VRSessionTemplate) => void;
  className?: string;
  hideButton?: boolean;
}

const VRTemplateCard: React.FC<VRTemplateCardProps> = ({ 
  template, 
  onClick, 
  className = "",
  hideButton = false
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) {
      onClick(template);
    } else {
      navigate(`/vr/templates/${template.id}`);
    }
  };
  
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} heure${hours > 1 ? 's' : ''}`;
    }
    
    return `${hours}h ${remainingMinutes}min`;
  };
  
  // Use the camelCase property or fallback to snake_case for backward compatibility
  const completionRate = template.completionRate || template.completion_rate;
  
  return (
    <Card 
      className={`overflow-hidden hover:shadow-md transition-all cursor-pointer ${className}`}
      onClick={handleClick}
    >
      <div 
        className="h-32 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${template.preview_url || '/images/vr-banner-bg.jpg'})` 
        }}
      >
        {completionRate ? (
          <div className="flex items-center gap-1 bg-primary/80 text-primary-foreground px-2 py-1 rounded-br-md text-xs font-medium w-fit">
            <CheckCircle size={12} />
            <span>{Math.round(completionRate * 100)}% complété</span>
          </div>
        ) : null}
      </div>
      
      <CardContent className="p-4 pt-3">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-medium text-lg line-clamp-1">{template.title}</h3>
        </div>
        
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
          <Clock3 size={12} />
          <span>{formatDuration(template.duration)}</span>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 h-10">
          {template.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          {template.emotion && (
            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
              {template.emotion}
            </span>
          )}
          
          {!hideButton && (
            <Button 
              size="sm" 
              variant="default"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/vr/session/${template.id}`);
              }}
            >
              Démarrer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VRTemplateCard;
