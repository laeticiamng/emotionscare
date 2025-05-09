
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Bell, Calendar, Music, Wind } from 'lucide-react';

const NotificationPreferences = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    journalReminders: true,
    breathingReminders: true,
    musicSuggestions: false,
    emailNotifications: true,
    frequency: 'daily',
    tone: 'gentle',
  });

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    toast({
      title: "Préférences de notification mises à jour",
      description: "Vos paramètres de notifications ont été enregistrés."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5 flex items-center gap-2">
            <Calendar className="text-primary h-5 w-5" />
            <div>
              <Label>Rappels de journal</Label>
              <p className="text-sm text-muted-foreground">Recevez un rappel pour écrire dans votre journal</p>
            </div>
          </div>
          <Switch 
            checked={settings.journalReminders}
            onCheckedChange={(checked) => handleChange('journalReminders', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5 flex items-center gap-2">
            <Wind className="text-primary h-5 w-5" />
            <div>
              <Label>Rappels de respiration</Label>
              <p className="text-sm text-muted-foreground">Recevez un rappel pour prendre un moment de respiration</p>
            </div>
          </div>
          <Switch 
            checked={settings.breathingReminders}
            onCheckedChange={(checked) => handleChange('breathingReminders', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5 flex items-center gap-2">
            <Music className="text-primary h-5 w-5" />
            <div>
              <Label>Suggestions musicales</Label>
              <p className="text-sm text-muted-foreground">Recevez des suggestions de musique adaptées à votre humeur</p>
            </div>
          </div>
          <Switch 
            checked={settings.musicSuggestions}
            onCheckedChange={(checked) => handleChange('musicSuggestions', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5 flex items-center gap-2">
            <Bell className="text-primary h-5 w-5" />
            <div>
              <Label>Notifications par email</Label>
              <p className="text-sm text-muted-foreground">Recevez des résumés hebdomadaires par email</p>
            </div>
          </div>
          <Switch 
            checked={settings.emailNotifications}
            onCheckedChange={(checked) => handleChange('emailNotifications', checked)}
          />
        </div>
      </div>
      
      <div className="border-t pt-4 space-y-3">
        <h3 className="font-medium">Fréquence des rappels</h3>
        <RadioGroup 
          value={settings.frequency}
          onValueChange={(value) => handleChange('frequency', value)}
          className="flex flex-wrap gap-2"
        >
          <div className="relative">
            <RadioGroupItem 
              value="daily" 
              id="freq-daily" 
              className="absolute inset-0 w-full h-full opacity-0 peer"
            />
            <Label 
              htmlFor="freq-daily" 
              className="px-3 py-1.5 border rounded-full peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground cursor-pointer flex items-center justify-center text-sm"
            >
              Quotidien
            </Label>
          </div>
          <div className="relative">
            <RadioGroupItem 
              value="weekly" 
              id="freq-weekly" 
              className="absolute inset-0 w-full h-full opacity-0 peer"
            />
            <Label 
              htmlFor="freq-weekly" 
              className="px-3 py-1.5 border rounded-full peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground cursor-pointer flex items-center justify-center text-sm"
            >
              Hebdomadaire
            </Label>
          </div>
          <div className="relative">
            <RadioGroupItem 
              value="flexible" 
              id="freq-flexible" 
              className="absolute inset-0 w-full h-full opacity-0 peer"
            />
            <Label 
              htmlFor="freq-flexible" 
              className="px-3 py-1.5 border rounded-full peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground cursor-pointer flex items-center justify-center text-sm"
            >
              Flexible
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="border-t pt-4 space-y-3">
        <h3 className="font-medium">Style de notification</h3>
        <div className="grid grid-cols-3 gap-2">
          <div 
            className={`border rounded-md p-3 cursor-pointer hover:bg-accent ${settings.tone === 'gentle' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => handleChange('tone', 'gentle')}
          >
            <h4 className="font-medium">Douce</h4>
            <p className="text-xs text-muted-foreground">Notifications calmes et discrètes</p>
          </div>
          <div 
            className={`border rounded-md p-3 cursor-pointer hover:bg-accent ${settings.tone === 'motivating' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => handleChange('tone', 'motivating')}
          >
            <h4 className="font-medium">Motivante</h4>
            <p className="text-xs text-muted-foreground">Encouragements positifs</p>
          </div>
          <div 
            className={`border rounded-md p-3 cursor-pointer hover:bg-accent ${settings.tone === 'silent' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => handleChange('tone', 'silent')}
          >
            <h4 className="font-medium">Silencieuse</h4>
            <p className="text-xs text-muted-foreground">Visuelles uniquement</p>
          </div>
        </div>
      </div>
      
      <Button onClick={saveSettings} className="w-full">
        Enregistrer les préférences
      </Button>
    </div>
  );
};

export default NotificationPreferences;
