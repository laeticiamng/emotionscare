
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const JournalPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Journal Émotionnel</h1>
        <Card>
          <CardHeader>
            <CardTitle>Votre journal personnel</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Suivez votre évolution émotionnelle au fil du temps.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JournalPage;
