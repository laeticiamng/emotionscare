
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cog } from 'lucide-react';

/**
 * Page des paramètres administrateur
 */
const SettingsPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <Cog className="h-8 w-8 text-gray-600" />
          Paramètres Administrateur
        </h1>
        <p className="text-gray-600">
          Configuration système et paramètres avancés
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuration Système</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Module de paramètres administrateur en cours de développement...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
