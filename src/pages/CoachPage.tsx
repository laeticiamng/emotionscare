
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const CoachPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Coach IA</h1>
        <Card>
          <CardHeader>
            <CardTitle>Votre assistant de bien-être</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Recevez des conseils personnalisés de notre coach intelligent.</p>
            <Button>Démarrer une conversation</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoachPage;
