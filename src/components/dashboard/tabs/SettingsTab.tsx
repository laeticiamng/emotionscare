// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Settings,
  Bell,
  Palette,
  Layout,
  Eye,
  Clock,
  Globe,
  Shield,
  Save,
  RotateCcw,
  Monitor,
  Smartphone,
  Moon,
  Sun,
  Zap,
  BarChart3,
  Heart,
  Calendar,
  Mail,
  MessageSquare,
  Volume2,
  Vibrate,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export interface SettingsTabProps {
  className?: string;
}

interface DashboardSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  refreshInterval: number;
  compactMode: boolean;
  showAnimations: boolean;
  defaultView: 'overview' | 'analytics' | 'goals';
  dataRetention: number;
  widgets: {
    emotionalOverview: boolean;
    weeklyProgress: boolean;
    quickActions: boolean;
    insights: boolean;
    recentActivity: boolean;
    goals: boolean;
  };
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
    sound: boolean;
    vibration: boolean;
    dailyDigest: boolean;
    weeklyReport: boolean;
    achievements: boolean;
    reminders: boolean;
    quietHoursStart: string;
    quietHoursEnd: string;
  };
  privacy: {
    shareAnonymousData: boolean;
    showOnLeaderboard: boolean;
    allowTeamView: boolean;
  };
}

const defaultSettings: DashboardSettings = {
  theme: 'system',
  language: 'fr',
  refreshInterval: 30,
  compactMode: false,
  showAnimations: true,
  defaultView: 'overview',
  dataRetention: 90,
  widgets: {
    emotionalOverview: true,
    weeklyProgress: true,
    quickActions: true,
    insights: true,
    recentActivity: true,
    goals: true,
  },
  notifications: {
    email: true,
    push: true,
    inApp: true,
    sound: true,
    vibration: false,
    dailyDigest: true,
    weeklyReport: true,
    achievements: true,
    reminders: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
  },
  privacy: {
    shareAnonymousData: true,
    showOnLeaderboard: true,
    allowTeamView: true,
  },
};

const SettingsTab: React.FC<SettingsTabProps> = ({ className }) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<DashboardSettings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);

  const updateSettings = <K extends keyof DashboardSettings>(
    key: K,
    value: DashboardSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const updateNestedSettings = <
    K extends keyof DashboardSettings,
    NK extends keyof DashboardSettings[K]
  >(
    key: K,
    nestedKey: NK,
    value: DashboardSettings[K][NK]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] as object),
        [nestedKey]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Save settings logic here
    toast({
      title: 'Paramètres enregistrés',
      description: 'Vos préférences ont été mises à jour.',
    });
    setHasChanges(false);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setHasChanges(true);
    toast({
      title: 'Paramètres réinitialisés',
      description: 'Les paramètres par défaut ont été restaurés.',
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            Paramètres du tableau de bord
          </h2>
          <p className="text-muted-foreground">
            Personnalisez votre expérience EmotionsCare
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="h-4 w-4 mr-2" />
            Enregistrer
          </Button>
        </div>
      </div>

      {hasChanges && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Modifications non enregistrées
          </Badge>
        </motion.div>
      )}

      <Tabs defaultValue="appearance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="appearance">
            <Palette className="h-4 w-4 mr-2" />
            Apparence
          </TabsTrigger>
          <TabsTrigger value="widgets">
            <Layout className="h-4 w-4 mr-2" />
            Widgets
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Shield className="h-4 w-4 mr-2" />
            Confidentialité
          </TabsTrigger>
        </TabsList>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Thème et affichage
              </CardTitle>
              <CardDescription>
                Personnalisez l'apparence de votre tableau de bord
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Thème</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'light', label: 'Clair', icon: Sun },
                    { value: 'dark', label: 'Sombre', icon: Moon },
                    { value: 'system', label: 'Système', icon: Monitor },
                  ].map((theme) => {
                    const Icon = theme.icon;
                    return (
                      <Button
                        key={theme.value}
                        variant={settings.theme === theme.value ? 'default' : 'outline'}
                        className="h-auto flex-col py-4"
                        onClick={() =>
                          updateSettings('theme', theme.value as any)
                        }
                      >
                        <Icon className="h-6 w-6 mb-2" />
                        {theme.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Langue</Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) => updateSettings('language', value)}
                >
                  <SelectTrigger>
                    <Globe className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Vue par défaut</Label>
                <Select
                  value={settings.defaultView}
                  onValueChange={(value: any) =>
                    updateSettings('defaultView', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overview">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Vue d'ensemble
                      </div>
                    </SelectItem>
                    <SelectItem value="analytics">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Analytiques
                      </div>
                    </SelectItem>
                    <SelectItem value="goals">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        Objectifs
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mode compact</Label>
                  <p className="text-sm text-muted-foreground">
                    Réduire l'espacement pour afficher plus de contenu
                  </p>
                </div>
                <Switch
                  checked={settings.compactMode}
                  onCheckedChange={(checked) =>
                    updateSettings('compactMode', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Animations</Label>
                  <p className="text-sm text-muted-foreground">
                    Activer les animations et transitions
                  </p>
                </div>
                <Switch
                  checked={settings.showAnimations}
                  onCheckedChange={(checked) =>
                    updateSettings('showAnimations', checked)
                  }
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Intervalle de rafraîchissement: {settings.refreshInterval}s</Label>
                </div>
                <Slider
                  value={[settings.refreshInterval]}
                  onValueChange={([value]) =>
                    updateSettings('refreshInterval', value)
                  }
                  min={10}
                  max={120}
                  step={10}
                />
                <p className="text-xs text-muted-foreground">
                  Fréquence de mise à jour automatique des données
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Widgets Tab */}
        <TabsContent value="widgets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5" />
                Widgets visibles
              </CardTitle>
              <CardDescription>
                Choisissez les widgets à afficher sur votre tableau de bord
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  key: 'emotionalOverview',
                  label: 'Aperçu émotionnel',
                  description: 'Graphique de vos émotions récentes',
                  icon: Heart,
                },
                {
                  key: 'weeklyProgress',
                  label: 'Progression hebdomadaire',
                  description: 'Résumé de votre semaine',
                  icon: Calendar,
                },
                {
                  key: 'quickActions',
                  label: 'Actions rapides',
                  description: 'Boutons d\'accès rapide aux fonctionnalités',
                  icon: Zap,
                },
                {
                  key: 'insights',
                  label: 'Insights IA',
                  description: 'Recommandations personnalisées',
                  icon: BarChart3,
                },
                {
                  key: 'recentActivity',
                  label: 'Activité récente',
                  description: 'Historique de vos dernières actions',
                  icon: Clock,
                },
                {
                  key: 'goals',
                  label: 'Objectifs',
                  description: 'Suivi de vos objectifs bien-être',
                  icon: Heart,
                },
              ].map((widget) => {
                const Icon = widget.icon;
                return (
                  <div
                    key={widget.key}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <Label>{widget.label}</Label>
                        <p className="text-sm text-muted-foreground">
                          {widget.description}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.widgets[widget.key as keyof typeof settings.widgets]}
                      onCheckedChange={(checked) =>
                        updateNestedSettings('widgets', widget.key as any, checked)
                      }
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Canaux de notification
              </CardTitle>
              <CardDescription>
                Choisissez comment recevoir vos notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  key: 'email',
                  label: 'Email',
                  description: 'Recevoir des notifications par email',
                  icon: Mail,
                },
                {
                  key: 'push',
                  label: 'Push',
                  description: 'Notifications push sur vos appareils',
                  icon: Smartphone,
                },
                {
                  key: 'inApp',
                  label: 'In-app',
                  description: 'Notifications dans l\'application',
                  icon: MessageSquare,
                },
                {
                  key: 'sound',
                  label: 'Son',
                  description: 'Jouer un son pour les notifications',
                  icon: Volume2,
                },
                {
                  key: 'vibration',
                  label: 'Vibration',
                  description: 'Vibrer pour les notifications (mobile)',
                  icon: Vibrate,
                },
              ].map((channel) => {
                const Icon = channel.icon;
                return (
                  <div
                    key={channel.key}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <Label>{channel.label}</Label>
                        <p className="text-sm text-muted-foreground">
                          {channel.description}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={
                        settings.notifications[
                          channel.key as keyof typeof settings.notifications
                        ] as boolean
                      }
                      onCheckedChange={(checked) =>
                        updateNestedSettings(
                          'notifications',
                          channel.key as any,
                          checked
                        )
                      }
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Types de notifications</CardTitle>
              <CardDescription>
                Sélectionnez les notifications que vous souhaitez recevoir
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  key: 'dailyDigest',
                  label: 'Résumé quotidien',
                  description: 'Un récap de votre journée chaque soir',
                },
                {
                  key: 'weeklyReport',
                  label: 'Rapport hebdomadaire',
                  description: 'Analyse détaillée de votre semaine',
                },
                {
                  key: 'achievements',
                  label: 'Succès et badges',
                  description: 'Quand vous débloquez un succès',
                },
                {
                  key: 'reminders',
                  label: 'Rappels',
                  description: 'Rappels de scan et d\'activités',
                },
              ].map((notif) => (
                <div
                  key={notif.key}
                  className="flex items-center justify-between"
                >
                  <div>
                    <Label>{notif.label}</Label>
                    <p className="text-sm text-muted-foreground">
                      {notif.description}
                    </p>
                  </div>
                  <Switch
                    checked={
                      settings.notifications[
                        notif.key as keyof typeof settings.notifications
                      ] as boolean
                    }
                    onCheckedChange={(checked) =>
                      updateNestedSettings(
                        'notifications',
                        notif.key as any,
                        checked
                      )
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="h-5 w-5" />
                Heures calmes
              </CardTitle>
              <CardDescription>
                Période sans notifications (sauf urgences)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Début</Label>
                  <Select
                    value={settings.notifications.quietHoursStart}
                    onValueChange={(value) =>
                      updateNestedSettings(
                        'notifications',
                        'quietHoursStart',
                        value
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0');
                        return (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Fin</Label>
                  <Select
                    value={settings.notifications.quietHoursEnd}
                    onValueChange={(value) =>
                      updateNestedSettings(
                        'notifications',
                        'quietHoursEnd',
                        value
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0');
                        return (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Paramètres de confidentialité
              </CardTitle>
              <CardDescription>
                Contrôlez comment vos données sont partagées
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Partager des données anonymes</Label>
                  <p className="text-sm text-muted-foreground">
                    Aider à améliorer EmotionsCare avec des données anonymisées
                  </p>
                </div>
                <Switch
                  checked={settings.privacy.shareAnonymousData}
                  onCheckedChange={(checked) =>
                    updateNestedSettings('privacy', 'shareAnonymousData', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Apparaître dans le classement</Label>
                  <p className="text-sm text-muted-foreground">
                    Permettre aux autres de voir votre position
                  </p>
                </div>
                <Switch
                  checked={settings.privacy.showOnLeaderboard}
                  onCheckedChange={(checked) =>
                    updateNestedSettings('privacy', 'showOnLeaderboard', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Visibilité équipe</Label>
                  <p className="text-sm text-muted-foreground">
                    Permettre à votre manager de voir vos statistiques agrégées
                  </p>
                </div>
                <Switch
                  checked={settings.privacy.allowTeamView}
                  onCheckedChange={(checked) =>
                    updateNestedSettings('privacy', 'allowTeamView', checked)
                  }
                />
              </div>

              <div className="space-y-3">
                <Label>Conservation des données: {settings.dataRetention} jours</Label>
                <Slider
                  value={[settings.dataRetention]}
                  onValueChange={([value]) =>
                    updateSettings('dataRetention', value)
                  }
                  min={30}
                  max={365}
                  step={30}
                />
                <p className="text-xs text-muted-foreground">
                  Durée de conservation de vos données détaillées
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Zone de danger</CardTitle>
              <CardDescription>
                Actions irréversibles sur votre compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                Exporter toutes mes données
              </Button>
              <Button variant="destructive" className="w-full">
                Supprimer mon compte
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsTab;
