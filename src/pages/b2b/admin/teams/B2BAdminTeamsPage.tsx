
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const B2BAdminTeamsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="container mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gestion des équipes</h1>
          <Button onClick={() => navigate('/b2b/admin/dashboard')} variant="outline">
            Retour au tableau de bord
          </Button>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Équipes de l'organisation</CardTitle>
            <CardDescription>Organisez et gérez vos équipes</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Interface de gestion des équipes à venir.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BAdminTeamsPage;
