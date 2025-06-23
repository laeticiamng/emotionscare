
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const JournalPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Journal Personnel</h1>
        <Card>
          <CardHeader>
            <CardTitle>Exprimez vos pensées</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Tenez un journal de vos émotions et réflexions.</p>
            <Button>Nouvelle entrée</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JournalPage;
