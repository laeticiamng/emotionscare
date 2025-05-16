
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { VRSessionTemplate, VRTemplateGridProps } from '@/types/vr';

const VRTemplateGrid: React.FC<VRTemplateGridProps> = ({ 
  templates, 
  onSelect,
  filter,
  emotion
}) => {
  // Filter templates based on emotion if provided
  const filteredTemplates = emotion 
    ? templates.filter(template => 
        template.emotionTarget === emotion || 
        template.emotion_target === emotion)
    : templates;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredTemplates.map((template) => (
        <Card 
          key={template.id} 
          className="cursor-pointer hover:shadow-md transition-shadow duration-200"
          onClick={() => onSelect(template)}
        >
          <CardContent className="p-4">
            <div className="aspect-video bg-muted rounded-md mb-3 overflow-hidden">
              {template.thumbnailUrl ? (
                <img 
                  src={template.thumbnailUrl} 
                  alt={template.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  {template.thumbnailUrl ? (
                    <img src={template.thumbnailUrl} alt={template.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-primary">No Image</span>
                  )}
                </div>
              )}
            </div>
            
            <h3 className="font-medium text-base mb-1 line-clamp-1">{template.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {template.tags && template.tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index} 
                  className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {template.duration && (
                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full ml-auto">
                  {template.duration} min
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VRTemplateGrid;
