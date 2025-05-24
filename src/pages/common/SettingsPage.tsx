
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Trash2, 
  Download,
  Save,
  Loader2
} from 'lucide-react';

interface UserPreferences {
  theme: string;
  language: string;
  notifications_enabled: boolean;
  email_notifications: boolean;
  data_sharing: boolean;
  auto_save: boolean;
}

const SettingsPage: React.FC = () => {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'system',
    language: 'fr',
    notifications_enabled: true,
    email_notifications: true,
    data_sharing: false,
    auto_save: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadUserPreferences();
  }, [user]);

  const loadUserPreferences = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data?.preferences) {
        setPreferences({ ...preferences, ...data.preferences });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ preferences })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Paramètres sauvegardés avec succès');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
      console.error('Error saving preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as 'light' | 'dark' | 'system');
    setPreferences(prev => ({ ...prev, theme: newTheme }));
  };

  const exportUserData = async () => {
    if (!user) return;

    try {
      // Fetch all user data
      const [emotions, journalEntries, profile] = await Promise.all([
        supabase.from('emotions').select('*').eq('user_id', user.id),
        supabase.from('journal_entries').select('*').eq('user_id', user.id),
        supabase.from('profiles').select('*').eq('id', user.id).single()
      ]);

      const userData = {
        profile: profile.data,
        emotions: emotions.data,
        journal_entries: journalEntries.data,
        exported_at: new Date().toISOString()
      };

      // Create and download file
      const blob = new Blob([JSON.stringify(userData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `emotionscare-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Données exportées avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'export des données');
      console.error('Export error:', error);
    }
  };

  const deleteAccount = async () => {
    if (!user) return;

    const confirmDelete = window.confirm(
      'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.'
    );

    if (!confirmDelete) return;

    try {
      // Delete user data
      await Promise.all([
        supabase.from('emotions').delete().eq('user_id', user.id),
        supabase.from('journal_entries').delete().eq('user_id', user.id),
        supabase.from('profiles').delete().eq('id', user.id)
      ]);

      // Sign out and redirect
      await signOut();
      toast.success('Compte supprimé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la suppression du compte');
      console.error('Delete account error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold">Paramètres</h1>
            <p className="text-muted-foreground">Gérez vos préférences et paramètres de compte</p>
          </div>
          
          <Button onClick={savePreferences} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Sauvegarder
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Apparence
              </CardTitle>
              <CardDescription>
                Personnalisez l'apparence de l'interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Thème</Label>
                <Select value={preferences.theme} onValueChange={handleThemeChange}>
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

              <div className="space-y-2">
                <Label htmlFor="language">Langue</Label>
                <Select 
                  value={preferences.language} 
                  onValueChange={(value) => setPreferences(prev => ({ ...prev, language: value }))}
                >
                  <SelectTrigger>
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

          {/* Notifications Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Gérez vos préférences de notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications push</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications dans l'app
                  </p>
                </div>
                <Switch
                  checked={preferences.notifications_enabled}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, notifications_enabled: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des emails de suivi
                  </p>
                </div>
                <Switch
                  checked={preferences.email_notifications}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, email_notifications: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sauvegarde automatique</Label>
                  <p className="text-sm text-muted-foreground">
                    Sauvegarder automatiquement vos données
                  </p>
                </div>
                <Switch
                  checked={preferences.auto_save}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, auto_save: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Confidentialité
              </CardTitle>
              <CardDescription>
                Gérez vos données et votre confidentialité
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Partage de données anonymes</Label>
                  <p className="text-sm text-muted-foreground">
                    Aider à améliorer l'application
                  </p>
                </div>
                <Switch
                  checked={preferences.data_sharing}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, data_sharing: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <Button 
                  onClick={exportUserData} 
                  variant="outline" 
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exporter mes données
                </Button>

                <Button 
                  onClick={deleteAccount} 
                  variant="destructive" 
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer mon compte
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations du compte
            </CardTitle>
            <CardDescription>
              Vos informations personnelles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  value={user?.user_metadata?.name || ''}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="created">Membre depuis</Label>
                <Input
                  id="created"
                  value={user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : ''}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Rôle</Label>
                <Input
                  id="role"
                  value={user?.user_metadata?.role || 'b2c'}
                  disabled
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
