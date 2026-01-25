/**
 * EmailDigestComposer - Configuration des digests email musicaux
 * Permet de paramétrer la fréquence et le contenu des emails
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Mail, Clock, Music, TrendingUp, Heart, Sparkles, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface DigestSettings {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  dayOfWeek?: number;
  timeOfDay: string;
  includeListeningStats: boolean;
  includeRecommendations: boolean;
  includeAchievements: boolean;
  includeEmotionInsights: boolean;
  includeChallenges: boolean;
}

const DEFAULT_SETTINGS: DigestSettings = {
  enabled: false,
  frequency: 'weekly',
  dayOfWeek: 1,
  timeOfDay: '09:00',
  includeListeningStats: true,
  includeRecommendations: true,
  includeAchievements: true,
  includeEmotionInsights: true,
  includeChallenges: false,
};

const DAYS_OF_WEEK = [
  { value: 0, label: 'Dimanche' },
  { value: 1, label: 'Lundi' },
  { value: 2, label: 'Mardi' },
  { value: 3, label: 'Mercredi' },
  { value: 4, label: 'Jeudi' },
  { value: 5, label: 'Vendredi' },
  { value: 6, label: 'Samedi' },
];

export const EmailDigestComposer: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [settings, setSettings] = useState<DigestSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Charger les paramètres depuis Supabase
  useEffect(() => {
    const loadSettings = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await supabase
          .from('user_settings')
          .select('value')
          .eq('user_id', user.id)
          .eq('key', 'email_digest_settings')
          .single();

        if (data?.value) {
          const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
          setSettings({ ...DEFAULT_SETTINGS, ...parsed });
        }
      } catch (err) {
        console.warn('Error loading digest settings:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [user?.id]);

  // Sauvegarder les paramètres
  const handleSave = async () => {
    if (!user?.id) {
      toast({
        title: 'Connexion requise',
        description: 'Connectez-vous pour sauvegarder vos préférences',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          key: 'email_digest_settings',
          value: settings,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,key' });

      if (error) throw error;

      toast({
        title: '✅ Préférences sauvegardées',
        description: settings.enabled 
          ? `Digest ${settings.frequency === 'daily' ? 'quotidien' : settings.frequency === 'weekly' ? 'hebdomadaire' : 'mensuel'} activé`
          : 'Digest email désactivé',
      });
    } catch (err) {
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder les paramètres',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = <K extends keyof DigestSettings>(key: K, value: DigestSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Digest Email Musical
            </CardTitle>
            <CardDescription>
              Recevez un résumé de votre activité musicale par email
            </CardDescription>
          </div>
          <Switch
            checked={settings.enabled}
            onCheckedChange={(checked) => updateSetting('enabled', checked)}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Fréquence */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Fréquence d'envoi
          </Label>
          <div className="flex gap-3">
            <Select
              value={settings.frequency}
              onValueChange={(v) => updateSetting('frequency', v as DigestSettings['frequency'])}
              disabled={!settings.enabled}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Quotidien</SelectItem>
                <SelectItem value="weekly">Hebdomadaire</SelectItem>
                <SelectItem value="monthly">Mensuel</SelectItem>
              </SelectContent>
            </Select>

            {settings.frequency === 'weekly' && (
              <Select
                value={String(settings.dayOfWeek)}
                onValueChange={(v) => updateSetting('dayOfWeek', parseInt(v))}
                disabled={!settings.enabled}
              >
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map((day) => (
                    <SelectItem key={day.value} value={String(day.value)}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Select
              value={settings.timeOfDay}
              onValueChange={(v) => updateSetting('timeOfDay', v)}
              disabled={!settings.enabled}
            >
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="08:00">08:00</SelectItem>
                <SelectItem value="09:00">09:00</SelectItem>
                <SelectItem value="12:00">12:00</SelectItem>
                <SelectItem value="18:00">18:00</SelectItem>
                <SelectItem value="20:00">20:00</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Contenu */}
        <div className="space-y-3">
          <Label>Contenu du digest</Label>
          <div className="grid gap-3">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <Music className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Statistiques d'écoute</p>
                  <p className="text-xs text-muted-foreground">Temps d'écoute, morceaux joués</p>
                </div>
              </div>
              <Checkbox
                checked={settings.includeListeningStats}
                onCheckedChange={(c) => updateSetting('includeListeningStats', !!c)}
                disabled={!settings.enabled}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-sm font-medium">Recommandations IA</p>
                  <p className="text-xs text-muted-foreground">Suggestions personnalisées</p>
                </div>
              </div>
              <Checkbox
                checked={settings.includeRecommendations}
                onCheckedChange={(c) => updateSetting('includeRecommendations', !!c)}
                disabled={!settings.enabled}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Insights émotionnels</p>
                  <p className="text-xs text-muted-foreground">Analyse de votre bien-être</p>
                </div>
              </div>
              <Checkbox
                checked={settings.includeEmotionInsights}
                onCheckedChange={(c) => updateSetting('includeEmotionInsights', !!c)}
                disabled={!settings.enabled}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <Heart className="h-4 w-4 text-pink-500" />
                <div>
                  <p className="text-sm font-medium">Badges & Succès</p>
                  <p className="text-xs text-muted-foreground">Vos accomplissements récents</p>
                </div>
              </div>
              <Checkbox
                checked={settings.includeAchievements}
                onCheckedChange={(c) => updateSetting('includeAchievements', !!c)}
                disabled={!settings.enabled}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Aperçu */}
        {settings.enabled && (
          <div className="rounded-lg bg-muted/50 p-4 space-y-2">
            <p className="text-sm font-medium">📬 Prochain envoi prévu</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {settings.frequency === 'daily' ? 'Demain' : 
                 settings.frequency === 'weekly' ? DAYS_OF_WEEK.find(d => d.value === settings.dayOfWeek)?.label : 
                 'Premier du mois'}
              </Badge>
              <Badge variant="outline">{settings.timeOfDay}</Badge>
              <Badge variant="outline">
                {[
                  settings.includeListeningStats && 'Stats',
                  settings.includeRecommendations && 'Reco',
                  settings.includeEmotionInsights && 'Insights',
                  settings.includeAchievements && 'Badges',
                ].filter(Boolean).join(' + ')}
              </Badge>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="gap-2"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Sauvegarder
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailDigestComposer;
