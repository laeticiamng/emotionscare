
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Bell, BellOff } from "lucide-react";

export const NotificationSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    enableAllNotifications: true,
    emailNotifications: true,
    inAppNotifications: true,
    dailyDigest: false,
    weeklyDigest: false,
    scanReminders: true,
    journalReminders: true,
    achievementNotifications: true,
    teamUpdates: true,
    silenceMode: false
  });

  // Charger les préférences depuis localStorage au montage
  useEffect(() => {
    const savedSettings = localStorage.getItem('notification_preferences');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error("Erreur lors du chargement des préférences:", error);
      }
    }
    
    // Synchroniser avec le mode silence global
    const silencePreference = localStorage.getItem('notification_silence');
    if (silencePreference) {
      setSettings(prev => ({ 
        ...prev, 
        silenceMode: silencePreference === 'true',
        enableAllNotifications: silencePreference !== 'true'
      }));
    }
  }, []);

  // Sauvegarder les préférences dans localStorage à chaque changement
  const updateSettings = (key: string, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    
    // Si on active le mode silence, désactiver les notifications
    if (key === 'silenceMode' && value === true) {
      newSettings.enableAllNotifications = false;
    }
    
    // Si on active toutes les notifications, désactiver le mode silence
    if (key === 'enableAllNotifications' && value === true) {
      newSettings.silenceMode = false;
    }
    
    setSettings(newSettings);
    localStorage.setItem('notification_preferences', JSON.stringify(newSettings));
    
    // Mettre à jour la préférence globale de silence
    if (key === 'silenceMode') {
      localStorage.setItem('notification_silence', String(value));
    } else if (key === 'enableAllNotifications') {
      localStorage.setItem('notification_silence', String(!value));
    }
  };

  const saveSettings = () => {
    // Simuler un appel API pour sauvegarder les préférences
    toast({
      title: "Préférences sauvegardées",
      description: "Vos préférences de notifications ont été mises à jour",
      duration: 3000
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Préférences de Notifications</CardTitle>
        <CardDescription>
          Personnalisez comment et quand vous souhaitez être notifié
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between py-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="silenceMode" className="text-base font-medium flex items-center">
              <BellOff className="mr-2 h-4 w-4" />
              Mode Silence
            </Label>
            <span className="text-sm text-muted-foreground">
              Recevoir uniquement un résumé hebdomadaire
            </span>
          </div>
          <Switch
            id="silenceMode"
            checked={settings.silenceMode}
            onCheckedChange={(checked) => updateSettings('silenceMode', checked)}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between py-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="enableAllNotifications" className="text-base font-medium flex items-center">
              <Bell className="mr-2 h-4 w-4" />
              Activer toutes les notifications
            </Label>
            <span className="text-sm text-muted-foreground">
              Contrôlez globalement si vous souhaitez recevoir des notifications
            </span>
          </div>
          <Switch
            id="enableAllNotifications"
            checked={settings.enableAllNotifications}
            onCheckedChange={(checked) => updateSettings('enableAllNotifications', checked)}
          />
        </div>

        <div className="space-y-4 pl-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="emailNotifications" className="cursor-pointer">Notifications par email</Label>
            <Switch
              id="emailNotifications"
              checked={settings.emailNotifications && settings.enableAllNotifications}
              onCheckedChange={(checked) => updateSettings('emailNotifications', checked)}
              disabled={!settings.enableAllNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="inAppNotifications" className="cursor-pointer">Notifications dans l'application</Label>
            <Switch
              id="inAppNotifications"
              checked={settings.inAppNotifications && settings.enableAllNotifications}
              onCheckedChange={(checked) => updateSettings('inAppNotifications', checked)}
              disabled={!settings.enableAllNotifications}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-sm font-medium flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Fréquence des récapitulatifs
          </h3>
          
          <div className="space-y-2 pl-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="dailyDigest" className="cursor-pointer">Résumé quotidien</Label>
              <Switch
                id="dailyDigest"
                checked={settings.dailyDigest && settings.enableAllNotifications}
                onCheckedChange={(checked) => updateSettings('dailyDigest', checked)}
                disabled={!settings.enableAllNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="weeklyDigest" className="cursor-pointer">Résumé hebdomadaire</Label>
              <Switch
                id="weeklyDigest"
                checked={settings.weeklyDigest || settings.silenceMode}
                onCheckedChange={(checked) => updateSettings('weeklyDigest', checked)}
                disabled={settings.silenceMode}
              />
            </div>
          </div>
        </div>

        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Types de notifications</h3>
          
          <div className="space-y-2 pl-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="scanReminders" className="cursor-pointer">Rappels de scan émotionnel</Label>
              <Switch
                id="scanReminders"
                checked={settings.scanReminders && settings.enableAllNotifications}
                onCheckedChange={(checked) => updateSettings('scanReminders', checked)}
                disabled={!settings.enableAllNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="journalReminders" className="cursor-pointer">Rappels de journal</Label>
              <Switch
                id="journalReminders"
                checked={settings.journalReminders && settings.enableAllNotifications}
                onCheckedChange={(checked) => updateSettings('journalReminders', checked)}
                disabled={!settings.enableAllNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="achievementNotifications" className="cursor-pointer">Récompenses et badges</Label>
              <Switch
                id="achievementNotifications"
                checked={settings.achievementNotifications && settings.enableAllNotifications}
                onCheckedChange={(checked) => updateSettings('achievementNotifications', checked)}
                disabled={!settings.enableAllNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="teamUpdates" className="cursor-pointer">Mises à jour de l'équipe</Label>
              <Switch
                id="teamUpdates"
                checked={settings.teamUpdates && settings.enableAllNotifications}
                onCheckedChange={(checked) => updateSettings('teamUpdates', checked)}
                disabled={!settings.enableAllNotifications}
              />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button onClick={saveSettings}>Enregistrer les préférences</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
