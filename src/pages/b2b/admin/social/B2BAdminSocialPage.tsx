
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const B2BAdminSocialPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="container mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Social Cocoon Admin</h1>
          <Button onClick={() => navigate('/b2b/admin/dashboard')} variant="outline">
            Retour au tableau de bord
          </Button>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Gestion du Social Cocoon</CardTitle>
            <CardDescription>Administrez l'espace social de votre organisation</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Interface d'administration sociale à venir.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BAdminSocialPage;
