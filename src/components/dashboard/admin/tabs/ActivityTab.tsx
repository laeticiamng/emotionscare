
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

const ActivityTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité utilisateurs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-8">
          Données d'activité des utilisateurs - à implémenter
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTab;
