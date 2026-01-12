/**
 * Page de paramètres de profil utilisateur - Remplace TODO
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/store/unified.store';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import { User, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAvatarHelpers } from '@/hooks/useAvatarHelpers';

interface ProfileSettingsPageProps {
  'data-testid'?: string;
}

interface UserMetadata {
  full_name?: string;
  phone?: string;
  bio?: string;
  location?: string;
  website?: string;
  birthday?: string;
  is_public?: boolean;
  allow_notifications?: boolean;
  allow_analytics?: boolean;
  avatar_url?: string;
  [key: string]: unknown;
}

interface ExtendedUser {
  id?: string;
  email?: string;
  user_metadata?: UserMetadata;
  [key: string]: unknown;
}

export const ProfileSettingsPage: React.FC<ProfileSettingsPageProps> = ({ 'data-testid': testId }) => {
  const rawUser = useAppStore.use.user();
  const user = rawUser as ExtendedUser | null;
  const setUser = useAppStore.use.setUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const { avatarUrl, uploading, uploadAvatar, removeAvatar, getInitials } = useAvatarHelpers();

  const [formData, setFormData] = React.useState({
    displayName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    bio: user?.user_metadata?.bio || '',
    location: user?.user_metadata?.location || '',
    website: user?.user_metadata?.website || '',
    birthday: user?.user_metadata?.birthday || '',
    isPublic: user?.user_metadata?.is_public || false,
    allowNotifications: user?.user_metadata?.allow_notifications ?? true,
    allowAnalytics: user?.user_metadata?.allow_analytics ?? true,
  });

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Update user metadata in Supabase
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: formData.displayName,
          phone: formData.phone,
          bio: formData.bio,
          location: formData.location,
          website: formData.website,
          birthday: formData.birthday,
          is_public: formData.isPublic,
          allow_notifications: formData.allowNotifications,
          allow_analytics: formData.allowAnalytics,
        }
      });

      if (authError) throw authError;

      // Update profile in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: formData.displayName,
          updated_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;

      // Update user in store
      const updatedUser: ExtendedUser = {
        ...user,
        email: formData.email,
        user_metadata: {
          ...(user?.user_metadata ?? {}),
          full_name: formData.displayName,
          phone: formData.phone,
          bio: formData.bio,
          location: formData.location,
          website: formData.website,
          birthday: formData.birthday,
          is_public: formData.isPublic,
          allow_notifications: formData.allowNotifications,
          allow_analytics: formData.allowAnalytics,
        }
      };
      setUser(updatedUser);

      toast({
        title: "Profil mis à jour",
        description: "Vos modifications ont été sauvegardées avec succès.",
      });
    } catch (error) {
      logger.error('Error saving profile', error as Error, 'COMPONENT');
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = React.useCallback((field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleAvatarClick = React.useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleAvatarChange = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        await uploadAvatar(file);
        toast({
          title: 'Avatar mis à jour',
          description: 'Votre nouvelle photo de profil est enregistrée.',
        });
      } catch (error) {
        logger.error('Error uploading avatar', error as Error, 'COMPONENT');
        toast({
          title: 'Erreur',
          description: "Impossible de mettre à jour la photo de profil.",
          variant: 'destructive',
        });
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    [toast, uploadAvatar],
  );

  const handleAvatarRemove = React.useCallback(async () => {
    try {
      await removeAvatar();
      toast({
        title: 'Avatar supprimé',
        description: 'Votre photo de profil a été supprimée.',
      });
    } catch (error) {
      logger.error('Error removing avatar', error as Error, 'COMPONENT');
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la photo de profil.',
        variant: 'destructive',
      });
    }
  }, [removeAvatar, toast]);

  return (
    <div className="container max-w-4xl mx-auto py-8 space-y-6" data-testid={testId}>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Paramètres du profil</h1>
        <p className="text-muted-foreground">
          Gérez vos informations personnelles et vos préférences de confidentialité
        </p>
      </div>

      <div className="grid gap-6">
        {/* Photo de profil */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Photo de profil
            </CardTitle>
            <CardDescription>
              Votre photo sera visible par les autres utilisateurs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarUrl ?? undefined} />
                <AvatarFallback className="text-lg">
                  {getInitials(formData.displayName || user?.email)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <Button variant="outline" size="sm" onClick={handleAvatarClick} disabled={uploading}>
                  Changer la photo
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={handleAvatarRemove}
                  disabled={uploading || !avatarUrl}
                >
                  Supprimer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations personnelles */}
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
            <CardDescription>
              Vos informations de base et de contact
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Nom d'affichage</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  placeholder="Votre nom complet"
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
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="votre@email.com"
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
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+33 1 23 45 67 89"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Localisation
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Paris, France"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthday" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date de naissance
                </Label>
                <Input
                  id="birthday"
                  type="date"
                  value={formData.birthday}
                  onChange={(e) => handleInputChange('birthday', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Site web</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://votresite.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biographie</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Parlez-nous de vous..."
                rows={3}
              />
              <p className="text-sm text-muted-foreground">
                {formData.bio.length}/500 caractères
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Préférences de confidentialité */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Confidentialité
            </CardTitle>
            <CardDescription>
              Contrôlez qui peut voir vos informations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Profil public</Label>
                <p className="text-sm text-muted-foreground">
                  Permettre aux autres utilisateurs de voir votre profil
                </p>
              </div>
              <Switch
                checked={formData.isPublic}
                onCheckedChange={(checked) => handleInputChange('isPublic', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Recevoir des notifications par email et push
                </p>
              </div>
              <Switch
                checked={formData.allowNotifications}
                onCheckedChange={(checked) => handleInputChange('allowNotifications', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Analytics</Label>
                <p className="text-sm text-muted-foreground">
                  Partager des données anonymes pour améliorer l'application
                </p>
              </div>
              <Switch
                checked={formData.allowAnalytics}
                onCheckedChange={(checked) => handleInputChange('allowAnalytics', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-between">
          <Button variant="outline">
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
          </Button>
        </div>
      </div>
    </div>
  );
};
