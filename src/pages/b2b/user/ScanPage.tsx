
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const B2BUserScanPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Scan Émotionnel</h1>
      <Card>
        <CardHeader>
          <CardTitle>Analyse émotionnelle</CardTitle>
          <CardDescription>Scanner votre état émotionnel</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Interface de scan émotionnel à implémenter</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BUserScanPage;
