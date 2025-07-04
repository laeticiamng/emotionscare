import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Shield, Database, Users, Eye } from 'lucide-react';

const PrivacyTogglesPage: React.FC = () => {
  const [settings, setSettings] = useState({
    emotionData: true,
    voiceData: true,
    locationData: false,
    analytics: true,
    sharing: false
  });

  const toggleSetting = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Contrôles de Confidentialité
          </h1>
          <p className="text-muted-foreground">
            Gérez vos préférences de confidentialité et de partage de données
          </p>
        </div>
        <Button>Sauvegarder</Button>
      </div>

      <Card className="border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Score de Confidentialité</h3>
              <p className="text-sm text-muted-foreground">Protection de vos données</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">85%</div>
              <div className="text-sm text-muted-foreground">Protection</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Données personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Données émotionnelles</h4>
                <p className="text-sm text-muted-foreground">Collecte et analyse de vos émotions</p>
              </div>
              <Switch 
                checked={settings.emotionData}
                onCheckedChange={() => toggleSetting('emotionData')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Enregistrements vocaux</h4>
                <p className="text-sm text-muted-foreground">Stockage temporaire pour analyse</p>
              </div>
              <Switch 
                checked={settings.voiceData}
                onCheckedChange={() => toggleSetting('voiceData')}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Partage de données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Recherche anonyme</h4>
                <p className="text-sm text-muted-foreground">Contribution à la recherche</p>
              </div>
              <Switch 
                checked={settings.sharing}
                onCheckedChange={() => toggleSetting('sharing')}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Suivi et analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Analytics d'utilisation</h4>
                <p className="text-sm text-muted-foreground">Amélioration de la plateforme</p>
              </div>
              <Switch 
                checked={settings.analytics}
                onCheckedChange={() => toggleSetting('analytics')}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyTogglesPage;