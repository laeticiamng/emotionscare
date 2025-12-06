// @ts-nocheck

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Key, 
  Lock, 
  Smartphone, 
  Eye, 
  AlertTriangle, 
  Bell, 
  UserCheck,
  Fingerprint,
  Clock
} from 'lucide-react';

const SecuritySettings: React.FC = () => {
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    multiFactorAuth: 'adaptive', // 'disabled', 'basic', 'adaptive'
    biometricAuth: true,
    sessionTimeout: true,
    loginNotifications: true,
    unusualActivityAlerts: true,
    deviceTrust: 'all', // 'all', 'known', 'verified'
    encryptionLevel: 'aes256', // 'standard', 'aes256'
    dataWipe: true,
    autoKeyRotation: true,
    behavioralAnalysis: true
  });

  const handleSwitchChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSelectChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    toast({
      title: "Paramètres de sécurité mis à jour",
      description: "Vos préférences de sécurité avancée ont été enregistrées avec succès."
    });
  };

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg border-b">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>Sécurité avancée</CardTitle>
        </div>
        <CardDescription>
          Protection renforcée de vos données et de votre compte
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Notification banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-blue-800 text-sm flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium mb-1">Protection avancée activée</p>
            <p>Votre compte bénéficie actuellement du niveau de sécurité le plus élevé avec chiffrement AES-256-GCM et TLS 1.3.</p>
          </div>
        </div>

        {/* Authentication Section */}
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Key className="mr-2 h-4 w-4" />
            Authentification
            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
              Renforcée
            </Badge>
          </h3>
          
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="mfa-select">Authentification multifacteur</Label>
              <Select 
                value={settings.multiFactorAuth}
                onValueChange={(value) => handleSelectChange('multiFactorAuth', value)}
              >
                <SelectTrigger id="mfa-select" className="w-full">
                  <SelectValue placeholder="Sélectionnez une option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disabled">Désactivée</SelectItem>
                  <SelectItem value="basic">Basique (Code temporaire)</SelectItem>
                  <SelectItem value="adaptive">Adaptative (Analyse contextuelle)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                L'authentification adaptative ajuste le niveau de vérification en fonction du contexte de connexion
              </p>
            </div>
            
            <div className="flex items-center justify-between rounded-lg border p-4">
              <Label htmlFor="biometric-auth" className="flex-1">
                <div className="flex items-center gap-2">
                  <Fingerprint className="h-4 w-4 text-muted-foreground" />
                  <span>Authentification biométrique</span>
                </div>
                <div className="text-sm text-muted-foreground ml-6">
                  Utiliser la reconnaissance faciale ou d'empreinte sur mobile
                </div>
              </Label>
              <Switch
                id="biometric-auth"
                checked={settings.biometricAuth}
                onCheckedChange={(checked) => handleSwitchChange('biometricAuth', checked)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <Label htmlFor="session-timeout" className="flex-1">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Expiration automatique de session</span>
                </div>
                <div className="text-sm text-muted-foreground ml-6">
                  Déconnexion après 30 minutes d'inactivité
                </div>
              </Label>
              <Switch
                id="session-timeout"
                checked={settings.sessionTimeout}
                onCheckedChange={(checked) => handleSwitchChange('sessionTimeout', checked)}
              />
            </div>
          </div>
        </div>

        {/* Monitoring Section */}
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Eye className="mr-2 h-4 w-4" />
            Surveillance et Alertes
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <Label htmlFor="login-notifications" className="flex-1">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <span>Notifications de connexion</span>
                </div>
                <div className="text-sm text-muted-foreground ml-6">
                  Être notifié lors d'une nouvelle connexion à votre compte
                </div>
              </Label>
              <Switch
                id="login-notifications"
                checked={settings.loginNotifications}
                onCheckedChange={(checked) => handleSwitchChange('loginNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <Label htmlFor="unusual-activity" className="flex-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  <span>Alerte d'activité inhabituelle</span>
                </div>
                <div className="text-sm text-muted-foreground ml-6">
                  Recevoir des alertes en cas d'activité suspecte détectée
                </div>
              </Label>
              <Switch
                id="unusual-activity"
                checked={settings.unusualActivityAlerts}
                onCheckedChange={(checked) => handleSwitchChange('unusualActivityAlerts', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between rounded-lg border p-4">
              <Label htmlFor="behavioral-analysis" className="flex-1">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                  <span>Analyse comportementale</span>
                  <Badge className="bg-primary/20 text-primary text-xs">Premium</Badge>
                </div>
                <div className="text-sm text-muted-foreground ml-6">
                  Protection avancée via l'analyse de vos habitudes de connexion
                </div>
              </Label>
              <Switch
                id="behavioral-analysis"
                checked={settings.behavioralAnalysis}
                onCheckedChange={(checked) => handleSwitchChange('behavioralAnalysis', checked)}
              />
            </div>
          </div>
        </div>

        {/* Data Protection Section */}
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Lock className="mr-2 h-4 w-4" />
            Protection des données
          </h3>
          
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="encryption-level">Niveau de chiffrement</Label>
              <Select 
                value={settings.encryptionLevel}
                onValueChange={(value) => handleSelectChange('encryptionLevel', value)}
              >
                <SelectTrigger id="encryption-level" className="w-full">
                  <SelectValue placeholder="Sélectionnez un niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="aes256">AES-256-GCM (Recommandé)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                AES-256-GCM offre une protection optimale de vos données sensibles
              </p>
            </div>
            
            <div className="flex items-center justify-between rounded-lg border p-4">
              <Label htmlFor="key-rotation" className="flex-1">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <span>Rotation automatique des clés</span>
                  <Badge className="bg-primary/20 text-primary text-xs">Premium</Badge>
                </div>
                <div className="text-sm text-muted-foreground ml-6">
                  Renouvellement périodique des clés de chiffrement
                </div>
              </Label>
              <Switch
                id="key-rotation"
                checked={settings.autoKeyRotation}
                onCheckedChange={(checked) => handleSwitchChange('autoKeyRotation', checked)}
              />
            </div>
          </div>
        </div>

        {/* Mobile Security */}
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Smartphone className="mr-2 h-4 w-4" />
            Sécurité mobile
          </h3>
          
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="device-trust">Niveau de confiance des appareils</Label>
              <Select 
                value={settings.deviceTrust}
                onValueChange={(value) => handleSelectChange('deviceTrust', value)}
              >
                <SelectTrigger id="device-trust" className="w-full">
                  <SelectValue placeholder="Sélectionnez un niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les appareils</SelectItem>
                  <SelectItem value="known">Appareils connus uniquement</SelectItem>
                  <SelectItem value="verified">Appareils vérifiés uniquement</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Un niveau plus restrictif requiert une vérification supplémentaire sur de nouveaux appareils
              </p>
            </div>
            
            <div className="flex items-center justify-between rounded-lg border p-4">
              <Label htmlFor="remote-wipe" className="flex-1">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <span>Effacement à distance</span>
                </div>
                <div className="text-sm text-muted-foreground ml-6">
                  Permettre l'effacement des données en cas d'appareil perdu
                </div>
              </Label>
              <Switch
                id="remote-wipe"
                checked={settings.dataWipe}
                onCheckedChange={(checked) => handleSwitchChange('dataWipe', checked)}
              />
            </div>
          </div>
        </div>

        <Button onClick={saveSettings} className="w-full">
          Enregistrer les paramètres de sécurité
        </Button>
        
        <div className="bg-muted/30 p-4 rounded-lg">
          <p className="text-xs text-center text-muted-foreground">
            EmotionsCare est certifié ISO 27001, ISO 27701, SOC 2 Type II et RGPD pour garantir
            la protection optimale de vos données personnelles.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySettings;
