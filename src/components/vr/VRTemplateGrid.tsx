
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VRSessionTemplate } from '@/types/vr';
import { formatDuration } from './utils';

interface VRTemplateGridProps {
  templates: VRSessionTemplate[];
  onSelectTemplate: (template: VRSessionTemplate) => void;
}

const VRTemplateGrid: React.FC<VRTemplateGridProps> = ({ templates, onSelectTemplate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">{template.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{template.description}</p>
            
            <div className="flex justify-between text-sm">
              <span>Durée: {formatDuration(template.duration)}</span>
              <span>Difficulté: {template.difficulty}</span>
            </div>
            
            {template.tags && (
              <div className="flex flex-wrap gap-1">
                {template.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-muted text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            <Button 
              onClick={() => onSelectTemplate(template)}
              className="w-full"
            >
              Sélectionner
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VRTemplateGrid;
