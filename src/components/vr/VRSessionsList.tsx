
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { VRSessionTemplate } from '@/types';
import { format } from 'date-fns';

interface VRSessionsListProps {
  templates: VRSessionTemplate[];
  onSelectTemplate: (template: VRSessionTemplate) => void;
  title?: string;
  className?: string;
}

const VRSessionsList: React.FC<VRSessionsListProps> = ({
  templates,
  onSelectTemplate,
  title = "Sessions disponibles",
  className = ""
}) => {
  // Sort templates by name
  const sortedTemplates = [...templates].sort((a, b) => 
    (a.name || a.title || '').localeCompare(b.name || b.title || '')
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedTemplates.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            Aucune session disponible
          </p>
        ) : (
          <div className="space-y-4">
            {sortedTemplates.map(template => (
              <div 
                key={template.id}
                className="p-3 border rounded-md hover:bg-muted/50 cursor-pointer"
                onClick={() => onSelectTemplate(template)}
              >
                <div className="font-medium">{template.name || template.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{template.description}</div>
                <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                  <div>Durée: {Math.round(template.duration / 60)} minutes</div>
                  {template.lastUsed && (
                    <div>
                      Dernière utilisation: {format(new Date(template.lastUsed), 'dd/MM/yyyy')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VRSessionsList;
