
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ScanPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Scan Émotionnel</h1>
        <Card>
          <CardHeader>
            <CardTitle>Analysez vos émotions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Utilisez notre technologie avancée pour scanner vos émotions.</p>
            <Button>Commencer le scan</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScanPage;
