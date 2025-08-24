import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Bell, Moon, Volume2, Globe, Shield, Palette, Accessibility, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UserPreferencesPage: React.FC = () => {
  const [preferences, setPreferences] = useState({
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    
    // Apparence
    theme: 'system',
    language: 'fr',
    fontSize: [14],
    colorScheme: 'default',
    
    // Audio
    soundEffects: true,
    voiceGuidance: true,
    audioVolume: [70],
    
    // Confidentialité
    profileVisibility: 'friends',
    dataSharing: false,
    analytics: true,
    locationTracking: false,
    
    // Accessibilité
    highContrast: false,
    screenReader: false,
    reducedMotion: false,
    keyboardNavigation: true
  });

  const { toast } = useToast();

  const updatePreference = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const savePreferences = () => {
    toast({
      title: "Préférences sauvegardées",
      description: "Vos paramètres ont été mis à jour avec succès",
    });
  };

  const resetToDefaults = () => {
    toast({
      title: "Paramètres réinitialisés",
      description: "Vos préférences ont été restaurées aux valeurs par défaut",
    });
  };

  return (
    <main data-testid="page-root" className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Préférences Utilisateur</h1>
          <p className="text-muted-foreground">
            Personnalisez votre expérience EmotionsCare selon vos besoins
          </p>
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Apparence</span>
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              <span className="hidden sm:inline">Audio</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Confidentialité</span>
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="flex items-center gap-2">
              <Accessibility className="h-4 w-4" />
              <span className="hidden sm:inline">Accessibilité</span>
            </TabsTrigger>
          </TabsList>

          {/* Notifications */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Paramètres de Notifications
                </CardTitle>
                <CardDescription>
                  Gérez comment et quand vous souhaitez être notifié
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Notifications par email</Label>
                      <p className="text-sm text-muted-foreground">
                        Recevez des mises à jour importantes par email
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={preferences.emailNotifications}
                      onCheckedChange={(checked) => updatePreference('emailNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Notifications push</Label>
                      <p className="text-sm text-muted-foreground">
                        Notifications instantanées sur votre appareil
                      </p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={preferences.pushNotifications}
                      onCheckedChange={(checked) => updatePreference('pushNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-notifications">Notifications SMS</Label>
                      <p className="text-sm text-muted-foreground">
                        Alertes importantes par message texte
                      </p>
                    </div>
                    <Switch
                      id="sms-notifications"
                      checked={preferences.smsNotifications}
                      onCheckedChange={(checked) => updatePreference('smsNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing-emails">Emails marketing</Label>
                      <p className="text-sm text-muted-foreground">
                        Nouveautés, conseils bien-être et offres spéciales
                      </p>
                    </div>
                    <Switch
                      id="marketing-emails"
                      checked={preferences.marketingEmails}
                      onCheckedChange={(checked) => updatePreference('marketingEmails', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Apparence */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Paramètres d'Apparence
                </CardTitle>
                <CardDescription>
                  Personnalisez l'interface selon vos préférences visuelles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Thème</Label>
                    <Select value={preferences.theme} onValueChange={(value) => updatePreference('theme', value)}>
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

                  <div className="space-y-2">
                    <Label>Langue</Label>
                    <Select value={preferences.language} onValueChange={(value) => updatePreference('language', value)}>
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
                </div>

                <div className="space-y-3">
                  <Label>Taille de police</Label>
                  <div className="px-3">
                    <Slider
                      value={preferences.fontSize}
                      onValueChange={(value) => updatePreference('fontSize', value)}
                      max={20}
                      min={10}
                      step={1}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>Petit</span>
                      <span>{preferences.fontSize[0]}px</span>
                      <span>Grand</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Palette de couleurs</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { name: 'Défaut', value: 'default', colors: 'from-blue-500 to-purple-500' },
                      { name: 'Nature', value: 'nature', colors: 'from-green-500 to-teal-500' },
                      { name: 'Sunset', value: 'sunset', colors: 'from-orange-500 to-pink-500' }
                    ].map((scheme) => (
                      <div
                        key={scheme.value}
                        className={`cursor-pointer p-3 rounded-lg border-2 transition-colors ${
                          preferences.colorScheme === scheme.value ? 'border-primary' : 'border-muted'
                        }`}
                        onClick={() => updatePreference('colorScheme', scheme.value)}
                      >
                        <div className={`h-8 rounded bg-gradient-to-r ${scheme.colors} mb-2`}></div>
                        <p className="text-sm font-medium text-center">{scheme.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audio */}
          <TabsContent value="audio">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  Paramètres Audio
                </CardTitle>
                <CardDescription>
                  Contrôlez l'expérience sonore de l'application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sound-effects">Effets sonores</Label>
                      <p className="text-sm text-muted-foreground">
                        Sons des interactions et notifications
                      </p>
                    </div>
                    <Switch
                      id="sound-effects"
                      checked={preferences.soundEffects}
                      onCheckedChange={(checked) => updatePreference('soundEffects', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="voice-guidance">Guidage vocal</Label>
                      <p className="text-sm text-muted-foreground">
                        Instructions vocales pour les exercices
                      </p>
                    </div>
                    <Switch
                      id="voice-guidance"
                      checked={preferences.voiceGuidance}
                      onCheckedChange={(checked) => updatePreference('voiceGuidance', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Volume audio</Label>
                  <div className="px-3">
                    <Slider
                      value={preferences.audioVolume}
                      onValueChange={(value) => updatePreference('audioVolume', value)}
                      max={100}
                      min={0}
                      step={5}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>Muet</span>
                      <span>{preferences.audioVolume[0]}%</span>
                      <span>Maximum</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Confidentialité */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Confidentialité & Sécurité
                </CardTitle>
                <CardDescription>
                  Contrôlez vos données et votre vie privée
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Visibilité du profil</Label>
                  <Select value={preferences.profileVisibility} onValueChange={(value) => updatePreference('profileVisibility', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="friends">Amis uniquement</SelectItem>
                      <SelectItem value="private">Privé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="data-sharing">Partage de données</Label>
                      <p className="text-sm text-muted-foreground">
                        Partager données anonymes pour la recherche
                      </p>
                    </div>
                    <Switch
                      id="data-sharing"
                      checked={preferences.dataSharing}
                      onCheckedChange={(checked) => updatePreference('dataSharing', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="analytics">Analytics</Label>
                      <p className="text-sm text-muted-foreground">
                        Améliorer l'application via données d'usage
                      </p>
                    </div>
                    <Switch
                      id="analytics"
                      checked={preferences.analytics}
                      onCheckedChange={(checked) => updatePreference('analytics', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="location-tracking">Géolocalisation</Label>
                      <p className="text-sm text-muted-foreground">
                        Permettre l'accès à votre position
                      </p>
                    </div>
                    <Switch
                      id="location-tracking"
                      checked={preferences.locationTracking}
                      onCheckedChange={(checked) => updatePreference('locationTracking', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Accessibilité */}
          <TabsContent value="accessibility">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Accessibility className="h-5 w-5" />
                  Options d'Accessibilité
                </CardTitle>
                <CardDescription>
                  Améliorez l'utilisabilité selon vos besoins spécifiques
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="high-contrast">Contraste élevé</Label>
                      <p className="text-sm text-muted-foreground">
                        Améliore la lisibilité des textes
                      </p>
                    </div>
                    <Switch
                      id="high-contrast"
                      checked={preferences.highContrast}
                      onCheckedChange={(checked) => updatePreference('highContrast', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="screen-reader">Lecteur d'écran</Label>
                      <p className="text-sm text-muted-foreground">
                        Optimise pour les technologies d'assistance
                      </p>
                    </div>
                    <Switch
                      id="screen-reader"
                      checked={preferences.screenReader}
                      onCheckedChange={(checked) => updatePreference('screenReader', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="reduced-motion">Mouvement réduit</Label>
                      <p className="text-sm text-muted-foreground">
                        Désactive les animations pour réduire les distractions
                      </p>
                    </div>
                    <Switch
                      id="reduced-motion"
                      checked={preferences.reducedMotion}
                      onCheckedChange={(checked) => updatePreference('reducedMotion', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="keyboard-navigation">Navigation clavier</Label>
                      <p className="text-sm text-muted-foreground">
                        Permet la navigation complète au clavier
                      </p>
                    </div>
                    <Switch
                      id="keyboard-navigation"
                      checked={preferences.keyboardNavigation}
                      onCheckedChange={(checked) => updatePreference('keyboardNavigation', checked)}
                    />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Raccourcis clavier</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Menu principal:</span>
                      <Badge variant="outline">Alt + M</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Recherche:</span>
                      <Badge variant="outline">Ctrl + K</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Aide:</span>
                      <Badge variant="outline">F1</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex justify-between items-center pt-6">
          <Button variant="outline" onClick={resetToDefaults}>
            Réinitialiser
          </Button>
          <Button onClick={savePreferences} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Sauvegarder les préférences
          </Button>
        </div>
      </div>
    </main>
  );
};

export default UserPreferencesPage;