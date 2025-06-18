
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useNotifications } from '@/hooks/useNotifications';
import { 
  Bell, 
  Mail, 
  Volume2, 
  Smartphone, 
  Moon,
  Trophy,
  Clock,
  Users,
  Settings as SettingsIcon
} from 'lucide-react';

const NotificationSettings: React.FC = () => {
  const { settings, updateSettings } = useNotifications();

  const handleToggle = (key: keyof typeof settings, value: boolean) => {
    updateSettings({ [key]: value });
  };

  const handleCategoryToggle = (category: keyof typeof settings.categories, value: boolean) => {
    updateSettings({
      categories: {
        ...settings.categories,
        [category]: value
      }
    });
  };

  const handleQuietHoursToggle = (enabled: boolean) => {
    updateSettings({
      quietHours: {
        ...settings.quietHours,
        enabled
      }
    });
  };

  const handleQuietHoursTime = (field: 'start' | 'end', value: string) => {
    updateSettings({
      quietHours: {
        ...settings.quietHours,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Paramètres des Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* General Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Général</h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4" />
                <div>
                  <Label htmlFor="push-enabled">Notifications push</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications dans le navigateur
                  </p>
                </div>
              </div>
              <Switch
                id="push-enabled"
                checked={settings.pushEnabled}
                onCheckedChange={(checked) => handleToggle('pushEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4" />
                <div>
                  <Label htmlFor="email-enabled">Notifications par email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications par email
                  </p>
                </div>
              </div>
              <Switch
                id="email-enabled"
                checked={settings.emailEnabled}
                onCheckedChange={(checked) => handleToggle('emailEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="h-4 w-4" />
                <div>
                  <Label htmlFor="sound-enabled">Sons</Label>
                  <p className="text-sm text-muted-foreground">
                    Jouer un son lors des notifications
                  </p>
                </div>
              </div>
              <Switch
                id="sound-enabled"
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => handleToggle('soundEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-4 w-4" />
                <div>
                  <Label htmlFor="vibration-enabled">Vibrations</Label>
                  <p className="text-sm text-muted-foreground">
                    Vibrer sur mobile lors des notifications
                  </p>
                </div>
              </div>
              <Switch
                id="vibration-enabled"
                checked={settings.vibrationEnabled}
                onCheckedChange={(checked) => handleToggle('vibrationEnabled', checked)}
              />
            </div>
          </div>

          <Separator />

          {/* Quiet Hours */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Moon className="h-4 w-4" />
              Heures silencieuses
            </h3>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="quiet-hours-enabled">Activer les heures silencieuses</Label>
                <p className="text-sm text-muted-foreground">
                  Désactiver les notifications pendant certaines heures
                </p>
              </div>
              <Switch
                id="quiet-hours-enabled"
                checked={settings.quietHours.enabled}
                onCheckedChange={handleQuietHoursToggle}
              />
            </div>

            {settings.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-4 pl-6">
                <div>
                  <Label htmlFor="quiet-start">Début</Label>
                  <Input
                    id="quiet-start"
                    type="time"
                    value={settings.quietHours.start}
                    onChange={(e) => handleQuietHoursTime('start', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="quiet-end">Fin</Label>
                  <Input
                    id="quiet-end"
                    type="time"
                    value={settings.quietHours.end}
                    onChange={(e) => handleQuietHoursTime('end', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Types de notifications</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trophy className="h-4 w-4" />
                  <div>
                    <Label>Succès et récompenses</Label>
                    <p className="text-sm text-muted-foreground">
                      Badges, niveaux, points
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.categories.achievements}
                  onCheckedChange={(checked) => handleCategoryToggle('achievements', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4" />
                  <div>
                    <Label>Rappels</Label>
                    <p className="text-sm text-muted-foreground">
                      Exercices quotidiens, check-ins
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.categories.reminders}
                  onCheckedChange={(checked) => handleCategoryToggle('reminders', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4" />
                  <div>
                    <Label>Social</Label>
                    <p className="text-sm text-muted-foreground">
                      Messages, interactions communautaires
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.categories.social}
                  onCheckedChange={(checked) => handleCategoryToggle('social', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SettingsIcon className="h-4 w-4" />
                  <div>
                    <Label>Système</Label>
                    <p className="text-sm text-muted-foreground">
                      Mises à jour, maintenances
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.categories.system}
                  onCheckedChange={(checked) => handleCategoryToggle('system', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => updateSettings({
              pushEnabled: true,
              emailEnabled: true,
              soundEnabled: true,
              vibrationEnabled: true,
              categories: {
                achievements: true,
                reminders: true,
                social: true,
                system: true
              }
            })}>
              Tout activer
            </Button>
            <Button variant="outline" onClick={() => updateSettings({
              pushEnabled: false,
              emailEnabled: false,
              soundEnabled: false,
              vibrationEnabled: false,
              categories: {
                achievements: false,
                reminders: false,
                social: false,
                system: false
              }
            })}>
              Tout désactiver
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;
