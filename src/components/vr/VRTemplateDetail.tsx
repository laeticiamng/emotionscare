// @ts-nocheck

// @ts-nocheck
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VRTemplateDetailProps } from '@/types/vr';
import { Play, ArrowLeft, Heart } from 'lucide-react';

const VRTemplateDetail: React.FC<VRTemplateDetailProps> = ({ 
  template, 
  onStart, 
  onBack, 
  heartRate 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {template.title}
            {heartRate && (
              <div className="flex items-center gap-2 text-red-500">
                <Heart className="h-4 w-4" />
                {heartRate} bpm
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{template.description}</p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Durée :</span> {template.duration} min
            </div>
            <div>
              <span className="font-medium">Difficulté :</span> {template.difficulty}
            </div>
            <div>
              <span className="font-medium">Catégorie :</span> {template.category}
            </div>
          </div>

          <Button 
            onClick={() => onStart(template)} 
            className="w-full"
            size="lg"
          >
            <Play className="mr-2 h-4 w-4" />
            Commencer la session
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VRTemplateDetail;
