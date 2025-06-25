
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const SecurityPage = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sécurité</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Gestion de la sécurité et des accès système.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityPage;
