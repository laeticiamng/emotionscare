
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FlashGlowPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Flash Glow</h1>
        <Card>
          <CardHeader>
            <CardTitle>Éclats de bien-être</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Sessions courtes et intenses de boost émotionnel.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FlashGlowPage;
