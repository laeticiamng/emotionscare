
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BossLevelGritPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Boss Level Grit</h1>
        <Card>
          <CardHeader>
            <CardTitle>Développez votre persévérance</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Module premium de développement de la résilience et de la détermination.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BossLevelGritPage;
