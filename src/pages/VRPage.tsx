
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const VRPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Expérience VR</h1>
        <Card>
          <CardHeader>
            <CardTitle>Réalité virtuelle immersive</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Plongez dans des environnements virtuels apaisants.</p>
            <Button>Lancer l'expérience VR</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VRPage;
