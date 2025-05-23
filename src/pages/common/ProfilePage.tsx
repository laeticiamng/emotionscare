
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Camera, Save, MapPin, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { getUserModeDisplayName } from '@/utils/userModeHelpers';
import useAvatarHelpers from '@/hooks/useAvatarHelpers';
import LoadingAnimation from '@/components/ui/loading-animation';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { userMode } = useUserMode();
  const { avatarUrl, uploading, uploadAvatar, removeAvatar, getInitials } = useAvatarHelpers();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.user_metadata?.name || '',
        email: user.email || '',
        bio: user.user_metadata?.bio || '',
        location: user.user_metadata?.location || '',
        phone: user.user_metadata?.phone || '',
      });
      setIsLoading(false);
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      await updateUser({
        data: {
          name: formData.name,
          bio: formData.bio,
          location: formData.location,
          phone: formData.phone,
        }
      });
      
      toast.success('Profil mis à jour avec succès !');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image');
      return;
    }

    await uploadAvatar(file);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingAnimation size="large" text="Chargement du profil..." />
      </div>
    );
  }

  const modeName = getUserModeDisplayName(userMode);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="container mx-auto max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mon Profil</h1>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles et préférences
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <div className="relative mx-auto mb-4">
                <Avatar className="h-24 w-24 mx-auto">
                  <AvatarImage src={avatarUrl || undefined} />
                  <AvatarFallback className="text-2xl">
                    {getInitials(formData.name)}
                  </AvatarFallback>
                </Avatar>
                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 p-2 bg-primary rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                  <Camera className="h-4 w-4 text-white" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
              <CardTitle>{formData.name || 'Nom non renseigné'}</CardTitle>
              <CardDescription>{formData.email}</CardDescription>
              <Badge variant="outline" className="mt-2">
                {modeName}
              </Badge>
            </CardHeader>
            <CardContent>
              {formData.bio && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Bio</h4>
                  <p className="text-sm text-muted-foreground">{formData.bio}</p>
                </div>
              )}
              {formData.location && (
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formData.location}</span>
                </div>
              )}
              {formData.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formData.phone}</span>
                </div>
              )}
              {avatarUrl && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={removeAvatar}
                  disabled={uploading}
                  className="w-full mt-4"
                >
                  Supprimer l'avatar
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Edit Profile */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations personnelles
              </CardTitle>
              <CardDescription>
                Modifiez vos informations personnelles et préférences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Votre nom complet"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    L'email ne peut pas être modifié
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Parlez un peu de vous..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Localisation</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Votre ville, pays"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleSave}
                  disabled={isSaving || uploading}
                  className="gap-2"
                >
                  {isSaving ? (
                    <>
                      <LoadingAnimation size="small" />
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Sauvegarder
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Stats */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Statistiques du compte</CardTitle>
            <CardDescription>
              Aperçu de votre activité sur EmotionsCare
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">12</div>
                <p className="text-sm text-muted-foreground">Scans émotionnels</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">85%</div>
                <p className="text-sm text-muted-foreground">Score bien-être moyen</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">23</div>
                <p className="text-sm text-muted-foreground">Jours d'activité</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
