
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Tag } from 'lucide-react';

interface VRSessionTemplate {
  id: string;
  title: string;
  description: string;
  duration: number;
  tags: string[];
  environment: string;
  thumbnailUrl: string;
  emotionTarget: string;
  category: string;
}

interface VRTemplateGridProps {
  templates: VRSessionTemplate[];
  onSelectTemplate: (template: VRSessionTemplate) => void;
}

export const VRTemplateGrid: React.FC<VRTemplateGridProps> = ({ templates, onSelectTemplate }) => {
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h${remainingMinutes ? ` ${remainingMinutes}min` : ''}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {templates.map((template) => (
        <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
          <div className="relative h-48 overflow-hidden">
            <img
              src={template.thumbnailUrl}
              alt={template.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-white/80 backdrop-blur-sm">
                {template.category}
              </Badge>
            </div>
          </div>
          
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{template.title}</CardTitle>
            <CardDescription className="line-clamp-2">{template.description}</CardDescription>
          </CardHeader>
          
          <CardContent className="pb-2 flex-grow">
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Clock className="mr-1 h-4 w-4" />
              <span>{formatDuration(template.duration)}</span>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {template.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {template.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{template.tags.length - 3}
                </Badge>
              )}
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              onClick={() => onSelectTemplate(template)} 
              className="w-full"
            >
              Commencer
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default VRTemplateGrid;
