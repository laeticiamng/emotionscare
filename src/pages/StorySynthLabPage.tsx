
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const StorySynthLabPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Story Synth Lab</h1>
        <Card>
          <CardHeader>
            <CardTitle>Laboratoire de récits</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Créez et partagez vos histoires personnelles de croissance.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StorySynthLabPage;
