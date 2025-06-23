
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ARFiltersPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Filtres AR</h1>
        <Card>
          <CardHeader>
            <CardTitle>Réalité augmentée émotionnelle</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Filtres de réalité augmentée pour explorer vos émotions.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ARFiltersPage;
