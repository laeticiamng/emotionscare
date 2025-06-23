
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const WeeklyBarsPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Weekly Bars</h1>
        <Card>
          <CardHeader>
            <CardTitle>Graphiques hebdomadaires</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Visualisation de vos progrès émotionnels semaine par semaine.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WeeklyBarsPage;
