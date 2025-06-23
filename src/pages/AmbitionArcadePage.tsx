
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AmbitionArcadePage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Ambition Arcade</h1>
        <Card>
          <CardHeader>
            <CardTitle>Jeux d'ambition</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Mini-jeux pour développer votre motivation et atteindre vos objectifs.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AmbitionArcadePage;
