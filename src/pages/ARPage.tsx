
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Shell from '@/Shell';
import PageHeader from '@/components/layout/PageHeader';
import ARExperience from '@/components/ar/ARExperience';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const ARPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleExperienceComplete = () => {
    toast({
      title: "Expérience AR terminée",
      description: "Votre session a été enregistrée avec succès."
    });
  };

  return (
    <Shell>
      <div className="container px-4 py-6 mx-auto">
        <PageHeader
          title="Thérapie en Réalité Augmentée"
          description="Immergez-vous dans un environnement thérapeutique en réalité augmentée"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <ARExperience 
              emotion="calm" 
              intensity={7}
              onComplete={handleExperienceComplete}
            />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Comment ça marche</CardTitle>
                <CardDescription>
                  Découvrez comment la réalité augmentée peut vous aider
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm list-disc pl-5">
                  <li>Votre téléphone ou votre tablette analyse votre environnement</li>
                  <li>Des éléments virtuels sont ajoutés en fonction de votre état émotionnel</li>
                  <li>La musique adaptative complète l'expérience immersive</li>
                  <li>Le suivi de vos progrès est enregistré pour adapter les futures sessions</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => navigate('/dashboard')}>
                  Retour au tableau de bord
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sessions précédentes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Vous n'avez pas encore de sessions AR enregistrées.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default ARPage;
