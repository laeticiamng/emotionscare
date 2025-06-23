
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const HeatmapVibesPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Heatmap Vibes</h1>
        <Card>
          <CardHeader>
            <CardTitle>Carte thermique des émotions</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Visualisation avancée de vos patterns émotionnels.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HeatmapVibesPage;
