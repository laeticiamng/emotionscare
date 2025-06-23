
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BubbleBeatPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Bubble-Beat</h1>
        <Card>
          <CardHeader>
            <CardTitle>Rythmes en bulles</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Jeu musical interactif avec des bulles sonores.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BubbleBeatPage;
