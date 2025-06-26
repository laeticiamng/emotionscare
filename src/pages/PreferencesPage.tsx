
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  User, 
  Bell, 
  Palette, 
  Shield, 
  Music, 
  Brain,
  Moon,
  Sun,
  Volume2,
  Mail,
  Phone,
  Save,
  RefreshCw
} from 'lucide-react';

const PreferencesPage: React.FC = () => {
  const [preferences, setPreferences] = useState({
    // Profil
    displayName: 'Jean Dupont',
    email: 'jean.dupont@email.com',
    phone: '+33 6 12 34 56 78',
    bio: 'Passionné de bien-être et de développement personnel',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    weeklyReport: true,
    moodReminders: true,
    goalReminders: false,
    
    // Apparence
    theme: 'system',
    fontSize: 16,
    compactMode: false,
    animationsEnabled: true,
    
    // Audio
    musicVolume: 70,
    voiceVolume: 85,
    backgroundSounds: true,
    voiceType: 'female',
    
    // Bien-être
    moodReminderTime: '20:00',
    goalReminderTime: '09:00',
    sessionDuration: 15,
    difficultyLevel: 'intermediate',
    
    // Confidentialité
    dataSharing: false,
    analyticsTracking: true,
    profileVisibility: 'private'
  });

  const [hasChanges, setHasChanges] = useState(false);

  const updatePreference = (key: string, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const savePreferences = () => {
    // Simulate saving preferences
    setTimeout(() => {
      setHasChanges(false);
      // Show success message
    }, 1000);
  };

  const resetPreferences = () => {
    // Reset to defaults
    setHasChanges(true);
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-slate-100 rounded-full">
              <Settings className="h-8 w-8 text-slate-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Préférences</h1>
              <p className="text-gray-600">Personnalisez votre expérience EmotionsCare</p>
            </div>
          </div>

          {hasChanges && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-800">Vous avez des modifications non sauvegardées</span>
              </div>
              <div className="flex gap-2">
                <Button onClick={resetPreferences} variant="outline" size="sm">
                  Annuler
                </Button>
                <Button onClick={savePreferences} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Preferences Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Apparence</TabsTrigger>
            <TabsTrigger value="wellness">Bien-être</TabsTrigger>
            <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations personnelles
                </CardTitle>
                <CardDescription>
                  Gérez vos informations de profil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="displayName">Nom d'affichage</Label>
                    <Input
                      id="displayName"
                      value={preferences.displayName}
                      onChange={(e) => updatePreference('displayName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={preferences.email}
                        onChange={(e) => updatePreference('email', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={preferences.phone}
                      onChange={(e) => updatePreference('phone', e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Parlez-nous de vous..."
                    value={preferences.bio}
                    onChange={(e) => updatePreference('bio', e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Choisissez quand et comment recevoir vos notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications">Notifications par email</Label>
                      <p className="text-sm text-gray-600">Recevez des emails pour les mises à jour importantes</p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={preferences.emailNotifications}
                      onCheckedChange={(checked) => updatePreference('emailNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="pushNotifications">Notifications push</Label>
                      <p className="text-sm text-gray-600">Notifications en temps réel sur votre appareil</p>
                    </div>
                    <Switch
                      id="pushNotifications"
                      checked={preferences.pushNotifications}
                      onCheckedChange={(checked) => updatePreference('pushNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weeklyReport">Rapport hebdomadaire</Label>
                      <p className="text-sm text-gray-600">Résumé de votre bien-être chaque semaine</p>
                    </div>
                    <Switch
                      id="weeklyReport"
                      checked={preferences.weeklyReport}
                      onCheckedChange={(checked) => updatePreference('weeklyReport', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="moodReminders">Rappels d'humeur</Label>
                      <p className="text-sm text-gray-600">Rappel quotidien pour enregistrer votre humeur</p>
                    </div>
                    <Switch
                      id="moodReminders"
                      checked={preferences.moodReminders}
                      onCheckedChange={(checked) => updatePreference('moodReminders', checked)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="moodReminderTime">Heure du rappel d'humeur</Label>
                    <Input
                      id="moodReminderTime"
                      type="time"
                      value={preferences.moodReminderTime}
                      onChange={(e) => updatePreference('moodReminderTime', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="goalReminderTime">Heure du rappel d'objectifs</Label>
                    <Input
                      id="goalReminderTime"
                      type="time"
                      value={preferences.goalReminderTime}
                      onChange={(e) => updatePreference('goalReminderTime', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Apparence
                </CardTitle>
                <CardDescription>
                  Personnalisez l'apparence de l'interface
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="theme">Thème</Label>
                  <Select value={preferences.theme} onValueChange={(value) => updatePreference('theme', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un thème" />
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
                      <SelectItem value="system">
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          Système
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="fontSize">Taille de police</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm">A</span>
                    <Slider
                      value={[preferences.fontSize]}
                      onValueChange={(value) => updatePreference('fontSize', value[0])}
                      max={20}
                      min={12}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-lg">A</span>
                    <Badge variant="secondary">{preferences.fontSize}px</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="compactMode">Mode compact</Label>
                    <p className="text-sm text-gray-600">Interface plus dense avec moins d'espacement</p>
                  </div>
                  <Switch
                    id="compactMode"
                    checked={preferences.compactMode}
                    onCheckedChange={(checked) => updatePreference('compactMode', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="animationsEnabled">Animations</Label>
                    <p className="text-sm text-gray-600">Activer les animations et transitions</p>
                  </div>
                  <Switch
                    id="animationsEnabled"
                    checked={preferences.animationsEnabled}
                    onCheckedChange={(checked) => updatePreference('animationsEnabled', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wellness Tab */}
          <TabsContent value="wellness" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Paramètres de bien-être
                </CardTitle>
                <CardDescription>
                  Configurez vos préférences pour les sessions de bien-être
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="sessionDuration">Durée de session par défaut</Label>
                  <Select 
                    value={preferences.sessionDuration.toString()} 
                    onValueChange={(value) => updatePreference('sessionDuration', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="10">10 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="20">20 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="difficultyLevel">Niveau de difficulté</Label>
                  <Select 
                    value={preferences.difficultyLevel} 
                    onValueChange={(value) => updatePreference('difficultyLevel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Débutant</SelectItem>
                      <SelectItem value="intermediate">Intermédiaire</SelectItem>
                      <SelectItem value="advanced">Avancé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="musicVolume">Volume musique</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Music className="h-4 w-4 text-gray-400" />
                    <Slider
                      value={[preferences.musicVolume]}
                      onValueChange={(value) => updatePreference('musicVolume', value[0])}
                      max={100}
                      min={0}
                      step={5}
                      className="flex-1"
                    />
                    <Badge variant="secondary">{preferences.musicVolume}%</Badge>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="voiceVolume">Volume voix</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Volume2 className="h-4 w-4 text-gray-400" />
                    <Slider
                      value={[preferences.voiceVolume]}
                      onValueChange={(value) => updatePreference('voiceVolume', value[0])}
                      max={100}
                      min={0}
                      step={5}
                      className="flex-1"
                    />
                    <Badge variant="secondary">{preferences.voiceVolume}%</Badge>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="voiceType">Type de voix</Label>
                  <Select 
                    value={preferences.voiceType} 
                    onValueChange={(value) => updatePreference('voiceType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Féminine</SelectItem>
                      <SelectItem value="male">Masculine</SelectItem>
                      <SelectItem value="neutral">Neutre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Confidentialité et sécurité
                </CardTitle>
                <CardDescription>
                  Contrôlez vos données et votre confidentialité
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dataSharing">Partage de données</Label>
                    <p className="text-sm text-gray-600">Autoriser le partage de données anonymisées pour la recherche</p>
                  </div>
                  <Switch
                    id="dataSharing"
                    checked={preferences.dataSharing}
                    onCheckedChange={(checked) => updatePreference('dataSharing', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="analyticsTracking">Analyses d'utilisation</Label>
                    <p className="text-sm text-gray-600">Nous aider à améliorer l'application</p>
                  </div>
                  <Switch
                    id="analyticsTracking"
                    checked={preferences.analyticsTracking}
                    onCheckedChange={(checked) => updatePreference('analyticsTracking', checked)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="profileVisibility">Visibilité du profil</Label>
                  <Select 
                    value={preferences.profileVisibility} 
                    onValueChange={(value) => updatePreference('profileVisibility', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Privé</SelectItem>
                      <SelectItem value="team">Équipe seulement</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">Gestion des données</h4>
                  <p className="text-sm text-yellow-700 mb-3">
                    Vous avez le contrôle total sur vos données personnelles
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Exporter mes données
                    </Button>
                    <Button variant="outline" size="sm">
                      Supprimer mon compte
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end gap-2 mt-8">
          <Button onClick={resetPreferences} variant="outline">
            Réinitialiser
          </Button>
          <Button onClick={savePreferences} className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder les préférences
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreferencesPage;
