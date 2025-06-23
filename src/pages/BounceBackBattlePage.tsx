
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BounceBackBattlePage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Bounce-Back Battle</h1>
        <Card>
          <CardHeader>
            <CardTitle>Combat la résilience</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Défiez-vous pour développer votre capacité de récupération.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BounceBackBattlePage;
