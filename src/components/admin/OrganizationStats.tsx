
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const OrganizationStats: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Utilisateurs actifs</div>
            <div className="text-2xl font-bold">42</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Équipes</div>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Scans émotionnels</div>
            <div className="text-2xl font-bold">248</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Score moyen</div>
            <div className="text-2xl font-bold">75%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { OrganizationStats };
export default OrganizationStats;
