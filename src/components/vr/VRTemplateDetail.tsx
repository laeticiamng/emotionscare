
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VRTemplateDetailProps } from '@/types/vr';
import { Play, ArrowLeft } from 'lucide-react';

const VRTemplateDetail: React.FC<VRTemplateDetailProps> = ({
  template,
  onStart,
  onBack,
  heartRate
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold">{template.title || template.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{template.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Durée:</span> {template.duration} minutes
                </div>
                <div>
                  <span className="font-medium">Difficulté:</span> {template.difficulty}
                </div>
                <div>
                  <span className="font-medium">Environnement:</span> {template.environment}
                </div>
                <div>
                  <span className="font-medium">Catégorie:</span> {template.category}
                </div>
              </div>

              {template.instructions && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Instructions:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {template.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Commencer la session</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {heartRate && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{heartRate} BPM</div>
                  <div className="text-sm text-muted-foreground">Rythme cardiaque actuel</div>
                </div>
              )}
              
              <Button onClick={() => onStart(template)} className="w-full" size="lg">
                <Play className="h-5 w-5 mr-2" />
                Commencer la session
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                Assurez-vous d'être dans un environnement calme et sécurisé.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VRTemplateDetail;
