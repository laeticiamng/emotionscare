
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Camera, 
  Save,
  Award,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { userMode } = useUserMode();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Utilisateur',
    email: user?.email || '',
    bio: 'Passionné(e) par le bien-être et l\'amélioration personnelle.',
    location: 'Paris, France',
    joinDate: 'Janvier 2024'
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    dataSharing: false,
    publicProfile: true,
    language: 'fr',
    theme: 'system'
  });

  const [privacySettings, setPrivacySettings] = useState({
    showEmotionalScore: true,
    showActivityHistory: false,
    allowAnalytics: true,
    shareWithCommunity: true
  });

  const handleSaveProfile = () => {
    // Simulate save operation
    toast.success("Profil mis à jour avec succès!");
  };

  const handleSavePreferences = () => {
    // Simulate save operation
    toast.success("Préférences sauvegardées!");
  };

  const handleSavePrivacy = () => {
    // Simulate save operation
    toast.success("Paramètres de confidentialité mis à jour!");
  };

  const achievements = [
    { title: 'Premier Scanner', description: 'Première analyse émotionnelle', date: '15 Jan 2024', icon: '🎯' },
    { title: 'Contributeur', description: '10 publications dans la communauté', date: '22 Jan 2024', icon: '💬' },
    { title: 'Régularité', description: '7 jours consécutifs d\'utilisation', date: '29 Jan 2024', icon: '⭐' },
    { title: 'Mentor', description: 'Aide apportée à 5 membres', date: '05 Fév 2024', icon: '🏆' }
  ];

  const statistics = [
    { label: 'Analyses effectuées', value: '47', trend: '+12' },
    { label: 'Score moyen', value: '78%', trend: '+5%' },
    { label: 'Jours actifs', value: '23', trend: '+8' },
    { label: 'Contributions communauté', value: '15', trend: '+3' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mon Profil</h1>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles et préférences
          </p>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          {userMode === 'b2c' ? 'Particulier' : 
           userMode === 'b2b_user' ? 'Collaborateur' : 'Administrateur'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Overview */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
                  {profileData.name.charAt(0).toUpperCase()}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <h3 className="text-xl font-semibold">{profileData.name}</h3>
              <p className="text-sm text-muted-foreground">{profileData.email}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Membre depuis {profileData.joinDate}
              </p>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Statistiques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {statistics.map((stat, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                  <div className="text-right">
                    <span className="font-semibold">{stat.value}</span>
                    <span className="text-xs text-green-600 ml-1">{stat.trend}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="preferences">Préférences</TabsTrigger>
              <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
              <TabsTrigger value="achievements">Réalisations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Informations Personnelles
                  </CardTitle>
                  <CardDescription>
                    Modifiez vos informations de profil
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nom complet</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="location">Localisation</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      className="min-h-20"
                    />
                  </div>
                  <Button onClick={handleSaveProfile}>
                    <Save className="mr-2 h-4 w-4" />
                    Sauvegarder
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="mr-2 h-5 w-5" />
                    Préférences de l'Application
                  </CardTitle>
                  <CardDescription>
                    Personnalisez votre expérience utilisateur
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="language">Langue</Label>
                      <Select value={preferences.language} onValueChange={(value) => 
                        setPreferences({...preferences, language: value})}>
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
                    <div>
                      <Label htmlFor="theme">Thème</Label>
                      <Select value={preferences.theme} onValueChange={(value) => 
                        setPreferences({...preferences, theme: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="system">Système</SelectItem>
                          <SelectItem value="light">Clair</SelectItem>
                          <SelectItem value="dark">Sombre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Notifications</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email-notif">Notifications par email</Label>
                          <p className="text-sm text-muted-foreground">Recevez des mises à jour par email</p>
                        </div>
                        <Switch
                          id="email-notif"
                          checked={preferences.emailNotifications}
                          onCheckedChange={(checked) => 
                            setPreferences({...preferences, emailNotifications: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="push-notif">Notifications push</Label>
                          <p className="text-sm text-muted-foreground">Notifications en temps réel</p>
                        </div>
                        <Switch
                          id="push-notif"
                          checked={preferences.pushNotifications}
                          onCheckedChange={(checked) => 
                            setPreferences({...preferences, pushNotifications: checked})}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button onClick={handleSavePreferences}>
                    <Save className="mr-2 h-4 w-4" />
                    Sauvegarder les préférences
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Paramètres de Confidentialité
                  </CardTitle>
                  <CardDescription>
                    Contrôlez la visibilité de vos données
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="show-score">Afficher le score émotionnel</Label>
                        <p className="text-sm text-muted-foreground">Visible dans votre profil public</p>
                      </div>
                      <Switch
                        id="show-score"
                        checked={privacySettings.showEmotionalScore}
                        onCheckedChange={(checked) => 
                          setPrivacySettings({...privacySettings, showEmotionalScore: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="show-history">Partager l'historique d'activité</Label>
                        <p className="text-sm text-muted-foreground">Visible par les autres membres</p>
                      </div>
                      <Switch
                        id="show-history"
                        checked={privacySettings.showActivityHistory}
                        onCheckedChange={(checked) => 
                          setPrivacySettings({...privacySettings, showActivityHistory: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="analytics">Autoriser les analyses</Label>
                        <p className="text-sm text-muted-foreground">Aide à améliorer l'application</p>
                      </div>
                      <Switch
                        id="analytics"
                        checked={privacySettings.allowAnalytics}
                        onCheckedChange={(checked) => 
                          setPrivacySettings({...privacySettings, allowAnalytics: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="community-share">Partage avec la communauté</Label>
                        <p className="text-sm text-muted-foreground">Permet l'interaction avec les autres</p>
                      </div>
                      <Switch
                        id="community-share"
                        checked={privacySettings.shareWithCommunity}
                        onCheckedChange={(checked) => 
                          setPrivacySettings({...privacySettings, shareWithCommunity: checked})}
                      />
                    </div>
                  </div>
                  
                  <Button onClick={handleSavePrivacy}>
                    <Save className="mr-2 h-4 w-4" />
                    Sauvegarder la confidentialité
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="achievements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="mr-2 h-5 w-5" />
                    Badges et Réalisations
                  </CardTitle>
                  <CardDescription>
                    Vos accomplissements sur la plateforme
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <h4 className="font-medium">{achievement.title}</h4>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Obtenu le {achievement.date}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
