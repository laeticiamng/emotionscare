
import React, { useState } from 'react';
import UnifiedShell from '@/components/unified/UnifiedShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Bell, Palette, Volume2, Shield, Save } from 'lucide-react';
import { toast } from 'sonner';

const UserPreferencesPage: React.FC = () => {
  const [preferences, setPreferences] = useState({
    notifications: {
      dailyReminders: true,
      weeklyReports: true,
      coachSuggestions: false,
      emailUpdates: true
    },
    interface: {
      theme: 'auto',
      language: 'fr',
      fontSize: [16],
      animations: true,
      compactMode: false
    },
    privacy: {
      dataSharing: false,
      analytics: true,
      personalizedAds: false,
      publicProfile: false
    },
    modules: {
      music: true,
      vr: false,
      breathwork: true,
      journal: true,
      coach: true,
      gamification: true
    }
  });

  const handleSavePreferences = () => {
    toast.success('Préférences sauvegardées avec succès');
    console.log('Preferences saved:', preferences);
  };

  const updateNotification = (key: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value }
    }));
  };

  const updateInterface = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      interface: { ...prev.interface, [key]: value }
    }));
  };

  const updatePrivacy = (key: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      privacy: { ...prev.privacy, [key]: value }
    }));
  };

  const updateModule = (key: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      modules: { ...prev.modules, [key]: value }
    }));
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      <UnifiedShell>
        <div className="container mx-auto px-4 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Settings className="w-8 h-8 text-primary" />
                Préférences Utilisateur
              </h1>
              <p className="text-muted-foreground">Personnalisez votre expérience EmotionsCare</p>
            </div>
            <Button onClick={handleSavePreferences} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Sauvegarder
            </Button>
          </div>

          <Tabs defaultValue="notifications" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="interface" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Interface
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Confidentialité
              </TabsTrigger>
              <TabsTrigger value="modules" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Modules
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Paramètres de Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Rappels quotidiens</h3>
                        <p className="text-sm text-muted-foreground">Recevez des rappels pour vos sessions</p>
                      </div>
                      <Switch
                        checked={preferences.notifications.dailyReminders}
                        onCheckedChange={(value) => updateNotification('dailyReminders', value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Rapports hebdomadaires</h3>
                        <p className="text-sm text-muted-foreground">Résumé de votre progression</p>
                      </div>
                      <Switch
                        checked={preferences.notifications.weeklyReports}
                        onCheckedChange={(value) => updateNotification('weeklyReports', value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Suggestions du coach</h3>
                        <p className="text-sm text-muted-foreground">Conseils personnalisés en temps réel</p>
                      </div>
                      <Switch
                        checked={preferences.notifications.coachSuggestions}
                        onCheckedChange={(value) => updateNotification('coachSuggestions', value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Mises à jour par email</h3>
                        <p className="text-sm text-muted-foreground">Nouvelles fonctionnalités et conseils</p>
                      </div>
                      <Switch
                        checked={preferences.notifications.emailUpdates}
                        onCheckedChange={(value) => updateNotification('emailUpdates', value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="interface">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Personnalisation de l'Interface
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h3 className="font-medium">Thème</h3>
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={preferences.interface.theme}
                        onChange={(e) => updateInterface('theme', e.target.value)}
                      >
                        <option value="auto">Automatique</option>
                        <option value="light">Clair</option>
                        <option value="dark">Sombre</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-medium">Langue</h3>
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={preferences.interface.language}
                        onChange={(e) => updateInterface('language', e.target.value)}
                      >
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Taille de police</h3>
                    <div className="px-4">
                      <Slider
                        value={preferences.interface.fontSize}
                        onValueChange={(value) => updateInterface('fontSize', value)}
                        max={24}
                        min={12}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-2">
                        <span>Petite</span>
                        <span>Actuelle: {preferences.interface.fontSize[0]}px</span>
                        <span>Grande</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Animations</h3>
                      <p className="text-sm text-muted-foreground">Effets visuels et transitions</p>
                    </div>
                    <Switch
                      checked={preferences.interface.animations}
                      onCheckedChange={(value) => updateInterface('animations', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Mode compact</h3>
                      <p className="text-sm text-muted-foreground">Interface plus dense</p>
                    </div>
                    <Switch
                      checked={preferences.interface.compactMode}
                      onCheckedChange={(value) => updateInterface('compactMode', value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Paramètres de Confidentialité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Partage de données</h3>
                        <p className="text-sm text-muted-foreground">Améliorer les services grâce à vos données anonymisées</p>
                      </div>
                      <Switch
                        checked={preferences.privacy.dataSharing}
                        onCheckedChange={(value) => updatePrivacy('dataSharing', value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Analytics</h3>
                        <p className="text-sm text-muted-foreground">Nous aider à améliorer l'application</p>
                      </div>
                      <Switch
                        checked={preferences.privacy.analytics}
                        onCheckedChange={(value) => updatePrivacy('analytics', value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Publicités personnalisées</h3>
                        <p className="text-sm text-muted-foreground">Contenu publicitaire adapté à vos intérêts</p>
                      </div>
                      <Switch
                        checked={preferences.privacy.personalizedAds}
                        onCheckedChange={(value) => updatePrivacy('personalizedAds', value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Profil public</h3>
                        <p className="text-sm text-muted-foreground">Rendre votre profil visible dans la communauté</p>
                      </div>
                      <Switch
                        checked={preferences.privacy.publicProfile}
                        onCheckedChange={(value) => updatePrivacy('publicProfile', value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="modules">
              <Card>
                <CardHeader>
                  <CardTitle>Modules Actifs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(preferences.modules).map(([module, enabled]) => (
                      <div key={module} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium capitalize">{module}</h3>
                          <Switch
                            checked={enabled}
                            onCheckedChange={(value) => updateModule(module, value)}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {module === 'music' && 'Thérapie musicale personnalisée'}
                          {module === 'vr' && 'Expériences de réalité virtuelle'}
                          {module === 'breathwork' && 'Exercices de respiration guidée'}
                          {module === 'journal' && 'Journal émotionnel quotidien'}
                          {module === 'coach' && 'Assistant IA personnalisé'}
                          {module === 'gamification' && 'Défis et récompenses'}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </UnifiedShell>
    </div>
  );
};

export default UserPreferencesPage;
