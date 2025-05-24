
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Settings, User, Bell, Shield, Palette, Globe, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    // Profile settings
    name: user?.user_metadata?.name || '',
    email: user?.email || '',
    
    // Notification settings
    emailNotifications: true,
    pushNotifications: true,
    weeklyReport: true,
    emotionAlerts: false,
    
    // Privacy settings
    dataSharing: false,
    analytics: true,
    
    // Appearance settings
    theme: 'system',
    language: 'fr',
    
    // Coach settings
    coachPersonality: 'empathetic',
    analysisDepth: 'detailed'
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Paramètres sauvegardés !');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Settings className="h-8 w-8 text-gray-600" />
          Paramètres
        </h1>
        <p className="text-muted-foreground">
          Personnalisez votre expérience EmotionsCare
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profil
            </CardTitle>
            <CardDescription>
              Informations personnelles et préférences de compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Nom complet</label>
              <Input
                value={settings.name}
                onChange={(e) => updateSetting('name', e.target.value)}
                placeholder="Votre nom complet"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <Input
                value={settings.email}
                onChange={(e) => updateSetting('email', e.target.value)}
                placeholder="votre.email@exemple.com"
                type="email"
              />
            </div>

            <Separator />

            <div>
              <label className="text-sm font-medium mb-2 block">Langue</label>
              <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
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

            <div>
              <label className="text-sm font-medium mb-2 block">Thème</label>
              <Select value={settings.theme} onValueChange={(value) => updateSetting('theme', value)}>
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
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Gérez vos préférences de notification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Notifications par email</label>
                <p className="text-xs text-muted-foreground">Recevez des updates par email</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Notifications push</label>
                <p className="text-xs text-muted-foreground">Notifications dans le navigateur</p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Rapport hebdomadaire</label>
                <p className="text-xs text-muted-foreground">Résumé de votre bien-être</p>
              </div>
              <Switch
                checked={settings.weeklyReport}
                onCheckedChange={(checked) => updateSetting('weeklyReport', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Alertes émotionnelles</label>
                <p className="text-xs text-muted-foreground">Suggestions basées sur votre humeur</p>
              </div>
              <Switch
                checked={settings.emotionAlerts}
                onCheckedChange={(checked) => updateSetting('emotionAlerts', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Confidentialité
            </CardTitle>
            <CardDescription>
              Contrôlez vos données et votre confidentialité
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Partage de données anonymes</label>
                <p className="text-xs text-muted-foreground">Aidez à améliorer le service</p>
              </div>
              <Switch
                checked={settings.dataSharing}
                onCheckedChange={(checked) => updateSetting('dataSharing', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Analytics</label>
                <p className="text-xs text-muted-foreground">Collecte de données d'utilisation</p>
              </div>
              <Switch
                checked={settings.analytics}
                onCheckedChange={(checked) => updateSetting('analytics', checked)}
              />
            </div>

            <Separator />

            <div className="text-center space-y-2">
              <Button variant="outline" size="sm">
                Télécharger mes données
              </Button>
              <p className="text-xs text-muted-foreground">
                Conformément au RGPD
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Coach Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Coach IA
            </CardTitle>
            <CardDescription>
              Personnalisez votre expérience avec le coach
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Personnalité du coach</label>
              <Select value={settings.coachPersonality} onValueChange={(value) => updateSetting('coachPersonality', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="empathetic">Empathique</SelectItem>
                  <SelectItem value="motivational">Motivant</SelectItem>
                  <SelectItem value="analytical">Analytique</SelectItem>
                  <SelectItem value="gentle">Doux</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Niveau d'analyse</label>
              <Select value={settings.analysisDepth} onValueChange={(value) => updateSetting('analysisDepth', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basique</SelectItem>
                  <SelectItem value="detailed">Détaillée</SelectItem>
                  <SelectItem value="comprehensive">Approfondie</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button onClick={handleSave} disabled={isSaving} size="lg" className="px-8">
          {isSaving ? (
            <>Sauvegarde...</>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Sauvegarder les modifications
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
