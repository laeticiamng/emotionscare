
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const B2BUserScanPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Scan Émotionnel</h1>
      <Card>
        <CardHeader>
          <CardTitle>Analyse de vos émotions</CardTitle>
          <CardDescription>Démarrez un scan pour analyser votre état émotionnel actuel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-4xl">📊</span>
            </div>
            <Button size="lg">Commencer le scan émotionnel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BUserScanPage;
