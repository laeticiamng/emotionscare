import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  User, 
  Bell, 
  Shield, 
  Palette,
  Globe,
  Smartphone,
  Key,
  Download
} from 'lucide-react';
import PageSEO from '@/components/seo/PageSEO';
import { useToast } from '@/hooks/use-toast';

/**
 * UnifiedSettingsPage - Page de paramètres consolidée
 * Fusionne tous les réglages utilisateur en une seule interface
 */
const UnifiedSettingsPage: React.FC = () => {
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      sms: false,
      marketing: false
    },
    privacy: {
      profilePublic: false,
      analyticsOptIn: true,
      dataSharing: false,
      locationTracking: false
    },
    preferences: {
      theme: 'system',
      language: 'fr',
      timezone: 'Europe/Paris'
    }
  });

  const handleSettingChange = (section: string, key: string, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
    
    toast({ 
      title: 'Paramètre mis à jour', 
      description: 'Vos préférences ont été sauvegardées' 
    });
  };

  const exportData = () => {
    toast({ 
      title: 'Export en cours', 
      description: 'Vos données seront disponibles sous peu par email' 
    });
  };

  const deleteAccount = () => {
    toast({ 
      title: 'Suppression demandée', 
      description: 'Un email de confirmation vous sera envoyé',
      variant: 'destructive'
    });
  };

  return (
    <>
      <PageSEO 
        title="Paramètres - EmotionsCare"
        description="Gérez vos préférences et paramètres de confidentialité sur EmotionsCare"
      />
      
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Paramètres</h1>
            <p className="text-muted-foreground">
              Gérez vos préférences et paramètres de confidentialité
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profil
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Confidentialité
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Apparence
              </TabsTrigger>
              <TabsTrigger value="data" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Données
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations Personnelles</CardTitle>
                  <CardDescription>Modifiez vos informations de profil</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input id="firstName" defaultValue="Marie" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom</Label>
                      <Input id="lastName" defaultValue="Dupont" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="marie.dupont@example.com" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" type="tel" defaultValue="+33 6 12 34 56 78" />
                  </div>
                  <Button onClick={() => toast({ title: 'Profil mis à jour', description: 'Vos informations ont été sauvegardées' })}>
                    Sauvegarder les Modifications
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Préférences de Notification</CardTitle>
                  <CardDescription>Choisissez comment vous souhaitez être notifié</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notifications Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Recevez des rappels et mises à jour par email
                      </p>
                    </div>
                    <Switch 
                      checked={settings.notifications.email}
                      onCheckedChange={(value) => handleSettingChange('notifications', 'email', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notifications Push</Label>
                      <p className="text-sm text-muted-foreground">
                        Notifications en temps réel sur votre appareil
                      </p>
                    </div>
                    <Switch 
                      checked={settings.notifications.push}
                      onCheckedChange={(value) => handleSettingChange('notifications', 'push', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS</Label>
                      <p className="text-sm text-muted-foreground">
                        Rappels urgents par SMS
                      </p>
                    </div>
                    <Switch 
                      checked={settings.notifications.sms}
                      onCheckedChange={(value) => handleSettingChange('notifications', 'sms', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Communications Marketing</Label>
                      <p className="text-sm text-muted-foreground">
                        Nouveautés et offres spéciales
                      </p>
                    </div>
                    <Switch 
                      checked={settings.notifications.marketing}
                      onCheckedChange={(value) => handleSettingChange('notifications', 'marketing', value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres de Confidentialité</CardTitle>
                  <CardDescription>Contrôlez la visibilité et l'utilisation de vos données</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Profil Public</Label>
                      <p className="text-sm text-muted-foreground">
                        Autoriser les autres à voir votre profil
                      </p>
                    </div>
                    <Switch 
                      checked={settings.privacy.profilePublic}
                      onCheckedChange={(value) => handleSettingChange('privacy', 'profilePublic', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Analytics</Label>
                      <p className="text-sm text-muted-foreground">
                        Participer à l'amélioration de l'application
                      </p>
                    </div>
                    <Switch 
                      checked={settings.privacy.analyticsOptIn}
                      onCheckedChange={(value) => handleSettingChange('privacy', 'analyticsOptIn', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Partage de Données</Label>
                      <p className="text-sm text-muted-foreground">
                        Partager des données anonymisées à des fins de recherche
                      </p>
                    </div>
                    <Switch 
                      checked={settings.privacy.dataSharing}
                      onCheckedChange={(value) => handleSettingChange('privacy', 'dataSharing', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Localisation</Label>
                      <p className="text-sm text-muted-foreground">
                        Permettre le suivi de localisation pour les recommandations
                      </p>
                    </div>
                    <Switch 
                      checked={settings.privacy.locationTracking}
                      onCheckedChange={(value) => handleSettingChange('privacy', 'locationTracking', value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Apparence et Préférences</CardTitle>
                  <CardDescription>Personnalisez l'interface selon vos goûts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="theme">Thème</Label>
                    <select 
                      id="theme" 
                      className="w-full mt-1 p-2 border rounded-md"
                      value={settings.preferences.theme}
                      onChange={(e) => handleSettingChange('preferences', 'theme', e.target.value)}
                    >
                      <option value="light">Clair</option>
                      <option value="dark">Sombre</option>
                      <option value="system">Système</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="language">Langue</Label>
                    <select 
                      id="language" 
                      className="w-full mt-1 p-2 border rounded-md"
                      value={settings.preferences.language}
                      onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="timezone">Fuseau Horaire</Label>
                    <select 
                      id="timezone" 
                      className="w-full mt-1 p-2 border rounded-md"
                      value={settings.preferences.timezone}
                      onChange={(e) => handleSettingChange('preferences', 'timezone', e.target.value)}
                    >
                      <option value="Europe/Paris">Europe/Paris</option>
                      <option value="America/New_York">America/New_York</option>
                      <option value="Asia/Tokyo">Asia/Tokyo</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des Données</CardTitle>
                  <CardDescription>Exportez ou supprimez vos données personnelles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Exporter mes Données</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Téléchargez toutes vos données personnelles dans un format lisible.
                    </p>
                    <Button onClick={exportData} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Demander l'Export
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-destructive/10 rounded-lg">
                    <h4 className="font-semibold mb-2 text-destructive">Zone de Danger</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                    </p>
                    <Button onClick={deleteAccount} variant="destructive">
                      Supprimer mon Compte
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default UnifiedSettingsPage;