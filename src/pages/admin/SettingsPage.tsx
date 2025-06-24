
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Shield, Bell, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Paramètres administrateur</h1>
        <Button>
          <Settings className="w-4 h-4 mr-2" />
          Sauvegarder
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Sécurité et conformité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Authentification à deux facteurs</span>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <span>Conformité RGPD</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span>Audit automatique</span>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Alertes d'urgence</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span>Rapports hebdomadaires</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span>Notifications équipes</span>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Données et sauvegarde
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Sauvegarde automatique</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span>Export mensuel</span>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <span>Archivage des données</span>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configuration générale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              Paramètres de configuration avancés
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
