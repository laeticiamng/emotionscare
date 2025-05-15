
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer } from 'lucide-react';
import { VRSessionTemplate } from '@/types';

interface VRTemplateGridProps {
  templates: VRSessionTemplate[];
  onSelect: (template: VRSessionTemplate) => void;
  className?: string;
}

const VRTemplateGrid: React.FC<VRTemplateGridProps> = ({
  templates,
  onSelect,
  className = ''
}) => {
  if (!templates || templates.length === 0) {
    return (
      <div className={`text-center p-4 ${className}`}>
        <p className="text-muted-foreground">Aucune session disponible</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}>
      {templates.map(template => (
        <Card 
          key={template.id}
          className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onSelect(template)}
        >
          <div className="aspect-[4/3] relative">
            {template.preview_url ? (
              <img 
                src={template.preview_url} 
                alt={template.name || template.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${
                template.emotion === 'calm' ? 'from-blue-100 to-indigo-200' :
                template.emotion === 'energetic' ? 'from-orange-100 to-red-200' :
                template.emotion === 'focused' ? 'from-amber-100 to-yellow-200' :
                'from-gray-100 to-gray-200'
              }`}>
                <div className="text-4xl opacity-70">
                  {template.is_audio_only ? '🎧' : '🌄'}
                </div>
              </div>
            )}
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
              <h3 className="text-white font-medium truncate">
                {template.name || template.title}
              </h3>
            </div>
          </div>
          
          <CardContent className="p-3 pt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                <Timer className="h-3 w-3 mr-1" />
                <span>{Math.round(template.duration / 60)} min</span>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(template);
                }}
              >
                Commencer
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VRTemplateGrid;
