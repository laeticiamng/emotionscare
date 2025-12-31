import React, { memo, useCallback, useState } from 'react';
import { Moon, Clock, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { QuietHoursSettings } from '../types';

export interface QuietHoursConfigProps {
  initialSettings: QuietHoursSettings | null;
  onSaved?: (settings: QuietHoursSettings) => void;
}

const QuietHoursConfig: React.FC<QuietHoursConfigProps> = memo(({ initialSettings, onSaved }) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<QuietHoursSettings>({
    enabled: initialSettings?.enabled ?? false,
    startUtc: initialSettings?.startUtc ?? '21:00',
    endUtc: initialSettings?.endUtc ?? '07:00',
  });

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('quiet_hours_settings')
        .upsert({
          enabled: settings.enabled,
          start_utc: settings.startUtc,
          end_utc: settings.endUtc,
        });

      if (error) throw error;

      toast({
        title: 'Heures calmes enregistrées',
        description: settings.enabled
          ? `Les notifications seront suspendues de ${settings.startUtc} à ${settings.endUtc} UTC.`
          : 'Les heures calmes sont désactivées.',
        variant: 'success',
      });

      onSaved?.(settings);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder les paramètres.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }, [settings, toast, onSaved]);

  return (
    <Card className="border-indigo-100 bg-indigo-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Moon className="h-5 w-5 text-indigo-500" aria-hidden="true" />
          <CardTitle className="text-base">Heures calmes</CardTitle>
        </div>
        <CardDescription className="text-xs">
          Définissez une plage horaire pendant laquelle les rappels ne seront pas envoyés.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-indigo-200 bg-white/80 px-4 py-3">
          <div>
            <Label htmlFor="quiet-enabled" className="text-sm font-medium">
              Activer les heures calmes
            </Label>
            <p className="text-xs text-muted-foreground">
              Suspend toutes les notifications pendant cette période.
            </p>
          </div>
          <Switch
            id="quiet-enabled"
            checked={settings.enabled}
            onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, enabled: checked }))}
          />
        </div>

        {settings.enabled && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="quiet-start" className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-indigo-400" aria-hidden="true" />
                Début (UTC)
              </Label>
              <Input
                id="quiet-start"
                type="time"
                value={settings.startUtc}
                onChange={(e) => setSettings((prev) => ({ ...prev, startUtc: e.target.value }))}
                className="border-indigo-200 focus:ring-indigo-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quiet-end" className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-indigo-400" aria-hidden="true" />
                Fin (UTC)
              </Label>
              <Input
                id="quiet-end"
                type="time"
                value={settings.endUtc}
                onChange={(e) => setSettings((prev) => ({ ...prev, endUtc: e.target.value }))}
                className="border-indigo-200 focus:ring-indigo-300"
              />
            </div>
          </div>
        )}

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <Save className="mr-2 h-4 w-4" aria-hidden="true" />
          {isSaving ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
      </CardContent>
    </Card>
  );
});

QuietHoursConfig.displayName = 'QuietHoursConfig';

export default QuietHoursConfig;
