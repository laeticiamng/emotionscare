
import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const NotificationSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    email: true,
    push: true,
    sms: false,
    weeklyReport: true,
    activityReminders: true,
    wellbeingTips: true,
    marketingEmails: false
  });

  const handleChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    // In a real app, you would save the notification settings here
    toast({
      title: "Paramètres de notification mis à jour",
      description: "Vos préférences de notification ont été enregistrées avec succès."
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Canaux de notification</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email</p>
              <p className="text-sm text-muted-foreground">Recevoir des notifications par email</p>
            </div>
            <Switch
              checked={settings.email}
              onCheckedChange={(checked) => handleChange('email', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notifications push</p>
              <p className="text-sm text-muted-foreground">Recevoir des notifications dans le navigateur</p>
            </div>
            <Switch
              checked={settings.push}
              onCheckedChange={(checked) => handleChange('push', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">SMS</p>
              <p className="text-sm text-muted-foreground">Recevoir des notifications importantes par SMS</p>
            </div>
            <Switch
              checked={settings.sms}
              onCheckedChange={(checked) => handleChange('sms', checked)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t">
        <h3 className="text-lg font-medium">Types de notification</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Rapport hebdomadaire</p>
              <p className="text-sm text-muted-foreground">Résumé hebdomadaire de votre bien-être émotionnel</p>
            </div>
            <Switch
              checked={settings.weeklyReport}
              onCheckedChange={(checked) => handleChange('weeklyReport', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Rappels d'activité</p>
              <p className="text-sm text-muted-foreground">Rappels pour vos séances VR et scans émotionnels</p>
            </div>
            <Switch
              checked={settings.activityReminders}
              onCheckedChange={(checked) => handleChange('activityReminders', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Conseils bien-être</p>
              <p className="text-sm text-muted-foreground">Conseils personnalisés pour améliorer votre bien-être</p>
            </div>
            <Switch
              checked={settings.wellbeingTips}
              onCheckedChange={(checked) => handleChange('wellbeingTips', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Emails marketing</p>
              <p className="text-sm text-muted-foreground">Nouvelles fonctionnalités et offres spéciales</p>
            </div>
            <Switch
              checked={settings.marketingEmails}
              onCheckedChange={(checked) => handleChange('marketingEmails', checked)}
            />
          </div>
        </div>
      </div>
      
      <Button onClick={saveSettings}>
        Enregistrer les préférences
      </Button>
    </div>
  );
};

export default NotificationSettings;
