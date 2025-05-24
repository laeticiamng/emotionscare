
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const MeditationPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Méditation</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sessions de méditation</CardTitle>
            <CardDescription>Découvrez nos exercices de méditation guidée</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Contenu de méditation à venir...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MeditationPage;
