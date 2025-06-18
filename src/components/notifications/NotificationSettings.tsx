
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { NotificationSettings as NotificationSettingsType } from '@/types/notifications';
import { useNotifications } from '@/hooks/useNotifications';

interface NotificationSettingsProps {
  className?: string;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ className }) => {
  const { settings, updateSettings } = useNotifications();

  const handleGlobalSettingChange = (key: keyof NotificationSettingsType, value: boolean) => {
    updateSettings({ [key]: value });
  };

  const handleTypeSettingChange = (type: keyof NotificationSettingsType['types'], value: boolean) => {
    updateSettings({
      types: {
        ...settings.types,
        [type]: value,
      },
    });
  };

  const notificationTypes = [
    {
      key: 'security' as const,
      label: 'Sécurité',
      description: 'Alertes de sécurité et connexions suspectes',
      important: true,
    },
    {
      key: 'system' as const,
      label: 'Système',
      description: 'Mises à jour et maintenance du système',
      important: false,
    },
    {
      key: 'social' as const,
      label: 'Social',
      description: 'Interactions sociales et communautaires',
      important: false,
    },
    {
      key: 'achievements' as const,
      label: 'Réussites',
      description: 'Nouveaux badges et objectifs atteints',
      important: false,
    },
    {
      key: 'reminders' as const,
      label: 'Rappels',
      description: 'Rappels personnalisés et routines',
      important: false,
    },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Préférences de notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Paramètres globaux */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Méthodes de notification</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <Label htmlFor="in-app" className="text-sm font-medium">
                Notifications dans l'application
              </Label>
              <span className="text-xs text-muted-foreground">
                Afficher les notifications directement dans l'interface
              </span>
            </div>
            <Switch
              id="in-app"
              checked={settings.inApp}
              onCheckedChange={(checked) => handleGlobalSettingChange('inApp', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <Label htmlFor="email" className="text-sm font-medium">
                Notifications par email
              </Label>
              <span className="text-xs text-muted-foreground">
                Recevoir les notifications importantes par email
              </span>
            </div>
            <Switch
              id="email"
              checked={settings.email}
              onCheckedChange={(checked) => handleGlobalSettingChange('email', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <Label htmlFor="push" className="text-sm font-medium">
                Notifications push
              </Label>
              <span className="text-xs text-muted-foreground">
                Notifications push sur vos appareils
              </span>
            </div>
            <Switch
              id="push"
              checked={settings.push}
              onCheckedChange={(checked) => handleGlobalSettingChange('push', checked)}
            />
          </div>
        </div>

        <Separator />

        {/* Types de notifications */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Types de notifications</h3>
          
          {notificationTypes.map((type) => (
            <div key={type.key} className="flex items-center justify-between">
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2">
                  <Label htmlFor={type.key} className="text-sm font-medium">
                    {type.label}
                  </Label>
                  {type.important && (
                    <Badge variant="secondary" className="text-xs">
                      Important
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {type.description}
                </span>
              </div>
              <Switch
                id={type.key}
                checked={settings.types[type.key]}
                onCheckedChange={(checked) => handleTypeSettingChange(type.key, checked)}
                disabled={type.important} // Les notifications importantes ne peuvent pas être désactivées
              />
            </div>
          ))}
        </div>

        {/* Note sur les notifications importantes */}
        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
          <strong>Note :</strong> Les notifications de sécurité sont essentielles pour la protection de votre compte et ne peuvent pas être désactivées.
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
