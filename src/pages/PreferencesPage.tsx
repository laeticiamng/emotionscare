
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Volume2, 
  Eye, 
  Shield, 
  Bell, 
  Globe, 
  Monitor,
  Smartphone,
  Moon,
  Sun,
  VolumeX,
  Settings,
  User,
  Lock,
  Accessibility,
  Zap,
  Heart,
  Brain
} from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useToast } from '@/hooks/use-toast';

const PreferencesPage: React.FC = () => {
  const { preferences, updatePreferences, theme, fontSize, language } = useUserPreferences();
  const { toast } = useToast();
  
  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [hasChanges, setHasChanges] = useState(false);

  const handlePreferenceChange = (key: string, value: any) => {
    const updated = { ...localPreferences, [key]: value };
    setLocalPreferences(updated);
    setHasChanges(true);
  };

  const handleNestedPreferenceChange = (section: string, key: string, value: any) => {
    const updated = {
      ...localPreferences,
      [section]: {
        ...localPreferences[section as keyof typeof localPreferences],
        [key]: value
      }
    };
    setLocalPreferences(updated);
    setHasChanges(true);
  };

  const savePreferences = async () => {
    try {
      await updatePreferences(localPreferences);
      setHasChanges(false);
      toast({
        title: "Préférences sauvegardées",
        description: "Vos paramètres ont été mis à jour avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les préférences.",
        variant: "destructive",
      });
    }
  };

  const resetPreferences = () => {
    setLocalPreferences(preferences);
    setHasChanges(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Préférences</h1>
            <p className="text-muted-foreground">
              Personnalisez votre expérience EmotionsCare
            </p>
          </div>
          
          {hasChanges && (
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={resetPreferences}>
                Annuler
              </Button>
              <Button onClick={savePreferences}>
                Sauvegarder
              </Button>
            </div>
          )}
        </div>

        <Tabs defaultValue="appearance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Apparence
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="flex items-center gap-2">
              <Accessibility className="h-4 w-4" />
              Accessibilité
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Confidentialité
            </TabsTrigger>
            <TabsTrigger value="wellness" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Bien-être
            </TabsTrigger>
          </TabsList>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Thème et apparence
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-3 block">Thème</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'light', label: 'Clair', icon: Sun },
                        { value: 'dark', label: 'Sombre', icon: Moon },
                        { value: 'system', label: 'Auto', icon: Monitor }
                      ].map((themeOption) => {
                        const Icon = themeOption.icon;
                        return (
                          <Button
                            key={themeOption.value}
                            variant={localPreferences.theme === themeOption.value ? 'default' : 'outline'}
                            onClick={() => handlePreferenceChange('theme', themeOption.value)}
                            className="flex flex-col items-center gap-2 h-auto py-4"
                          >
                            <Icon className="h-5 w-5" />
                            <span className="text-sm">{themeOption.label}</span>
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-3 block">Taille de police</label>
                    <Select 
                      value={localPreferences.fontSize || 'medium'}
                      onValueChange={(value) => handlePreferenceChange('fontSize', value)}
                    >
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

                  <div>
                    <label className="text-sm font-medium mb-3 block">Police de caractère</label>
                    <Select 
                      value={localPreferences.fontFamily || 'sans'}
                      onValueChange={(value) => handlePreferenceChange('fontFamily', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sans">Sans-serif</SelectItem>
                        <SelectItem value="serif">Serif</SelectItem>
                        <SelectItem value="mono">Monospace</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5" />
                    Audio et effets
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Effets sonores</h4>
                      <p className="text-sm text-muted-foreground">Sons d'interface et notifications</p>
                    </div>
                    <Switch 
                      checked={localPreferences.soundEffects !== false}
                      onCheckedChange={(checked) => handlePreferenceChange('soundEffects', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Vibrations</h4>
                      <p className="text-sm text-muted-foreground">Retour haptique sur mobile</p>
                    </div>
                    <Switch 
                      checked={localPreferences.vibration !== false}
                      onCheckedChange={(checked) => handlePreferenceChange('vibration', checked)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-3 block">Langue</label>
                    <Select 
                      value={localPreferences.language || 'fr'}
                      onValueChange={(value) => handlePreferenceChange('language', value)}
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
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Accessibility Tab */}
          <TabsContent value="accessibility" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Accessibility className="h-5 w-5" />
                  Options d'accessibilité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Contraste élevé</h4>
                        <p className="text-sm text-muted-foreground">Améliore la lisibilité</p>
                      </div>
                      <Switch 
                        checked={localPreferences.accessibility?.highContrast || false}
                        onCheckedChange={(checked) => handleNestedPreferenceChange('accessibility', 'highContrast', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Réduire les animations</h4>
                        <p className="text-sm text-muted-foreground">Limite les effets de mouvement</p>
                      </div>
                      <Switch 
                        checked={localPreferences.accessibility?.reduceMotion || false}
                        onCheckedChange={(checked) => handleNestedPreferenceChange('accessibility', 'reduceMotion', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Texte agrandi</h4>
                        <p className="text-sm text-muted-foreground">Augmente la taille du texte</p>
                      </div>
                      <Switch 
                        checked={localPreferences.accessibility?.largeText || false}
                        onCheckedChange={(checked) => handleNestedPreferenceChange('accessibility', 'largeText', checked)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Lecteur d'écran</h4>
                        <p className="text-sm text-muted-foreground">Optimisé pour les lecteurs d'écran</p>
                      </div>
                      <Switch 
                        checked={localPreferences.accessibility?.screenReader || false}
                        onCheckedChange={(checked) => handleNestedPreferenceChange('accessibility', 'screenReader', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Navigation clavier</h4>
                        <p className="text-sm text-muted-foreground">Navigation complète au clavier</p>
                      </div>
                      <Switch 
                        checked={localPreferences.accessibility?.keyboardNavigation || false}
                        onCheckedChange={(checked) => handleNestedPreferenceChange('accessibility', 'keyboardNavigation', checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Méthodes de notification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notifications push</h4>
                      <p className="text-sm text-muted-foreground">Dans l'application</p>
                    </div>
                    <Switch 
                      checked={localPreferences.notifications?.push !== false}
                      onCheckedChange={(checked) => handleNestedPreferenceChange('notifications', 'push', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notifications email</h4>
                      <p className="text-sm text-muted-foreground">Résumés par email</p>
                    </div>
                    <Switch 
                      checked={localPreferences.notifications?.email !== false}
                      onCheckedChange={(checked) => handleNestedPreferenceChange('notifications', 'email', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notifications dans l'app</h4>
                      <p className="text-sm text-muted-foreground">Alertes visuelles</p>
                    </div>
                    <Switch 
                      checked={localPreferences.notifications?.inApp !== false}
                      onCheckedChange={(checked) => handleNestedPreferenceChange('notifications', 'inApp', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Types de notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: 'security', label: 'Sécurité', description: 'Alertes importantes' },
                    { key: 'achievements', label: 'Récompenses', description: 'Badges et progrès' },
                    { key: 'reminders', label: 'Rappels', description: 'Sessions et exercices' },
                    { key: 'social', label: 'Social', description: 'Messages et interactions' },
                    { key: 'system', label: 'Système', description: 'Mises à jour' }
                  ].map((type) => (
                    <div key={type.key} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{type.label}</h4>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                      <Switch 
                        checked={localPreferences.notifications?.types?.[type.key as keyof typeof localPreferences.notifications.types] !== false}
                        onCheckedChange={(checked) => handleNestedPreferenceChange('notifications', `types.${type.key}`, checked)}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Paramètres de confidentialité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Visibilité du profil</h4>
                      <Select 
                        value={typeof localPreferences.privacy === 'object' ? localPreferences.privacy?.profileVisibility || 'private' : 'private'}
                        onValueChange={(value) => handleNestedPreferenceChange('privacy', 'profileVisibility', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="private">Privé</SelectItem>
                          <SelectItem value="friends">Amis uniquement</SelectItem>
                          <SelectItem value="public">Public</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Collecte de données</h4>
                        <p className="text-sm text-muted-foreground">Amélioration du service</p>
                      </div>
                      <Switch 
                        checked={typeof localPreferences.privacy === 'object' ? localPreferences.privacy?.dataCollection !== false : false}
                        onCheckedChange={(checked) => handleNestedPreferenceChange('privacy', 'dataCollection', checked)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Analytics</h4>
                        <p className="text-sm text-muted-foreground">Données d'utilisation anonymes</p>
                      </div>
                      <Switch 
                        checked={typeof localPreferences.privacy === 'object' ? localPreferences.privacy?.analytics !== false : false}
                        onCheckedChange={(checked) => handleNestedPreferenceChange('privacy', 'analytics', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Marketing</h4>
                        <p className="text-sm text-muted-foreground">Communications marketing</p>
                      </div>
                      <Switch 
                        checked={typeof localPreferences.privacy === 'object' ? localPreferences.privacy?.marketing !== false : false}
                        onCheckedChange={(checked) => handleNestedPreferenceChange('privacy', 'marketing', checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wellness Tab */}
          <TabsContent value="wellness" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Objectifs de bien-être
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Rappels quotidiens</label>
                    <div className="space-y-2">
                      {['Méditation', 'Scan émotionnel', 'Journal', 'Exercices de respiration'].map((activity) => (
                        <div key={activity} className="flex items-center justify-between">
                          <span className="text-sm">{activity}</span>
                          <Switch defaultChecked />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Préférences IA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Recommandations personnalisées</h4>
                      <p className="text-sm text-muted-foreground">Basées sur vos habitudes</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Coach IA proactif</h4>
                      <p className="text-sm text-muted-foreground">Suggestions automatiques</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-3 block">Sensibilité des recommandations</label>
                    <Slider
                      defaultValue={[70]}
                      max={100}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Conservateur</span>
                      <span>Adaptatif</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PreferencesPage;
