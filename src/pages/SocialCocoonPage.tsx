
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SocialCocoonPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Social Cocon</h1>
        <Card>
          <CardHeader>
            <CardTitle>Communauté bienveillante</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Connectez-vous avec d'autres utilisateurs dans un espace sécurisé.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SocialCocoonPage;
