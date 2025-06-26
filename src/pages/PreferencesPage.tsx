
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Bell, Moon, Globe, Palette, Volume2, Shield, Heart, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PreferencesPage: React.FC = () => {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState({
    notifications: true,
    darkMode: false,
    language: 'fr',
    musicVolume: [75],
    scanFrequency: 'daily',
    coachPersonality: 'empathetic',
    dataSharing: false,
    reminderTime: '09:00'
  });

  const savePreferences = () => {
    toast({
      title: "Préférences sauvegardées",
      description: "Vos paramètres ont été mis à jour avec succès.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6" data-testid="page-root">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Préférences</h1>
          <p className="text-gray-600">Personnalisez votre expérience EmotionsCare</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="experience">Expérience</TabsTrigger>
            <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibilité</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Paramètres Généraux
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Langue</Label>
                    <Select value={preferences.language} onValueChange={(value) => 
                      setPreferences(prev => ({ ...prev, language: value }))
                    }>
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

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Mode sombre</Label>
                      <p className="text-sm text-muted-foreground">Interface sombre pour les yeux</p>
                    </div>
                    <Switch 
                      checked={preferences.darkMode}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({ ...prev, darkMode: checked }))
                      }
                    />
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
                  Notifications & Rappels
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notifications push</Label>
                      <p className="text-sm text-muted-foreground">Recevoir des rappels</p>
                    </div>
                    <Switch 
                      checked={preferences.notifications}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({ ...prev, notifications: checked }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Fréquence des scans</Label>
                    <Select value={preferences.scanFrequency} onValueChange={(value) => 
                      setPreferences(prev => ({ ...prev, scanFrequency: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Toutes les heures</SelectItem>
                        <SelectItem value="daily">Quotidien</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Personnalisation de l'Expérience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Volume de la musique: {preferences.musicVolume[0]}%</Label>
                    <Slider
                      value={preferences.musicVolume}
                      onValueChange={(value) => 
                        setPreferences(prev => ({ ...prev, musicVolume: value }))
                      }
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Personnalité du Coach IA</Label>
                    <Select value={preferences.coachPersonality} onValueChange={(value) => 
                      setPreferences(prev => ({ ...prev, coachPersonality: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="empathetic">Empathique</SelectItem>
                        <SelectItem value="motivational">Motivant</SelectItem>
                        <SelectItem value="analytical">Analytique</SelectItem>
                        <SelectItem value="friendly">Amical</SelectItem>
                      </SelectContent>
                    </Select>
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
                  Confidentialité & Données
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Partage de données anonymes</Label>
                      <p className="text-sm text-muted-foreground">Aider à améliorer l'IA</p>
                    </div>
                    <Switch 
                      checked={preferences.dataSharing}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({ ...prev, dataSharing: checked }))
                      }
                    />
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">🔒 Vos données sont protégées</h4>
                    <p className="text-sm text-blue-700">
                      Toutes vos données sont chiffrées et stockées de manière sécurisée. 
                      Conformité RGPD garantie.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accessibility" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Accessibilité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">♿ Fonctionnalités d'accessibilité</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Navigation au clavier complète</li>
                      <li>• Support des lecteurs d'écran</li>
                      <li>• Contrastes élevés disponibles</li>
                      <li>• Tailles de police ajustables</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-8">
          <Button onClick={savePreferences} size="lg" className="px-8">
            Sauvegarder les préférences
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreferencesPage;
