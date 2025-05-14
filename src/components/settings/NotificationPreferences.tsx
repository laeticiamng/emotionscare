
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { NotificationFrequency, NotificationType, NotificationTone } from '@/types/notification';

interface NotificationPreferencesProps {
  initialPreferences?: {
    enabled: boolean;
    emailEnabled: boolean;
    pushEnabled: boolean;
    frequency: string;
    notificationType?: string;
    tone?: string;
  };
  onSave?: (preferences: any) => void;
}

const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({ 
  initialPreferences,
  onSave
}) => {
  // Default values
  const defaultPreferences = {
    enabled: true,
    emailEnabled: false,
    pushEnabled: true,
    frequency: NotificationFrequency.DAILY,
    notificationType: NotificationType.IN_APP,
    tone: NotificationTone.FRIENDLY
  };
  
  // Combined preferences
  const preferences = { ...defaultPreferences, ...initialPreferences };
  
  // State
  const [notificationsEnabled, setNotificationsEnabled] = useState(preferences.enabled);
  const [emailEnabled, setEmailEnabled] = useState(preferences.emailEnabled);
  const [pushEnabled, setPushEnabled] = useState(preferences.pushEnabled);
  const [frequency, setFrequency] = useState(preferences.frequency);
  const [notificationType, setNotificationType] = useState(preferences.notificationType);
  const [tone, setTone] = useState(preferences.tone);
  
  // Handle save
  const handleSave = () => {
    const updatedPreferences = {
      enabled: notificationsEnabled,
      emailEnabled,
      pushEnabled,
      frequency,
      notificationType,
      tone
    };
    
    if (onSave) {
      onSave(updatedPreferences);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Préférences de notification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Notifications</h3>
            <p className="text-sm text-muted-foreground">
              Recevoir des notifications sur votre activité
            </p>
          </div>
          <Switch 
            checked={notificationsEnabled}
            onCheckedChange={setNotificationsEnabled}
          />
        </div>
        
        {notificationsEnabled && (
          <>
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-medium">Canaux de notification</h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Email</h4>
                  <p className="text-xs text-muted-foreground">
                    Recevoir des notifications par email
                  </p>
                </div>
                <Switch 
                  checked={emailEnabled}
                  onCheckedChange={setEmailEnabled}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Notifications push</h4>
                  <p className="text-xs text-muted-foreground">
                    Recevoir des notifications push dans le navigateur
                  </p>
                </div>
                <Switch 
                  checked={pushEnabled}
                  onCheckedChange={setPushEnabled}
                />
              </div>
            </div>
            
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-medium">Fréquence</h3>
              
              <RadioGroup value={frequency} onValueChange={setFrequency}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={NotificationFrequency.IMMEDIATE} id="immediate" />
                  <Label htmlFor="immediate">Immédiate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={NotificationFrequency.DAILY} id="daily" />
                  <Label htmlFor="daily">Quotidienne</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={NotificationFrequency.WEEKLY} id="weekly" />
                  <Label htmlFor="weekly">Hebdomadaire</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={NotificationFrequency.MONTHLY} id="monthly" />
                  <Label htmlFor="monthly">Mensuelle</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-medium">Ton des notifications</h3>
              
              <RadioGroup value={tone} onValueChange={setTone}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={NotificationTone.FORMAL} id="formal" />
                  <Label htmlFor="formal">Formel</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={NotificationTone.FRIENDLY} id="friendly" />
                  <Label htmlFor="friendly">Amical</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={NotificationTone.PROFESSIONAL} id="professional" />
                  <Label htmlFor="professional">Professionnel</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={NotificationTone.CASUAL} id="casual" />
                  <Label htmlFor="casual">Décontracté</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={NotificationTone.ENCOURAGING} id="encouraging" />
                  <Label htmlFor="encouraging">Encourageant</Label>
                </div>
              </RadioGroup>
            </div>
            
            <Button onClick={handleSave} className="w-full">
              Enregistrer les préférences
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
