
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { VRSessionTemplate } from '@/types';

export interface VRTemplateGridProps {
  templates: VRSessionTemplate[];
  onSelect: (template: VRSessionTemplate) => void;
  onSelectTemplate?: (template: VRSessionTemplate) => void; // Added for backward compatibility
  filter?: string;
  className?: string;
}

const VRTemplateGrid: React.FC<VRTemplateGridProps> = ({
  templates,
  onSelect,
  onSelectTemplate,
  filter,
  className = ''
}) => {
  const handleSelect = (template: VRSessionTemplate) => {
    if (onSelectTemplate) {
      onSelectTemplate(template);
    } else {
      onSelect(template);
    }
  };
  
  // Filter templates if a filter is provided
  const displayTemplates = filter
    ? templates.filter(t => 
        t.emotion?.toLowerCase().includes(filter.toLowerCase()) || 
        t.title?.toLowerCase().includes(filter.toLowerCase()) ||
        t.description?.toLowerCase().includes(filter.toLowerCase()) ||
        t.tags?.some(tag => tag.toLowerCase().includes(filter.toLowerCase())))
    : templates;
  
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ${className}`}>
      {displayTemplates.map(template => (
        <Card 
          key={template.id}
          className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleSelect(template)}
        >
          <div className="aspect-video relative overflow-hidden bg-primary/10">
            {template.imageUrl || template.thumbnail ? (
              <img 
                src={template.imageUrl || template.thumbnail} 
                alt={template.title || template.name || 'VR Session'} 
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-muted">
                <span className="text-3xl">🧠</span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
              <span className="text-xs font-medium text-white bg-primary/80 px-2 py-1 rounded-full">
                {template.duration} min
              </span>
            </div>
          </div>
          <CardContent className="pt-3">
            <h3 className="font-medium mb-1 line-clamp-1">{template.title || template.name || 'Session sans titre'}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2">{template.description || 'Pas de description'}</p>
            {template.emotion && (
              <div className="mt-2 flex items-center">
                <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                  {template.emotion}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      
      {displayTemplates.length === 0 && (
        <div className="col-span-full flex justify-center p-8 text-muted-foreground">
          Aucune session VR ne correspond à votre recherche.
        </div>
      )}
    </div>
  );
};

export default VRTemplateGrid;
