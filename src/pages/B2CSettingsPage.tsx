/**
 * B2C SETTINGS PAGE - EMOTIONSCARE
 * Page des paramètres B2C accessible WCAG 2.1 AA
 * Avec persistance réelle via useUserSettings
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Settings, Bell, Palette, Heart, Shield, Loader2, AlertCircle } from "lucide-react";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useToast } from "@/hooks/use-toast";

const B2CSettingsPage = () => {
  const { settings, loading, saving, updateSettings, resetSettings, error: settingsError } = useUserSettings();
  const { toast } = useToast();

  // Local state pour les modifications non sauvegardées
  const [localSettings, setLocalSettings] = useState({
    notifications: true,
    darkMode: false,
    autoScan: false,
    privacyMode: false,
    language: 'fr',
  });

  // Charger les settings dans le state local quand ils arrivent
  useEffect(() => {
    if (settings) {
      setLocalSettings({
        notifications: settings.email_notifications ?? true,
        darkMode: settings.theme === 'dark',
        autoScan: settings.auto_suggestions ?? false,
        privacyMode: settings.profile_visibility === 'private',
        language: settings.language ?? 'fr',
      });
    }
  }, [settings]);

  // Focus management pour l'accessibilité
  useEffect(() => {
    document.title = "Paramètres | EmotionsCare - Personnalisation";
  }, []);

  // Vérifier si des changements ont été faits
  const hasChanges = settings ? (
    localSettings.notifications !== (settings.email_notifications ?? true) ||
    localSettings.darkMode !== (settings.theme === 'dark') ||
    localSettings.autoScan !== (settings.auto_suggestions ?? false) ||
    localSettings.privacyMode !== (settings.profile_visibility === 'private') ||
    localSettings.language !== (settings.language ?? 'fr')
  ) : false;

  const handleSave = async () => {
    try {
      await updateSettings({
        email_notifications: localSettings.notifications,
        theme: localSettings.darkMode ? 'dark' : 'light',
        auto_suggestions: localSettings.autoScan,
        profile_visibility: localSettings.privacyMode ? 'private' : 'friends',
        language: localSettings.language,
      });

      toast({
        title: "Paramètres sauvegardés",
        description: "Vos modifications ont été enregistrées avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive",
      });
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir réinitialiser tous les paramètres aux valeurs par défaut ?")) {
      return;
    }

    try {
      await resetSettings();
      toast({
        title: "Paramètres réinitialisés",
        description: "Tous les paramètres ont été restaurés aux valeurs par défaut",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de réinitialiser les paramètres",
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement des paramètres...</span>
      </div>
    );
  }

  const settingsCategories = [
    {
      title: "Notifications",
      icon: <Bell className="w-5 h-5" />,
      description: "Gérez vos préférences de notifications",
      settings: [
        {
          id: "push-notifications",
          label: "Notifications push",
          description: "Recevoir des notifications sur votre appareil",
          value: localSettings.notifications,
          onChange: (value: boolean) => setLocalSettings(prev => ({ ...prev, notifications: value }))
        },
      ]
    },
    {
      title: "Apparence",
      icon: <Palette className="w-5 h-5" />,
      description: "Personnalisez l'interface utilisateur",
      settings: [
        {
          id: "dark-mode",
          label: "Mode sombre",
          description: "Utiliser le thème sombre",
          value: localSettings.darkMode,
          onChange: (value: boolean) => setLocalSettings(prev => ({ ...prev, darkMode: value }))
        }
      ]
    },
    {
      title: "Émotions & Scan",
      icon: <Heart className="w-5 h-5" />,
      description: "Paramètres de reconnaissance émotionnelle",
      settings: [
        {
          id: "auto-scan",
          label: "Scan automatique",
          description: "Scanner vos émotions automatiquement",
          value: localSettings.autoScan,
          onChange: (value: boolean) => setLocalSettings(prev => ({ ...prev, autoScan: value }))
        }
      ]
    },
    {
      title: "Confidentialité",
      icon: <Shield className="w-5 h-5" />,
      description: "Contrôlez vos données personnelles",
      settings: [
        {
          id: "privacy-mode",
          label: "Mode privé",
          description: "Ne pas stocker l'historique des scans",
          value: localSettings.privacyMode,
          onChange: (value: boolean) => setLocalSettings(prev => ({ ...prev, privacyMode: value }))
        }
      ]
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="w-8 h-8 text-primary" aria-hidden="true" />
              <h1 className="text-3xl font-bold text-foreground">
                Paramètres
              </h1>
            </div>
            <p className="text-muted-foreground">
              Personnalisez votre expérience EmotionsCare
            </p>
          </header>

          <main>
            {/* Alerte d'erreur */}
            {settingsError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{settingsError}</AlertDescription>
              </Alert>
            )}

            {/* Alerte de modifications non sauvegardées */}
            {hasChanges && (
              <Alert className="mb-6 bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-900">
                  Vous avez des modifications non sauvegardées
                </AlertDescription>
              </Alert>
            )}

            {/* Catégories de paramètres */}
            {settingsCategories.map((category, index) => (
              <section
                key={index}
                className="mb-6"
                aria-labelledby={`category-${index}-title`}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="text-primary" aria-hidden="true">
                        {category.icon}
                      </div>
                      <div>
                        <CardTitle id={`category-${index}-title`}>
                          {category.title}
                        </CardTitle>
                        <CardDescription>
                          {category.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {category.settings.map((setting) => (
                      <div
                        key={setting.id}
                        className="flex items-center justify-between p-4 rounded-lg hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex-1">
                          <label
                            htmlFor={setting.id}
                            className="font-medium text-foreground cursor-pointer"
                          >
                            {setting.label}
                          </label>
                          <p className="text-sm text-muted-foreground">
                            {setting.description}
                          </p>
                        </div>
                        <Switch
                          id={setting.id}
                          checked={setting.value}
                          onCheckedChange={setting.onChange}
                          aria-label={setting.label}
                          className="ml-4"
                          onKeyDown={(e) => handleKeyDown(e, () => setting.onChange(!setting.value))}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </section>
            ))}

            {/* Préférences linguistiques */}
            <section className="mb-6" aria-labelledby="language-title">
              <Card>
                <CardHeader>
                  <CardTitle id="language-title">
                    Langue et Région
                  </CardTitle>
                  <CardDescription>
                    Sélectionnez votre langue préférée
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Langue</h3>
                      <p className="text-sm text-muted-foreground">Choisir la langue de l'interface</p>
                    </div>
                    <Select
                      value={localSettings.language}
                      onValueChange={(value) => setLocalSettings(prev => ({ ...prev, language: value }))}
                    >
                      <SelectTrigger className="w-40" aria-label="Sélectionner la langue">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Fuseau horaire</h3>
                      <p className="text-sm text-muted-foreground">Votre fuseau horaire local</p>
                    </div>
                    <Badge variant="secondary" role="status" aria-label="Fuseau horaire actuel">
                      Europe/Paris
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Actions */}
            <nav aria-label="Actions des paramètres" className="flex gap-4 justify-center">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={saving}
                className="focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Réinitialiser tous les paramètres aux valeurs par défaut"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Réinitialiser
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasChanges || saving}
                className="focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Sauvegarder toutes les modifications des paramètres"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Sauvegarde...
                  </>
                ) : (
                  'Sauvegarder les modifications'
                )}
              </Button>
            </nav>
          </main>
        </div>
      </div>
    </>
  );
};

export default B2CSettingsPage;
