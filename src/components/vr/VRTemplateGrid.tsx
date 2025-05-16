
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Tag } from 'lucide-react';
import { VRSessionTemplate } from '@/types';

interface VRTemplateGridProps {
  templates: VRSessionTemplate[];
  onSelect: (template: VRSessionTemplate) => void;
  emotion?: string;
}

const VRTemplateGrid: React.FC<VRTemplateGridProps> = ({
  templates,
  onSelect,
  emotion
}) => {
  const filteredTemplates = emotion 
    ? templates.filter(t => t.emotionTarget === emotion || !t.emotionTarget)
    : templates;
    
  if (filteredTemplates.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">
          Aucune séance VR disponible{emotion ? ` pour l'émotion "${emotion}"` : ''}.
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredTemplates.map((template) => (
        <Card key={template.id} className="overflow-hidden flex flex-col h-full">
          <div 
            className="h-40 bg-muted relative"
            style={template.thumbnailUrl ? { 
              backgroundImage: `url(${template.thumbnailUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            } : {}}
          >
            {!template.thumbnailUrl && (
              <div className="flex items-center justify-center h-full">
                <span className="text-muted-foreground">Pas d'aperçu</span>
              </div>
            )}
          </div>
          <CardHeader>
            <CardTitle>{template.title}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{template.duration} minutes</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-muted-foreground text-sm">
              {template.description}
            </p>
            {template.tags && template.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {template.tags.map((tag, i) => (
                  <div key={i} className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-md flex items-center">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full"
              onClick={() => onSelect(template)}
            >
              Commencer la séance
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default VRTemplateGrid;
