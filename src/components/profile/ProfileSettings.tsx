
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Briefcase, Building, Heart, Settings, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  job_title?: string;
  avatar_url?: string;
  emotional_score?: number;
  preferences: {
    theme?: string;
    language?: string;
    notifications_enabled?: boolean;
    email_notifications?: boolean;
  };
}

const ProfileSettings: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfile({
        id: data.id,
        name: data.name || '',
        email: data.email || user.email || '',
        role: data.role || 'b2c',
        department: data.department,
        job_title: data.job_title,
        avatar_url: data.avatar_url,
        emotional_score: data.emotional_score,
        preferences: data.preferences || {
          theme: 'system',
          language: 'fr',
          notifications_enabled: true,
          email_notifications: true
        }
      });
    } catch (error) {
      console.error('Erreur chargement profil:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le profil",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!profile) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          department: profile.department,
          job_title: profile.job_title,
          preferences: profile.preferences
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: "Profil sauvegardé",
        description: "Vos modifications ont été enregistrées"
      });
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le profil",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => prev ? { ...prev, ...updates } : null);
  };

  const updatePreferences = (key: string, value: any) => {
    setProfile(prev => prev ? {
      ...prev,
      preferences: { ...prev.preferences, [key]: value }
    } : null);
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'b2c': return 'Particulier';
      case 'b2b_user': return 'Collaborateur';
      case 'b2b_admin': return 'Administrateur';
      default: return role;
    }
  };

  const getEmotionalScoreColor = (score?: number) => {
    if (!score) return 'bg-gray-500';
    if (score >= 8) return 'bg-green-500';
    if (score >= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-muted rounded w-1/3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">Impossible de charger le profil</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informations personnelles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              {profile.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt="Avatar" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="h-8 w-8 text-primary" />
              )}
            </div>
            
            {/* Basic Info */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold">{profile.name || 'Nom non défini'}</h2>
                <Badge variant="outline">{getRoleLabel(profile.role)}</Badge>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{profile.email}</span>
              </div>
              {profile.emotional_score && (
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Score émotionnel :</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getEmotionalScoreColor(profile.emotional_score)}`}></div>
                    <span className="font-medium">{profile.emotional_score}/10</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => updateProfile({ name: e.target.value })}
                placeholder="Votre nom"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profile.email}
                disabled
                className="bg-muted"
              />
            </div>

            {profile.role.startsWith('b2b') && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="job_title">Poste</Label>
                  <Input
                    id="job_title"
                    value={profile.job_title || ''}
                    onChange={(e) => updateProfile({ job_title: e.target.value })}
                    placeholder="Votre poste"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Département</Label>
                  <Input
                    id="department"
                    value={profile.department || ''}
                    onChange={(e) => updateProfile({ department: e.target.value })}
                    placeholder="Votre département"
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Préférences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Thème</Label>
              <div className="flex gap-2">
                {['light', 'dark', 'system'].map(theme => (
                  <Button
                    key={theme}
                    variant={profile.preferences.theme === theme ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updatePreferences('theme', theme)}
                  >
                    {theme === 'light' ? 'Clair' : theme === 'dark' ? 'Sombre' : 'Système'}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Notifications push</Label>
                <p className="text-sm text-muted-foreground">
                  Recevoir des notifications dans l'application
                </p>
              </div>
              <Switch
                checked={profile.preferences.notifications_enabled}
                onCheckedChange={(checked) => updatePreferences('notifications_enabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Notifications email</Label>
                <p className="text-sm text-muted-foreground">
                  Recevoir des notifications par email
                </p>
              </div>
              <Switch
                checked={profile.preferences.email_notifications}
                onCheckedChange={(checked) => updatePreferences('email_notifications', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button
          onClick={saveProfile}
          disabled={isSaving}
          className="w-full md:w-auto"
        >
          {isSaving ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 mr-2"
              >
                <Save className="h-4 w-4" />
              </motion.div>
              Sauvegarde...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder les modifications
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
};

export default ProfileSettings;
