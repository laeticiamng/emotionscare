import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { MessageSquare } from 'lucide-react';
import { AlertConfiguration } from './types';

interface SlackNotificationSectionProps {
  config: Partial<AlertConfiguration>;
  onConfigChange: (updates: Partial<AlertConfiguration>) => void;
}

export const SlackNotificationSection = ({ config, onConfigChange }: SlackNotificationSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          <h3 className="text-lg font-semibold">Notifications Slack</h3>
        </div>
        <Switch
          checked={config.notify_slack}
          onCheckedChange={(notify_slack) => onConfigChange({ notify_slack })}
        />
      </div>

      {config.notify_slack && (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="slack_webhook_url">Webhook URL *</Label>
            <Input
              id="slack_webhook_url"
              type="url"
              value={config.slack_webhook_url || ''}
              onChange={(e) => onConfigChange({ slack_webhook_url: e.target.value })}
              placeholder="https://hooks.slack.com/services/..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slack_channel">Canal (optionnel)</Label>
            <Input
              id="slack_channel"
              value={config.slack_channel || ''}
              onChange={(e) => onConfigChange({ slack_channel: e.target.value })}
              placeholder="#alerts"
            />
          </div>
        </div>
      )}
    </div>
  );
};
