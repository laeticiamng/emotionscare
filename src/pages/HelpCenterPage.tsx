
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const HelpCenterPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Centre d'Aide & FAQ</h1>
        <Card>
          <CardHeader>
            <CardTitle>Support et assistance</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Trouvez des réponses à vos questions et obtenez de l'aide.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpCenterPage;
