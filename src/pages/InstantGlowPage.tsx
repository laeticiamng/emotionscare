
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const InstantGlowPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Instant Glow</h1>
        <Card>
          <CardHeader>
            <CardTitle>Bien-être instantané</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Techniques rapides pour un boost immédiat de votre humeur.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InstantGlowPage;
