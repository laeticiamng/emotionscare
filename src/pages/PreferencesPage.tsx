
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Save, Settings, Bell, Music, Eye, Palette, Volume2, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';

const PreferencesPage: React.FC = () => {
  const [preferences, setPreferences] = useState({
    notifications: true,
    emailAlerts: false,
    soundEffects: true,
    musicAutoplay: true,
    theme: 'system',
    language: 'fr',
    volume: [70],
    animationSpeed: [1],
    dataCollection: true,
    shareProgress: false,
    publicProfile: false
  });

  const handleSave = () => {
    // Sauvegarder les préférences
    toast.success('Préférences sauvegardées avec succès !');
  };

  const updatePreference = (key: string, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20" data-testid="page-root">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Settings className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Préférences
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Personnalisez votre expérience EmotionsCare selon vos besoins
            </p>
          </div>

          <div className="grid gap-6">
            {/* Notifications */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  <CardTitle>Notifications</CardTitle>
                </div>
                <CardDescription>
                  Gérez vos notifications et alertes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications" className="text-sm font-medium">
                    Notifications push
                  </Label>
                  <Switch
                    id="notifications"
                    checked={preferences.notifications}
                    onCheckedChange={(checked) => updatePreference('notifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-alerts" className="text-sm font-medium">
                    Alertes par email
                  </Label>
                  <Switch
                    id="email-alerts"
                    checked={preferences.emailAlerts}
                    onCheckedChange={(checked) => updatePreference('emailAlerts', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Interface et Thème */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  <CardTitle>Interface & Thème</CardTitle>
                </div>
                <CardDescription>
                  Personnalisez l'apparence de l'application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Thème</Label>
                    <Select value={preferences.theme} onValueChange={(value) => updatePreference('theme', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4" />
                            Clair
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center gap-2">
                            <Moon className="h-4 w-4" />
                            Sombre
                          </div>
                        </SelectItem>
                        <SelectItem value="system">Système</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Langue</Label>
                    <Select value={preferences.language} onValueChange={(value) => updatePreference('language', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Vitesse des animations ({preferences.animationSpeed[0]}x)
                  </Label>
                  <Slider
                    value={preferences.animationSpeed}
                    onValueChange={(value) => updatePreference('animationSpeed', value)}
                    max={2}
                    min={0.5}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Audio et Musique */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Music className="h-5 w-5 text-primary" />
                  <CardTitle>Audio & Musique</CardTitle>
                </div>
                <CardDescription>
                  Configurez les paramètres audio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sound-effects" className="text-sm font-medium">
                    Effets sonores
                  </Label>
                  <Switch
                    id="sound-effects"
                    checked={preferences.soundEffects}
                    onCheckedChange={(checked) => updatePreference('soundEffects', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="music-autoplay" className="text-sm font-medium">
                    Lecture automatique
                  </Label>
                  <Switch
                    id="music-autoplay"
                    checked={preferences.musicAutoplay}
                    onCheckedChange={(checked) => updatePreference('musicAutoplay', checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    Volume général ({preferences.volume[0]}%)
                  </Label>
                  <Slider
                    value={preferences.volume}
                    onValueChange={(value) => updatePreference('volume', value)}
                    max={100}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Confidentialité */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  <CardTitle>Confidentialité</CardTitle>
                </div>
                <CardDescription>
                  Gérez vos données et votre confidentialité
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="data-collection" className="text-sm font-medium">
                    Collecte de données d'usage
                  </Label>
                  <Switch
                    id="data-collection"
                    checked={preferences.dataCollection}
                    onCheckedChange={(checked) => updatePreference('dataCollection', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="share-progress" className="text-sm font-medium">
                    Partager mes progrès
                  </Label>
                  <Switch
                    id="share-progress"
                    checked={preferences.shareProgress}
                    onCheckedChange={(checked) => updatePreference('shareProgress', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="public-profile" className="text-sm font-medium">
                    Profil public
                  </Label>
                  <Switch
                    id="public-profile"
                    checked={preferences.publicProfile}
                    onCheckedChange={(checked) => updatePreference('publicProfile', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          <div className="flex justify-center">
            <Button onClick={handleSave} size="lg" className="px-8">
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder les préférences
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PreferencesPage;
