/**
 * Advanced Settings - Paramètres avancés de l'application
 * Interface complète de configuration utilisateur
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Globe, 
  Download, 
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Key,
  Settings,
  Moon,
  Sun,
  Monitor,
  Camera,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  bio: string;
  timezone: string;
  language: string;
  dateFormat: string;
}

interface PrivacySettings {
  dataSharing: boolean;
  analytics: boolean;
  marketing: boolean;
  profileVisibility: 'public' | 'private' | 'friends';
  activitySharing: boolean;
  locationTracking: boolean;
}

interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  animations: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  autoSave: boolean;
  offlineMode: boolean;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  loginNotifications: boolean;
  deviceManagement: boolean;
}

const AdvancedSettings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const [profile, setProfile] = useState<UserProfile>({
    name: user?.email?.split('@')[0] || '',
    email: user?.email || '',
    avatar: '',
    bio: '',
    timezone: 'Europe/Paris',
    language: 'fr',
    dateFormat: 'dd/MM/yyyy'
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    dataSharing: false,
    analytics: true,
    marketing: false,
    profileVisibility: 'private',
    activitySharing: false,
    locationTracking: false
  });

  const [appSettings, setAppSettings] = useState<AppSettings>({
    theme: 'system',
    animations: true,
    reducedMotion: false,
    highContrast: false,
    fontSize: 'medium',
    autoSave: true,
    offlineMode: false
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    loginNotifications: true,
    deviceManagement: true
  });

  const handleSave = async (section?: string) => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveMessage({
        type: 'success',
        message: section ? `${section} mis à jour avec succès` : 'Paramètres sauvegardés'
      });
    } catch (error) {
      setSaveMessage({
        type: 'error',
        message: 'Erreur lors de la sauvegarde. Veuillez réessayer.'
      });
    } finally {
      setIsSaving(false);
      // Effacer le message après 3 secondes
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const handleExportData = () => {
    // Simuler l'export des données
    const data = {
      profile,
      settings: { privacy, app: appSettings, security },
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emotionscare-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = () => {
    // Confirmation de suppression (à implémenter avec un dialog)
    if (window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      console.log('Suppression du compte...');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Paramètres avancés
        </h1>
        <p className="text-muted-foreground">
          Configurez votre expérience EmotionsCare selon vos préférences
        </p>
      </motion.div>

      {/* Message de sauvegarde */}
      {saveMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
        >
          <Alert className={saveMessage.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            {saveMessage.type === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={saveMessage.type === 'success' ? 'text-green-700' : 'text-red-700'}>
              {saveMessage.message}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Confidentialité
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Apparence
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Sécurité
          </TabsTrigger>
        </TabsList>

        {/* Onglet Profil */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Gérez vos informations de profil et préférences personnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar et nom */}
              <div className="flex items-center gap-6">
                <div className="space-y-2">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile.avatar} />
                    <AvatarFallback className="text-lg">
                      {profile.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" className="w-20">
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Votre nom"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Biographie</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Parlez-nous de vous..."
                      className="resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Préférences régionales */}
              <div className="space-y-4">
                <h4 className="font-medium">Préférences régionales</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Fuseau horaire</Label>
                    <Select value={profile.timezone} onValueChange={(value) => setProfile(prev => ({ ...prev, timezone: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Europe/Paris">Europe/Paris (UTC+1)</SelectItem>
                        <SelectItem value="America/New_York">America/New_York (UTC-5)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Asia/Tokyo (UTC+9)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="language">Langue</Label>
                    <Select value={profile.language} onValueChange={(value) => setProfile(prev => ({ ...prev, language: value }))}>
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
                    <Label htmlFor="dateFormat">Format de date</Label>
                    <Select value={profile.dateFormat} onValueChange={(value) => setProfile(prev => ({ ...prev, dateFormat: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave('Profil')} disabled={isSaving}>
                  {isSaving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Sauvegarder le profil
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Confidentialité */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de confidentialité</CardTitle>
              <CardDescription>
                Contrôlez comment vos données sont utilisées et partagées
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Partage de données anonymisées</div>
                    <div className="text-sm text-muted-foreground">
                      Autoriser l'utilisation de vos données pour améliorer nos services
                    </div>
                  </div>
                  <Switch
                    checked={privacy.dataSharing}
                    onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, dataSharing: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Analytics et métriques</div>
                    <div className="text-sm text-muted-foreground">
                      Collecter des données d'usage pour améliorer l'expérience
                    </div>
                  </div>
                  <Switch
                    checked={privacy.analytics}
                    onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, analytics: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Communications marketing</div>
                    <div className="text-sm text-muted-foreground">
                      Recevoir des informations sur nos nouveautés et offres
                    </div>
                  </div>
                  <Switch
                    checked={privacy.marketing}
                    onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, marketing: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Partage d'activité</div>
                    <div className="text-sm text-muted-foreground">
                      Permettre aux autres utilisateurs de voir votre activité
                    </div>
                  </div>
                  <Switch
                    checked={privacy.activitySharing}
                    onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, activitySharing: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Localisation</div>
                    <div className="text-sm text-muted-foreground">
                      Autoriser l'accès à votre localisation pour des recommandations personnalisées
                    </div>
                  </div>
                  <Switch
                    checked={privacy.locationTracking}
                    onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, locationTracking: checked }))}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Visibilité du profil</h4>
                <Select value={privacy.profileVisibility} onValueChange={(value: any) => setPrivacy(prev => ({ ...prev, profileVisibility: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public - Visible par tous</SelectItem>
                    <SelectItem value="friends">Amis - Visible par vos connexions</SelectItem>
                    <SelectItem value="private">Privé - Invisible aux autres</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Gestion des données</h4>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="h-4 w-4 mr-2" />
                    Exporter mes données
                  </Button>
                  <Button variant="outline" disabled>
                    <Upload className="h-4 w-4 mr-2" />
                    Importer des données
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer mon compte
                  </Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave('Confidentialité')} disabled={isSaving}>
                  {isSaving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Sauvegarder la confidentialité
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Apparence */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Apparence et accessibilité</CardTitle>
              <CardDescription>
                Personnalisez l'interface selon vos préférences visuelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Thème</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={appSettings.theme === 'light' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAppSettings(prev => ({ ...prev, theme: 'light' }))}
                      className="flex items-center gap-2"
                    >
                      <Sun className="h-4 w-4" />
                      Clair
                    </Button>
                    <Button
                      variant={appSettings.theme === 'dark' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAppSettings(prev => ({ ...prev, theme: 'dark' }))}
                      className="flex items-center gap-2"
                    >
                      <Moon className="h-4 w-4" />
                      Sombre
                    </Button>
                    <Button
                      variant={appSettings.theme === 'system' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAppSettings(prev => ({ ...prev, theme: 'system' }))}
                      className="flex items-center gap-2"
                    >
                      <Monitor className="h-4 w-4" />
                      Système
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Taille de police</Label>
                  <Select value={appSettings.fontSize} onValueChange={(value: any) => setAppSettings(prev => ({ ...prev, fontSize: value }))}>
                    <SelectTrigger className="w-48">
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
                  <div className="space-y-0.5">
                    <div className="font-medium">Animations</div>
                    <div className="text-sm text-muted-foreground">
                      Activer les animations et transitions
                    </div>
                  </div>
                  <Switch
                    checked={appSettings.animations}
                    onCheckedChange={(checked) => setAppSettings(prev => ({ ...prev, animations: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Mouvement réduit</div>
                    <div className="text-sm text-muted-foreground">
                      Réduire les mouvements pour l'accessibilité
                    </div>
                  </div>
                  <Switch
                    checked={appSettings.reducedMotion}
                    onCheckedChange={(checked) => setAppSettings(prev => ({ ...prev, reducedMotion: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Contraste élevé</div>
                    <div className="text-sm text-muted-foreground">
                      Améliorer le contraste pour une meilleure lisibilité
                    </div>
                  </div>
                  <Switch
                    checked={appSettings.highContrast}
                    onCheckedChange={(checked) => setAppSettings(prev => ({ ...prev, highContrast: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Sauvegarde automatique</div>
                    <div className="text-sm text-muted-foreground">
                      Sauvegarder automatiquement votre travail
                    </div>
                  </div>
                  <Switch
                    checked={appSettings.autoSave}
                    onCheckedChange={(checked) => setAppSettings(prev => ({ ...prev, autoSave: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Mode hors ligne</div>
                    <div className="text-sm text-muted-foreground">
                      Activer la synchronisation hors ligne
                    </div>
                  </div>
                  <Switch
                    checked={appSettings.offlineMode}
                    onCheckedChange={(checked) => setAppSettings(prev => ({ ...prev, offlineMode: checked }))}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave('Apparence')} disabled={isSaving}>
                  {isSaving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Sauvegarder l'apparence
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Sécurité */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de sécurité</CardTitle>
              <CardDescription>
                Protégez votre compte avec des mesures de sécurité avancées
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Authentification à deux facteurs</div>
                    <div className="text-sm text-muted-foreground">
                      Sécurisez votre compte avec un code de vérification
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={security.twoFactorEnabled}
                      onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, twoFactorEnabled: checked }))}
                    />
                    {security.twoFactorEnabled && (
                      <Badge variant="secondary" className="text-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Activé
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Timeout de session (minutes)</Label>
                  <Select value={security.sessionTimeout.toString()} onValueChange={(value) => setSecurity(prev => ({ ...prev, sessionTimeout: parseInt(value) }))}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 heure</SelectItem>
                      <SelectItem value="120">2 heures</SelectItem>
                      <SelectItem value="0">Jamais</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Notifications de connexion</div>
                    <div className="text-sm text-muted-foreground">
                      Recevoir un email lors de nouvelles connexions
                    </div>
                  </div>
                  <Switch
                    checked={security.loginNotifications}
                    onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, loginNotifications: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Gestion des appareils</div>
                    <div className="text-sm text-muted-foreground">
                      Voir et gérer les appareils connectés
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Voir les appareils
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Actions de sécurité</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Key className="h-4 w-4 mr-2" />
                    Changer le mot de passe
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Révoquer toutes les sessions
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger les données de sécurité
                  </Button>
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Pour votre sécurité, nous recommandons d'activer l'authentification à deux facteurs 
                  et de ne jamais partager vos identifiants de connexion.
                </AlertDescription>
              </Alert>

              <div className="flex justify-end">
                <Button onClick={() => handleSave('Sécurité')} disabled={isSaving}>
                  {isSaving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Sauvegarder la sécurité
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedSettings;