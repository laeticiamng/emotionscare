
import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const SecuritySettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: true,
    rememberDevice: true,
    loginAlerts: true,
    dataEncryption: true
  });

  const handleChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    // In a real app, you would save the security settings here
    toast({
      title: "Paramètres de sécurité mis à jour",
      description: "Vos préférences de sécurité ont été enregistrées avec succès."
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Authentification à deux facteurs</p>
            <p className="text-sm text-muted-foreground">Ajoutez une couche de sécurité supplémentaire à votre compte</p>
          </div>
          <Switch
            checked={settings.twoFactorAuth}
            onCheckedChange={(checked) => handleChange('twoFactorAuth', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Expiration de session</p>
            <p className="text-sm text-muted-foreground">Déconnexion automatique après 30 minutes d'inactivité</p>
          </div>
          <Switch
            checked={settings.sessionTimeout}
            onCheckedChange={(checked) => handleChange('sessionTimeout', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Se souvenir de l'appareil</p>
            <p className="text-sm text-muted-foreground">Rester connecté sur les appareils de confiance</p>
          </div>
          <Switch
            checked={settings.rememberDevice}
            onCheckedChange={(checked) => handleChange('rememberDevice', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Alertes de connexion</p>
            <p className="text-sm text-muted-foreground">Recevoir des alertes lors de nouvelles connexions</p>
          </div>
          <Switch
            checked={settings.loginAlerts}
            onCheckedChange={(checked) => handleChange('loginAlerts', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Chiffrement des données</p>
            <p className="text-sm text-muted-foreground">Chiffrer vos données personnelles</p>
          </div>
          <Switch
            checked={settings.dataEncryption}
            onCheckedChange={(checked) => handleChange('dataEncryption', checked)}
          />
        </div>
      </div>
      
      <Button onClick={saveSettings}>
        Enregistrer les paramètres
      </Button>
    </div>
  );
};

export default SecuritySettings;
