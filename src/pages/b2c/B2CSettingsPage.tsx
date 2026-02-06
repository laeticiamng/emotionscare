/**
 * B2C SETTINGS PAGE - EMOTIONSCARE
 * Page des paramètres généraux complète et accessible WCAG 2.1 AA
 * Avec persistance Supabase via useUserSettings
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { logger } from '@/lib/logger';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Settings, Bell, Palette, Heart, Shield, Loader2, AlertCircle,
  Globe, Clock, Monitor, Moon, Sun, Volume2, VolumeX, Upload,
  Accessibility, Eye, Download, Trash2, RefreshCw, Save, History,
  Smartphone, Database, CheckCircle2, Info, HardDrive, Zap, TestTube2,
  Lock, Sparkles, User, BellRing
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useToast } from "@/hooks/use-toast";
import { useAccessibility } from "@/hooks/useAccessibility";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import PageRoot from "@/components/common/PageRoot";

// Timezones communes
const TIMEZONES = [
  { value: 'Europe/Paris', label: 'Paris (UTC+1/+2)' },
  { value: 'Europe/London', label: 'Londres (UTC+0/+1)' },
  { value: 'Europe/Brussels', label: 'Bruxelles (UTC+1/+2)' },
  { value: 'Europe/Berlin', label: 'Berlin (UTC+1/+2)' },
  { value: 'America/New_York', label: 'New York (UTC-5/-4)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (UTC-8/-7)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (UTC+9)' },
  { value: 'Australia/Sydney', label: 'Sydney (UTC+10/+11)' },
];

const LANGUAGES = [
  { value: 'fr', label: 'Français', flag: '🇫🇷' },
  { value: 'en', label: 'English', flag: '🇬🇧' },
  { value: 'es', label: 'Español', flag: '🇪🇸' },
  { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

const FONT_SIZES = [
  { value: 'small', label: 'Petit' },
  { value: 'medium', label: 'Moyen' },
  { value: 'large', label: 'Grand' },
];

const COLOR_SCHEMES = [
  { value: 'default', label: 'Par défaut', colors: ['#8B5CF6', '#3B82F6'] },
  { value: 'ocean', label: 'Océan', colors: ['#06B6D4', '#0EA5E9'] },
  { value: 'forest', label: 'Forêt', colors: ['#10B981', '#22C55E'] },
  { value: 'sunset', label: 'Coucher de soleil', colors: ['#F59E0B', '#EF4444'] },
  { value: 'lavender', label: 'Lavande', colors: ['#A855F7', '#EC4899'] },
];

const REMINDER_TIMES = [
  { value: '07:00', label: '07:00 - Matin tôt' },
  { value: '09:00', label: '09:00 - Matin' },
  { value: '12:00', label: '12:00 - Midi' },
  { value: '18:00', label: '18:00 - Soir' },
  { value: '21:00', label: '21:00 - Nuit' },
];

const PREFERRED_MODULES = [
  { value: 'scan', label: 'Scan émotionnel' },
  { value: 'breathwork', label: 'Respiration' },
  { value: 'journal', label: 'Journal' },
  { value: 'meditation', label: 'Méditation' },
  { value: 'music', label: 'Musicothérapie' },
  { value: 'coach', label: 'Coach IA' },
];

const B2CSettingsPage = () => {
  const { settings, loading, saving, updateSettings, resetSettings, error: settingsError, reload } = useUserSettings();
  const { toast } = useToast();
  const { announce } = useAccessibility();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState('general');
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [storageInfo, setStorageInfo] = useState({ used: 0, max: 100, breakdown: { scans: 0, journal: 0, sessions: 0, other: 0 } });
  const [loadingStorage, setLoadingStorage] = useState(false);
  const [testingNotification, setTestingNotification] = useState(false);

  // Local state pour les modifications
  const [localSettings, setLocalSettings] = useState({
    // General
    language: 'fr',
    timezone: 'Europe/Paris',
    dailyReminderTime: null as string | null,
    preferredModules: [] as string[],
    // Appearance
    theme: 'auto' as 'light' | 'dark' | 'auto',
    colorScheme: 'default',
    fontSize: 'medium',
    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    reminderNotifications: true,
    socialNotifications: true,
    weeklyReports: true,
    achievementNotifications: true,
    // Privacy
    profileVisibility: 'friends' as 'public' | 'friends' | 'private',
    dataSharing: false,
    analyticsTracking: true,
    emotionDataRetentionDays: 365,
    // Accessibility
    highContrast: false,
    reduceAnimations: false,
    screenReaderMode: false,
    // Therapeutic
    autoSuggestions: true,
    emotionTrackingFrequency: 'medium',
    soundEnabled: true,
  });

  // Sync settings when loaded
  useEffect(() => {
    if (settings) {
      setLocalSettings({
        language: settings.language ?? 'fr',
        timezone: settings.timezone ?? 'Europe/Paris',
        dailyReminderTime: settings.daily_reminder_time ?? null,
        preferredModules: settings.preferred_modules ?? [],
        theme: settings.theme ?? 'auto',
        colorScheme: settings.color_scheme ?? 'default',
        fontSize: settings.font_size ?? 'medium',
        emailNotifications: settings.email_notifications ?? true,
        pushNotifications: settings.push_notifications ?? false,
        reminderNotifications: settings.reminder_notifications ?? true,
        socialNotifications: settings.social_notifications ?? true,
        weeklyReports: settings.weekly_reports ?? true,
        achievementNotifications: settings.achievement_notifications ?? true,
        profileVisibility: settings.profile_visibility ?? 'friends',
        dataSharing: settings.data_sharing ?? false,
        analyticsTracking: settings.analytics_tracking ?? true,
        emotionDataRetentionDays: settings.emotion_data_retention_days ?? 365,
        highContrast: settings.high_contrast ?? false,
        reduceAnimations: settings.reduce_animations ?? false,
        screenReaderMode: settings.screen_reader_mode ?? false,
        autoSuggestions: settings.auto_suggestions ?? true,
        emotionTrackingFrequency: settings.emotion_tracking_frequency ?? 'medium',
        soundEnabled: true,
      });
    }
  }, [settings]);

  // Load real storage info
  useEffect(() => {
    if (user?.id) {
      loadStorageInfo();
    }
  }, [user?.id]);

  const loadStorageInfo = async () => {
    if (!user?.id) return;
    setLoadingStorage(true);
    try {
      // Get counts from different tables to estimate storage
      const [scansResult, journalResult, sessionsResult] = await Promise.all([
        supabase.from('emotional_scans').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('journal_entries').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('session_tracking').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      ]);

      // Estimate storage based on record counts (rough estimate)
      const scansCount = scansResult.count || 0;
      const journalCount = journalResult.count || 0;
      const sessionsCount = sessionsResult.count || 0;

      const scansSize = scansCount * 0.5; // ~0.5 KB per scan
      const journalSize = journalCount * 2; // ~2 KB per journal entry
      const sessionsSize = sessionsCount * 0.3; // ~0.3 KB per session
      const otherSize = 3; // Base metadata

      const totalUsed = Math.round(scansSize + journalSize + sessionsSize + otherSize);

      setStorageInfo({
        used: Math.min(totalUsed, 100),
        max: 100,
        breakdown: {
          scans: Math.round(scansSize),
          journal: Math.round(journalSize),
          sessions: Math.round(sessionsSize),
          other: otherSize,
        }
      });
    } catch (err) {
      logger.error('Failed to load storage info:', err, 'SYSTEM');
    } finally {
      setLoadingStorage(false);
    }
  };

  // Check for unsaved changes
  const hasChanges = settings ? (
    localSettings.language !== (settings.language ?? 'fr') ||
    localSettings.timezone !== (settings.timezone ?? 'Europe/Paris') ||
    localSettings.theme !== (settings.theme ?? 'auto') ||
    localSettings.fontSize !== (settings.font_size ?? 'medium') ||
    localSettings.emailNotifications !== (settings.email_notifications ?? true) ||
    localSettings.pushNotifications !== (settings.push_notifications ?? false) ||
    localSettings.reminderNotifications !== (settings.reminder_notifications ?? true) ||
    localSettings.socialNotifications !== (settings.social_notifications ?? true) ||
    localSettings.weeklyReports !== (settings.weekly_reports ?? true) ||
    localSettings.achievementNotifications !== (settings.achievement_notifications ?? true) ||
    localSettings.profileVisibility !== (settings.profile_visibility ?? 'friends') ||
    localSettings.dataSharing !== (settings.data_sharing ?? false) ||
    localSettings.analyticsTracking !== (settings.analytics_tracking ?? true) ||
    localSettings.emotionDataRetentionDays !== (settings.emotion_data_retention_days ?? 365) ||
    localSettings.highContrast !== (settings.high_contrast ?? false) ||
    localSettings.reduceAnimations !== (settings.reduce_animations ?? false) ||
    localSettings.screenReaderMode !== (settings.screen_reader_mode ?? false) ||
    localSettings.autoSuggestions !== (settings.auto_suggestions ?? true) ||
    localSettings.emotionTrackingFrequency !== (settings.emotion_tracking_frequency ?? 'medium')
  ) : false;

  const handleSave = useCallback(async () => {
    try {
      await updateSettings({
        language: localSettings.language,
        timezone: localSettings.timezone,
        theme: localSettings.theme,
        color_scheme: localSettings.colorScheme,
        font_size: localSettings.fontSize as 'small' | 'medium' | 'large',
        email_notifications: localSettings.emailNotifications,
        push_notifications: localSettings.pushNotifications,
        reminder_notifications: localSettings.reminderNotifications,
        social_notifications: localSettings.socialNotifications,
        weekly_reports: localSettings.weeklyReports,
        achievement_notifications: localSettings.achievementNotifications,
        profile_visibility: localSettings.profileVisibility,
        data_sharing: localSettings.dataSharing,
        analytics_tracking: localSettings.analyticsTracking,
        emotion_data_retention_days: localSettings.emotionDataRetentionDays,
        high_contrast: localSettings.highContrast,
        reduce_animations: localSettings.reduceAnimations,
        screen_reader_mode: localSettings.screenReaderMode,
        auto_suggestions: localSettings.autoSuggestions,
        emotion_tracking_frequency: localSettings.emotionTrackingFrequency as 'low' | 'medium' | 'high',
        daily_reminder_time: localSettings.dailyReminderTime,
        preferred_modules: localSettings.preferredModules,
      });

      toast({
        title: "Paramètres sauvegardés",
        description: "Vos modifications ont été enregistrées",
      });
      announce('Paramètres sauvegardés avec succès');
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive",
      });
    }
  }, [updateSettings, localSettings, toast, announce]);

  const handleReset = useCallback(async () => {
    try {
      await resetSettings();
      setShowResetDialog(false);
      toast({
        title: "Paramètres réinitialisés",
        description: "Tous les paramètres ont été restaurés",
      });
      announce('Paramètres réinitialisés');
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de réinitialiser",
        variant: "destructive",
      });
    }
  }, [resetSettings, toast, announce]);

  const handleExportSettings = useCallback(() => {
    const exportData = {
      settings: localSettings,
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `emotionscare-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    setShowExportDialog(false);
    toast({
      title: "Export réussi",
      description: "Vos paramètres ont été exportés",
    });
    announce('Paramètres exportés');
  }, [localSettings, toast, announce]);

  const handleImportSettings = useCallback(async () => {
    if (!importFile) return;

    try {
      const text = await importFile.text();
      const data = JSON.parse(text);
      
      if (!data.settings || !data.version) {
        throw new Error('Format de fichier invalide');
      }

      // Validate and apply imported settings
      setLocalSettings(prev => ({
        ...prev,
        ...data.settings,
      }));

      setShowImportDialog(false);
      setImportFile(null);
      toast({
        title: "Import réussi",
        description: "Vos paramètres ont été importés. N'oubliez pas de sauvegarder.",
      });
      announce('Paramètres importés');
    } catch (err) {
      toast({
        title: "Erreur d'import",
        description: err instanceof Error ? err.message : "Fichier invalide",
        variant: "destructive",
      });
    }
  }, [importFile, toast, announce]);

  const handleTestNotification = useCallback(async () => {
    setTestingNotification(true);
    try {
      // Request notification permission if not granted
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification('EmotionsCare - Test', {
            body: 'Vos notifications fonctionnent correctement !',
            icon: '/favicon.ico',
          });
          toast({
            title: "Notification envoyée",
            description: "Vérifiez votre système de notifications",
          });
        } else {
          toast({
            title: "Permission refusée",
            description: "Veuillez autoriser les notifications dans votre navigateur",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Non supporté",
          description: "Les notifications ne sont pas supportées par votre navigateur",
          variant: "destructive",
        });
      }
    } finally {
      setTestingNotification(false);
    }
  }, [toast]);

  const togglePreferredModule = useCallback((moduleValue: string) => {
    setLocalSettings(prev => {
      const current = prev.preferredModules || [];
      if (current.includes(moduleValue)) {
        return { ...prev, preferredModules: current.filter(m => m !== moduleValue) };
      } else {
        return { ...prev, preferredModules: [...current, moduleValue] };
      }
    });
  }, []);

  if (loading) {
    return (
      <PageRoot>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 sr-only">Chargement des paramètres...</span>
        </div>
      </PageRoot>
    );
  }

  return (
    <PageRoot>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Header */}
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <Settings className="w-10 h-10 text-primary" />
                <div className="absolute -inset-2 rounded-full bg-primary/20 animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Paramètres Généraux
                </h1>
                <p className="text-muted-foreground">
                  Personnalisez votre expérience EmotionsCare
                </p>
              </div>
            </div>

            {/* Status badges */}
            <div className="flex flex-wrap gap-2">
              {hasChanges && (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Modifications non sauvegardées
                </Badge>
              )}
              <Badge variant="secondary">
                <Globe className="h-3 w-3 mr-1" />
                {LANGUAGES.find(l => l.value === localSettings.language)?.label}
              </Badge>
              <Badge variant="secondary">
                <Clock className="h-3 w-3 mr-1" />
                {TIMEZONES.find(t => t.value === localSettings.timezone)?.label.split(' ')[0]}
              </Badge>
            </div>
          </motion.header>

          {/* Error alert */}
          {settingsError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{settingsError}</AlertDescription>
            </Alert>
          )}

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 max-w-3xl">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Général</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">Apparence</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="accessibility" className="flex items-center gap-2">
                <Accessibility className="h-4 w-4" />
                <span className="hidden sm:inline">Accessibilité</span>
              </TabsTrigger>
              <TabsTrigger value="data" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span className="hidden sm:inline">Données</span>
              </TabsTrigger>
            </TabsList>

            {/* General Tab */}
            <TabsContent value="general" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-primary" />
                      Langue et Région
                    </CardTitle>
                    <CardDescription>
                      Personnalisez la langue et le fuseau horaire
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Language */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <label htmlFor="language" className="font-medium">Langue</label>
                        <p className="text-sm text-muted-foreground">Langue de l'interface</p>
                      </div>
                      <Select
                        value={localSettings.language}
                        onValueChange={(value) => setLocalSettings(prev => ({ ...prev, language: value }))}
                      >
                        <SelectTrigger className="w-48" id="language">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {LANGUAGES.map(lang => (
                            <SelectItem key={lang.value} value={lang.value}>
                              <span className="flex items-center gap-2">
                                <span>{lang.flag}</span>
                                <span>{lang.label}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    {/* Timezone */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <label htmlFor="timezone" className="font-medium">Fuseau horaire</label>
                        <p className="text-sm text-muted-foreground">Pour les rappels et notifications</p>
                      </div>
                      <Select
                        value={localSettings.timezone}
                        onValueChange={(value) => setLocalSettings(prev => ({ ...prev, timezone: value }))}
                      >
                        <SelectTrigger className="w-56" id="timezone">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TIMEZONES.map(tz => (
                            <SelectItem key={tz.value} value={tz.value}>
                              {tz.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Therapeutic Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-primary" />
                      Paramètres Thérapeutiques
                    </CardTitle>
                    <CardDescription>
                      Configuration du suivi émotionnel
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <SettingToggle
                      id="auto-suggestions"
                      label="Suggestions automatiques"
                      description="Recevoir des recommandations personnalisées"
                      checked={localSettings.autoSuggestions}
                      onCheckedChange={(value) => setLocalSettings(prev => ({ ...prev, autoSuggestions: value }))}
                    />

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <label className="font-medium">Fréquence du suivi</label>
                        <p className="text-sm text-muted-foreground">Nombre de rappels par jour</p>
                      </div>
                      <Select
                        value={localSettings.emotionTrackingFrequency}
                        onValueChange={(value) => setLocalSettings(prev => ({ ...prev, emotionTrackingFrequency: value }))}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Faible (1x/jour)</SelectItem>
                          <SelectItem value="medium">Moyen (3x/jour)</SelectItem>
                          <SelectItem value="high">Élevé (5x/jour)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    {/* Daily reminder time */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <label className="font-medium">Heure du rappel quotidien</label>
                        <p className="text-sm text-muted-foreground">Quand souhaitez-vous être rappelé</p>
                      </div>
                      <Select
                        value={localSettings.dailyReminderTime || '09:00'}
                        onValueChange={(value) => setLocalSettings(prev => ({ ...prev, dailyReminderTime: value }))}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Choisir une heure" />
                        </SelectTrigger>
                        <SelectContent>
                          {REMINDER_TIMES.map(time => (
                            <SelectItem key={time.value} value={time.value}>
                              {time.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    {/* Preferred modules */}
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="font-medium">Modules préférés</label>
                        <p className="text-sm text-muted-foreground">Les modules qui vous seront suggérés en priorité</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {PREFERRED_MODULES.map(module => (
                          <Badge
                            key={module.value}
                            variant={localSettings.preferredModules?.includes(module.value) ? 'default' : 'outline'}
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => togglePreferredModule(module.value)}
                          >
                            {localSettings.preferredModules?.includes(module.value) && (
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                            )}
                            {module.label}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <SettingToggle
                      id="sound-enabled"
                      label="Sons activés"
                      description="Activer les effets sonores"
                      checked={localSettings.soundEnabled}
                      onCheckedChange={(value) => setLocalSettings(prev => ({ ...prev, soundEnabled: value }))}
                      icon={localSettings.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5 text-primary" />
                      Thème et Affichage
                    </CardTitle>
                    <CardDescription>
                      Personnalisez l'apparence de l'application
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Theme Selector */}
                    <div className="space-y-3">
                      <label className="font-medium">Thème</label>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { value: 'light', label: 'Clair', icon: Sun },
                          { value: 'dark', label: 'Sombre', icon: Moon },
                          { value: 'auto', label: 'Auto', icon: Monitor },
                        ].map(({ value, label, icon: Icon }) => (
                          <button
                            key={value}
                            onClick={() => setLocalSettings(prev => ({ ...prev, theme: value as 'light' | 'dark' | 'auto' }))}
                            className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                              localSettings.theme === value 
                                ? 'border-primary bg-primary/10' 
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <Icon className={`h-6 w-6 ${localSettings.theme === value ? 'text-primary' : 'text-muted-foreground'}`} />
                            <span className={localSettings.theme === value ? 'font-medium' : ''}>{label}</span>
                            {localSettings.theme === value && (
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Font Size */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-medium">Taille de police</label>
                        <Badge variant="secondary">{FONT_SIZES.find(f => f.value === localSettings.fontSize)?.label}</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {FONT_SIZES.map(size => (
                          <button
                            key={size.value}
                            onClick={() => setLocalSettings(prev => ({ ...prev, fontSize: size.value }))}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              localSettings.fontSize === size.value 
                                ? 'border-primary bg-primary/10' 
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <span className={`${
                              size.value === 'small' ? 'text-sm' : 
                              size.value === 'large' ? 'text-lg' : 'text-base'
                            }`}>
                              {size.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Color Scheme */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-medium">Palette de couleurs</label>
                        <Badge variant="secondary">{COLOR_SCHEMES.find(c => c.value === localSettings.colorScheme)?.label}</Badge>
                      </div>
                      <div className="grid grid-cols-5 gap-3">
                        {COLOR_SCHEMES.map(scheme => (
                          <button
                            key={scheme.value}
                            onClick={() => setLocalSettings(prev => ({ ...prev, colorScheme: scheme.value }))}
                            className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                              localSettings.colorScheme === scheme.value 
                                ? 'border-primary bg-primary/10' 
                                : 'border-border hover:border-primary/50'
                            }`}
                            title={scheme.label}
                          >
                            <div className="flex gap-1">
                              {scheme.colors.map((color, idx) => (
                                <div 
                                  key={idx} 
                                  className="w-4 h-4 rounded-full" 
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                            <span className="text-xs truncate w-full text-center">{scheme.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-primary" />
                      Préférences de Notifications
                    </CardTitle>
                    <CardDescription>
                      Contrôlez quand et comment vous êtes notifié
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <SettingToggle
                      id="email-notifications"
                      label="Notifications email"
                      description="Recevoir des emails de rappel"
                      checked={localSettings.emailNotifications}
                      onCheckedChange={(value) => setLocalSettings(prev => ({ ...prev, emailNotifications: value }))}
                    />
                    <Separator />
                    <SettingToggle
                      id="push-notifications"
                      label="Notifications push"
                      description="Notifications sur votre appareil"
                      checked={localSettings.pushNotifications}
                      onCheckedChange={(value) => setLocalSettings(prev => ({ ...prev, pushNotifications: value }))}
                    />
                    <Separator />
                    <SettingToggle
                      id="reminder-notifications"
                      label="Rappels quotidiens"
                      description="Rappels de suivi émotionnel"
                      checked={localSettings.reminderNotifications}
                      onCheckedChange={(value) => setLocalSettings(prev => ({ ...prev, reminderNotifications: value }))}
                    />
                    <Separator />
                    <SettingToggle
                      id="social-notifications"
                      label="Notifications sociales"
                      description="Activité de vos amis"
                      checked={localSettings.socialNotifications}
                      onCheckedChange={(value) => setLocalSettings(prev => ({ ...prev, socialNotifications: value }))}
                    />
                    <Separator />
                    <SettingToggle
                      id="weekly-reports"
                      label="Rapports hebdomadaires"
                      description="Résumé de votre semaine"
                      checked={localSettings.weeklyReports}
                      onCheckedChange={(value) => setLocalSettings(prev => ({ ...prev, weeklyReports: value }))}
                    />
                    <Separator />
                    <SettingToggle
                      id="achievement-notifications"
                      label="Succès et badges"
                      description="Notification lors de nouveaux badges"
                      checked={localSettings.achievementNotifications}
                      onCheckedChange={(value) => setLocalSettings(prev => ({ ...prev, achievementNotifications: value }))}
                    />
                  </CardContent>
                </Card>

                {/* Test notification */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TestTube2 className="h-5 w-5 text-primary" />
                      Tester les notifications
                    </CardTitle>
                    <CardDescription>
                      Vérifiez que vos notifications fonctionnent
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleTestNotification}
                      disabled={testingNotification}
                    >
                      {testingNotification ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <BellRing className="h-4 w-4 mr-2" />
                      )}
                      Envoyer une notification test
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Accessibility Tab */}
            <TabsContent value="accessibility" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Accessibility className="h-5 w-5 text-primary" />
                      Options d'Accessibilité
                    </CardTitle>
                    <CardDescription>
                      Adaptez l'application à vos besoins - WCAG 2.1 AA
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <SettingToggle
                      id="high-contrast"
                      label="Contraste élevé"
                      description="Augmenter le contraste des couleurs"
                      checked={localSettings.highContrast}
                      onCheckedChange={(value) => setLocalSettings(prev => ({ ...prev, highContrast: value }))}
                      icon={<Eye className="h-4 w-4" />}
                    />
                    <Separator />
                    <SettingToggle
                      id="reduce-animations"
                      label="Réduire les animations"
                      description="Minimiser les mouvements à l'écran"
                      checked={localSettings.reduceAnimations}
                      onCheckedChange={(value) => setLocalSettings(prev => ({ ...prev, reduceAnimations: value }))}
                      icon={<Zap className="h-4 w-4" />}
                    />
                    <Separator />
                    <SettingToggle
                      id="screen-reader-mode"
                      label="Mode lecteur d'écran"
                      description="Optimiser pour les technologies d'assistance"
                      checked={localSettings.screenReaderMode}
                      onCheckedChange={(value) => setLocalSettings(prev => ({ ...prev, screenReaderMode: value }))}
                      icon={<Smartphone className="h-4 w-4" />}
                    />
                  </CardContent>
                </Card>

                {/* Info card */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium mb-1">Conformité WCAG 2.1 AA</h4>
                        <p className="text-sm text-muted-foreground">
                          EmotionsCare est conçu pour être accessible à tous. Nous suivons les directives 
                          WCAG 2.1 niveau AA pour garantir une expérience inclusive.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Data Tab */}
            <TabsContent value="data" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Storage Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HardDrive className="h-5 w-5 text-primary" />
                      Stockage des Données
                    </CardTitle>
                    <CardDescription>
                      Espace utilisé pour vos données
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {loadingStorage ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Espace utilisé</span>
                            <span className="font-medium">{storageInfo.used} Ko / {storageInfo.max} Mo</span>
                          </div>
                          <Progress value={(storageInfo.used / (storageInfo.max * 1024)) * 100} className="h-2" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="p-3 rounded-lg bg-muted/50">
                            <p className="text-muted-foreground">Scans émotionnels</p>
                            <p className="font-medium">~{storageInfo.breakdown.scans} Ko</p>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/50">
                            <p className="text-muted-foreground">Journal</p>
                            <p className="font-medium">~{storageInfo.breakdown.journal} Ko</p>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/50">
                            <p className="text-muted-foreground">Sessions</p>
                            <p className="font-medium">~{storageInfo.breakdown.sessions} Ko</p>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/50">
                            <p className="text-muted-foreground">Autre</p>
                            <p className="font-medium">~{storageInfo.breakdown.other} Ko</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={loadStorageInfo} className="w-full">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Actualiser
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Data Retention */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Conservation des Données
                    </CardTitle>
                    <CardDescription>
                      Durée de conservation de vos données émotionnelles
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Durée de conservation</span>
                        <Badge variant="secondary">{localSettings.emotionDataRetentionDays} jours</Badge>
                      </div>
                      <Slider
                        value={[localSettings.emotionDataRetentionDays]}
                        onValueChange={([value]) => setLocalSettings(prev => ({ ...prev, emotionDataRetentionDays: value }))}
                        min={30}
                        max={730}
                        step={30}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>30 jours</span>
                        <span>1 an</span>
                        <span>2 ans</span>
                      </div>
                    </div>

                    <Separator />

                    <SettingToggle
                      id="analytics-tracking"
                      label="Analyse anonyme"
                      description="Aider à améliorer l'application"
                      checked={localSettings.analyticsTracking}
                      onCheckedChange={(value) => setLocalSettings(prev => ({ ...prev, analyticsTracking: value }))}
                    />

                    <Separator />

                    <SettingToggle
                      id="data-sharing"
                      label="Partage de données"
                      description="Partager des données anonymes pour la recherche"
                      checked={localSettings.dataSharing}
                      onCheckedChange={(value) => setLocalSettings(prev => ({ ...prev, dataSharing: value }))}
                    />
                  </CardContent>
                </Card>

                {/* Privacy Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Visibilité du Profil
                    </CardTitle>
                    <CardDescription>
                      Contrôlez qui peut voir vos informations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <label className="font-medium">Visibilité</label>
                        <p className="text-sm text-muted-foreground">Qui peut voir votre profil</p>
                      </div>
                      <Select
                        value={localSettings.profileVisibility}
                        onValueChange={(value) => setLocalSettings(prev => ({ ...prev, profileVisibility: value as 'public' | 'friends' | 'private' }))}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="friends">Amis uniquement</SelectItem>
                          <SelectItem value="private">Privé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setShowExportDialog(true)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exporter mes paramètres
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setShowImportDialog(true)}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Importer des paramètres
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-destructive hover:text-destructive"
                      onClick={() => setShowResetDialog(true)}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Réinitialiser les paramètres
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>

          {/* Sticky Save Bar */}
          {hasChanges && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t p-4 z-50"
            >
              <div className="container mx-auto max-w-5xl flex items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  Vous avez des modifications non sauvegardées
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={reload} disabled={saving}>
                    Annuler
                  </Button>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sauvegarde...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Sauvegarder
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Reset Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-destructive" />
              Réinitialiser les paramètres
            </DialogTitle>
            <DialogDescription>
              Tous vos paramètres seront restaurés aux valeurs par défaut.
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetDialog(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleReset} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Réinitialiser
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              Exporter les paramètres
            </DialogTitle>
            <DialogDescription>
              Télécharger vos paramètres au format JSON pour les sauvegarder.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Le fichier inclura tous vos paramètres actuels : langue, thème, notifications, accessibilité, etc.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleExportSettings}>
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Importer des paramètres
            </DialogTitle>
            <DialogDescription>
              Restaurez vos paramètres depuis un fichier exporté.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="import-file">Fichier de paramètres</Label>
              <Input
                id="import-file"
                type="file"
                accept=".json"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                ref={fileInputRef}
              />
            </div>
            {importFile && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Fichier sélectionné : {importFile.name}
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowImportDialog(false); setImportFile(null); }}>
              Annuler
            </Button>
            <Button onClick={handleImportSettings} disabled={!importFile}>
              <Upload className="h-4 w-4 mr-2" />
              Importer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageRoot>
  );
};

// Reusable Setting Toggle Component
interface SettingToggleProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  icon?: React.ReactNode;
}

const SettingToggle: React.FC<SettingToggleProps> = ({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  icon,
}) => (
  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
    <div className="flex items-center gap-3 flex-1">
      {icon && <span className="text-muted-foreground">{icon}</span>}
      <div>
        <label htmlFor={id} className="font-medium cursor-pointer">
          {label}
        </label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
    <Switch
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      aria-label={label}
    />
  </div>
);

export default B2CSettingsPage;
