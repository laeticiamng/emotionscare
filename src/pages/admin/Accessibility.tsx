
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const AccessibilityPage = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Accessibilité</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Configuration et gestion des options d'accessibilité.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessibilityPage;
