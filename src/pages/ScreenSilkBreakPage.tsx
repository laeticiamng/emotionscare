
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ScreenSilkBreakPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Screen-Silk Break</h1>
        <Card>
          <CardHeader>
            <CardTitle>Pause écran premium</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Techniques avancées de repos visuel et mental.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScreenSilkBreakPage;
