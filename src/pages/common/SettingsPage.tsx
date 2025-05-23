
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  Globe,
  Smartphone,
  Mail,
  Save,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    // Notifications
    push_notifications: true,
    email_notifications: true,
    sms_notifications: false,
    reminder_notifications: true,
    
    // Confidentialité
    data_sharing: false,
    analytics_sharing: true,
    profile_visibility: 'private',
    
    // Interface
    language: 'fr',
    compact_mode: false,
    auto_theme: true,
    
    // Son
    sound_effects: true,
    voice_feedback: false
  });

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          preferences: {
            ...settings,
            theme: theme,
            updated_at: new Date().toISOString()
          }
        });

      if (error) throw error;

      toast.success('Paramètres sauvegardés avec succès');
    } catch (error) {
      console.error('Settings save error:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Paramètres</h1>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
          <TabsTrigger value="interface">Interface</TabsTrigger>
          <TabsTrigger value="account">Compte</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Préférences de Notifications
              </CardTitle>
              <CardDescription>
                Gérez comment et quand vous souhaitez être notifié
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications push</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des notifications dans l'application
                    </p>
                  </div>
                  <Switch
                    checked={settings.push_notifications}
                    onCheckedChange={(checked) => handleSettingChange('push_notifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications email</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des résumés et alertes par email
                    </p>
                  </div>
                  <Switch
                    checked={settings.email_notifications}
                    onCheckedChange={(checked) => handleSettingChange('email_notifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Rappels quotidiens</Label>
                    <p className="text-sm text-muted-foreground">
                      Rappels pour vos sessions de bien-être
                    </p>
                  </div>
                  <Switch
                    checked={settings.reminder_notifications}
                    onCheckedChange={(checked) => handleSettingChange('reminder_notifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications SMS</Label>
                    <p className="text-sm text-muted-foreground">
                      Alertes urgentes par SMS (en développement)
                    </p>
                  </div>
                  <Switch
                    checked={settings.sms_notifications}
                    onCheckedChange={(checked) => handleSettingChange('sms_notifications', checked)}
                    disabled
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
              <CardDescription>
                Contrôlez vos données et votre vie privée
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Partage de données anonymisées</Label>
                    <p className="text-sm text-muted-foreground">
                      Aider à améliorer EmotionsCare avec des données anonymes
                    </p>
                  </div>
                  <Switch
                    checked={settings.data_sharing}
                    onCheckedChange={(checked) => handleSettingChange('data_sharing', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Analytiques d'usage</Label>
                    <p className="text-sm text-muted-foreground">
                      Partager des statistiques d'utilisation pour améliorer l'app
                    </p>
                  </div>
                  <Switch
                    checked={settings.analytics_sharing}
                    onCheckedChange={(checked) => handleSettingChange('analytics_sharing', checked)}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Visibilité du profil</Label>
                  <RadioGroup 
                    value={settings.profile_visibility}
                    onValueChange={(value) => handleSettingChange('profile_visibility', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="private" id="private" />
                      <Label htmlFor="private">Privé - Seul vous pouvez voir votre profil</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="team" id="team" />
                      <Label htmlFor="team">Équipe - Visible par votre équipe (B2B uniquement)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="public" id="public" />
                      <Label htmlFor="public">Public - Visible par tous les utilisateurs</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interface" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Interface et Affichage
              </CardTitle>
              <CardDescription>
                Personnalisez l'apparence de votre application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label>Thème</Label>
                  <RadioGroup 
                    value={theme}
                    onValueChange={(value) => setTheme(value as any)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="light" />
                      <Label htmlFor="light">Clair</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dark" id="dark" />
                      <Label htmlFor="dark">Sombre</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="system" id="system" />
                      <Label htmlFor="system">Automatique (système)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Langue</Label>
                  <RadioGroup 
                    value={settings.language}
                    onValueChange={(value) => handleSettingChange('language', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fr" id="fr" />
                      <Label htmlFor="fr">🇫🇷 Français</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="en" id="en" disabled />
                      <Label htmlFor="en">🇬🇧 English (bientôt disponible)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mode compact</Label>
                    <p className="text-sm text-muted-foreground">
                      Interface plus dense avec moins d'espacement
                    </p>
                  </div>
                  <Switch
                    checked={settings.compact_mode}
                    onCheckedChange={(checked) => handleSettingChange('compact_mode', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Effets sonores</Label>
                    <p className="text-sm text-muted-foreground">
                      Sons lors des interactions dans l'application
                    </p>
                  </div>
                  <Switch
                    checked={settings.sound_effects}
                    onCheckedChange={(checked) => handleSettingChange('sound_effects', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations du Compte</CardTitle>
              <CardDescription>
                Gérez votre compte et vos données
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                
                <div>
                  <Label>Type de compte</Label>
                  <p className="text-sm text-muted-foreground">
                    {user?.role === 'b2c' ? 'Personnel' : 
                     user?.role === 'b2b_user' ? 'Collaborateur' : 
                     user?.role === 'b2b_admin' ? 'Administrateur' : 'Non défini'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Shield className="h-4 w-4" />
                  <span>Vos données sont chiffrées et sécurisées</span>
                </div>
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" disabled>
                    <Mail className="mr-2 h-4 w-4" />
                    Exporter mes données (bientôt disponible)
                  </Button>
                  
                  <Button variant="destructive" className="w-full" disabled>
                    Supprimer mon compte (bientôt disponible)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sauvegarde...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Sauvegarder les paramètres
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
