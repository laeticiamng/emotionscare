
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const B2CLoginPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connexion Particulier</CardTitle>
          <CardDescription>Connectez-vous à votre espace personnel</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Page de connexion B2C en cours de développement...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2CLoginPage;
