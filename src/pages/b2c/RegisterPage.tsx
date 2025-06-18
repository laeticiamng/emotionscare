
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RegisterPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Inscription B2C</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Page d'inscription pour les particuliers - À implémenter</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
