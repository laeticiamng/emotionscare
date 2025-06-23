
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyTogglesPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Privacy Toggles</h1>
        <Card>
          <CardHeader>
            <CardTitle>Contrôles de confidentialité</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Gérez vos paramètres de confidentialité et de données.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyTogglesPage;
