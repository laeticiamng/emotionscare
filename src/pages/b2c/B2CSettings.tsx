
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, User, Bell, Shield, Palette } from 'lucide-react';

const B2CSettings: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Paramètres</h1>
        <p className="text-muted-foreground">
          Configurez votre expérience EmotionsCare
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <CardTitle>Profil utilisateur</CardTitle>
            </div>
            <CardDescription>
              Gérez vos informations personnelles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline">Modifier le profil</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>
              Configurez vos préférences de notification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline">Gérer les notifications</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              <CardTitle>Apparence</CardTitle>
            </div>
            <CardDescription>
              Personnalisez l'interface
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline">Thème et couleurs</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Confidentialité</CardTitle>
            </div>
            <CardDescription>
              Contrôlez vos données personnelles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline">Paramètres de confidentialité</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2CSettings;
