
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const B2BUserScanPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="container mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Scanner Collaborateur</h1>
          <Button onClick={() => navigate('/b2b/user/dashboard')} variant="outline">
            Retour au tableau de bord
          </Button>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Bien-être au travail</CardTitle>
            <CardDescription>Évaluez votre état émotionnel professionnel</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Interface de scan pour collaborateurs à venir.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BUserScanPage;
