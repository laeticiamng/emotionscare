
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { 
  Settings, 
  Bell, 
  Palette, 
  Globe, 
  Shield, 
  Download,
  Trash2,
  Save,
  Zap,
  Volume2
} from 'lucide-react';
import { toast } from 'sonner';

const SettingsPage: React.FC = () => {
  const [generalSettings, setGeneralSettings] = useState({
    language: 'fr',
    theme: 'system',
    autoSave: true,
    highContrast: false,
    reducedMotion: false,
    fontSize: [16]
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    soundEnabled: true,
    vibrationEnabled: true,
    dailyReminders: true,
    weeklyReports: true,
    communityUpdates: false,
    marketingEmails: false,
    volume: [70]
  });

  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
    shareAnalytics: true,
    trackingEnabled: false,
    dataCollection: true,
    thirdPartySharing: false
  });

  const [performanceSettings, setPerformanceSettings] = useState({
    animationsEnabled: true,
    autoplayVideos: false,
    cacheEnabled: true,
    backgroundSync: true,
    offlineMode: false
  });

  const handleSaveGeneral = () => {
    // Simulate save
    toast.success("Paramètres généraux sauvegardés");
  };

  const handleSaveNotifications = () => {
    // Simulate save
    toast.success("Préférences de notification mises à jour");
  };

  const handleSavePrivacy = () => {
    // Simulate save
    toast.success("Paramètres de confidentialité mis à jour");
  };

  const handleSavePerformance = () => {
    // Simulate save
    toast.success("Paramètres de performance sauvegardés");
  };

  const handleExportData = () => {
    toast.info("Export des données en cours...");
    // Simulate export
    setTimeout(() => {
      toast.success("Données exportées avec succès");
    }, 2000);
  };

  const handleDeleteAccount = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
      toast.error("Suppression de compte en cours...");
    }
  };

  const handleClearCache = () => {
    toast.info("Cache vidé avec succès");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Settings className="mr-3 h-8 w-8 text-primary" />
            Paramètres
          </h1>
          <p className="text-muted-foreground">
            Personnalisez votre expérience EmotionsCare
          </p>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                Paramètres Généraux
              </CardTitle>
              <CardDescription>
                Configuration de base de l'application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="language">Langue</Label>
                  <Select 
                    value={generalSettings.language} 
                    onValueChange={(value) => 
                      setGeneralSettings({...generalSettings, language: value})
                    }
                  >
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
                <div>
                  <Label htmlFor="theme">Thème</Label>
                  <Select 
                    value={generalSettings.theme} 
                    onValueChange={(value) => 
                      setGeneralSettings({...generalSettings, theme: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">Automatique</SelectItem>
                      <SelectItem value="light">Clair</SelectItem>
                      <SelectItem value="dark">Sombre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Taille de la police: {generalSettings.fontSize[0]}px</Label>
                  <Slider
                    value={generalSettings.fontSize}
                    onValueChange={(value) => 
                      setGeneralSettings({...generalSettings, fontSize: value})
                    }
                    max={24}
                    min={12}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-save">Sauvegarde automatique</Label>
                    <p className="text-sm text-muted-foreground">Enregistre automatiquement vos données</p>
                  </div>
                  <Switch
                    id="auto-save"
                    checked={generalSettings.autoSave}
                    onCheckedChange={(checked) => 
                      setGeneralSettings({...generalSettings, autoSave: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="high-contrast">Contraste élevé</Label>
                    <p className="text-sm text-muted-foreground">Améliore la lisibilité</p>
                  </div>
                  <Switch
                    id="high-contrast"
                    checked={generalSettings.highContrast}
                    onCheckedChange={(checked) => 
                      setGeneralSettings({...generalSettings, highContrast: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="reduced-motion">Réduire les animations</Label>
                    <p className="text-sm text-muted-foreground">Limite les effets visuels</p>
                  </div>
                  <Switch
                    id="reduced-motion"
                    checked={generalSettings.reducedMotion}
                    onCheckedChange={(checked) => 
                      setGeneralSettings({...generalSettings, reducedMotion: checked})
                    }
                  />
                </div>
              </div>

              <Button onClick={handleSaveGeneral}>
                <Save className="mr-2 h-4 w-4" />
                Sauvegarder
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Préférences de Notification
              </CardTitle>
              <CardDescription>
                Gérez comment et quand vous recevez des notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Notifications générales</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notif">Notifications par email</Label>
                      <p className="text-sm text-muted-foreground">Recevez des mises à jour importantes</p>
                    </div>
                    <Switch
                      id="email-notif"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, emailNotifications: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notif">Notifications push</Label>
                      <p className="text-sm text-muted-foreground">Notifications en temps réel</p>
                    </div>
                    <Switch
                      id="push-notif"
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, pushNotifications: checked})
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Audio et vibrations</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sound">Sons activés</Label>
                      <p className="text-sm text-muted-foreground">Sons de notification</p>
                    </div>
                    <Switch
                      id="sound"
                      checked={notificationSettings.soundEnabled}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, soundEnabled: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="vibration">Vibrations</Label>
                      <p className="text-sm text-muted-foreground">Vibrations sur mobile</p>
                    </div>
                    <Switch
                      id="vibration"
                      checked={notificationSettings.vibrationEnabled}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, vibrationEnabled: checked})
                      }
                    />
                  </div>
                  <div>
                    <Label className="flex items-center">
                      <Volume2 className="mr-2 h-4 w-4" />
                      Volume: {notificationSettings.volume[0]}%
                    </Label>
                    <Slider
                      value={notificationSettings.volume}
                      onValueChange={(value) => 
                        setNotificationSettings({...notificationSettings, volume: value})
                      }
                      max={100}
                      min={0}
                      step={5}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Types de notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="daily-reminders">Rappels quotidiens</Label>
                      <p className="text-sm text-muted-foreground">Rappels pour vos analyses</p>
                    </div>
                    <Switch
                      id="daily-reminders"
                      checked={notificationSettings.dailyReminders}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, dailyReminders: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weekly-reports">Rapports hebdomadaires</Label>
                      <p className="text-sm text-muted-foreground">Résumé de vos progrès</p>
                    </div>
                    <Switch
                      id="weekly-reports"
                      checked={notificationSettings.weeklyReports}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, weeklyReports: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="community-updates">Mises à jour communauté</Label>
                      <p className="text-sm text-muted-foreground">Nouvelles publications et interactions</p>
                    </div>
                    <Switch
                      id="community-updates"
                      checked={notificationSettings.communityUpdates}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, communityUpdates: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="marketing">Emails promotionnels</Label>
                      <p className="text-sm text-muted-foreground">Offres et nouveautés</p>
                    </div>
                    <Switch
                      id="marketing"
                      checked={notificationSettings.marketingEmails}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, marketingEmails: checked})
                      }
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveNotifications}>
                <Save className="mr-2 h-4 w-4" />
                Sauvegarder les notifications
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Confidentialité et Sécurité
              </CardTitle>
              <CardDescription>
                Contrôlez vos données et votre confidentialité
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="public-profile">Profil public</Label>
                    <p className="text-sm text-muted-foreground">Rendre votre profil visible aux autres</p>
                  </div>
                  <Switch
                    id="public-profile"
                    checked={privacySettings.publicProfile}
                    onCheckedChange={(checked) => 
                      setPrivacySettings({...privacySettings, publicProfile: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="share-analytics">Partager les analyses</Label>
                    <p className="text-sm text-muted-foreground">Aide à améliorer l'application</p>
                  </div>
                  <Switch
                    id="share-analytics"
                    checked={privacySettings.shareAnalytics}
                    onCheckedChange={(checked) => 
                      setPrivacySettings({...privacySettings, shareAnalytics: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="tracking">Suivi publicitaire</Label>
                    <p className="text-sm text-muted-foreground">Autoriser le suivi pour la publicité</p>
                  </div>
                  <Switch
                    id="tracking"
                    checked={privacySettings.trackingEnabled}
                    onCheckedChange={(checked) => 
                      setPrivacySettings({...privacySettings, trackingEnabled: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="data-collection">Collecte de données</Label>
                    <p className="text-sm text-muted-foreground">Collecte pour améliorer les services</p>
                  </div>
                  <Switch
                    id="data-collection"
                    checked={privacySettings.dataCollection}
                    onCheckedChange={(checked) => 
                      setPrivacySettings({...privacySettings, dataCollection: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="third-party">Partage avec des tiers</Label>
                    <p className="text-sm text-muted-foreground">Partager avec des partenaires</p>
                  </div>
                  <Switch
                    id="third-party"
                    checked={privacySettings.thirdPartySharing}
                    onCheckedChange={(checked) => 
                      setPrivacySettings({...privacySettings, thirdPartySharing: checked})
                    }
                  />
                </div>
              </div>

              <div className="pt-4 border-t space-y-3">
                <h4 className="font-medium">Gestion des données</h4>
                <div className="flex space-x-3">
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="mr-2 h-4 w-4" />
                    Exporter mes données
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer mon compte
                  </Button>
                </div>
              </div>

              <Button onClick={handleSavePrivacy}>
                <Save className="mr-2 h-4 w-4" />
                Sauvegarder la confidentialité
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5" />
                Performance et Optimisation
              </CardTitle>
              <CardDescription>
                Optimisez les performances de l'application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="animations">Animations activées</Label>
                    <p className="text-sm text-muted-foreground">Effets visuels et transitions</p>
                  </div>
                  <Switch
                    id="animations"
                    checked={performanceSettings.animationsEnabled}
                    onCheckedChange={(checked) => 
                      setPerformanceSettings({...performanceSettings, animationsEnabled: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoplay">Lecture automatique des vidéos</Label>
                    <p className="text-sm text-muted-foreground">Peut consommer plus de données</p>
                  </div>
                  <Switch
                    id="autoplay"
                    checked={performanceSettings.autoplayVideos}
                    onCheckedChange={(checked) => 
                      setPerformanceSettings({...performanceSettings, autoplayVideos: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="cache">Cache activé</Label>
                    <p className="text-sm text-muted-foreground">Améliore la vitesse de chargement</p>
                  </div>
                  <Switch
                    id="cache"
                    checked={performanceSettings.cacheEnabled}
                    onCheckedChange={(checked) => 
                      setPerformanceSettings({...performanceSettings, cacheEnabled: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="background-sync">Synchronisation en arrière-plan</Label>
                    <p className="text-sm text-muted-foreground">Synchronise les données automatiquement</p>
                  </div>
                  <Switch
                    id="background-sync"
                    checked={performanceSettings.backgroundSync}
                    onCheckedChange={(checked) => 
                      setPerformanceSettings({...performanceSettings, backgroundSync: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="offline-mode">Mode hors ligne</Label>
                    <p className="text-sm text-muted-foreground">Utilisation sans connexion internet</p>
                  </div>
                  <Switch
                    id="offline-mode"
                    checked={performanceSettings.offlineMode}
                    onCheckedChange={(checked) => 
                      setPerformanceSettings({...performanceSettings, offlineMode: checked})
                    }
                  />
                </div>
              </div>

              <div className="pt-4 border-t space-y-3">
                <h4 className="font-medium">Maintenance</h4>
                <Button variant="outline" onClick={handleClearCache}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Vider le cache
                </Button>
              </div>

              <Button onClick={handleSavePerformance}>
                <Save className="mr-2 h-4 w-4" />
                Sauvegarder les performances
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
