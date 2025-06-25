
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const OptimisationPage = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Optimisation système</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Interface d'optimisation et performance du système.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OptimisationPage;
