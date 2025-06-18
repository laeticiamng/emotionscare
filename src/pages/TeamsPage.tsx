
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TeamsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Équipes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Page Teams - Contenu à venir
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamsPage;
