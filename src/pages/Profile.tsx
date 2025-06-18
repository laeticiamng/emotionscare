import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Upload, Save, User, Shield, Bell, Palette } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Système de profil utilisateur complet
 * Point 8: User Profile System - Gestion profil utilisateur
 */
const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { userMode } = useUserMode();
  const { toast } = useToast();
  
  // États du profil
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    department: '',
    job_title: '',
    phone: '',
    location: '',
    website: '',
  });

  // États des préférences
  const [preferences, setPreferences] = useState({
    theme: 'system',
    language: 'fr',
    notifications_enabled: true,
    email_notifications: true,
    push_notifications: false,
    analytics_consent: true,
    marketing_consent: false,
    data_processing_consent: true,
  });

  // États pour l'avatar
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  useEffect(() => {
    loadProfile();
  }, [user]);

  /**
   * Charger le profil utilisateur
   */
  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setProfileData({
          name: profile.name || '',
          bio: profile.bio || '',
          department: profile.department || '',
          job_title: profile.job_title || '',
          phone: profile.phone || '',
          location: profile.location || '',
          website: profile.website || '',
        });

        if (profile.preferences) {
          setPreferences({ ...preferences, ...profile.preferences });
        }

        if (profile.avatar_url) {
          setAvatarPreview(profile.avatar_url);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    }
  };

  /**
   * Sauvegarder le profil
   */
  const saveProfile = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      let avatarUrl = avatarPreview;

      // Upload de l'avatar si un nouveau fichier est sélectionné
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}/avatar.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatarFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        avatarUrl = publicUrlData.publicUrl;
      }

      // Mise à jour du profil
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profileData,
          avatar_url: avatarUrl,
          preferences,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Profil sauvegardé",
        description: "Vos informations ont été mises à jour avec succès",
      });

      setAvatarFile(null);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la sauvegarde",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Gérer la sélection d'avatar
   */
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérification du type de fichier
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Erreur",
          description: "Veuillez sélectionner un fichier image valide",
          variant: "destructive",
        });
        return;
      }

      // Vérification de la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erreur",
          description: "L'image ne doit pas dépasser 5MB",
          variant: "destructive",
        });
        return;
      }

      setAvatarFile(file);
      
      // Prévisualisation
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Supprimer l'avatar
   */
  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview('');
  };

  const getUserInitials = () => {
    const name = profileData.name || user?.email || 'Utilisateur';
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="container mx-auto max-w-4xl p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mon Profil</h1>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles et préférences
          </p>
        </div>
        <Badge variant={userMode === 'b2c' ? 'default' : userMode === 'b2b_user' ? 'secondary' : 'destructive'}>
          {userMode === 'b2c' ? 'Personnel' : userMode === 'b2b_user' ? 'Employé' : 'Administrateur'}
        </Badge>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
          <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>

        {/* Onglet Profil */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarPreview} />
                    <AvatarFallback className="text-lg">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Photo de profil</h3>
                  <p className="text-sm text-muted-foreground">
                    Formats acceptés: JPG, PNG, GIF (max 5MB)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Changer
                    </Button>
                    {avatarPreview && (
                      <Button variant="outline" size="sm" onClick={removeAvatar}>
                        Supprimer
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Informations de base */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    placeholder="Votre nom complet"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Localisation</Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    placeholder="Ville, Pays"
                  />
                </div>
              </div>

              {/* Informations professionnelles */}
              {(userMode === 'b2b_user' || userMode === 'b2b_admin') && (
                <>
                  <Separator />
                  <h3 className="font-medium">Informations professionnelles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="job_title">Poste</Label>
                      <Input
                        id="job_title"
                        value={profileData.job_title}
                        onChange={(e) => setProfileData({ ...profileData, job_title: e.target.value })}
                        placeholder="Votre poste"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Département</Label>
                      <Input
                        id="department"
                        value={profileData.department}
                        onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                        placeholder="Votre département"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  placeholder="Parlez-nous de vous..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Site web</Label>
                <Input
                  id="website"
                  value={profileData.website}
                  onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                  placeholder="https://votre-site.com"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Préférences */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Préférences d'affichage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Thème</Label>
                  <p className="text-sm text-muted-foreground">
                    Choisissez votre thème préféré
                  </p>
                </div>
                <Select
                  value={preferences.theme}
                  onValueChange={(value) => setPreferences({ ...preferences, theme: value })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Clair</SelectItem>
                    <SelectItem value="dark">Sombre</SelectItem>
                    <SelectItem value="system">Système</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Langue</Label>
                  <p className="text-sm text-muted-foreground">
                    Langue de l'interface
                  </p>
                </div>
                <Select
                  value={preferences.language}
                  onValueChange={(value) => setPreferences({ ...preferences, language: value })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications activées</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications générales
                  </p>
                </div>
                <Switch
                  checked={preferences.notifications_enabled}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, notifications_enabled: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications par email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications par email
                  </p>
                </div>
                <Switch
                  checked={preferences.email_notifications}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, email_notifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications push</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications push sur vos appareils
                  </p>
                </div>
                <Switch
                  checked={preferences.push_notifications}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, push_notifications: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Confidentialité */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Paramètres de confidentialité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Consentement analytiques</Label>
                  <p className="text-sm text-muted-foreground">
                    Autoriser la collecte de données d'utilisation anonymes
                  </p>
                </div>
                <Switch
                  checked={preferences.analytics_consent}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, analytics_consent: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Communications marketing</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des informations sur nos nouveautés
                  </p>
                </div>
                <Switch
                  checked={preferences.marketing_consent}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, marketing_consent: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Traitement des données</Label>
                  <p className="text-sm text-muted-foreground">
                    Autoriser le traitement de vos données personnelles
                  </p>
                </div>
                <Switch
                  checked={preferences.data_processing_consent}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, data_processing_consent: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Sécurité */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sécurité du compte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">
                  La gestion avancée de la sécurité (changement de mot de passe, 2FA) 
                  sera disponible dans une prochaine mise à jour.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bouton de sauvegarde */}
      <div className="flex justify-end">
        <Button onClick={saveProfile} disabled={isLoading} size="lg">
          {isLoading ? (
            <>Sauvegarde...</>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder les modifications
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;