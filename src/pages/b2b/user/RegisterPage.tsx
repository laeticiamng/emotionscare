
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const B2BUserRegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Inscription Utilisateur B2B</CardTitle>
          <CardDescription>Créer un compte collaborateur</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Formulaire d'inscription B2B utilisateur à implémenter</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BUserRegisterPage;
