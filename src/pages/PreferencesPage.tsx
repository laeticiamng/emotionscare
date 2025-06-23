
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PreferencesPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Préférences</h1>
        <Card>
          <CardHeader>
            <CardTitle>Paramètres personnels</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Configurez votre expérience EmotionsCare.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PreferencesPage;
