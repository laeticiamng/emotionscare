import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shell } from '@/Shell';
import { useVRSession } from '@/hooks/useVRSession';
import { VRSessionTemplate } from '@/types';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const VRPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("meditation");
  const { templates, isLoading } = useVRSession("meditation"); // Add a default category

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSessionStart = (template: VRSessionTemplate) => {
    navigate(`/vr-session/${template.id}`);
  };

  return (
    <Shell>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Sessions de réalité virtuelle</h1>
        <p className="mb-4">
          Choisissez une session de réalité virtuelle pour améliorer votre bien-être émotionnel.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading ? (
            <p>Chargement des sessions...</p>
          ) : (
            templates?.map((template) => (
              <Card key={template.id} className="bg-card text-card-foreground shadow-sm h-full flex flex-col">
                <CardHeader className="flex flex-col space-y-1.5 p-4">
                  <CardTitle className="text-lg font-semibold leading-none tracking-tight">{template.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 flex flex-col flex-grow">
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <img src={template.thumbnail} alt={template.title} className="w-full h-full object-cover" />
                  </div>
                  <Badge variant={template.intensity === 'low' ? 'outline' : (template.intensity === 'high' ? 'destructive' : 'default')}>
                    {template.intensity === 'low' ? 'Facile' : (template.intensity === 'high' ? 'Intense' : 'Modéré')}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2 flex-grow">
                    {template.description}
                  </p>
                  <Button onClick={() => handleSessionStart(template)} className="mt-4">Commencer la session</Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Shell>
  );
};

export default VRPage;
