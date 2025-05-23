
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  User, 
  Mail, 
  Building2, 
  Save,
  Camera,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getModeDashboardPath, getUserModeDisplayName } from '@/utils/userModeHelpers';

const ProfilePage: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const { userMode } = useUserMode();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    department: '',
    job_title: '',
    role: '',
    preferences: {
      theme: 'system',
      language: 'fr',
      notifications_enabled: true,
      email_notifications: true
    }
  });

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile({
          name: data.name || '',
          email: data.email || user.email || '',
          department: data.department || '',
          job_title: data.job_title || '',
          role: data.role || '',
          preferences: data.preferences || {
            theme: 'system',
            language: 'fr',
            notifications_enabled: true,
            email_notifications: true
          }
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Erreur lors du chargement du profil');
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: profile.name,
          email: profile.email,
          department: profile.department,
          job_title: profile.job_title,
          role: profile.role,
          preferences: profile.preferences,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update user metadata
      await updateUser({
        data: {
          name: profile.name
        }
      });

      toast.success('Profil mis à jour avec succès !');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleBackToDashboard = () => {
    if (userMode) {
      navigate(getModeDashboardPath(userMode));
    } else {
      navigate('/choose-mode');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={handleBackToDashboard}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-xl font-bold">Mon Profil</h1>
          </div>
          <div className="flex items-center space-x-4">
            {userMode && (
              <Badge variant="outline">
                {getUserModeDisplayName(userMode)}
              </Badge>
            )}
            <Badge variant="outline">
              {user?.email}
            </Badge>
            <Button onClick={handleLogout} variant="outline">
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8 max-w-4xl">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="relative mb-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto">
                    {profile.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                
                <h2 className="text-xl font-bold mb-2">
                  {profile.name || 'Nom non défini'}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {profile.job_title || 'Poste non défini'}
                </p>
                
                <div className="space-y-2">
                  <Badge 
                    variant="outline"
                    className={
                      profile.role === 'b2b_admin' ? 'bg-purple-50 text-purple-600' :
                      profile.role === 'b2b_user' ? 'bg-green-50 text-green-600' :
                      'bg-blue-50 text-blue-600'
                    }
                  >
                    {getUserModeDisplayName(profile.role)}
                  </Badge>
                  
                  {profile.department && (
                    <Badge variant="outline">
                      {profile.department}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Form */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>
                  Gérez vos informations de profil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Votre nom complet"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="votre.email@exemple.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="job_title">Poste</Label>
                    <Input
                      id="job_title"
                      value={profile.job_title}
                      onChange={(e) => handleInputChange('job_title', e.target.value)}
                      placeholder="Votre poste"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="department">Département</Label>
                    <Input
                      id="department"
                      value={profile.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      placeholder="Votre département"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Préférences</CardTitle>
                <CardDescription>
                  Personnalisez votre expérience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="theme">Thème</Label>
                    <Select 
                      value={profile.preferences.theme} 
                      onValueChange={(value) => handlePreferenceChange('theme', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Clair</SelectItem>
                        <SelectItem value="dark">Sombre</SelectItem>
                        <SelectItem value="system">Système</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="language">Langue</Label>
                    <Select 
                      value={profile.preferences.language} 
                      onValueChange={(value) => handlePreferenceChange('language', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notifications">Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Recevoir des notifications dans l'application
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      id="notifications"
                      checked={profile.preferences.notifications_enabled}
                      onChange={(e) => handlePreferenceChange('notifications_enabled', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email_notifications">Notifications email</Label>
                      <p className="text-sm text-muted-foreground">
                        Recevoir des notifications par email
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      id="email_notifications"
                      checked={profile.preferences.email_notifications}
                      onChange={(e) => handlePreferenceChange('email_notifications', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions du compte</CardTitle>
                <CardDescription>
                  Gérez votre compte et vos données
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={saveProfile}
                    disabled={isSaving}
                    className="flex-1"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Sauvegarder les modifications
                  </Button>
                  
                  <Button variant="outline" className="flex-1">
                    Changer de mot de passe
                  </Button>
                </div>
                
                <div className="pt-4 border-t">
                  <Button variant="destructive" className="w-full">
                    Supprimer mon compte
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
