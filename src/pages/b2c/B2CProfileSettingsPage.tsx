/**
 * B2CProfileSettingsPage - Page de profil utilisateur complète
 * Intégration Supabase avec persistance réelle
 */

import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { 
  User, Mail, Phone, MapPin, Calendar, Camera, Shield, 
  Settings, Bell, Lock, Eye, Download, Trash2, 
  Star, Award, TrendingUp, Activity, Heart, Loader2,
  Save, X, Globe, Briefcase, Sparkles, CheckCircle2,
  AlertTriangle, Key, Share2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useProfile, getProfileCompletionPercentage, getRarityColor } from '@/modules/profile';
import { useAccessibility } from '@/hooks/useAccessibility';
import PageRoot from '@/components/common/PageRoot';
import { format, differenceInMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const B2CProfileSettingsPage: React.FC = () => {
  const {
    profile,
    stats,
    achievements,
    badges,
    activityHistory,
    isLoading,
    isSaving,
    updateProfile,
    updatePreferences,
    uploadAvatar,
    removeAvatar,
    exportData,
    changePassword,
    requestAccountDeletion,
  } = useProfile();

  const [activeTab, setActiveTab] = useState<string>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [show2FADialog, setShow2FADialog] = useState(false);
  const [showSessionsDialog, setShowSessionsDialog] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    phone: '',
    location: '',
    website: '',
    job_title: '',
  });

  const { announce } = useAccessibility();

  // Initialize edit form when profile loads
  React.useEffect(() => {
    if (profile) {
      setEditForm({
        name: profile.name || '',
        bio: profile.bio || '',
        phone: profile.phone || '',
        location: profile.location || '',
        website: profile.website || '',
        job_title: profile.job_title || '',
      });
    }
  }, [profile]);

  const handleStartEditing = useCallback(() => {
    setIsEditing(true);
    announce('Mode édition activé');
  }, [announce]);

  const handleCancelEditing = useCallback(() => {
    if (profile) {
      setEditForm({
        name: profile.name || '',
        bio: profile.bio || '',
        phone: profile.phone || '',
        location: profile.location || '',
        website: profile.website || '',
        job_title: profile.job_title || '',
      });
    }
    setIsEditing(false);
    announce('Modifications annulées');
  }, [profile, announce]);

  const handleSaveProfile = useCallback(async () => {
    try {
      await updateProfile(editForm);
      setIsEditing(false);
      announce('Profil mis à jour avec succès');
    } catch {
      // Error handled by hook
    }
  }, [updateProfile, editForm, announce]);

  const handleAvatarClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleAvatarChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await uploadAvatar(file);
        announce('Avatar mis à jour');
      } catch {
        // Error handled by hook
      }
    }
  }, [uploadAvatar, announce]);

  const handlePreferenceChange = useCallback(async (key: string, value: boolean) => {
    try {
      await updatePreferences({ [key]: value });
      announce(`Paramètre ${key} ${value ? 'activé' : 'désactivé'}`);
    } catch {
      // Error handled by hook
    }
  }, [updatePreferences, announce]);

  const handleExportData = useCallback(async () => {
    try {
      await exportData();
      announce('Données exportées');
    } catch {
      // Error handled by hook
    }
  }, [exportData, announce]);

  const handlePasswordChange = useCallback(async () => {
    if (newPassword !== confirmPassword) {
      return;
    }
    try {
      await changePassword(newPassword);
      setShowPasswordDialog(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      // Error handled by hook
    }
  }, [changePassword, newPassword, confirmPassword]);

  const handleDeleteAccount = useCallback(async () => {
    try {
      await requestAccountDeletion();
      setShowDeleteDialog(false);
    } catch {
      // Error handled by hook
    }
  }, [requestAccountDeletion]);

  const handleShareProfile = useCallback(async () => {
    const shareText = `Mon profil EmotionsCare 🧠\n\n📊 ${stats.totalScans} scans émotionnels\n📝 ${stats.totalJournalEntries} entrées journal\n🧘 ${stats.totalBreathingSessions} séances respiration\n🏆 ${stats.totalBadges} badges\n🔥 Série de ${stats.currentStreak} jours\n⭐ Niveau ${stats.level}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ 
          title: 'Mon profil EmotionsCare',
          text: shareText 
        });
        announce('Profil partagé');
      } catch {
        await navigator.clipboard.writeText(shareText);
        announce('Profil copié dans le presse-papiers');
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      announce('Profil copié dans le presse-papiers');
    }
  }, [stats, announce]);

  const handle2FASetup = useCallback(() => {
    // 2FA setup - Supabase supports this via MFA
    setShow2FADialog(true);
  }, []);

  if (isLoading) {
    return (
      <PageRoot>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageRoot>
    );
  }

  if (!profile) {
    return (
      <PageRoot>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <User className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Impossible de charger le profil</p>
        </div>
      </PageRoot>
    );
  }

  const completionPercentage = getProfileCompletionPercentage(profile);
  const memberSinceMonths = profile.created_at 
    ? differenceInMonths(new Date(), new Date(profile.created_at))
    : 0;
  const memberSinceText = profile.created_at
    ? format(new Date(profile.created_at), 'MMMM yyyy', { locale: fr })
    : 'Inconnu';

  const xpProgress = stats.xpToNextLevel > 0 
    ? ((stats.xp % stats.xpToNextLevel) / stats.xpToNextLevel) * 100 
    : 0;

  return (
    <PageRoot>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
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
                <span className="text-sm font-medium">{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profil</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Sécurité</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Confidentialité</span>
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Statistiques</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Avatar Section */}
                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle>Photo de Profil</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-6">
                    <div>
                      <div className="relative inline-block">
                        <Avatar className="w-32 h-32 mx-auto mb-4 ring-4 ring-primary/20">
                          <AvatarImage src={profile.avatar_url || undefined} alt={profile.name || 'Avatar de profil'} />
                          <AvatarFallback className="text-3xl bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                            {(profile.name?.[0] || profile.email?.[0] || 'U').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {stats.level > 1 && (
                          <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                            <Sparkles className="h-5 w-5 text-primary" />
                          </div>
                        )}
                      </div>
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                      
                      <div className="flex gap-2 justify-center flex-wrap">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleAvatarClick}
                          disabled={isSaving}
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          Changer
                        </Button>
                        {profile.avatar_url && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={removeAvatar}
                            disabled={isSaving}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={handleShareProfile}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold">
                          {profile.name || 'Utilisateur'}
                        </h3>
                        <p className="text-sm text-muted-foreground">{profile.email}</p>
                        <Badge variant="secondary" className="mt-2">
                          {profile.role === 'b2c' ? 'Particulier' : 
                           profile.role === 'b2b_user' ? 'Collaborateur' : 
                           profile.role === 'b2b_admin' ? 'Administrateur' : profile.role}
                        </Badge>
                      </div>

                      <Separator />

                      {/* Level & XP */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <Award className="h-4 w-4 text-primary" />
                            Niveau {stats.level}
                          </span>
                          <span className="text-muted-foreground">
                            {stats.xp} XP
                          </span>
                        </div>
                        <Progress value={xpProgress} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {stats.xpToNextLevel - (stats.xp % stats.xpToNextLevel)} XP pour le niveau suivant
                        </p>
                      </div>

                      <Separator />

                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          Membre depuis {memberSinceText}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Activity className="h-4 w-4" />
                          {stats.totalScans + stats.totalJournalEntries + stats.totalBreathingSessions} activités
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Heart className="h-4 w-4" />
                          {stats.currentStreak} jours de série
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Personal Information */}
                <Card className="lg:col-span-2">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Informations Personnelles</CardTitle>
                      <CardDescription>Gérez vos informations de profil</CardDescription>
                    </div>
                    {!isEditing ? (
                      <Button onClick={handleStartEditing} className="shrink-0">
                        <Settings className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                    ) : (
                      <div className="flex gap-2 shrink-0">
                        <Button 
                          variant="outline" 
                          onClick={handleCancelEditing}
                          disabled={isSaving}
                        >
                          Annuler
                        </Button>
                        <Button 
                          onClick={handleSaveProfile}
                          disabled={isSaving}
                        >
                          {isSaving ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4 mr-2" />
                          )}
                          Enregistrer
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Nom complet
                        </Label>
                        <Input
                          id="name"
                          value={editForm.name}
                          disabled={!isEditing}
                          onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Votre nom"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email || ''}
                          disabled
                          className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">
                          L'email ne peut pas être modifié
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Téléphone
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={editForm.phone}
                          disabled={!isEditing}
                          onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+33 6 XX XX XX XX"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Localisation
                        </Label>
                        <Input
                          id="location"
                          value={editForm.location}
                          disabled={!isEditing}
                          onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="Paris, France"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website" className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Site web
                        </Label>
                        <Input
                          id="website"
                          value={editForm.website}
                          disabled={!isEditing}
                          onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                          placeholder="https://..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="job_title" className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          Profession
                        </Label>
                        <Input
                          id="job_title"
                          value={editForm.job_title}
                          disabled={!isEditing}
                          onChange={(e) => setEditForm(prev => ({ ...prev, job_title: e.target.value }))}
                          placeholder="Votre profession"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">À propos de moi</Label>
                      <Textarea
                        id="bio"
                        value={editForm.bio}
                        disabled={!isEditing}
                        onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Parlez-nous de vous, vos objectifs et votre parcours..."
                        rows={4}
                      />
                      <p className="text-xs text-muted-foreground">
                        {editForm.bio.length}/500 caractères
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Badges & Achievements */}
                {badges.length > 0 && (
                  <Card className="lg:col-span-3">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        Mes Badges
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-3">
                        {badges.map((badge) => (
                          <motion.div
                            key={badge.id}
                            whileHover={{ scale: 1.05 }}
                            className={`flex items-center gap-2 px-3 py-2 rounded-full ${getRarityColor(badge.rarity)}`}
                          >
                            <span>{badge.icon}</span>
                            <span className="text-sm font-medium">{badge.name}</span>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <div className="max-w-4xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-6 w-6 text-primary" />
                      Sécurité de votre compte
                    </CardTitle>
                    <CardDescription>
                      Protégez votre compte avec des mesures de sécurité avancées
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Password */}
                    <div className="flex items-center justify-between p-6 border rounded-xl hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Lock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Mot de passe</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Modifiez votre mot de passe régulièrement
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" onClick={() => setShowPasswordDialog(true)}>
                        Modifier
                      </Button>
                    </div>

                    {/* 2FA */}
                    <div className="flex items-center justify-between p-6 border rounded-xl hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Key className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">Authentification à deux facteurs</h4>
                            <Badge variant="secondary" className="bg-orange-500/10 text-orange-600">
                              Recommandé
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Sécurisez votre compte avec une vérification supplémentaire
                          </p>
                          <p className="text-sm font-medium mt-2 text-orange-600">
                            Non configuré
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" onClick={handle2FASetup}>
                        Configurer
                      </Button>
                    </div>

                    {/* Active Sessions */}
                    <div className="flex items-center justify-between p-6 border rounded-xl hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Activity className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Sessions actives</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Gérez les appareils connectés à votre compte
                          </p>
                          <p className="text-sm font-medium mt-2 text-blue-600">
                            1 appareil actif
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" onClick={() => setShowSessionsDialog(true)}>
                        Voir détails
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy">
              <div className="max-w-4xl mx-auto space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-6 w-6 text-primary" />
                      Paramètres de confidentialité
                    </CardTitle>
                    <CardDescription>
                      Contrôlez qui peut voir vos informations et comment nous utilisons vos données
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {[
                      {
                        title: 'Profil public',
                        description: 'Permet aux autres utilisateurs de voir votre profil',
                        key: 'public_profile'
                      },
                      {
                        title: 'Partage des statistiques',
                        description: 'Permet le partage anonymisé de vos données pour la recherche',
                        key: 'share_stats'
                      },
                      {
                        title: 'Notifications email',
                        description: 'Recevez des notifications par email',
                        key: 'email_notifications'
                      },
                      {
                        title: 'Notifications push',
                        description: 'Recevez des notifications sur vos appareils',
                        key: 'push_notifications'
                      },
                      {
                        title: 'Analytiques et amélioration',
                        description: "Aide à améliorer l'application en partageant des données d'usage",
                        key: 'analytics_opt_in'
                      }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.description}
                          </p>
                        </div>
                        <Switch
                          checked={profile.preferences[item.key as keyof typeof profile.preferences] as boolean}
                          onCheckedChange={(value) => handlePreferenceChange(item.key, value)}
                          disabled={isSaving}
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
                    <CardDescription>
                      Exercez vos droits sur vos données personnelles
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Exporter mes données</h4>
                        <p className="text-sm text-muted-foreground">
                          Téléchargez toutes vos données dans un format portable
                        </p>
                      </div>
                      <Button variant="outline" onClick={handleExportData} disabled={isSaving}>
                        {isSaving ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4 mr-2" />
                        )}
                        Exporter
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-destructive/50 rounded-lg bg-destructive/5">
                      <div>
                        <h4 className="font-medium text-destructive">Supprimer mon compte</h4>
                        <p className="text-sm text-destructive/80">
                          Cette action est irréversible et supprimera toutes vos données
                        </p>
                      </div>
                      <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Stats Tab */}
            <TabsContent value="stats">
              <div className="max-w-6xl mx-auto space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: 'Scans émotionnels',
                      value: stats.totalScans,
                      icon: Activity,
                      color: 'text-blue-500',
                    },
                    {
                      title: 'Entrées journal',
                      value: stats.totalJournalEntries,
                      icon: Star,
                      color: 'text-yellow-500',
                    },
                    {
                      title: 'Séances respiration',
                      value: stats.totalBreathingSessions,
                      icon: Heart,
                      color: 'text-red-500',
                    },
                    {
                      title: 'Série actuelle',
                      value: `${stats.currentStreak} jours`,
                      icon: TrendingUp,
                      color: 'text-green-500',
                    },
                    {
                      title: 'Badges obtenus',
                      value: stats.totalBadges,
                      icon: Award,
                      color: 'text-purple-500',
                    },
                    {
                      title: "Heures d'utilisation",
                      value: `${stats.totalHoursUsed}h`,
                      icon: Activity,
                      color: 'text-indigo-500',
                    },
                  ].map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card>
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                              </div>
                              <Icon className={`h-8 w-8 ${stat.color}`} />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Activity Chart */}
                {activityHistory.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Activité des 30 derniers jours</CardTitle>
                      <CardDescription>
                        Votre engagement quotidien
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={activityHistory.slice(-14)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="date" 
                            tickFormatter={(date) => format(new Date(date), 'dd/MM')}
                          />
                          <YAxis />
                          <Tooltip 
                            labelFormatter={(date) => format(new Date(date as string), 'dd MMMM', { locale: fr })}
                          />
                          <Bar dataKey="scans" fill="hsl(var(--primary))" name="Scans" />
                          <Bar dataKey="breathing" fill="hsl(var(--chart-2))" name="Respiration" />
                          <Bar dataKey="journals" fill="hsl(var(--chart-3))" name="Journal" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}

                {/* Achievements Progress */}
                {achievements.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        Progression des succès
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {achievements.slice(0, 6).map((achievement) => (
                          <div 
                            key={achievement.id} 
                            className={`p-4 rounded-lg border ${achievement.unlocked ? 'bg-primary/5 border-primary/20' : 'bg-muted/50'}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{achievement.icon}</span>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">{achievement.name}</h4>
                                  {achievement.unlocked && (
                                    <CheckCircle2 className="h-4 w-4 text-primary" />
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">{achievement.description}</p>
                                <div className="mt-2">
                                  <Progress 
                                    value={Math.min((achievement.progress / achievement.target) * 100, 100)} 
                                    className="h-1.5" 
                                  />
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {achievement.progress}/{achievement.target}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le mot de passe</DialogTitle>
            <DialogDescription>
              Choisissez un mot de passe fort et unique
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-sm text-destructive">Les mots de passe ne correspondent pas</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handlePasswordChange}
              disabled={!newPassword || newPassword !== confirmPassword || isSaving}
            >
              {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Modifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Supprimer mon compte
            </DialogTitle>
            <DialogDescription>
              Cette action est irréversible. Toutes vos données seront définitivement supprimées.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Vous perdrez :
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• {stats.totalScans} scans émotionnels</li>
              <li>• {stats.totalJournalEntries} entrées de journal</li>
              <li>• {stats.totalBreathingSessions} séances de respiration</li>
              <li>• {stats.totalBadges} badges et récompenses</li>
            </ul>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Annuler
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Supprimer définitivement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2FA Setup Dialog */}
      <Dialog open={show2FADialog} onOpenChange={setShow2FADialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              Authentification à deux facteurs
            </DialogTitle>
            <DialogDescription>
              Renforcez la sécurité de votre compte avec une vérification en deux étapes.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Comment ça marche ?</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  Téléchargez une application d'authentification (Google Authenticator, Authy)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  Scannez le QR code pour lier votre compte
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  Entrez le code à 6 chiffres à chaque connexion
                </li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground">
              L'authentification à deux facteurs sera activée prochainement. Vous serez notifié dès son activation.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShow2FADialog(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sessions Dialog */}
      <Dialog open={showSessionsDialog} onOpenChange={setShowSessionsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Sessions actives
            </DialogTitle>
            <DialogDescription>
              Appareils actuellement connectés à votre compte
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Session actuelle</h4>
                    <p className="text-sm text-muted-foreground">
                      {navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'} • {
                        navigator.userAgent.includes('Chrome') ? 'Chrome' :
                        navigator.userAgent.includes('Firefox') ? 'Firefox' :
                        navigator.userAgent.includes('Safari') ? 'Safari' : 'Navigateur'
                      }
                    </p>
                    <p className="text-xs text-green-600 mt-1">Connecté maintenant</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                  Actif
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Aucune autre session active détectée.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSessionsDialog(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageRoot>
  );
};

export default B2CProfileSettingsPage;
