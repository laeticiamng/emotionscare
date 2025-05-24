
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const B2BUserLoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Connexion Utilisateur B2B</CardTitle>
          <CardDescription>Accès collaborateur</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Formulaire de connexion B2B utilisateur à implémenter</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BUserLoginPage;
