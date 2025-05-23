
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const B2COnboardingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Bienvenue !</CardTitle>
          <CardDescription>Configuration de votre profil B2C</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p>Votre compte a été créé avec succès !</p>
          <p>Vous pouvez maintenant accéder à votre tableau de bord personnel.</p>
          <Button onClick={() => navigate('/b2c/dashboard')} className="w-full">
            Accéder au tableau de bord
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2COnboardingPage;
