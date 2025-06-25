
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Headphones, Play, Settings } from 'lucide-react';

const VRPage: React.FC = () => {
  const vrExperiences = [
    { title: "Plage Tropicale", duration: "15 min", difficulty: "Débutant" },
    { title: "Forêt Enchantée", duration: "20 min", difficulty: "Intermédiaire" },
    { title: "Montagne Zen", duration: "25 min", difficulty: "Avancé" }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Headphones className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Réalité Virtuelle</h1>
          </div>
          <p className="text-muted-foreground">
            Expériences immersives pour la relaxation et la méditation
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Connecter votre casque VR</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                  <Headphones className="h-16 w-16 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground mb-4">
                    Assurez-vous que votre casque VR est connecté
                  </p>
                  <Button className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Configurer le casque
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expériences disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {vrExperiences.map((experience, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div>
                      <h3 className="font-medium">{experience.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {experience.duration} • {experience.difficulty}
                      </p>
                    </div>
                    <Button className="flex items-center gap-2">
                      <Play className="h-4 w-4" />
                      Lancer
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VRPage;
