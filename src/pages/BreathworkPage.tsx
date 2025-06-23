
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BreathworkPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Breathwork</h1>
        <Card>
          <CardHeader>
            <CardTitle>Exercices de respiration</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Techniques avancées de respiration pour le bien-être.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BreathworkPage;
