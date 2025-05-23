
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const B2CResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Réinitialiser le mot de passe</CardTitle>
          <CardDescription>Page de réinitialisation B2C</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">Cette fonctionnalité sera bientôt disponible.</p>
          <Button onClick={() => navigate('/b2c/login')}>
            Retour à la connexion
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2CResetPasswordPage;
