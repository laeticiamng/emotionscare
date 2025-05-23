
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const B2CSocialPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="container mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Espace Social B2C</h1>
          <Button onClick={() => navigate('/b2c/dashboard')} variant="outline">
            Retour au tableau de bord
          </Button>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Communauté</CardTitle>
            <CardDescription>Connectez-vous avec d'autres utilisateurs</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Cette fonctionnalité sera bientôt disponible.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2CSocialPage;
