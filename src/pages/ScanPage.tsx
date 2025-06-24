
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ScanPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Scan Émotionnel</h1>
        <Card>
          <CardHeader>
            <CardTitle>Analysez votre état émotionnel</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Utilisez notre IA pour analyser vos émotions via texte ou voix.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScanPage;
