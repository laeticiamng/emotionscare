
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { VRTemplateDetailProps } from '@/types/vr';
import { getVRTemplateCoverUrl } from '@/utils/vrCompatibility';

const VRTemplateDetail: React.FC<VRTemplateDetailProps> = ({ 
  template, 
  onStart, 
  onBack 
}) => {
  // Get cover URL using compatibility helper
  const coverUrl = getVRTemplateCoverUrl(template);
  
  return (
    <Card className="overflow-hidden">
      {coverUrl && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={coverUrl} 
            alt={template.title} 
            className="object-cover w-full h-full" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <h2 className="text-2xl font-bold">{template.title}</h2>
            <p className="text-sm opacity-90">{template.category} • {template.duration} min</p>
          </div>
        </div>
      )}
      
      <CardHeader>
        {!coverUrl && <h2 className="text-2xl font-bold">{template.title}</h2>}
        <p className="text-muted-foreground">{template.description}</p>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium">Difficulté</p>
            <p className="text-muted-foreground">{template.difficulty}</p>
          </div>
          <div>
            <p className="font-medium">Durée</p>
            <p className="text-muted-foreground">{template.duration} minutes</p>
          </div>
          {template.tags && template.tags.length > 0 && (
            <div className="col-span-2">
              <p className="font-medium">Tags</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {template.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Retour
          </Button>
        )}
        {onStart && (
          <Button onClick={onStart}>
            Démarrer la session
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default VRTemplateDetail;
