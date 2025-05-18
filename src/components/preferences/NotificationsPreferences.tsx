
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPreferences, NotificationsPreferences } from '@/types/preferences';
import { Checkbox } from '@/components/ui/checkbox';
import { TimePicker } from '@/components/ui/time-picker';

interface NotificationsPreferencesProps {
  onUpdate: (values: Partial<UserPreferences>) => void;
}

const NotificationsPreferencesComponent = ({
  onUpdate,
  notifications
}: NotificationsPreferencesProps & {
  notifications: NotificationsPreferences | boolean;
}) => {
  const notifSettings = typeof notifications === 'boolean' 
    ? { enabled: notifications, emailEnabled: false, pushEnabled: false } 
    : notifications;

  const handleToggleNotifications = (enabled: boolean) => {
    if (typeof notifications === 'boolean') {
      onUpdate({ notifications: enabled });
    } else {
      onUpdate({ 
        notifications: {
          ...notifications,
          enabled
        }
      });
    }
  };

  const handleToggleChannel = (channel: 'emailEnabled' | 'pushEnabled' | 'inAppEnabled', value: boolean) => {
    if (typeof notifications !== 'boolean') {
      onUpdate({
        notifications: {
          ...notifications,
          [channel]: value
        }
      });
    }
  };

  const handleToggleType = (type: string, value: boolean) => {
    if (typeof notifications !== 'boolean') {
      onUpdate({
        notifications: {
          ...notifications,
          types: {
            ...notifications.types,
            [type]: value
          }
        }
      });
    }
  };

  const handleQuietHoursUpdate = (property: string, value: any) => {
    if (typeof notifications !== 'boolean') {
      onUpdate({
        notifications: {
          ...notifications,
          quietHours: {
            ...notifications.quietHours,
            [property]: value
          }
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Notifications</h3>
          <p className="text-sm text-muted-foreground">
            Gérez vos préférences de notification
          </p>
        </div>
        <Switch 
          checked={notifSettings?.enabled || false}
          onCheckedChange={handleToggleNotifications}
        />
      </div>
      
      {notifSettings?.enabled && (
        <>
          <div className="space-y-4">
            <h4 className="font-medium">Canaux de notification</h4>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notif">Notifications par email</Label>
              <Switch 
                id="email-notif" 
                checked={notifSettings.emailEnabled || false}
                onCheckedChange={(checked) => handleToggleChannel('emailEnabled', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notif">Notifications push</Label>
              <Switch 
                id="push-notif" 
                checked={notifSettings.pushEnabled || false}
                onCheckedChange={(checked) => handleToggleChannel('pushEnabled', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="inapp-notif">Notifications in-app</Label>
              <Switch 
                id="inapp-notif" 
                checked={notifSettings.inAppEnabled || false}
                onCheckedChange={(checked) => handleToggleChannel('inAppEnabled', checked)}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium">Types de notifications</h4>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="system-notif" 
                  checked={notifSettings?.types?.system || false}
                  onCheckedChange={(checked) => handleToggleType('system', Boolean(checked))}
                />
                <Label htmlFor="system-notif">Système</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="emotion-notif" 
                  checked={notifSettings?.types?.emotion || false}
                  onCheckedChange={(checked) => handleToggleType('emotion', Boolean(checked))}
                />
                <Label htmlFor="emotion-notif">Émotions</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="coach-notif" 
                  checked={notifSettings?.types?.coach || false}
                  onCheckedChange={(checked) => handleToggleType('coach', Boolean(checked))}
                />
                <Label htmlFor="coach-notif">Coach</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="journal-notif" 
                  checked={notifSettings?.types?.journal || false}
                  onCheckedChange={(checked) => handleToggleType('journal', Boolean(checked))}
                />
                <Label htmlFor="journal-notif">Journal</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="community-notif" 
                  checked={notifSettings?.types?.community || false}
                  onCheckedChange={(checked) => handleToggleType('community', Boolean(checked))}
                />
                <Label htmlFor="community-notif">Communauté</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="achievement-notif" 
                  checked={notifSettings?.types?.achievement || false}
                  onCheckedChange={(checked) => handleToggleType('achievement', Boolean(checked))}
                />
                <Label htmlFor="achievement-notif">Réalisations</Label>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium">Paramètres avancés</h4>
            
            <div className="space-y-2">
              <Label htmlFor="frequency-select">Fréquence</Label>
              <Select
                value={notifSettings.frequency || 'immediate'}
                onValueChange={(value) => {
                  if (typeof notifications !== 'boolean') {
                    onUpdate({
                      notifications: {
                        ...notifications,
                        frequency: value
                      }
                    });
                  }
                }}
              >
                <SelectTrigger id="frequency-select">
                  <SelectValue placeholder="Choisir une fréquence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immédiate</SelectItem>
                  <SelectItem value="hourly">Toutes les heures</SelectItem>
                  <SelectItem value="daily">Quotidienne</SelectItem>
                  <SelectItem value="weekly">Hebdomadaire</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="quiet-hours">Heures silencieuses</Label>
                <Switch 
                  id="quiet-hours" 
                  checked={notifSettings.quietHours?.enabled || false}
                  onCheckedChange={(checked) => handleQuietHoursUpdate('enabled', checked)}
                />
              </div>
              
              {notifSettings.quietHours?.enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-time">Début</Label>
                    <TimePicker
                      value={notifSettings.quietHours.start || '22:00'}
                      onChange={(value) => handleQuietHoursUpdate('start', value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="end-time">Fin</Label>
                    <TimePicker
                      value={notifSettings.quietHours.end || '07:00'}
                      onChange={(value) => handleQuietHoursUpdate('end', value)}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tone-select">Ton</Label>
              <Select
                value={notifSettings.tone || 'informational'}
                onValueChange={(value) => {
                  if (typeof notifications !== 'boolean') {
                    onUpdate({
                      notifications: {
                        ...notifications,
                        tone: value
                      }
                    });
                  }
                }}
              >
                <SelectTrigger id="tone-select">
                  <SelectValue placeholder="Choisir un ton" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="informational">Informatif</SelectItem>
                  <SelectItem value="friendly">Amical</SelectItem>
                  <SelectItem value="professional">Professionnel</SelectItem>
                  <SelectItem value="minimalist">Minimaliste</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationsPreferencesComponent;
