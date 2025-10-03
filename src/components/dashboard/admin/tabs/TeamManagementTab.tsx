
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const TeamManagementTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des équipes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Interface de gestion des équipes et des membres.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamManagementTab;
