
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const B2CDashboard: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Tableau de bord B2C</h1>
          <Button onClick={signOut} variant="outline">
            Déconnexion
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Bienvenue {user?.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Votre espace personnel EmotionsCare</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analyse émotionnelle</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Effectuez une nouvelle analyse de votre état émotionnel</p>
              <Button className="mt-4">Commencer l'analyse</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Musique thérapeutique</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Découvrez des playlists adaptées à votre humeur</p>
              <Button className="mt-4">Explorer la musique</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2CDashboard;
