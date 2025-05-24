
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const B2BUserCoachPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Coach IA</h1>
      <Card>
        <CardHeader>
          <CardTitle>Accompagnement personnalisé</CardTitle>
          <CardDescription>Votre coach émotionnel IA</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Interface de coaching IA à implémenter</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BUserCoachPage;
