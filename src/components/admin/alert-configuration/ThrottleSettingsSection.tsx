import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Settings } from 'lucide-react';
import { AlertConfiguration } from './types';

interface ThrottleSettingsSectionProps {
  config: Partial<AlertConfiguration>;
  onConfigChange: (updates: Partial<AlertConfiguration>) => void;
}

export const ThrottleSettingsSection = ({ config, onConfigChange }: ThrottleSettingsSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Settings className="w-4 h-4" />
        <h3 className="text-lg font-semibold">Paramètres Avancés</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="throttle_minutes">Throttling (minutes)</Label>
          <Input
            id="throttle_minutes"
            type="number"
            min="0"
            value={config.throttle_minutes}
            onChange={(e) => onConfigChange({ throttle_minutes: parseInt(e.target.value) || 0 })}
          />
          <p className="text-xs text-muted-foreground">
            Temps minimum entre deux alertes identiques
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="max_alerts_per_hour">Max alertes/heure</Label>
          <Input
            id="max_alerts_per_hour"
            type="number"
            min="1"
            value={config.max_alerts_per_hour}
            onChange={(e) => onConfigChange({ max_alerts_per_hour: parseInt(e.target.value) || 1 })}
          />
          <p className="text-xs text-muted-foreground">
            Nombre maximum d'alertes par heure
          </p>
        </div>
      </div>
    </div>
  );
};
