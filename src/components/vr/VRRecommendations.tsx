
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { VRSessionTemplate } from '@/types';
import { ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VRRecommendationsProps {
  recommendations: VRSessionTemplate[];
  onSelectTemplate: (template: VRSessionTemplate) => void;
}

const VRRecommendations: React.FC<VRRecommendationsProps> = ({
  recommendations,
  onSelectTemplate,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Recommended for you</h2>
      </div>
      
      {recommendations.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">
          No personalized recommendations yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <div className="aspect-video overflow-hidden bg-muted">
                {template.preview_url && !template.is_audio_only ? (
                  <img
                    src={template.preview_url}
                    alt={template.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <p className="text-center font-medium">Audio Session</p>
                  </div>
                )}
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-bold mb-1">{template.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {template.description}
                </p>
                
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => onSelectTemplate(template)}
                >
                  <span>Start Session</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VRRecommendations;
