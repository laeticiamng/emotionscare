
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LoginPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Connexion Administration</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Page de connexion pour les administrateurs RH - À implémenter</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
