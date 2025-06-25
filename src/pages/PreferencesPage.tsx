
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { Settings, Bell, Palette, Volume2, Shield, User, ArrowLeft, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const PreferencesPage: React.FC = () => {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    notifications: {
      enabled: true,
      emailNotifications: false,
      pushNotifications: true,
      reminderFrequency: 'daily'
    },
    audio: {
      volume: [75],
      autoPlay: false,
      preferredGenre: 'ambient'
    },
    display: {
      theme: 'light',
      fontSize: 'medium',
      reducedMotion: false
    },
    privacy: {
      dataSharing: false,
      analytics: true,
      personalization: true
    }
  });

  const handleSave = () => {
    // Simulation de sauvegarde
    toast.success('Préférences sauvegardées avec succès !');
  };

  const handleReset = () => {
    toast.info('Préférences réinitialisées aux valeurs par défaut');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/')}
              data-testid="back-button"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Settings className="h-8 w-8 text-primary" />
                Préférences
              </h1>
              <p className="text-gray-600">Personnalisez votre expérience EmotionsCare</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>
              Réinitialiser
            </Button>
            <Button onClick={handleSave} data-testid="save-preferences">
              <Save className="mr-2 h-4 w-4" />
              Sauvegarder
            </Button>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              Audio
            </TabsTrigger>
            <TabsTrigger value="display" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Affichage
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Confidentialité
            </TabsTrigger>
          </TabsList>

          {/* Notifications */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Paramètres de notification
                </CardTitle>
                <CardDescription>
                  Gérez la façon dont vous recevez les notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Notifications activées</Label>
                    <div className="text-sm text-gray-500">
                      Recevoir des notifications générales
                    </div>
                  </div>
                  <Switch
                    checked={preferences.notifications.enabled}
                    onCheckedChange={(checked) =>
                      setPreferences(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, enabled: checked }
                      }))
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Notifications par email</Label>
                    <div className="text-sm text-gray-500">
                      Recevoir des résumés par email
                    </div>
                  </div>
                  <Switch
                    checked={preferences.notifications.emailNotifications}
                    onCheckedChange={(checked) =>
                      setPreferences(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, emailNotifications: checked }
                      }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Notifications push</Label>
                    <div className="text-sm text-gray-500">
                      Recevoir des notifications en temps réel
                    </div>
                  </div>
                  <Switch
                    checked={preferences.notifications.pushNotifications}
                    onCheckedChange={(checked) =>
                      setPreferences(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, pushNotifications: checked }
                      }))
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-base">Fréquence des rappels</Label>
                  <Select
                    value={preferences.notifications.reminderFrequency}
                    onValueChange={(value) =>
                      setPreferences(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, reminderFrequency: value }
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Jamais</SelectItem>
                      <SelectItem value="daily">Quotidien</SelectItem>
                      <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      <SelectItem value="monthly">Mensuel</SelectItem>
                    </SelectContent>
                  </Select>
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
                  Paramètres audio
                </CardTitle>
                <CardDescription>
                  Configurez votre expérience audio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-base">Volume principal</Label>
                  <Slider
                    value={preferences.audio.volume}
                    onValueChange={(value) =>
                      setPreferences(prev => ({
                        ...prev,
                        audio: { ...prev.audio, volume: value }
                      }))
                    }
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-500 text-right">
                    {preferences.audio.volume[0]}%
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Lecture automatique</Label>
                    <div className="text-sm text-gray-500">
                      Démarrer la musique automatiquement
                    </div>
                  </div>
                  <Switch
                    checked={preferences.audio.autoPlay}
                    onCheckedChange={(checked) =>
                      setPreferences(prev => ({
                        ...prev,
                        audio: { ...prev.audio, autoPlay: checked }
                      }))
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-base">Genre musical préféré</Label>
                  <Select
                    value={preferences.audio.preferredGenre}
                    onValueChange={(value) =>
                      setPreferences(prev => ({
                        ...prev,
                        audio: { ...prev.audio, preferredGenre: value }
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ambient">Ambiant</SelectItem>
                      <SelectItem value="classical">Classique</SelectItem>
                      <SelectItem value="nature">Sons de la nature</SelectItem>
                      <SelectItem value="meditation">Méditation</SelectItem>
                      <SelectItem value="jazz">Jazz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Display */}
          <TabsContent value="display">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Paramètres d'affichage
                </CardTitle>
                <CardDescription>
                  Personnalisez l'apparence de l'interface
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-base">Thème</Label>
                  <Select
                    value={preferences.display.theme}
                    onValueChange={(value) =>
                      setPreferences(prev => ({
                        ...prev,
                        display: { ...prev.display, theme: value }
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Clair</SelectItem>
                      <SelectItem value="dark">Sombre</SelectItem>
                      <SelectItem value="auto">Automatique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-base">Taille de police</Label>
                  <Select
                    value={preferences.display.fontSize}
                    onValueChange={(value) =>
                      setPreferences(prev => ({
                        ...prev,
                        display: { ...prev.display, fontSize: value }
                      }))
                    }
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
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Réduire les animations</Label>
                    <div className="text-sm text-gray-500">
                      Minimiser les effets visuels pour plus de confort
                    </div>
                  </div>
                  <Switch
                    checked={preferences.display.reducedMotion}
                    onCheckedChange={(checked) =>
                      setPreferences(prev => ({
                        ...prev,
                        display: { ...prev.display, reducedMotion: checked }
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Paramètres de confidentialité
                </CardTitle>
                <CardDescription>
                  Contrôlez vos données et votre confidentialité
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Partage de données</Label>
                    <div className="text-sm text-gray-500">
                      Autoriser le partage anonyme pour améliorer le service
                    </div>
                  </div>
                  <Switch
                    checked={preferences.privacy.dataSharing}
                    onCheckedChange={(checked) =>
                      setPreferences(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, dataSharing: checked }
                      }))
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Analyses d'usage</Label>
                    <div className="text-sm text-gray-500">
                      Collecter des données d'usage pour améliorer l'expérience
                    </div>
                  </div>
                  <Switch
                    checked={preferences.privacy.analytics}
                    onCheckedChange={(checked) =>
                      setPreferences(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, analytics: checked }
                      }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Personnalisation</Label>
                    <div className="text-sm text-gray-500">
                      Utiliser vos données pour personnaliser les recommandations
                    </div>
                  </div>
                  <Switch
                    checked={preferences.privacy.personalization}
                    onCheckedChange={(checked) =>
                      setPreferences(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, personalization: checked }
                      }))
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Actions sur les données</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Exporter mes données
                    </Button>
                    <Button variant="outline" size="sm">
                      Supprimer mes données
                    </Button>
                  </div>
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
