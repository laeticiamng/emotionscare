
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const MeditationPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Méditation</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Séances de méditation</CardTitle>
          <CardDescription>Découvrez nos séances guidées pour votre bien-être</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Page de méditation en cours de développement...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeditationPage;
