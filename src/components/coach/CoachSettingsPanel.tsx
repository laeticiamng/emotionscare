import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Settings,
  Bell,
  Globe,
  Shield,
  Palette,
  Volume2,
  Database,
  LogOut,
  ChevronRight,
} from 'lucide-react';

interface CoachSettings {
  language: string;
  mode: string;
  theme: string;
  notifications: {
    dailyCheckIn: boolean;
    emotionalAlerts: boolean;
    recommendations: boolean;
    newFeatures: boolean;
  };
  preferences: {
    coachPersonality: string;
    responseLength: string;
    meditationLanguage: string;
  };
  privacy: {
    dataCollection: boolean;
    analytics: boolean;
    sharing: boolean;
  };
}

export const CoachSettingsPanel = () => {
  const [settings, setSettings] = useState<CoachSettings>({
    language: 'fr',
    mode: 'b2c',
    theme: 'system',
    notifications: {
      dailyCheckIn: true,
      emotionalAlerts: true,
      recommendations: true,
      newFeatures: false,
    },
    preferences: {
      coachPersonality: 'warm',
      responseLength: 'brief',
      meditationLanguage: 'fr',
    },
    privacy: {
      dataCollection: true,
      analytics: true,
      sharing: false,
    },
  });

  const [showReset, setShowReset] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Simuler la sauvegarde
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    // Réinitialiser aux valeurs par défaut
    setSettings({
      language: 'fr',
      mode: 'b2c',
      theme: 'system',
      notifications: {
        dailyCheckIn: true,
        emotionalAlerts: true,
        recommendations: true,
        newFeatures: false,
      },
      preferences: {
        coachPersonality: 'warm',
        responseLength: 'brief',
        meditationLanguage: 'fr',
      },
      privacy: {
        dataCollection: true,
        analytics: true,
        sharing: false,
      },
    });
    setShowReset(false);
    handleSave();
  };

  return (
    <div className="space-y-6 w-full">
      {/* En-tête */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="w-8 h-8 text-slate-900 dark:text-white" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Paramètres Coach
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          Personnalisez votre expérience avec votre coach émotionnel IA
        </p>
      </div>

      {/* Message de confirmation */}
      {saved && (
        <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-800 dark:text-green-200 text-sm font-medium">
            ✓ Paramètres enregistrés avec succès
          </p>
        </div>
      )}

      {/* Paramètres généraux */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Paramètres généraux
          </CardTitle>
          <CardDescription>
            Configuration de base de votre coach
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Langue */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block">Langue</Label>
              <Select value={settings.language} onValueChange={(value) =>
                setSettings({ ...settings, language: value })
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français 🇫🇷</SelectItem>
                  <SelectItem value="en">English 🇬🇧</SelectItem>
                  <SelectItem value="es">Español 🇪🇸</SelectItem>
                  <SelectItem value="de">Deutsch 🇩🇪</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mode */}
            <div>
              <Label className="mb-2 block">Mode Coach</Label>
              <Select value={settings.mode} onValueChange={(value) =>
                setSettings({ ...settings, mode: value })
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="b2c">Personnel (B2C) - Chaleureux</SelectItem>
                  <SelectItem value="b2b">Professionnel (B2B) - Formel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Thème */}
          <div>
            <Label className="mb-2 block">Thème</Label>
            <Select value={settings.theme} onValueChange={(value) =>
              setSettings({ ...settings, theme: value })
            }>
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

      {/* Préférences Coach */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Préférences du coach
          </CardTitle>
          <CardDescription>
            Personnalisez la manière dont votre coach interagit avec vous
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Personnalité du coach */}
          <div>
            <Label className="mb-2 block">Personnalité du coach</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'warm', label: 'Chaleureux 🤗', desc: 'Empathique et personnel' },
                { value: 'analytical', label: 'Analytique 🧠', desc: 'Logique et structuré' },
                { value: 'motivating', label: 'Motivant 💪', desc: 'Inspirant et énergique' },
                { value: 'supportive', label: 'Bienveillant 🫂', desc: 'Réconfortant et doux' },
              ].map((personality) => (
                <button
                  key={personality.value}
                  onClick={() =>
                    setSettings({
                      ...settings,
                      preferences: { ...settings.preferences, coachPersonality: personality.value },
                    })
                  }
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    settings.preferences.coachPersonality === personality.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <p className="font-semibold">{personality.label}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{personality.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Longueur des réponses */}
          <div>
            <Label className="mb-2 block">Longueur des réponses</Label>
            <Select value={settings.preferences.responseLength} onValueChange={(value) =>
              setSettings({
                ...settings,
                preferences: { ...settings.preferences, responseLength: value },
              })
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="micro">Ultra-court (≤7 mots)</SelectItem>
                <SelectItem value="brief">Bref (≤25 mots)</SelectItem>
                <SelectItem value="medium">Moyen (≤100 mots)</SelectItem>
                <SelectItem value="detailed">Détaillé (sans limite)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Langue de la méditation */}
          <div>
            <Label className="mb-2 block">Langue des guidages de méditation</Label>
            <Select value={settings.preferences.meditationLanguage} onValueChange={(value) =>
              setSettings({
                ...settings,
                preferences: { ...settings.preferences, meditationLanguage: value },
              })
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">Anglais</SelectItem>
                <SelectItem value="instrumental">Musique uniquement (sans voix)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Contrôlez quand votre coach vous contacte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
            <div>
              <p className="font-medium">Check-in quotidien</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Rapide question sur votre bien-être
              </p>
            </div>
            <Switch
              checked={settings.notifications.dailyCheckIn}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, dailyCheckIn: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
            <div>
              <p className="font-medium">Alertes émotionnelles</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Notifications si émotions négatives détectées
              </p>
            </div>
            <Switch
              checked={settings.notifications.emotionalAlerts}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, emotionalAlerts: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
            <div>
              <p className="font-medium">Recommandations</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Suggestions personnalisées selon votre historique
              </p>
            </div>
            <Switch
              checked={settings.notifications.recommendations}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, recommendations: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
            <div>
              <p className="font-medium">Nouvelles fonctionnalités</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Annonces sur les mises à jour et nouvelles features
              </p>
            </div>
            <Switch
              checked={settings.notifications.newFeatures}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, newFeatures: checked },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Confidentialité & Données */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Confidentialité & Données
          </CardTitle>
          <CardDescription>
            Contrôlez comment vos données sont utilisées
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
            <div>
              <p className="font-medium">Collecte de données</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Améliorer vos expériences via vos interactions
              </p>
            </div>
            <Switch
              checked={settings.privacy.dataCollection}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  privacy: { ...settings.privacy, dataCollection: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
            <div>
              <p className="font-medium">Analyse & Télémétrie</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Partager des données anonymisées avec nos chercheurs
              </p>
            </div>
            <Switch
              checked={settings.privacy.analytics}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  privacy: { ...settings.privacy, analytics: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
            <div>
              <p className="font-medium">Partage social</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Permettre le partage de conversations avec tiers
              </p>
            </div>
            <Switch
              checked={settings.privacy.sharing}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  privacy: { ...settings.privacy, sharing: checked },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Gestion des données */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Gestion des données
          </CardTitle>
          <CardDescription>
            Téléchargez ou supprimez vos données personnelles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start gap-2">
            <Volume2 className="w-4 h-4" />
            Télécharger mon historique
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2 text-red-600 dark:text-red-400 hover:text-red-700">
            <Database className="w-4 h-4" />
            Supprimer toutes les données personnelles
          </Button>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 justify-between sticky bottom-0 bg-white dark:bg-slate-950 p-4 -mx-6 -mb-6 px-6">
        <Button
          variant="outline"
          onClick={() => setShowReset(true)}
        >
          Réinitialiser aux défauts
        </Button>
        <div className="flex gap-3">
          <Button variant="outline">
            Annuler
          </Button>
          <Button onClick={handleSave}>
            Enregistrer les modifications
          </Button>
        </div>
      </div>

      {/* Dialog de réinitialisation */}
      <AlertDialog open={showReset} onOpenChange={setShowReset}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Réinitialiser tous les paramètres?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action réinitialisera tous les paramètres à leurs valeurs par défaut.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReset}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Réinitialiser
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
