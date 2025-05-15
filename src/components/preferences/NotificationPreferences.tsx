
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NotificationFrequency, NotificationPreference, NotificationType, NotificationChannels } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface NotificationPreferencesProps {
  preferences: NotificationPreference[];
  onPreferenceChange: (preference: NotificationPreference) => void;
}

const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({ 
  preferences, 
  onPreferenceChange 
}) => {
  const { toast } = useToast();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleToggleEmail = (preference: NotificationPreference) => {
    const emailEnabled = preference.emailEnabled !== undefined 
      ? preference.emailEnabled 
      : (preference.channels && typeof preference.channels !== 'string' && 'email' in preference.channels)
        ? preference.channels.email
        : false;
    
    const updatedPreference = {
      ...preference,
      emailEnabled: !emailEnabled,
    };
    
    // Add channels for backward compatibility if it exists in the original
    if (preference.channels && typeof preference.channels !== 'string') {
      updatedPreference.channels = {
        ...preference.channels,
        email: !emailEnabled
      };
    } else if (preference.channels && Array.isArray(preference.channels)) {
      // Handle string[] type of channels if needed
      updatedPreference.channels = preference.channels;
    } else {
      // Create default channels object if none exists
      updatedPreference.channels = {
        email: !emailEnabled,
        push: !!preference.pushEnabled,
        inApp: true
      };
    }
    
    handlePreferenceUpdate(updatedPreference);
  };

  const handleTogglePush = (preference: NotificationPreference) => {
    const pushEnabled = preference.pushEnabled !== undefined 
      ? preference.pushEnabled 
      : (preference.channels && typeof preference.channels !== 'string' && 'push' in preference.channels)
        ? preference.channels.push
        : false;
    
    const updatedPreference = {
      ...preference,
      pushEnabled: !pushEnabled
    };
    
    // Add channels for backward compatibility if it exists in the original
    if (preference.channels && typeof preference.channels !== 'string') {
      updatedPreference.channels = {
        ...preference.channels,
        push: !pushEnabled
      };
    } else if (preference.channels && Array.isArray(preference.channels)) {
      // Handle string[] type of channels if needed
      updatedPreference.channels = preference.channels;
    } else {
      // Create default channels object if none exists
      updatedPreference.channels = {
        email: !!preference.emailEnabled,
        push: !pushEnabled,
        inApp: true
      };
    }
    
    handlePreferenceUpdate(updatedPreference);
  };

  const handleFrequencyChange = (preference: NotificationPreference, frequency: NotificationFrequency) => {
    const updatedPreference = {
      ...preference,
      frequency
    };
    
    handlePreferenceUpdate(updatedPreference);
  };

  const handlePreferenceUpdate = (preference: NotificationPreference) => {
    const preferenceId = preference.type || String(preferences.indexOf(preference));
    setUpdatingId(preferenceId);
    
    // Simulate API call to update preference
    setTimeout(() => {
      onPreferenceChange(preference);
      setUpdatingId(null);
      
      toast({
        title: "Préférences mises à jour",
        description: "Vos préférences de notification ont été enregistrées.",
      });
    }, 500);
  };

  // Helper to get notification type name
  const getNotificationTypeName = (typeValue: string): string => {
    switch (typeValue) {
      case 'emotion': return 'Analyses émotionnelles';
      case 'coach': return 'Messages du coach';
      case 'journal': return 'Journal';
      case 'community': return 'Communauté';
      case 'system': return 'Système';
      default: return 'Autres';
    }
  };

  // Helper to check if email is enabled for a preference
  const isEmailEnabled = (preference: NotificationPreference): boolean => {
    if (preference.emailEnabled !== undefined) {
      return preference.emailEnabled;
    }
    
    if (preference.channels) {
      if (typeof preference.channels === 'object' && !Array.isArray(preference.channels)) {
        return !!preference.channels.email;
      }
    }
    
    return false;
  };
  
  // Helper to check if push is enabled for a preference
  const isPushEnabled = (preference: NotificationPreference): boolean => {
    if (preference.pushEnabled !== undefined) {
      return preference.pushEnabled;
    }
    
    if (preference.channels) {
      if (typeof preference.channels === 'object' && !Array.isArray(preference.channels)) {
        return !!preference.channels.push;
      }
    }
    
    return false;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {preferences.map((preference, index) => {
            const preferenceId = preference.type || String(index);
            const isUpdating = updatingId === preferenceId;
            const emailEnabled = isEmailEnabled(preference);
            const pushEnabled = isPushEnabled(preference);
            
            // Get the type label, handling both strings and objects
            let typeName = 'Notification';
            if (preference.type) {
              typeName = getNotificationTypeName(preference.type);
            } else if (index === 0) {
              typeName = 'Général';
            } else {
              typeName = `Type ${index + 1}`;
            }
            
            return (
              <div key={preferenceId} className="space-y-4">
                <div className="font-medium">{typeName}</div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`email-${preferenceId}`} className="cursor-pointer">
                        Notifications par email
                      </Label>
                      <Switch
                        id={`email-${preferenceId}`}
                        checked={emailEnabled}
                        onCheckedChange={() => handleToggleEmail(preference)}
                        disabled={isUpdating}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`push-${preferenceId}`} className="cursor-pointer">
                        Notifications push
                      </Label>
                      <Switch
                        id={`push-${preferenceId}`}
                        checked={pushEnabled}
                        onCheckedChange={() => handleTogglePush(preference)}
                        disabled={isUpdating}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor={`frequency-${preferenceId}`}>Fréquence</Label>
                    <Select
                      value={preference.frequency}
                      onValueChange={(value) => handleFrequencyChange(preference, value as NotificationFrequency)}
                      disabled={isUpdating || (!emailEnabled && !pushEnabled)}
                    >
                      <SelectTrigger id={`frequency-${preferenceId}`} className="mt-1">
                        <SelectValue placeholder="Choisir une fréquence" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Temps réel</SelectItem>
                        <SelectItem value="immediate">Immédiat</SelectItem>
                        <SelectItem value="daily">Quotidien</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                        <SelectItem value="never">Jamais</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="border-t pt-2 mt-2"></div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
