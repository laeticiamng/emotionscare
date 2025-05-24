
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { User, Mail, Calendar, Award, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { userMode } = useUserMode();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    jobTitle: '',
    preferences: {
      theme: 'system',
      language: 'fr',
      notifications_enabled: true,
      email_notifications: true
    }
  });

  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.user_metadata?.firstName || '',
        lastName: user.user_metadata?.lastName || '',
        email: user.email || '',
        company: user.user_metadata?.company || '',
        jobTitle: user.user_metadata?.jobTitle || '',
        preferences: user.user_metadata?.preferences || profile.preferences
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          firstName: profile.firstName,
          lastName: profile.lastName,
          company: profile.company,
          jobTitle: profile.jobTitle,
          preferences: profile.preferences
        }
      });

      if (error) throw error;
      toast.success('Profil mis à jour avec succès !');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleLabel = (mode: string) => {
    switch (mode) {
      case 'b2c': return 'Particulier';
      case 'b2b_user': return 'Collaborateur';
      case 'b2b_admin': return 'Administrateur';
      default: return 'Utilisateur';
    }
  };

  const getTrialStatus = () => {
    const trialEnd = user?.user_metadata?.trial_end;
    if (!trialEnd) return null;
    
    const endDate = new Date(trialEnd);
    const now = new Date();
    const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft > 0) {
      return `${daysLeft} jour${daysLeft > 1 ? 's' : ''} d'essai restant${daysLeft > 1 ? 's' : ''}`;
    }
    return 'Période d\'essai terminée';
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
          <User className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mon profil</h1>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles et préférences
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Vos données de profil et informations de contact
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prénom</label>
                  <Input
                    value={profile.firstName}
                    onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Votre prénom"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom</label>
                  <Input
                    value={profile.lastName}
                    onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    value={profile.email}
                    disabled
                    className="pl-10 bg-slate-50 dark:bg-slate-900"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  L'email ne peut pas être modifié. Contactez le support si nécessaire.
                </p>
              </div>

              {(userMode === 'b2b_user' || userMode === 'b2b_admin') && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Entreprise</label>
                    <Input
                      value={profile.company}
                      onChange={(e) => setProfile(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Nom de votre entreprise"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Poste</label>
                    <Input
                      value={profile.jobTitle}
                      onChange={(e) => setProfile(prev => ({ ...prev, jobTitle: e.target.value }))}
                      placeholder="Votre fonction"
                    />
                  </div>
                </>
              )}

              <Button onClick={handleSave} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Sauvegarder
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Informations du compte */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statut du compte</CardTitle>
              <CardDescription>
                Informations sur votre abonnement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Type de compte</span>
                <Badge variant="outline">
                  {getRoleLabel(userMode || '')}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Statut</span>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  Actif
                </Badge>
              </div>

              {getTrialStatus() && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      {getTrialStatus()}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Membre depuis</span>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : '-'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
              <CardDescription>
                Votre activité sur la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Scans réalisés</span>
                <Badge variant="outline">12</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Sessions coach</span>
                <Badge variant="outline">8</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Musiques générées</span>
                <Badge variant="outline">5</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
