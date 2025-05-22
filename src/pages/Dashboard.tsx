
import React from 'react';
import Shell from '@/Shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard: React.FC = () => {
  return (
    <Shell>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Module Tableau de bord</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Cette page redirige vers le tableau de bord approprié en fonction de votre mode utilisateur.
            </p>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
};

export default Dashboard;
