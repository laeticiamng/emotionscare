
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { User, Mail, Building2, Briefcase, Save, Loader2 } from 'lucide-react';

interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
  company?: string;
  position?: string;
  bio?: string;
  phone?: string;
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<ProfileData>({
    first_name: '',
    last_name: '',
    email: '',
    company: '',
    position: '',
    bio: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      if (user?.email?.endsWith('@exemple.fr')) {
        // Données simulées pour les comptes démo
        setProfileData({
          first_name: user.user_metadata?.first_name || 'Démo',
          last_name: user.user_metadata?.last_name || 'Utilisateur',
          email: user.email,
          company: 'Entreprise Demo',
          position: 'Poste Demo',
          bio: 'Ceci est un profil de démonstration pour tester les fonctionnalités de la plateforme.',
          phone: '+33 1 23 45 67 89'
        });
      } else {
        // Pour les vraits comptes, récupérer les données du profil
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user?.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        setProfileData({
          first_name: data?.name?.split(' ')[0] || user?.user_metadata?.first_name || '',
          last_name: data?.name?.split(' ')[1] || user?.user_metadata?.last_name || '',
          email: user?.email || '',
          company: data?.company || '',
          position: data?.job_title || '',
          bio: data?.bio || '',
          phone: data?.phone || ''
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger votre profil",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (user?.email?.endsWith('@exemple.fr')) {
        // Simulation pour les comptes démo
        setTimeout(() => {
          toast({
            title: "Profil mis à jour",
            description: "Vos informations ont été enregistrées (simulation)",
          });
          setIsSaving(false);
        }, 1000);
        return;
      }

      // Pour les vrais comptes, sauvegarder en base de données
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          name: `${profileData.first_name} ${profileData.last_name}`,
          email: profileData.email,
          company: profileData.company,
          job_title: profileData.position,
          bio: profileData.bio,
          phone: profileData.phone,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder vos informations",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const isDemo = user?.email?.endsWith('@exemple.fr');

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Mon Profil</h1>
        <p className="text-gray-600">
          Gérez vos informations personnelles et professionnelles
        </p>
        {isDemo && (
          <div className="mt-2 bg-orange-100 border border-orange-200 rounded-lg p-2">
            <p className="text-sm text-orange-800">
              🎯 Compte de démonstration - Modifications simulées
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Informations personnelles
              </CardTitle>
              <CardDescription>
                Mettez à jour vos informations de base
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    value={profileData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={profileData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+33 1 23 45 67 89"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biographie</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Parlez-nous un peu de vous..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {user?.user_metadata?.role?.startsWith('b2b') && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Informations professionnelles
                </CardTitle>
                <CardDescription>
                  Détails concernant votre poste et votre entreprise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Entreprise</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="company"
                      value={profileData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Poste</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="position"
                      value={profileData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-6">
            <Button onClick={handleSave} disabled={isSaving} className="w-full">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sauvegarde en cours...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder les modifications
                </>
              )}
            </Button>
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Résumé du compte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="font-semibold">
                  {profileData.first_name} {profileData.last_name}
                </h3>
                <p className="text-sm text-gray-500">{profileData.email}</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Type de compte:</span>
                  <span className="font-medium">
                    {user?.user_metadata?.role === 'b2c' ? 'Personnel' : 
                     user?.user_metadata?.role === 'b2b_user' ? 'Collaborateur' : 'Administrateur'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Membre depuis:</span>
                  <span className="font-medium">
                    {new Date(user?.created_at || '').toLocaleDateString('fr-FR')}
                  </span>
                </div>
                {profileData.company && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Entreprise:</span>
                    <span className="font-medium">{profileData.company}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
