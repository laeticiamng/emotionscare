
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Bell, Shield, Palette } from 'lucide-react';

const SettingsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Paramètres - EmotionsCare</title>
        <meta name="description" content="Configurez vos préférences EmotionsCare" />
      </Helmet>
      
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Paramètres</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Gérez vos préférences de notification
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Confidentialité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Contrôlez vos données et votre confidentialité
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Apparence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Personnalisez l'apparence de l'application
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
