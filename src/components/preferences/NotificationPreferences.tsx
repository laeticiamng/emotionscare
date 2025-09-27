
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NotificationFrequency, NotificationPreference } from '@/types/notification';

interface NotificationPreferencesProps {
  preferences: {
    enabled: boolean;
    emailEnabled?: boolean;
    pushEnabled?: boolean;
    inAppEnabled?: boolean;
    types: {
      system: boolean;
      emotion: boolean;
      coach: boolean;
      journal: boolean;
      community: boolean;
      achievement?: boolean;
      badge?: boolean;
      challenge?: boolean;
      reminder?: boolean;
      info?: boolean;
      warning?: boolean;
      error?: boolean;
      success?: boolean;
      streak?: boolean;
    };
    frequency: NotificationFrequency;
    tone?: string;
    quietHours?: {
      enabled: boolean;
      start: string;
      end: string;
    }
  };
  onUpdate: (preferences: any) => void;
}

const NotificationPreferencesComponent: React.FC<NotificationPreferencesProps> = ({
  preferences,
  onUpdate,
}) => {
  const handleToggle = (enabled: boolean) => {
    if (enabled) {
      onUpdate({
        ...preferences,
        enabled: true,
      });
    } else {
      onUpdate({
        enabled: false,
        emailEnabled: false,
        pushEnabled: false,
        inAppEnabled: false,
        types: {
          system: false,
          emotion: false,
          coach: false,
          journal: false,
          community: false,
        },
        frequency: 'immediate',
      });
    }
  };

  const handleTypeToggle = (type: string, checked: boolean) => {
    const updatedTypes = {
      ...preferences.types,
      [type]: checked,
    };
    onUpdate({ ...preferences, types: updatedTypes });
  };

  const handleFrequencyChange = (frequency: NotificationFrequency) => {
    onUpdate({ ...preferences, frequency });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Préférences de notification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="notifications-toggle" className="font-medium">
              Activer les notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Recevez des mises à jour sur vos analyses émotionnelles
            </p>
          </div>
          <Switch
            id="notifications-toggle"
            checked={preferences.enabled}
            onCheckedChange={handleToggle}
          />
        </div>

        {preferences.enabled && (
          <>
            <div className="space-y-4">
              <Label className="font-medium">Canaux de notification</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications" className="cursor-pointer">
                    Email
                  </Label>
                  <Switch
                    id="email-notifications"
                    checked={preferences.emailEnabled || false}
                    onCheckedChange={(checked) =>
                      onUpdate({ ...preferences, emailEnabled: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications" className="cursor-pointer">
                    Notifications push
                  </Label>
                  <Switch
                    id="push-notifications"
                    checked={preferences.pushEnabled || false}
                    onCheckedChange={(checked) =>
                      onUpdate({ ...preferences, pushEnabled: checked })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="font-medium">Types de notification</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="system-notifications" className="cursor-pointer">
                    Système
                  </Label>
                  <Switch
                    id="system-notifications"
                    checked={preferences.types?.system || false}
                    onCheckedChange={(checked) =>
                      handleTypeToggle('system', checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="emotion-notifications" className="cursor-pointer">
                    Analyses émotionnelles
                  </Label>
                  <Switch
                    id="emotion-notifications"
                    checked={preferences.types?.emotion || false}
                    onCheckedChange={(checked) =>
                      handleTypeToggle('emotion', checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="coach-notifications" className="cursor-pointer">
                    Coach virtuel
                  </Label>
                  <Switch
                    id="coach-notifications"
                    checked={preferences.types?.coach || false}
                    onCheckedChange={(checked) =>
                      handleTypeToggle('coach', checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="journal-notifications" className="cursor-pointer">
                    Journal émotionnel
                  </Label>
                  <Switch
                    id="journal-notifications"
                    checked={preferences.types?.journal || false}
                    onCheckedChange={(checked) =>
                      handleTypeToggle('journal', checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="community-notifications" className="cursor-pointer">
                    Communauté
                  </Label>
                  <Switch
                    id="community-notifications"
                    checked={preferences.types?.community || false}
                    onCheckedChange={(checked) =>
                      handleTypeToggle('community', checked)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label htmlFor="notification-frequency" className="font-medium">
                Fréquence des notifications
              </Label>
              <Select
                value={preferences.frequency}
                onValueChange={(value) => handleFrequencyChange(value as NotificationFrequency)}
              >
                <SelectTrigger id="notification-frequency">
                  <SelectValue placeholder="Choisir une fréquence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immédiatement</SelectItem>
                  <SelectItem value="daily">Quotidienne</SelectItem>
                  <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  <SelectItem value="never">Jamais</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationPreferencesComponent;
