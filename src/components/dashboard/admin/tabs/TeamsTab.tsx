
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

const TeamsTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Équipes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-8">
          Gestion des équipes - à implémenter
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamsTab;
