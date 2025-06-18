
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Accueil</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Page d'accueil de l'application EmotionsCare.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
