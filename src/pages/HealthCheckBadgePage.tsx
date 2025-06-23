
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const HealthCheckBadgePage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Health-check Badge</h1>
        <Card>
          <CardHeader>
            <CardTitle>Badge de santé</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Indicateur visuel de votre état de bien-être général.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthCheckBadgePage;
