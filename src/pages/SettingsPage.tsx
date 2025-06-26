
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Download,
  Upload,
  Smartphone,
  Mail,
  Lock,
  Key,
  Database,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Moon,
  Sun,
  Monitor,
  Volume2,
  Eye,
  EyeOff,
  Save,
  RefreshCw
} from 'lucide-react';
import UserSettings from '@/components/settings/UserSettings';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    // Profil
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    phone: '+33 6 12 34 56 78',
    bio: 'Passionné par le bien-être et la technologie',
    avatar: '',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    weeklyReport: true,
    moodReminders: true,
    teamUpdates: true,
    
    // Thème
    theme: 'system',
    language: 'fr',
    timezone: 'Europe/Paris',
    
    // Confidentialité
    profileVisibility: 'team',
    dataSharing: false,
    analyticsOptIn: true,
    
    // Audio
    soundEffects: true,
    voiceGuidance: true,
    musicVolume: 75,
    
    // Sécurité
    twoFactorAuth: false,
    sessionTimeout: 30,
    loginAlerts: true
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    // Simulation de sauvegarde
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleExportData = () => {
    // Logique d'export des données
    console.log('Export des données utilisateur');
  };

  const handleDeleteAccount = () => {
    // Logique de suppression de compte
    console.log('Suppression du compte');
  };

  return (
    <div className="container mx-auto py-6 space-y-6" data-testid="page-root">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <Settings className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Paramètres</h1>
            <p className="text-muted-foreground">Personnalisez votre expérience EmotionsCare</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={isLoading} className="bg-gradient-to-r from-blue-500 to-purple-500">
          {isLoading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Sauvegarder
        </Button>
      </motion.div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Apparence</TabsTrigger>
          <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="advanced">Avancé</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Informations Personnelles</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={settings.avatar} />
                  <AvatarFallback className="text-lg">
                    {settings.firstName[0]}{settings.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Changer la photo
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    JPG, PNG ou GIF. Taille max: 2MB
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    value={settings.firstName}
                    onChange={(e) => setSettings({...settings, firstName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={settings.lastName}
                    onChange={(e) => setSettings({...settings, lastName: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex space-x-2">
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({...settings, email: e.target.value})}
                    className="flex-1"
                  />
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Vérifié
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => setSettings({...settings, phone: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Parlez-nous de vous..."
                  value={settings.bio}
                  onChange={(e) => setSettings({...settings, bio: e.target.value})}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Préférences Régionales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Langue</Label>
                  <Select value={settings.language} onValueChange={(value) => setSettings({...settings, language: value})}>
                    <SelectTrigger>
                      <Globe className="h-4 w-4 mr-2" />
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
                  <Label>Fuseau Horaire</Label>
                  <Select value={settings.timezone} onValueChange={(value) => setSettings({...settings, timezone: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Paris">Europe/Paris (GMT+1)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (GMT+0)</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (GMT-5)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Asia/Tokyo (GMT+9)</SelectItem>
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
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Préférences de Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Notifications Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevez des mises à jour par email
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Notifications Push</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications sur votre appareil
                    </p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => setSettings({...settings, pushNotifications: checked})}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Notifications SMS</Label>
                    <p className="text-sm text-muted-foreground">
                      Alertes importantes par SMS
                    </p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => setSettings({...settings, smsNotifications: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Types de Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Rapport Hebdomadaire</Label>
                  <p className="text-sm text-muted-foreground">
                    Résumé de votre bien-être chaque semaine
                  </p>
                </div>
                <Switch
                  checked={settings.weeklyReport}
                  onCheckedChange={(checked) => setSettings({...settings, weeklyReport: checked})}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Rappels d'Humeur</Label>
                  <p className="text-sm text-muted-foreground">
                    Rappels pour enregistrer votre humeur
                  </p>
                </div>
                <Switch
                  checked={settings.moodReminders}
                  onCheckedChange={(checked) => setSettings({...settings, moodReminders: checked})}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Mises à Jour d'Équipe</Label>
                  <p className="text-sm text-muted-foreground">
                    Nouvelles de votre équipe (B2B uniquement)
                  </p>
                </div>
                <Switch
                  checked={settings.teamUpdates}
                  onCheckedChange={(checked) => setSettings({...settings, teamUpdates: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Thème et Apparence</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Thème</Label>
                <div className="grid grid-cols-3 gap-3">
                  <Card 
                    className={`p-4 cursor-pointer border-2 transition-colors ${
                      settings.theme === 'light' ? 'border-primary' : 'border-muted'
                    }`}
                    onClick={() => setSettings({...settings, theme: 'light'})}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Sun className="h-6 w-6" />
                      <span className="text-sm font-medium">Clair</span>
                    </div>
                  </Card>
                  <Card 
                    className={`p-4 cursor-pointer border-2 transition-colors ${
                      settings.theme === 'dark' ? 'border-primary' : 'border-muted'
                    }`}
                    onClick={() => setSettings({...settings, theme: 'dark'})}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Moon className="h-6 w-6" />
                      <span className="text-sm font-medium">Sombre</span>
                    </div>
                  </Card>
                  <Card 
                    className={`p-4 cursor-pointer border-2 transition-colors ${
                      settings.theme === 'system' ? 'border-primary' : 'border-muted'
                    }`}
                    onClick={() => setSettings({...settings, theme: 'system'})}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Monitor className="h-6 w-6" />
                      <span className="text-sm font-medium">Système</span>
                    </div>
                  </Card>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Volume Audio</Label>
                <div className="flex items-center space-x-4">
                  <Volume2 className="h-4 w-4" />
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.musicVolume}
                      onChange={(e) => setSettings({...settings, musicVolume: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  </div>
                  <span className="text-sm font-medium w-12">{settings.musicVolume}%</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Effets Sonores</Label>
                    <p className="text-sm text-muted-foreground">
                      Sons de l'interface utilisateur
                    </p>
                  </div>
                  <Switch
                    checked={settings.soundEffects}
                    onCheckedChange={(checked) => setSettings({...settings, soundEffects: checked})}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Guidage Vocal</Label>
                    <p className="text-sm text-muted-foreground">
                      Instructions vocales pour les exercices
                    </p>
                  </div>
                  <Switch
                    checked={settings.voiceGuidance}
                    onCheckedChange={(checked) => setSettings({...settings, voiceGuidance: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Confidentialité et Données</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Visibilité du Profil</Label>
                  <Select 
                    value={settings.profileVisibility} 
                    onValueChange={(value) => setSettings({...settings, profileVisibility: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Visible par tous</SelectItem>
                      <SelectItem value="team">Équipe - Visible par votre équipe</SelectItem>
                      <SelectItem value="private">Privé - Visible par vous seul</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Partage de Données</Label>
                    <p className="text-sm text-muted-foreground">
                      Autoriser le partage anonyme pour la recherche
                    </p>
                  </div>
                  <Switch
                    checked={settings.dataSharing}
                    onCheckedChange={(checked) => setSettings({...settings, dataSharing: checked})}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Analytics</Label>
                    <p className="text-sm text-muted-foreground">
                      Nous aider à améliorer l'application
                    </p>
                  </div>
                  <Switch
                    checked={settings.analyticsOptIn}
                    onCheckedChange={(checked) => setSettings({...settings, analyticsOptIn: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gestion des Données</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Exporter mes Données</h4>
                  <p className="text-sm text-muted-foreground">
                    Télécharger toutes vos données personnelles
                  </p>
                </div>
                <Button variant="outline" onClick={handleExportData}>
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                <div className="space-y-1">
                  <h4 className="font-medium text-red-800">Supprimer mon Compte</h4>
                  <p className="text-sm text-red-600">
                    Cette action est irréversible
                  </p>
                </div>
                <Button variant="destructive" onClick={handleDeleteAccount}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>Sécurité du Compte</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Changer le Mot de Passe</Label>
                  <div className="space-y-3">
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mot de passe actuel"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <Input type="password" placeholder="Nouveau mot de passe" />
                    <Input type="password" placeholder="Confirmer le nouveau mot de passe" />
                    <Button className="w-full">
                      <Key className="h-4 w-4 mr-2" />
                      Changer le Mot de Passe
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Authentification à Deux Facteurs (2FA)</Label>
                    <p className="text-sm text-muted-foreground">
                      Sécurité renforcée pour votre compte
                    </p>
                  </div>
                  <Switch
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => setSettings({...settings, twoFactorAuth: checked})}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Délai d'Expiration de Session</Label>
                  <Select 
                    value={settings.sessionTimeout.toString()} 
                    onValueChange={(value) => setSettings({...settings, sessionTimeout: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 heure</SelectItem>
                      <SelectItem value="240">4 heures</SelectItem>
                      <SelectItem value="0">Jamais</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Alertes de Connexion</Label>
                    <p className="text-sm text-muted-foreground">
                      Être notifié des nouvelles connexions
                    </p>
                  </div>
                  <Switch
                    checked={settings.loginAlerts}
                    onCheckedChange={(checked) => setSettings({...settings, loginAlerts: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sessions Actives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Appareil Actuel</p>
                      <p className="text-sm text-muted-foreground">Chrome sur Windows • Maintenant</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Actif
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">iPhone</p>
                      <p className="text-sm text-muted-foreground">Safari • Il y a 2 heures</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Déconnecter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Paramètres Avancés</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Attention</h4>
                    <p className="text-sm text-yellow-700">
                      Ces paramètres sont destinés aux utilisateurs avancés. 
                      Modifier ces options peut affecter le fonctionnement de l'application.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Mode Debug</Label>
                    <p className="text-sm text-muted-foreground">
                      Afficher les informations de débogage
                    </p>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Cache Automatique</Label>
                    <p className="text-sm text-muted-foreground">
                      Mise en cache des données pour de meilleures performances
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Serveur API</Label>
                  <Input placeholder="https://api.emotionscare.com" disabled />
                  <p className="text-xs text-muted-foreground">
                    Contactez le support pour modifier cette valeur
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions Système</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Vider le Cache</h4>
                  <p className="text-sm text-muted-foreground">
                    Supprime les données temporaires
                  </p>
                </div>
                <Button variant="outline">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Vider
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Synchroniser les Données</h4>
                  <p className="text-sm text-muted-foreground">
                    Force la synchronisation avec le serveur
                  </p>
                </div>
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Synchroniser
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
