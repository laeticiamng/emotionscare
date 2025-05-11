import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/hooks/use-theme';

const SettingsPage: React.FC = () => {
  const theme = useTheme();

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Apparence</h3>
              <p className="text-sm text-muted-foreground">
                Personnalisez l'apparence de votre application.
              </p>
              <Button onClick={() => theme.setTheme('light')}>Mode Clair</Button>
              <Button onClick={() => theme.setTheme('dark')}>Mode Sombre</Button>
              <Button onClick={() => theme.setTheme('system')}>Mode Système</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
