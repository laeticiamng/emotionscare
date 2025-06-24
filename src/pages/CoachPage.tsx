
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CoachPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Coach IA</h1>
        <Card>
          <CardHeader>
            <CardTitle>Assistant virtuel personnel</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Obtenez des conseils personnalisés de votre coach IA.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoachPage;
