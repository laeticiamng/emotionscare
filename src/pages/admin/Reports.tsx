
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const ReportsPage = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Rapports et Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Interface de génération et consultation des rapports.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;
