import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  User, 
  Bell, 
  Palette, 
  Shield, 
  Music, 
  Brain,
  Accessibility,
  Download,
  Trash2,
  Save,
  RefreshCw
} from 'lucide-react';
import { useAccessibilityContext } from '@/components/accessibility/AccessibilityProvider';
import { toast } from 'sonner';

const SettingsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { settings: accessibilitySettings, updateSettings: updateAccessibilitySettings } = useAccessibilityContext();
  
  const [settings, setSettings] = useState({
    // General
    language: 'fr',
    timezone: 'Europe/Paris',
    theme: 'system',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    soundNotifications: false,
    
    // Privacy
    dataCollection: true,
    analytics: true,
    shareWithTeam: false,
    
    // Music
    audioQuality: 'high',
    autoplay: true,
    downloadOffline: false,
    
    // Emotion Analysis
    autoScan: false,
    saveHistory: true,
    shareInsights: true
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate save
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Paramètres sauvegardés avec succès');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSettings({
      language: 'fr',
      timezone: 'Europe/Paris',
      theme: 'system',
      emailNotifications: true,
      pushNotifications: true,
      soundNotifications: false,
      dataCollection: true,
      analytics: true,
      shareWithTeam: false,
      audioQuality: 'high',
      autoplay: true,
      downloadOffline: false,
      autoScan: false,
      saveHistory: true,
      shareInsights: true
    });
    toast.info('Paramètres réinitialisés');
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Paramètres & Préférences</h1>
          <p className="text-muted-foreground">Personnalisez votre expérience EmotionsCare</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
          <TabsTrigger value="features">Fonctionnalités</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibilité</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Préférences Générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Langue</label>
                  <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
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
                  <Select value={settings.timezone} onValueChange={(value) => updateSetting('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                      <SelectItem value="Europe/London">Europe/London</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                      <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Thème</label>
                  <Select value={settings.theme} onValueChange={(value) => updateSetting('theme', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Clair</SelectItem>
                      <SelectItem value="dark">Sombre</SelectItem>
                      <SelectItem value="system">Système</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notifications par email</p>
                    <p className="text-sm text-muted-foreground">Recevez des mises à jour par email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notifications push</p>
                    <p className="text-sm text-muted-foreground">Notifications en temps réel</p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sons de notification</p>
                    <p className="text-sm text-muted-foreground">Sons pour les alertes</p>
                  </div>
                  <Switch
                    checked={settings.soundNotifications}
                    onCheckedChange={(checked) => updateSetting('soundNotifications', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Confidentialité et Données
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Collecte de données</p>
                    <p className="text-sm text-muted-foreground">Permettre la collecte de données pour améliorer l'expérience</p>
                  </div>
                  <Switch
                    checked={settings.dataCollection}
                    onCheckedChange={(checked) => updateSetting('dataCollection', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Analytics</p>
                    <p className="text-sm text-muted-foreground">Partager des données d'usage anonymes</p>
                  </div>
                  <Switch
                    checked={settings.analytics}
                    onCheckedChange={(checked) => updateSetting('analytics', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Partage avec l'équipe</p>
                    <p className="text-sm text-muted-foreground">Permettre à votre équipe de voir vos insights</p>
                  </div>
                  <Switch
                    checked={settings.shareWithTeam}
                    onCheckedChange={(checked) => updateSetting('shareWithTeam', checked)}
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer toutes mes données
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Musicothérapie
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Qualité audio</label>
                  <Select value={settings.audioQuality} onValueChange={(value) => updateSetting('audioQuality', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Basse (128 kbps)</SelectItem>
                      <SelectItem value="medium">Moyenne (256 kbps)</SelectItem>
                      <SelectItem value="high">Haute (320 kbps)</SelectItem>
                      <SelectItem value="lossless">Sans perte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Lecture automatique</p>
                    <p className="text-sm text-muted-foreground">Démarrer automatiquement</p>
                  </div>
                  <Switch
                    checked={settings.autoplay}
                    onCheckedChange={(checked) => updateSetting('autoplay', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Téléchargement hors ligne</p>
                    <p className="text-sm text-muted-foreground">Permettre les téléchargements</p>
                  </div>
                  <Switch
                    checked={settings.downloadOffline}
                    onCheckedChange={(checked) => updateSetting('downloadOffline', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Analyse Émotionnelle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Scan automatique</p>
                    <p className="text-sm text-muted-foreground">Analyser automatiquement vos textes</p>
                  </div>
                  <Switch
                    checked={settings.autoScan}
                    onCheckedChange={(checked) => updateSetting('autoScan', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sauvegarder l'historique</p>
                    <p className="text-sm text-muted-foreground">Conserver vos analyses</p>
                  </div>
                  <Switch
                    checked={settings.saveHistory}
                    onCheckedChange={(checked) => updateSetting('saveHistory', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Partager les insights</p>
                    <p className="text-sm text-muted-foreground">Permettre le partage d'insights IA</p>
                  </div>
                  <Switch
                    checked={settings.shareInsights}
                    onCheckedChange={(checked) => updateSetting('shareInsights', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Accessibility className="h-5 w-5" />
                Accessibilité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Options visuelles</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Contraste élevé</p>
                      <p className="text-sm text-muted-foreground">Améliore la lisibilité</p>
                    </div>
                    <Switch
                      checked={accessibilitySettings.highContrast}
                      onCheckedChange={(checked) => updateAccessibilitySettings({ highContrast: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Texte large</p>
                      <p className="text-sm text-muted-foreground">Augmente la taille du texte</p>
                    </div>
                    <Switch
                      checked={accessibilitySettings.largeText}
                      onCheckedChange={(checked) => updateAccessibilitySettings({ largeText: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Réduire les animations</p>
                      <p className="text-sm text-muted-foreground">Moins d'animations</p>
                    </div>
                    <Switch
                      checked={accessibilitySettings.reducedMotion}
                      onCheckedChange={(checked) => updateAccessibilitySettings({ reducedMotion: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Police dyslexie</p>
                      <p className="text-sm text-muted-foreground">Police adaptée à la dyslexie</p>
                    </div>
                    <Switch
                      checked={accessibilitySettings.dyslexicFont}
                      onCheckedChange={(checked) => updateAccessibilitySettings({ dyslexicFont: checked })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Options audio et navigation</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Descriptions audio</p>
                      <p className="text-sm text-muted-foreground">Annonces vocales</p>
                    </div>
                    <Switch
                      checked={accessibilitySettings.audioDescriptions}
                      onCheckedChange={(checked) => updateAccessibilitySettings({ audioDescriptions: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Navigation clavier</p>
                      <p className="text-sm text-muted-foreground">Support clavier complet</p>
                    </div>
                    <Switch
                      checked={accessibilitySettings.keyboardNavigation}
                      onCheckedChange={(checked) => updateAccessibilitySettings({ keyboardNavigation: checked })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Vitesse de lecture</label>
                    <Slider
                      value={[accessibilitySettings.voiceSpeed]}
                      onValueChange={([value]) => updateAccessibilitySettings({ voiceSpeed: value })}
                      min={0.5}
                      max={2}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Lent</span>
                      <span>{accessibilitySettings.voiceSpeed}x</span>
                      <span>Rapide</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between pt-6 border-t">
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
        
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;