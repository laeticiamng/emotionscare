
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres système</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Configuration des paramètres système et application.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
