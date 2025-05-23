
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { User, Mail, Building, Save, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: '',
    job_title: '',
    department: '',
    bio: '',
    notifications_enabled: true,
    email_notifications: true
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setProfile({
          name: data.name || user.name || '',
          email: data.email || user.email || '',
          company: data.department || '',
          job_title: data.job_title || '',
          department: data.department || '',
          bio: '',
          notifications_enabled: data.preferences?.notifications_enabled ?? true,
          email_notifications: data.preferences?.email_notifications ?? true
        });
      }
    } catch (error) {
      console.error('Profile loading error:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: profile.name,
          email: profile.email,
          job_title: profile.job_title,
          department: profile.department,
          preferences: {
            notifications_enabled: profile.notifications_enabled,
            email_notifications: profile.email_notifications
          }
        });

      if (error) throw error;

      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      console.error('Profile save error:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <User className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Mon Profil</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations personnelles */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations Personnelles</CardTitle>
              <CardDescription>
                Gérez vos informations de profil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Votre nom"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              {user?.role !== 'b2c' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              )}

              <div>
                <Label htmlFor="bio">Bio (optionnel)</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Parlez-nous un peu de vous..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Préférences */}
          <Card>
            <CardHeader>
              <CardTitle>Préférences</CardTitle>
              <CardDescription>
                Personnalisez votre expérience EmotionsCare
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notifications en temps réel</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications pour les analyses et recommandations
                  </p>
                </div>
                <Switch
                  checked={profile.notifications_enabled}
                  onCheckedChange={(checked) => handleInputChange('notifications_enabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Notifications par email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des résumés et rappels par email
                  </p>
                </div>
                <Switch
                  checked={profile.email_notifications}
                  onCheckedChange={(checked) => handleInputChange('email_notifications', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Avatar et infos */}
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-12 w-12 text-primary" />
              </div>
              <h3 className="font-semibold">{profile.name || 'Nom non défini'}</h3>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
              {profile.job_title && (
                <p className="text-sm text-muted-foreground mt-1">{profile.job_title}</p>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <Button 
                onClick={handleSave} 
                disabled={isLoading}
                className="w-full"
              >
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

              <div className="pt-4 border-t">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>Compte vérifié</span>
                  </div>
                  {user?.role !== 'b2c' && (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      <span>Compte entreprise</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
