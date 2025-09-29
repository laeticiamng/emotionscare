import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  User, Mail, Phone, MapPin, Calendar, Camera, Shield, 
  Settings, Bell, Lock, Eye, Download, Trash2, 
  Star, Award, TrendingUp, Activity, Heart
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAccessibility } from '@/hooks/useAccessibility';
import PageRoot from '@/components/common/PageRoot';

const B2CProfileSettingsPage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'privacy' | 'stats'>('profile');
  
  const [profile, setProfile] = useState({
    firstName: 'Marie',
    lastName: 'Dubois',
    email: 'marie.dubois@email.com',
    phone: '+33 6 12 34 56 78',
    bio: 'Passionnée de bien-être et de développement personnel. J\'utilise EmotionsCare pour maintenir un équilibre émotionnel au quotidien.',
    location: 'Paris, France',
    birthDate: '1985-03-15',
    avatar: '',
    timezone: 'Europe/Paris',
    language: 'fr'
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisible: true,
    shareStats: false,
    emailNotifications: true,
    pushNotifications: true,
    analyticsOptIn: true
  });

  const [stats] = useState({
    totalSessions: 147,
    streakDays: 12,
    emotionalScore: 8.4,
    wellbeingLevel: 85,
    achievements: 23,
    hoursUsed: 87
  });

  const { announce } = useAccessibility();

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    
    try {
      // Simulation d'API avec validation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsEditing(false);
      announce('Profil mis à jour avec succès');
      
      toast({
        title: "✅ Profil mis à jour",
        description: "Vos modifications ont été enregistrées avec succès"
      });
    } catch (error) {
      toast({
        title: "❌ Erreur",
        description: "Impossible de sauvegarder les modifications",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  }, [announce]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    announce('Modifications annulées');
  }, [announce]);

  const handlePrivacyChange = useCallback((key: keyof typeof privacySettings, value: boolean) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }));
    announce(`Paramètre ${key} ${value ? 'activé' : 'désactivé'}`);
  }, [announce]);

  const exportData = useCallback(async () => {
    // Simulation export données
    announce('Export des données en cours...');
    toast({
      title: "📥 Export en cours",
      description: "Vos données sont en cours de préparation"
    });
    
    setTimeout(() => {
      toast({
        title: "✅ Export terminé",
        description: "Vos données ont été téléchargées"
      });
    }, 3000);
  }, [announce]);

  const deleteAccount = useCallback(() => {
    toast({
      title: "⚠️ Suppression de compte", 
      description: "Cette action est irréversible. Contactez le support pour procéder.",
      variant: "destructive"
    });
  }, []);

  const getCompletionPercentage = () => {
    const fields = [profile.firstName, profile.lastName, profile.email, profile.phone, profile.bio, profile.location];
    const completed = fields.filter(field => field && field.trim()).length;
    return Math.round((completed / fields.length) * 100);
  };

  const membershipMonths = Math.floor((Date.now() - new Date('2024-03-01').getTime()) / (1000 * 60 * 60 * 24 * 30));

  return (
    <PageRoot>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Enhanced Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="relative">
                <User className="h-12 w-12 text-primary" />
                <div className="absolute -inset-2 rounded-full bg-primary/20 animate-pulse" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Mon Profil
                </h1>
                <p className="text-lg text-muted-foreground mt-2">
                  Gérez vos informations et préférences
                </p>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="max-w-md mx-auto mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Profil complété</span>
                <span className="text-sm font-medium">{getCompletionPercentage()}%</span>
              </div>
              <Progress value={getCompletionPercentage()} className="h-2" />
            </div>

            {/* Navigation Tabs */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex rounded-lg bg-muted p-1">
                {[
                  { id: 'profile', label: 'Profil', icon: User },
                  { id: 'security', label: 'Sécurité', icon: Shield },
                  { id: 'privacy', label: 'Confidentialité', icon: Eye },
                  { id: 'stats', label: 'Statistiques', icon: TrendingUp }
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? "default" : "ghost"}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className="flex items-center gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Avatar Section */}
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle>Photo de Profil</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <div>
                    <Avatar className="w-32 h-32 mx-auto mb-4 ring-4 ring-primary/20">
                      <AvatarImage src={profile.avatar} />
                      <AvatarFallback className="text-3xl bg-gradient-to-br from-primary to-secondary text-white">
                        {profile.firstName[0]}{profile.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <Button variant="outline" size="sm" className="mb-6">
                      <Camera className="h-4 w-4 mr-2" />
                      Changer la photo
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold">
                        {profile.firstName} {profile.lastName}
                      </h3>
                      <Badge variant="secondary" className="mt-2">Utilisateur B2C</Badge>
                    </div>

                    <Separator />

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Membre depuis {membershipMonths} mois
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Activity className="h-4 w-4" />
                        {stats.totalSessions} sessions complétées
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Heart className="h-4 w-4" />
                        Score bien-être: {stats.wellbeingLevel}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Information */}
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Informations Personnelles</CardTitle>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} className="shrink-0">
                      <Settings className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                  ) : (
                    <div className="flex gap-2 shrink-0">
                      <Button 
                        variant="outline" 
                        onClick={handleCancel}
                        disabled={isSaving}
                      >
                        Annuler
                      </Button>
                      <Button 
                        onClick={handleSave}
                        disabled={isSaving}
                      >
                        {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Prénom
                      </Label>
                      <Input
                        id="firstName"
                        value={profile.firstName}
                        disabled={!isEditing}
                        onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                        className={isEditing ? 'focus:ring-2 focus:ring-primary' : ''}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom de famille</Label>
                      <Input
                        id="lastName"
                        value={profile.lastName}
                        disabled={!isEditing}
                        onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                        className={isEditing ? 'focus:ring-2 focus:ring-primary' : ''}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Adresse email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        disabled={!isEditing}
                        onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                        className={isEditing ? 'focus:ring-2 focus:ring-primary' : ''}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Téléphone
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profile.phone}
                        disabled={!isEditing}
                        onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                        className={isEditing ? 'focus:ring-2 focus:ring-primary' : ''}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Localisation
                      </Label>
                      <Input
                        id="location"
                        value={profile.location}
                        disabled={!isEditing}
                        onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                        className={isEditing ? 'focus:ring-2 focus:ring-primary' : ''}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="birthDate" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Date de naissance
                      </Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={profile.birthDate}
                        disabled={!isEditing}
                        onChange={(e) => setProfile(prev => ({ ...prev, birthDate: e.target.value }))}
                        className={isEditing ? 'focus:ring-2 focus:ring-primary' : ''}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">À propos de moi</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      disabled={!isEditing}
                      onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Parlez-nous de vous, vos objectifs et votre parcours..."
                      rows={4}
                      className={isEditing ? 'focus:ring-2 focus:ring-primary' : ''}
                    />
                    <p className="text-xs text-muted-foreground">
                      {profile.bio.length}/500 caractères
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-primary" />
                    Sécurité de votre compte
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Protégez votre compte avec des mesures de sécurité avancées
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    {
                      title: 'Mot de passe',
                      description: 'Dernière modification : il y a 2 mois',
                      status: 'Fort',
                      statusColor: 'text-green-600',
                      action: 'Modifier',
                      icon: Lock
                    },
                    {
                      title: 'Authentification à deux facteurs (2FA)',
                      description: 'Sécurisez votre compte avec une vérification supplémentaire',
                      status: 'Non configuré',
                      statusColor: 'text-orange-600',
                      action: 'Configurer',
                      icon: Shield,
                      recommended: true
                    },
                    {
                      title: 'Sessions actives',
                      description: 'Gérez les appareils connectés à votre compte',
                      status: '3 appareils',
                      statusColor: 'text-blue-600',
                      action: 'Voir détails',
                      icon: Activity
                    }
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="flex items-center justify-between p-6 border rounded-xl hover:bg-muted/50 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{item.title}</h4>
                              {item.recommended && (
                                <Badge variant="secondary" className="bg-orange-500/10 text-orange-600">
                                  Recommandé
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.description}
                            </p>
                            <p className={`text-sm font-medium mt-2 ${item.statusColor}`}>
                              {item.status}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline">
                          {item.action}
                        </Button>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-6 w-6 text-primary" />
                    Paramètres de confidentialité
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Contrôlez qui peut voir vos informations et comment nous utilisons vos données
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    {
                      title: 'Profil public',
                      description: 'Permet aux autres utilisateurs de voir votre profil',
                      key: 'profileVisible' as keyof typeof privacySettings
                    },
                    {
                      title: 'Partage des statistiques',
                      description: 'Permet le partage anonymisé de vos données pour la recherche',
                      key: 'shareStats' as keyof typeof privacySettings
                    },
                    {
                      title: 'Notifications email',
                      description: 'Recevez des notifications par email',
                      key: 'emailNotifications' as keyof typeof privacySettings
                    },
                    {
                      title: 'Notifications push',
                      description: 'Recevez des notifications sur vos appareils',
                      key: 'pushNotifications' as keyof typeof privacySettings
                    },
                    {
                      title: 'Analytiques et amélioration',
                      description: 'Aide à améliorer l\'application en partageant des données d\'usage',
                      key: 'analyticsOptIn' as keyof typeof privacySettings
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.description}
                        </p>
                      </div>
                      <Switch
                        checked={privacySettings[item.key]}
                        onCheckedChange={(value) => handlePrivacyChange(item.key, value)}
                        aria-label={item.title}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Data Management */}
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des données (RGPD)</CardTitle>
                  <p className="text-muted-foreground">
                    Exercez vos droits sur vos données personnelles
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Exporter mes données</h4>
                      <p className="text-sm text-muted-foreground">
                        Téléchargez toutes vos données dans un format portable
                      </p>
                    </div>
                    <Button variant="outline" onClick={exportData}>
                      <Download className="h-4 w-4 mr-2" />
                      Exporter
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50/50 dark:bg-red-950/20">
                    <div>
                      <h4 className="font-medium text-red-700 dark:text-red-400">Supprimer mon compte</h4>
                      <p className="text-sm text-red-600 dark:text-red-300">
                        Cette action est irréversible et supprimera toutes vos données
                      </p>
                    </div>
                    <Button variant="destructive" onClick={deleteAccount}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Statistics Tab */}
          {activeTab === 'stats' && (
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[
                  {
                    title: 'Sessions totales',
                    value: stats.totalSessions,
                    icon: Activity,
                    color: 'text-blue-500',
                    change: '+12 cette semaine'
                  },
                  {
                    title: 'Série actuelle',
                    value: `${stats.streakDays} jours`,
                    icon: Award,
                    color: 'text-green-500',
                    change: 'Record personnel !'
                  },
                  {
                    title: 'Score émotionnel',
                    value: `${stats.emotionalScore}/10`,
                    icon: Heart,
                    color: 'text-red-500',
                    change: '+0.3 ce mois'
                  },
                  {
                    title: 'Niveau bien-être',
                    value: `${stats.wellbeingLevel}%`,
                    icon: TrendingUp,
                    color: 'text-purple-500',
                    change: '+5% ce mois'
                  },
                  {
                    title: 'Achievements',
                    value: stats.achievements,
                    icon: Star,
                    color: 'text-yellow-500',
                    change: '3 nouveaux'
                  },
                  {
                    title: 'Heures d\'usage',
                    value: `${stats.hoursUsed}h`,
                    icon: Activity,
                    color: 'text-indigo-500',
                    change: '+8h cette semaine'
                  }
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                            <p className="text-xs text-green-600 mt-1">{stat.change}</p>
                          </div>
                          <Icon className={`h-8 w-8 ${stat.color}`} />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Évolution mensuelle</CardTitle>
                  <p className="text-muted-foreground">
                    Votre progression sur les 6 derniers mois
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Graphique de progression détaillé</p>
                      <p className="text-sm">Disponible prochainement</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </PageRoot>
  );
};

export default B2CProfileSettingsPage;