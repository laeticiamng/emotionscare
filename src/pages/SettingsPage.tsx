
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Settings, Bell, Palette, Globe, Shield, Loader2, Save } from 'lucide-react';

interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'fr' | 'en';
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  privacy: {
    shareAnalytics: boolean;
    showActivity: boolean;
  };
}

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserSettings>({
    theme: 'system',
    language: 'fr',
    notifications: {
      email: true,
      push: true,
      marketing: false,
    },
    privacy: {
      shareAnalytics: true,
      showActivity: true,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      if (user?.email?.endsWith('@exemple.fr')) {
        // Données simulées pour les comptes démo
        setSettings({
          theme: 'light',
          language: 'fr',
          notifications: {
            email: true,
            push: false,
            marketing: false,
          },
          privacy: {
            shareAnalytics: true,
            showActivity: true,
          },
        });
      } else {
        // Pour les vrais comptes, récupérer les paramètres
        const { data, error } = await supabase
          .from('profiles')
          .select('preferences')
          .eq('id', user?.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data?.preferences) {
          setSettings({
            theme: data.preferences.theme || 'system',
            language: data.preferences.language || 'fr',
            notifications: {
              email: data.preferences.notifications?.email ?? true,
              push: data.preferences.notifications?.push ?? true,
              marketing: data.preferences.notifications?.marketing ?? false,
            },
            privacy: {
              shareAnalytics: data.preferences.privacy?.shareAnalytics ?? true,
              showActivity: data.preferences.privacy?.showActivity ?? true,
            },
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos paramètres",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (user?.email?.endsWith('@exemple.fr')) {
        // Simulation pour les comptes démo
        setTimeout(() => {
          toast({
            title: "Paramètres mis à jour",
            description: "Vos préférences ont été enregistrées (simulation)",
          });
          setIsSaving(false);
        }, 1000);
        return;
      }

      // Pour les vrais comptes, sauvegarder les paramètres
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          preferences: settings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Paramètres mis à jour",
        description: "Vos préférences ont été enregistrées avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder vos paramètres",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateSettings = (path: string, value: any) => {
    setSettings(prev => {
      const keys = path.split('.');
      const updated = { ...prev };
      let current: any = updated;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const isDemo = user?.email?.endsWith('@exemple.fr');

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="text-gray-600">
          Configurez vos préférences et options de confidentialité
        </p>
        {isDemo && (
          <div className="mt-2 bg-orange-100 border border-orange-200 rounded-lg p-2">
            <p className="text-sm text-orange-800">
              🎯 Compte de démonstration - Modifications simulées
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Apparence */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              Apparence
            </CardTitle>
            <CardDescription>
              Personnalisez l'apparence de l'interface
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Thème</Label>
              <Select 
                value={settings.theme} 
                onValueChange={(value: 'light' | 'dark' | 'system') => updateSettings('theme', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un thème" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Clair</SelectItem>
                  <SelectItem value="dark">Sombre</SelectItem>
                  <SelectItem value="system">Automatique</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Langue</Label>
              <Select 
                value={settings.language} 
                onValueChange={(value: 'fr' | 'en') => updateSettings('language', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une langue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </CardTitle>
            <CardDescription>
              Gérez vos préférences de notification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifications par email</Label>
                <p className="text-sm text-gray-500">
                  Recevez des notifications importantes par email
                </p>
              </div>
              <Switch
                checked={settings.notifications.email}
                onCheckedChange={(checked) => updateSettings('notifications.email', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifications push</Label>
                <p className="text-sm text-gray-500">
                  Recevez des notifications sur votre appareil
                </p>
              </div>
              <Switch
                checked={settings.notifications.push}
                onCheckedChange={(checked) => updateSettings('notifications.push', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Marketing</Label>
                <p className="text-sm text-gray-500">
                  Recevez nos actualités et conseils
                </p>
              </div>
              <Switch
                checked={settings.notifications.marketing}
                onCheckedChange={(checked) => updateSettings('notifications.marketing', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Confidentialité */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Confidentialité
            </CardTitle>
            <CardDescription>
              Contrôlez la confidentialité de vos données
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Partager les analyses</Label>
                <p className="text-sm text-gray-500">
                  Aidez-nous à améliorer nos services
                </p>
              </div>
              <Switch
                checked={settings.privacy.shareAnalytics}
                onCheckedChange={(checked) => updateSettings('privacy.shareAnalytics', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Afficher l'activité</Label>
                <p className="text-sm text-gray-500">
                  Montrer votre activité aux autres utilisateurs
                </p>
              </div>
              <Switch
                checked={settings.privacy.showActivity}
                onCheckedChange={(checked) => updateSettings('privacy.showActivity', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Actions
            </CardTitle>
            <CardDescription>
              Gérez votre compte et vos données
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleSave} disabled={isSaving} className="w-full">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sauvegarde en cours...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder les paramètres
                </>
              )}
            </Button>

            <Button variant="outline" className="w-full">
              Exporter mes données
            </Button>

            <Button variant="destructive" className="w-full">
              Supprimer mon compte
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
