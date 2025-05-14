
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NotificationFrequency, NotificationPreference, NotificationType } from '@/types/notification';
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
    const emailEnabled = preference.emailEnabled !== undefined ? preference.emailEnabled : 
                        (preference.channels?.email || false);
    
    const updatedPreference: NotificationPreference = {
      ...preference,
      emailEnabled: !emailEnabled,
      channels: {
        ...(preference.channels || { email: false, push: false, inApp: true }),
        email: !emailEnabled
      }
    };
    
    handlePreferenceUpdate(updatedPreference);
  };

  const handleTogglePush = (preference: NotificationPreference) => {
    const pushEnabled = preference.pushEnabled !== undefined ? preference.pushEnabled : 
                       (preference.channels?.push || false);
    
    const updatedPreference: NotificationPreference = {
      ...preference,
      pushEnabled: !pushEnabled,
      channels: {
        ...(preference.channels || { email: false, push: false, inApp: true }),
        push: !pushEnabled
      }
    };
    
    handlePreferenceUpdate(updatedPreference);
  };

  const handleFrequencyChange = (preference: NotificationPreference, frequency: NotificationFrequency) => {
    const updatedPreference: NotificationPreference = {
      ...preference,
      frequency
    };
    
    handlePreferenceUpdate(updatedPreference);
  };

  const handlePreferenceUpdate = (preference: NotificationPreference) => {
    setUpdatingId(preference.type);
    
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

  const getNotificationTypeName = (type: NotificationType): string => {
    switch (type) {
      case 'emotion': return 'Analyses émotionnelles';
      case 'coach': return 'Messages du coach';
      case 'journal': return 'Journal';
      case 'community': return 'Communauté';
      case 'system': return 'Système';
      default: return 'Autres';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {preferences.map((preference) => {
            const isUpdating = updatingId === preference.type;
            const emailEnabled = preference.emailEnabled !== undefined ? preference.emailEnabled : 
                                (preference.channels?.email || false);
            const pushEnabled = preference.pushEnabled !== undefined ? preference.pushEnabled : 
                               (preference.channels?.push || false);
            
            return (
              <div key={preference.type} className="space-y-4">
                <div className="font-medium">{getNotificationTypeName(preference.type)}</div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`email-${preference.type}`} className="cursor-pointer">
                        Notifications par email
                      </Label>
                      <Switch
                        id={`email-${preference.type}`}
                        checked={emailEnabled}
                        onCheckedChange={() => handleToggleEmail(preference)}
                        disabled={isUpdating}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`push-${preference.type}`} className="cursor-pointer">
                        Notifications push
                      </Label>
                      <Switch
                        id={`push-${preference.type}`}
                        checked={pushEnabled}
                        onCheckedChange={() => handleTogglePush(preference)}
                        disabled={isUpdating}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor={`frequency-${preference.type}`}>Fréquence</Label>
                    <Select
                      value={preference.frequency}
                      onValueChange={(value) => handleFrequencyChange(preference, value as NotificationFrequency)}
                      disabled={isUpdating || (!emailEnabled && !pushEnabled)}
                    >
                      <SelectTrigger id={`frequency-${preference.type}`} className="mt-1">
                        <SelectValue placeholder="Choisir une fréquence" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Temps réel</SelectItem>
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
