
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { VRSessionTemplate } from '@/types';
import { StarIcon, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface VRSessionsListProps {
  templates: VRSessionTemplate[];
  onSelectTemplate: (template: VRSessionTemplate) => void;
  filter?: string;
}

const VRSessionsList: React.FC<VRSessionsListProps> = ({ 
  templates, 
  onSelectTemplate,
  filter
}) => {
  // Filter templates if a filter is provided
  const filteredTemplates = filter 
    ? templates.filter(template => 
        template.category === filter || 
        template.emotions?.includes(filter) || 
        template.tags?.includes(filter)
      )
    : templates;
    
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredTemplates.map((template) => (
        <Card 
          key={template.id} 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onSelectTemplate(template)}
        >
          <div className="aspect-video w-full overflow-hidden bg-muted">
            {template.preview_url && !template.is_audio_only ? (
              <img 
                src={template.preview_url} 
                alt={template.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10">
                <p className="text-primary font-medium">Audio Only</p>
              </div>
            )}
          </div>
          
          <CardContent className="p-4">
            <h3 className="font-bold mb-1">{template.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {template.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline" className="text-xs">
                {template.category}
              </Badge>
              
              {template.difficulty && (
                <Badge 
                  variant={
                    template.difficulty === 'easy' ? 'secondary' : 
                    template.difficulty === 'medium' ? 'default' : 
                    'destructive'
                  }
                  className="text-xs"
                >
                  {template.difficulty}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{template.duration} min</span>
              </div>
              
              {template.popularity && (
                <div className="flex items-center gap-1">
                  <StarIcon className="h-3 w-3 text-yellow-500" />
                  <span>{template.popularity.toFixed(1)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {filteredTemplates.length === 0 && (
        <div className="col-span-full p-8 text-center text-muted-foreground">
          <p>No VR sessions found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default VRSessionsList;
