
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UserPreferences } from '@/types/types';
import { NotificationPreferences as NotificationPrefsType } from '@/types/notification';

interface NotificationPreferencesProps {
  preferences: UserPreferences;
  onChange: (value: Partial<UserPreferences>) => void;
}

const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({ preferences, onChange }) => {
  const notifications = preferences.notifications || {
    enabled: true,
    emailEnabled: true,
    pushEnabled: true,
    inAppEnabled: true,
    types: {
      system: true,
      emotion: true,
      coach: true,
      journal: true,
      community: true,
      achievement: true,
    },
    frequency: 'immediate',
  };
  
  // Helper to update notification settings
  const updateNotifications = (updates: Partial<NotificationPrefsType>) => {
    onChange({
      notifications: {
        ...notifications,
        ...updates,
      },
    });
  };
  
  // Helper to update notification types
  const updateNotificationType = (type: string, value: boolean) => {
    updateNotifications({
      types: {
        ...notifications.types,
        [type]: value,
      },
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="notifications-enabled" className="text-base font-medium">
          Activer les notifications
        </Label>
        <Checkbox
          id="notifications-enabled"
          checked={notifications.enabled}
          onCheckedChange={(checked) => updateNotifications({ enabled: checked === true })}
        />
      </div>
      
      {notifications.enabled && (
        <>
          <div className="space-y-3">
            <Label className="text-base">Méthodes de notification</Label>
            
            <div className="ml-4 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="email-notifications"
                  checked={notifications.emailEnabled}
                  onCheckedChange={(checked) => updateNotifications({ emailEnabled: checked === true })}
                />
                <Label htmlFor="email-notifications" className="font-normal">Email</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="push-notifications"
                  checked={notifications.pushEnabled}
                  onCheckedChange={(checked) => updateNotifications({ pushEnabled: checked === true })}
                />
                <Label htmlFor="push-notifications" className="font-normal">
                  Notifications push
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inapp-notifications"
                  checked={notifications.inAppEnabled}
                  onCheckedChange={(checked) => updateNotifications({ inAppEnabled: checked === true })}
                />
                <Label htmlFor="inapp-notifications" className="font-normal">
                  Notifications dans l'application
                </Label>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label className="text-base">Types de notifications</Label>
            
            <div className="ml-4 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="system-notifications"
                  checked={notifications.types?.system}
                  onCheckedChange={(checked) => updateNotificationType('system', checked === true)}
                />
                <Label htmlFor="system-notifications" className="font-normal">
                  Système
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="emotion-notifications"
                  checked={notifications.types?.emotion}
                  onCheckedChange={(checked) => updateNotificationType('emotion', checked === true)}
                />
                <Label htmlFor="emotion-notifications" className="font-normal">
                  Émotions
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="coach-notifications"
                  checked={notifications.types?.coach}
                  onCheckedChange={(checked) => updateNotificationType('coach', checked === true)}
                />
                <Label htmlFor="coach-notifications" className="font-normal">
                  Coach
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="journal-notifications"
                  checked={notifications.types?.journal}
                  onCheckedChange={(checked) => updateNotificationType('journal', checked === true)}
                />
                <Label htmlFor="journal-notifications" className="font-normal">
                  Journal
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="community-notifications"
                  checked={notifications.types?.community}
                  onCheckedChange={(checked) => updateNotificationType('community', checked === true)}
                />
                <Label htmlFor="community-notifications" className="font-normal">
                  Communauté
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="achievement-notifications"
                  checked={notifications.types?.achievement}
                  onCheckedChange={(checked) => updateNotificationType('achievement', checked === true)}
                />
                <Label htmlFor="achievement-notifications" className="font-normal">
                  Récompenses
                </Label>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label className="text-base">Fréquence des notifications</Label>
            
            <RadioGroup
              value={notifications.frequency || 'immediate'}
              onValueChange={(value) => updateNotifications({ frequency: value })}
              className="ml-4 space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="immediate" id="immediate" />
                <Label htmlFor="immediate" className="font-normal">Immédiatement</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hourly" id="hourly" />
                <Label htmlFor="hourly" className="font-normal">Toutes les heures</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily" className="font-normal">Une fois par jour</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekly" id="weekly" />
                <Label htmlFor="weekly" className="font-normal">Une fois par semaine</Label>
              </div>
            </RadioGroup>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationPreferences;
