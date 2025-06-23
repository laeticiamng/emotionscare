
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const VRGalactiquePage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">VR Galactique</h1>
        <Card>
          <CardHeader>
            <CardTitle>Voyage spatial virtuel</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Exploration de l'espace en réalité virtuelle pour la méditation.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VRGalactiquePage;
