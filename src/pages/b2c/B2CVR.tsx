
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Headphones, Play } from 'lucide-react';

const B2CVR: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Expériences VR</h1>
        <p className="text-muted-foreground">
          Immergez-vous dans des environnements relaxants en réalité virtuelle
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Headphones className="h-5 w-5" />
              <CardTitle>Environnements VR</CardTitle>
            </div>
            <CardDescription>
              Choisissez votre expérience immersive
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Headphones className="h-16 w-16 mx-auto mb-6 text-primary" />
              <h3 className="text-lg font-semibold mb-4">Expériences disponibles</h3>
              <p className="text-muted-foreground mb-6">
                Explorez des environnements conçus pour la relaxation et la méditation
              </p>
              <Button>
                <Play className="h-4 w-4 mr-2" />
                Lancer une expérience
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2CVR;
