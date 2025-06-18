
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

/**
 * Page des préférences utilisateur
 */
const PreferencesPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <Settings className="h-8 w-8 text-gray-600" />
          Préférences
        </h1>
        <p className="text-gray-600">
          Personnalisez votre expérience EmotionsCare
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Paramètres Utilisateur</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Module de préférences en cours de développement...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PreferencesPage;
