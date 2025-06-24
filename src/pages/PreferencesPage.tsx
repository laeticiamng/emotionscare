
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, User, Palette, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const PreferencesPage: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Préférences utilisateur</h1>
        <Button>
          <Settings className="w-4 h-4 mr-2" />
          Sauvegarder
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profil utilisateur
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom d'affichage</label>
              <input className="w-full px-3 py-2 border rounded-md" placeholder="Votre nom" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input className="w-full px-3 py-2 border rounded-md" placeholder="votre.email@exemple.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Fuseau horaire</label>
              <select className="w-full px-3 py-2 border rounded-md">
                <option>Europe/Paris</option>
                <option>America/New_York</option>
                <option>Asia/Tokyo</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Apparence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Mode sombre</span>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <span>Animations réduites</span>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <span>Haute visibilité</span>
              <Switch />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Taille de police</label>
              <select className="w-full px-3 py-2 border rounded-md">
                <option>Petite</option>
                <option>Normale</option>
                <option>Grande</option>
                <option>Très grande</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Confidentialité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Données analytiques</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span>Partage d'amélioration</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span>Cookies marketing</span>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Rappels quotidiens</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span>Notifications push</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span>Résumés hebdomadaires</span>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PreferencesPage;
