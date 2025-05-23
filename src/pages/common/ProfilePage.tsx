
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Building, Calendar, Save, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import LoadingAnimation from '@/components/ui/loading-animation';

interface ProfileData {
  name: string;
  email: string;
  company?: string;
  job_title?: string;
  department?: string;
  avatar_url?: string;
  preferences?: any;
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { userMode } = useUserMode();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProfileData({
        name: profile?.name || user.name || '',
        email: profile?.email || user.email || '',
        company: profile?.job_title || '',
        job_title: profile?.job_title || '',
        department: profile?.department || '',
        avatar_url: profile?.avatar_url || '',
        preferences: profile?.preferences || {}
      });

    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Erreur lors du chargement du profil');
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!user || !profileData) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: profileData.name,
          email: profileData.email,
          job_title: profileData.job_title,
          department: profileData.department,
          avatar_url: profileData.avatar_url,
          preferences: profileData.preferences,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => prev ? { ...prev, [field]: value } : null);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingAnimation text="Chargement du profil..." />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="text-center py-12">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Aucune donnée de profil trouvée</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mon Profil</h1>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles et préférences
          </p>
        </div>
        <Badge variant="outline">
          {userMode === 'b2c' ? 'Particulier' : 
           userMode === 'b2b_user' ? 'Collaborateur' : 
           'Administrateur'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations personnelles */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations Personnelles
              </CardTitle>
              <CardDescription>
                Vos données de base et informations de contact
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Votre nom complet"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              {(userMode === 'b2b_user' || userMode === 'b2b_admin') && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="job_title">Poste</Label>
                    <Input
                      id="job_title"
                      value={profileData.job_title || ''}
                      onChange={(e) => handleInputChange('job_title', e.target.value)}
                      placeholder="Votre poste dans l'entreprise"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Département</Label>
                    <Input
                      id="department"
                      value={profileData.department || ''}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      placeholder="Votre département"
                    />
                  </div>
                </>
              )}

              <Button onClick={saveProfile} disabled={isSaving} className="w-full">
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Sauvegarder les modifications
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Statistiques du profil */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Informations du Compte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Email vérifié</span>
                <Badge variant="outline" className="text-green-600">
                  ✓ Confirmé
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Type de compte</span>
                <Badge>
                  {userMode === 'b2c' ? 'Personnel' : 
                   userMode === 'b2b_user' ? 'Professionnel' : 
                   'Administrateur'}
                </Badge>
              </div>

              {(userMode === 'b2b_user' || userMode === 'b2b_admin') && (
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Organisation</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Préférences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Notifications</Label>
                <div className="text-sm text-muted-foreground">
                  Gérez vos préférences de notification dans les paramètres
                </div>
              </div>
              
              <Button variant="outline" onClick={() => window.location.href = '/settings'}>
                Ouvrir les paramètres
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
