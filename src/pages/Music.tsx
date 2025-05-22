
import React from 'react';
import Shell from '@/Shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Music: React.FC = () => {
  return (
    <Shell>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Musique</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Module Musique</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Cette page redirige vers le module musique approprié en fonction de votre mode utilisateur.
            </p>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
};

export default Music;
