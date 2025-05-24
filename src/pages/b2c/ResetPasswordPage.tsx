
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const B2CResetPasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Réinitialiser le mot de passe</CardTitle>
          <CardDescription>Récupérez l'accès à votre compte</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Formulaire de réinitialisation à implémenter</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2CResetPasswordPage;
