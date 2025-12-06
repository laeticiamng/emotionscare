import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { ConfigSectionProps, NotificationsConfig } from './config-types';

export const NotificationsConfigSection: React.FC<ConfigSectionProps<NotificationsConfig>> = ({
  config,
  onChange,
}) => {
  const updateField = <K extends keyof NotificationsConfig>(field: K, value: NotificationsConfig[K]) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration des Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Notifications email</Label>
              <p className="text-sm text-gray-600">Activer les notifications par email</p>
            </div>
            <Switch
              checked={config.emailEnabled}
              onCheckedChange={(checked) => updateField('emailEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Notifications push</Label>
              <p className="text-sm text-gray-600">Activer les notifications push</p>
            </div>
            <Switch
              checked={config.pushEnabled}
              onCheckedChange={(checked) => updateField('pushEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Notifications SMS</Label>
              <p className="text-sm text-gray-600">Activer les notifications SMS</p>
            </div>
            <Switch
              checked={config.smsEnabled}
              onCheckedChange={(checked) => updateField('smsEnabled', checked)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="slackWebhook">Webhook Slack</Label>
            <Input
              id="slackWebhook"
              type="url"
              value={config.slackWebhook}
              onChange={(e) => updateField('slackWebhook', e.target.value)}
              placeholder="https://hooks.slack.com/..."
            />
          </div>
          <div>
            <Label htmlFor="discordWebhook">Webhook Discord</Label>
            <Input
              id="discordWebhook"
              type="url"
              value={config.discordWebhook}
              onChange={(e) => updateField('discordWebhook', e.target.value)}
              placeholder="https://discord.com/api/webhooks/..."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
