
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import ThemeSettingsTab from '@/components/settings/ThemeSettingsTab';
import NotificationSettings from '@/components/settings/NotificationSettings';
import PrivacySettings from '@/components/settings/PrivacySettings';
import AccessibilitySettings from '@/components/settings/AccessibilitySettings';
import { Settings, User, Shield, Bell, Palette, Volume2, Clock, Globe } from 'lucide-react';

const PreferencesPage: React.FC = () => {
  const [language, setLanguage] = useState('fr');
  const [timezone, setTimezone] = useState('Europe/Paris');
  const [autoBackup, setAutoBackup] = useState(true);
  const [analyticsSharing, setAnalyticsSharing] = useState(false);
  const [sessionReminders, setSessionReminders] = useState(true);
  const [soundVolume, setSoundVolume] = useState([75]);
  const [dataRetention, setDataRetention] = useState('12months');

  const handleSavePreferences = () => {
    const preferences = {
      language,
      timezone,
      autoBackup,
      analyticsSharing,
      sessionReminders,
      soundVolume: soundVolume[0],
      dataRetention
    };
    console.log('Saving preferences:', preferences);
    // Ici, on sauvegarderait les préférences via une API
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <Settings className="w-8 h-8 mr-3" />
              Préférences
            </h1>
            <p className="text-muted-foreground">Personnalisez votre expérience EmotionsCare</p>
          </div>
          <Button onClick={handleSavePreferences} className="px-6">
            Enregistrer
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="appearance">Apparence</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibilité</TabsTrigger>
            <TabsTrigger value="data">Données</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Langue et Région
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Langue de l'interface</label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fuseau horaire</label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Paris">Europe/Paris (GMT+1)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (GMT+0)</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (GMT-5)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Asia/Tokyo (GMT+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Volume2 className="w-5 h-5 mr-2" />
                  Audio et Médias
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Volume général</label>
                    <Badge variant="outline">{soundVolume[0]}%</Badge>
                  </div>
                  <Slider
                    value={soundVolume}
                    onValueChange={setSoundVolume}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Sessions et Rappels
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Rappels de session</label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des rappels pour vos activités de bien-être
                    </p>
                  </div>
                  <Switch
                    checked={sessionReminders}
                    onCheckedChange={setSessionReminders}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Sauvegarde automatique</label>
                    <p className="text-sm text-muted-foreground">
                      Sauvegarder automatiquement vos données de session
                    </p>
                  </div>
                  <Switch
                    checked={autoBackup}
                    onCheckedChange={setAutoBackup}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <ThemeSettingsTab />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="privacy">
            <PrivacySettings />
          </TabsContent>

          <TabsContent value="accessibility">
            <AccessibilitySettings />
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Gestion des Données
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Durée de conservation des données</label>
                  <Select value={dataRetention} onValueChange={setDataRetention}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3months">3 mois</SelectItem>
                      <SelectItem value="6months">6 mois</SelectItem>
                      <SelectItem value="12months">12 mois</SelectItem>
                      <SelectItem value="24months">24 mois</SelectItem>
                      <SelectItem value="unlimited">Illimitée</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Les données plus anciennes seront automatiquement supprimées
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Partage d'analyses anonymes</label>
                    <p className="text-sm text-muted-foreground">
                      Aide à améliorer l'application (données anonymisées)
                    </p>
                  </div>
                  <Switch
                    checked={analyticsSharing}
                    onCheckedChange={setAnalyticsSharing}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Zone de Danger</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-3">
                  <h3 className="font-semibold text-red-800">Supprimer toutes mes données</h3>
                  <p className="text-sm text-red-700">
                    Cette action supprimera définitivement toutes vos données personnelles, 
                    historiques de sessions, et paramètres. Cette action est irréversible.
                  </p>
                  <Button variant="destructive" size="sm">
                    Supprimer mes données
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PreferencesPage;
