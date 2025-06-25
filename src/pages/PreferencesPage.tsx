
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Settings, Bell, Palette, Shield, Music, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PreferencesPage: React.FC = () => {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState({
    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    reminderFrequency: 'daily',
    quietHours: { start: '22:00', end: '08:00' },
    
    // Interface
    theme: 'system',
    language: 'fr',
    fontSize: 'medium',
    animations: true,
    
    // Audio
    masterVolume: [75],
    musicGenres: ['ambient', 'classical'],
    voiceSpeed: [1],
    
    // Confidentialité
    dataSharing: false,
    analytics: true,
    profileVisibility: 'private',
    
    // Scan émotionnel
    scanFrequency: 'twice-daily',
    autoScan: false,
    scanReminders: true
  });

  const handleSave = () => {
    // Simuler la sauvegarde
    toast({
      title: "Préférences sauvegardées",
      description: "Vos paramètres ont été mis à jour avec succès.",
    });
  };

  const updatePreference = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <Settings className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">Préférences</h1>
            <p className="text-muted-foreground">Personnalisez votre expérience EmotionsCare</p>
          </div>
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="interface" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Interface
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              Audio
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Confidentialité
            </TabsTrigger>
            <TabsTrigger value="scan" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Scan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications par email</Label>
                    <p className="text-sm text-muted-foreground">Recevoir des rappels par email</p>
                  </div>
                  <Switch
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) => updatePreference('emailNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications push</Label>
                    <p className="text-sm text-muted-foreground">Notifications sur votre appareil</p>
                  </div>
                  <Switch
                    checked={preferences.pushNotifications}
                    onCheckedChange={(checked) => updatePreference('pushNotifications', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Fréquence des rappels</Label>
                  <Select value={preferences.reminderFrequency} onValueChange={(value) => updatePreference('reminderFrequency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Jamais</SelectItem>
                      <SelectItem value="daily">Quotidien</SelectItem>
                      <SelectItem value="twice-daily">Deux fois par jour</SelectItem>
                      <SelectItem value="weekly">Hebdomadaire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Début des heures silencieuses</Label>
                    <Input
                      type="time"
                      value={preferences.quietHours.start}
                      onChange={(e) => updatePreference('quietHours', { ...preferences.quietHours, start: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fin des heures silencieuses</Label>
                    <Input
                      type="time"
                      value={preferences.quietHours.end}
                      onChange={(e) => updatePreference('quietHours', { ...preferences.quietHours, end: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interface" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Apparence et Interface</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Taille de police</Label>
                  <Select value={preferences.fontSize} onValueChange={(value) => updatePreference('fontSize', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Petite</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="large">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Animations</Label>
                    <p className="text-sm text-muted-foreground">Activer les animations de l'interface</p>
                  </div>
                  <Switch
                    checked={preferences.animations}
                    onCheckedChange={(checked) => updatePreference('animations', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audio" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres Audio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Volume principal</Label>
                  <Slider
                    value={preferences.masterVolume}
                    onValueChange={(value) => updatePreference('masterVolume', value)}
                    max={100}
                    step={1}
                  />
                  <p className="text-sm text-muted-foreground">{preferences.masterVolume[0]}%</p>
                </div>

                <div className="space-y-2">
                  <Label>Vitesse de la voix</Label>
                  <Slider
                    value={preferences.voiceSpeed}
                    onValueChange={(value) => updatePreference('voiceSpeed', value)}
                    min={0.5}
                    max={2}
                    step={0.1}
                  />
                  <p className="text-sm text-muted-foreground">{preferences.voiceSpeed[0]}x</p>
                </div>

                <div className="space-y-2">
                  <Label>Genres musicaux préférés</Label>
                  <div className="flex flex-wrap gap-2">
                    {['ambient', 'classical', 'nature', 'binaural', 'meditation'].map((genre) => (
                      <Badge
                        key={genre}
                        variant={preferences.musicGenres.includes(genre) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => {
                          const newGenres = preferences.musicGenres.includes(genre)
                            ? preferences.musicGenres.filter(g => g !== genre)
                            : [...preferences.musicGenres, genre];
                          updatePreference('musicGenres', newGenres);
                        }}
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Confidentialité et Sécurité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Partage de données anonymes</Label>
                    <p className="text-sm text-muted-foreground">Aider à améliorer l'application</p>
                  </div>
                  <Switch
                    checked={preferences.dataSharing}
                    onCheckedChange={(checked) => updatePreference('dataSharing', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Analytics</Label>
                    <p className="text-sm text-muted-foreground">Statistiques d'utilisation</p>
                  </div>
                  <Switch
                    checked={preferences.analytics}
                    onCheckedChange={(checked) => updatePreference('analytics', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Visibilité du profil</Label>
                  <Select value={preferences.profileVisibility} onValueChange={(value) => updatePreference('profileVisibility', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Privé</SelectItem>
                      <SelectItem value="team">Équipe uniquement</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scan" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres du Scan Émotionnel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Fréquence des scans</Label>
                  <Select value={preferences.scanFrequency} onValueChange={(value) => updatePreference('scanFrequency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manuel uniquement</SelectItem>
                      <SelectItem value="daily">Une fois par jour</SelectItem>
                      <SelectItem value="twice-daily">Deux fois par jour</SelectItem>
                      <SelectItem value="hourly">Toutes les heures</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Scan automatique</Label>
                    <p className="text-sm text-muted-foreground">Détecter automatiquement les émotions</p>
                  </div>
                  <Switch
                    checked={preferences.autoScan}
                    onCheckedChange={(checked) => updatePreference('autoScan', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Rappels de scan</Label>
                    <p className="text-sm text-muted-foreground">Notifications pour effectuer un scan</p>
                  </div>
                  <Switch
                    checked={preferences.scanReminders}
                    onCheckedChange={(checked) => updatePreference('scanReminders', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-8">
          <Button onClick={handleSave} size="lg">
            Sauvegarder les préférences
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreferencesPage;
