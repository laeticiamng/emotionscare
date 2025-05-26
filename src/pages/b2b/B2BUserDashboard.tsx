
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const B2BUserDashboard: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Espace Collaborateur</h1>
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
              <p>Votre bien-être au travail est important</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Check-in quotidien</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Comment vous sentez-vous aujourd'hui ?</p>
              <Button className="mt-4">Faire mon check-in</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ressources bien-être</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Accédez aux outils de bien-être de votre entreprise</p>
              <Button className="mt-4">Explorer</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2BUserDashboard;
