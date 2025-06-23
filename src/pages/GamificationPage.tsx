
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const GamificationPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Gamification</h1>
        <Card>
          <CardHeader>
            <CardTitle>Défis et récompenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Suivez vos progrès et débloquez des récompenses.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GamificationPage;
