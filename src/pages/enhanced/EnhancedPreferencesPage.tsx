import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, Palette, Bell, Shield, Brain, Music, 
  Moon, Sun, Volume2, Vibrate, Globe, Clock,
  Heart, Activity, Zap, Target, Eye, Waves
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { ResponsiveWrapper } from '@/components/responsive/ResponsiveWrapper';
import { FunctionalButton } from '@/components/ui/functional-button';
import { motion } from 'framer-motion';

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
    wellness_reminders: boolean;
    journal_prompts: boolean;
    mood_tracking: boolean;
  };
  wellness: {
    preferred_session_duration: number;
    breathing_pace: number;
    music_genre_preferences: string[];
    intensity_level: 'low' | 'medium' | 'high';
    focus_areas: string[];
  };
  privacy: {
    data_sharing: boolean;
    analytics: boolean;
    personalization: boolean;
    location_tracking: boolean;
  };
  accessibility: {
    high_contrast: boolean;
    large_text: boolean;
    reduced_motion: boolean;
    voice_navigation: boolean;
    screen_reader: boolean;
  };
  ai_coach: {
    personality: 'supportive' | 'motivational' | 'analytical' | 'gentle';
    communication_style: 'formal' | 'casual' | 'friendly';
    intervention_frequency: number;
    advanced_insights: boolean;
  };
}

const EnhancedPreferencesPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'auto',
    language: 'fr',
    timezone: 'Europe/Paris',
    notifications: {
      push: true,
      email: true,
      sms: false,
      wellness_reminders: true,
      journal_prompts: true,
      mood_tracking: true,
    },
    wellness: {
      preferred_session_duration: 15,
      breathing_pace: 4,
      music_genre_preferences: ['ambient', 'nature'],
      intensity_level: 'medium',
      focus_areas: ['stress', 'sleep', 'focus'],
    },
    privacy: {
      data_sharing: false,
      analytics: true,
      personalization: true,
      location_tracking: false,
    },
    accessibility: {
      high_contrast: false,
      large_text: false,
      reduced_motion: false,
      voice_navigation: false,
      screen_reader: false,
    },
    ai_coach: {
      personality: 'supportive',
      communication_style: 'friendly',
      intervention_frequency: 3,
      advanced_insights: true,
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserPreferences();
    }
  }, [user]);

  const loadUserPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setPreferences({ ...preferences, ...data.preferences });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async () => {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert([{
          user_id: user?.id,
          preferences: preferences,
          updated_at: new Date().toISOString()
        }]);

      if (error) throw error;

      // Appliquer les préférences IA
      await supabase.functions.invoke('update-ai-preferences', {
        body: {
          user_id: user?.id,
          ai_preferences: preferences.ai_coach,
          wellness_preferences: preferences.wellness
        }
      });

      setHasChanges(false);
      toast({
        title: "Préférences sauvegardées",
        description: "Vos paramètres ont été mis à jour avec succès",
        duration: 3000
      });
    } catch (error) {
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder vos préférences",
        variant: "destructive"
      });
    }
  };

  const updatePreference = (path: string, value: any) => {
    setPreferences(prev => {
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
    setHasChanges(true);
  };

  const musicGenres = [
    'ambient', 'nature', 'classical', 'meditation', 'binaural', 
    'lo-fi', 'spa', 'piano', 'guitar', 'electronic'
  ];

  const focusAreas = [
    'stress', 'anxiety', 'sleep', 'focus', 'confidence', 
    'motivation', 'relationships', 'work-life-balance', 'creativity', 'energy'
  ];

  if (isLoading) {
    return (
      <ResponsiveWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </ResponsiveWrapper>
    );
  }

  return (
    <ResponsiveWrapper>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900">
        <div className="container mx-auto p-4 lg:p-8 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Préférences Avancées
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Personnalisez votre expérience de bien-être avec des paramètres intelligents
            </p>
          </motion.div>

          {hasChanges && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">Modifications non sauvegardées</span>
                  </div>
                  <FunctionalButton
                    actionId="save-preferences"
                    onClick={savePreferences}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Sauvegarder
                  </FunctionalButton>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Général
              </TabsTrigger>
              <TabsTrigger value="wellness" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Bien-être
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                IA Coach
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Confidentialité
              </TabsTrigger>
              <TabsTrigger value="accessibility" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Accessibilité
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5 text-indigo-500" />
                      Apparence & Interface
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Thème</label>
                        <Select
                          value={preferences.theme}
                          onValueChange={(value) => updatePreference('theme', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">
                              <div className="flex items-center gap-2">
                                <Sun className="h-4 w-4" />
                                Clair
                              </div>
                            </SelectItem>
                            <SelectItem value="dark">
                              <div className="flex items-center gap-2">
                                <Moon className="h-4 w-4" />
                                Sombre
                              </div>
                            </SelectItem>
                            <SelectItem value="auto">
                              <div className="flex items-center gap-2">
                                <Settings className="h-4 w-4" />
                                Automatique
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium">Langue</label>
                        <Select
                          value={preferences.language}
                          onValueChange={(value) => updatePreference('language', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fr">
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                Français
                              </div>
                            </SelectItem>
                            <SelectItem value="en">
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                English
                              </div>
                            </SelectItem>
                            <SelectItem value="es">
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                Español
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium">Fuseau horaire</label>
                      <Select
                        value={preferences.timezone}
                        onValueChange={(value) => updatePreference('timezone', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Europe/Paris">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Europe/Paris (GMT+1)
                            </div>
                          </SelectItem>
                          <SelectItem value="America/New_York">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              America/New_York (GMT-5)
                            </div>
                          </SelectItem>
                          <SelectItem value="Asia/Tokyo">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Asia/Tokyo (GMT+9)
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="wellness" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="grid gap-6"
              >
                <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-green-500" />
                      Sessions de Bien-être
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-sm font-medium">
                        Durée préférée des sessions: {preferences.wellness.preferred_session_duration} minutes
                      </label>
                      <Slider
                        value={[preferences.wellness.preferred_session_duration]}
                        onValueChange={([value]) => updatePreference('wellness.preferred_session_duration', value)}
                        max={60}
                        min={5}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>5 min</span>
                        <span>30 min</span>
                        <span>60 min</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium">
                        Rythme de respiration: {preferences.wellness.breathing_pace} sec
                      </label>
                      <Slider
                        value={[preferences.wellness.breathing_pace]}
                        onValueChange={([value]) => updatePreference('wellness.breathing_pace', value)}
                        max={8}
                        min={2}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Rapide (2s)</span>
                        <span>Normal (4s)</span>
                        <span>Lent (8s)</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium">Niveau d'intensité</label>
                      <Select
                        value={preferences.wellness.intensity_level}
                        onValueChange={(value) => updatePreference('wellness.intensity_level', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Doux - Sessions relaxantes</SelectItem>
                          <SelectItem value="medium">Modéré - Équilibre détente/énergie</SelectItem>
                          <SelectItem value="high">Intensif - Sessions dynamiques</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Music className="h-5 w-5 text-purple-500" />
                      Préférences Musicales
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {musicGenres.map((genre) => (
                        <Badge
                          key={genre}
                          variant={preferences.wellness.music_genre_preferences.includes(genre) ? "default" : "outline"}
                          className="cursor-pointer transition-all duration-200 hover:scale-105"
                          onClick={() => {
                            const current = preferences.wellness.music_genre_preferences;
                            if (current.includes(genre)) {
                              updatePreference('wellness.music_genre_preferences', current.filter(g => g !== genre));
                            } else {
                              updatePreference('wellness.music_genre_preferences', [...current, genre]);
                            }
                          }}
                        >
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-500" />
                      Domaines de Focus
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {focusAreas.map((area) => (
                        <Badge
                          key={area}
                          variant={preferences.wellness.focus_areas.includes(area) ? "default" : "outline"}
                          className="cursor-pointer transition-all duration-200 hover:scale-105"
                          onClick={() => {
                            const current = preferences.wellness.focus_areas;
                            if (current.includes(area)) {
                              updatePreference('wellness.focus_areas', current.filter(a => a !== area));
                            } else {
                              updatePreference('wellness.focus_areas', [...current, area]);
                            }
                          }}
                        >
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-orange-500" />
                      Paramètres de Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {Object.entries(preferences.notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div className="space-y-1">
                          <label className="text-sm font-medium capitalize">
                            {key.replace(/_/g, ' ')}
                          </label>
                          <p className="text-xs text-muted-foreground">
                            {key === 'push' && 'Notifications push sur votre appareil'}
                            {key === 'email' && 'Notifications par email'}
                            {key === 'sms' && 'Notifications par SMS'}
                            {key === 'wellness_reminders' && 'Rappels pour vos sessions bien-être'}
                            {key === 'journal_prompts' && 'Suggestions pour votre journal'}
                            {key === 'mood_tracking' && 'Rappels de suivi d\'humeur'}
                          </p>
                        </div>
                        <Switch
                          checked={value}
                          onCheckedChange={(checked) => updatePreference(`notifications.${key}`, checked)}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="ai" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-cyan-500" />
                      Coach IA Personnalisé
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Personnalité du coach</label>
                        <Select
                          value={preferences.ai_coach.personality}
                          onValueChange={(value) => updatePreference('ai_coach.personality', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="supportive">Bienveillant - Soutien empathique</SelectItem>
                            <SelectItem value="motivational">Motivant - Encouragements dynamiques</SelectItem>
                            <SelectItem value="analytical">Analytique - Approche rationnelle</SelectItem>
                            <SelectItem value="gentle">Doux - Approche très délicate</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium">Style de communication</label>
                        <Select
                          value={preferences.ai_coach.communication_style}
                          onValueChange={(value) => updatePreference('ai_coach.communication_style', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="formal">Formel - Respectueux et professionnel</SelectItem>
                            <SelectItem value="casual">Décontracté - Style naturel</SelectItem>
                            <SelectItem value="friendly">Amical - Chaleureux et proche</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium">
                        Fréquence d'intervention: {preferences.ai_coach.intervention_frequency}/10
                      </label>
                      <Slider
                        value={[preferences.ai_coach.intervention_frequency]}
                        onValueChange={([value]) => updatePreference('ai_coach.intervention_frequency', value)}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Minimal</span>
                        <span>Équilibré</span>
                        <span>Fréquent</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Insights avancés</label>
                        <p className="text-xs text-muted-foreground">
                          Analyses comportementales approfondies et recommandations personnalisées
                        </p>
                      </div>
                      <Switch
                        checked={preferences.ai_coach.advanced_insights}
                        onCheckedChange={(checked) => updatePreference('ai_coach.advanced_insights', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-red-500" />
                      Confidentialité & Données
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {Object.entries(preferences.privacy).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div className="space-y-1">
                          <label className="text-sm font-medium capitalize">
                            {key.replace(/_/g, ' ')}
                          </label>
                          <p className="text-xs text-muted-foreground">
                            {key === 'data_sharing' && 'Partager vos données anonymisées pour la recherche'}
                            {key === 'analytics' && 'Permettre les analyses d\'usage pour améliorer l\'app'}
                            {key === 'personalization' && 'Utiliser vos données pour personnaliser l\'expérience'}
                            {key === 'location_tracking' && 'Autoriser la géolocalisation pour des fonctionnalités contextuelles'}
                          </p>
                        </div>
                        <Switch
                          checked={value}
                          onCheckedChange={(checked) => updatePreference(`privacy.${key}`, checked)}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="accessibility" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-teal-500" />
                      Accessibilité
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {Object.entries(preferences.accessibility).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div className="space-y-1">
                          <label className="text-sm font-medium capitalize">
                            {key.replace(/_/g, ' ')}
                          </label>
                          <p className="text-xs text-muted-foreground">
                            {key === 'high_contrast' && 'Augmenter le contraste pour une meilleure lisibilité'}
                            {key === 'large_text' && 'Afficher un texte plus grand'}
                            {key === 'reduced_motion' && 'Réduire les animations et transitions'}
                            {key === 'voice_navigation' && 'Activer la navigation vocale'}
                            {key === 'screen_reader' && 'Optimiser pour les lecteurs d\'écran'}
                          </p>
                        </div>
                        <Switch
                          checked={value}
                          onCheckedChange={(checked) => updatePreference(`accessibility.${key}`, checked)}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>

          {hasChanges && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-center"
            >
              <FunctionalButton
                actionId="save-all-preferences"
                onClick={savePreferences}
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 min-w-[200px]"
                successMessage="Toutes vos préférences ont été sauvegardées !"
              >
                <Settings className="h-5 w-5 mr-2" />
                Sauvegarder Toutes les Préférences
              </FunctionalButton>
            </motion.div>
          )}
        </div>
      </div>
    </ResponsiveWrapper>
  );
};

export default EnhancedPreferencesPage;