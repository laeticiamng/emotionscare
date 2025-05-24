
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const B2BAdminLoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Connexion Administrateur</CardTitle>
          <CardDescription>Accès administration B2B</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Formulaire de connexion administrateur à implémenter</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BAdminLoginPage;
