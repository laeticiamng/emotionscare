import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Bell } from 'lucide-react';
import { AlertConfiguration } from './types';

interface DiscordNotificationSectionProps {
  config: Partial<AlertConfiguration>;
  onConfigChange: (updates: Partial<AlertConfiguration>) => void;
}

export const DiscordNotificationSection = ({ config, onConfigChange }: DiscordNotificationSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4" />
          <h3 className="text-lg font-semibold">Notifications Discord</h3>
        </div>
        <Switch
          checked={config.notify_discord}
          onCheckedChange={(notify_discord) => onConfigChange({ notify_discord })}
        />
      </div>

      {config.notify_discord && (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="discord_webhook_url">Webhook URL *</Label>
            <Input
              id="discord_webhook_url"
              type="url"
              value={config.discord_webhook_url || ''}
              onChange={(e) => onConfigChange({ discord_webhook_url: e.target.value })}
              placeholder="https://discord.com/api/webhooks/..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discord_username">Nom d'utilisateur</Label>
            <Input
              id="discord_username"
              value={config.discord_username || ''}
              onChange={(e) => onConfigChange({ discord_username: e.target.value })}
              placeholder="EmotionsCare Monitor"
            />
          </div>
        </div>
      )}
    </div>
  );
};
