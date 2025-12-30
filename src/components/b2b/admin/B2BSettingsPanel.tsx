/**
 * B2BSettingsPanel - Panneau de paramètres pour admin B2B
 * Configuration organisation, notifications, intégrations, sécurité
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, Bell, Shield, Palette, Globe, 
  Mail, MessageSquare, Users, Clock, Save,
  RefreshCw, Lock, Eye, EyeOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OrganizationSettings {
  name: string;
  domain: string;
  timezone: string;
  language: string;
  logo?: string;
}

interface NotificationSettings {
  emailDigest: boolean;
  slackIntegration: boolean;
  weeklyReports: boolean;
  alertThreshold: number;
  digestFrequency: 'daily' | 'weekly' | 'monthly';
}

interface SecuritySettings {
  mfaRequired: boolean;
  sessionTimeout: number;
  ipWhitelist: boolean;
  dataRetention: number;
  auditLogging: boolean;
}

export const B2BSettingsPanel: React.FC = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const [orgSettings, setOrgSettings] = useState<OrganizationSettings>({
    name: 'Mon Organisation',
    domain: 'mon-org.emotionscare.app',
    timezone: 'Europe/Paris',
    language: 'fr',
  });

  const [notifSettings, setNotifSettings] = useState<NotificationSettings>({
    emailDigest: true,
    slackIntegration: false,
    weeklyReports: true,
    alertThreshold: 5,
    digestFrequency: 'weekly',
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    mfaRequired: false,
    sessionTimeout: 60,
    ipWhitelist: false,
    dataRetention: 365,
    auditLogging: true,
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulated save
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: 'Paramètres sauvegardés',
        description: 'Vos modifications ont été enregistrées.',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder les paramètres.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Paramètres organisation</h2>
          <p className="text-muted-foreground">Configuration complète de votre espace B2B</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Sauvegarder
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="gap-2">
            <Building2 className="h-4 w-4" />
            Général
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="branding" className="gap-2">
            <Palette className="h-4 w-4" />
            Personnalisation
          </TabsTrigger>
        </TabsList>

        {/* Général */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informations organisation
              </CardTitle>
              <CardDescription>
                Détails de base de votre organisation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Nom de l'organisation</Label>
                  <Input
                    id="org-name"
                    value={orgSettings.name}
                    onChange={(e) => setOrgSettings({ ...orgSettings, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-domain">Domaine</Label>
                  <Input
                    id="org-domain"
                    value={orgSettings.domain}
                    onChange={(e) => setOrgSettings({ ...orgSettings, domain: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuseau horaire</Label>
                  <Select
                    value={orgSettings.timezone}
                    onValueChange={(value) => setOrgSettings({ ...orgSettings, timezone: value })}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Paris">Europe/Paris (UTC+1)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (UTC+0)</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (UTC-5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Langue par défaut</Label>
                  <Select
                    value={orgSettings.language}
                    onValueChange={(value) => setOrgSettings({ ...orgSettings, language: value })}
                  >
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Clés API
              </CardTitle>
              <CardDescription>
                Gérez vos clés d'accès API pour les intégrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  type={showApiKey ? 'text' : 'password'}
                  value="sk_live_xxxx_xxxx_xxxx_xxxx"
                  readOnly
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button variant="outline">Régénérer</Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Ne partagez jamais votre clé API. Utilisez des variables d'environnement.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Notifications email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Digest email</Label>
                  <p className="text-sm text-muted-foreground">
                    Résumé périodique des activités
                  </p>
                </div>
                <Switch
                  checked={notifSettings.emailDigest}
                  onCheckedChange={(checked) => 
                    setNotifSettings({ ...notifSettings, emailDigest: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Rapports hebdomadaires</Label>
                  <p className="text-sm text-muted-foreground">
                    Rapport de bien-être chaque lundi
                  </p>
                </div>
                <Switch
                  checked={notifSettings.weeklyReports}
                  onCheckedChange={(checked) => 
                    setNotifSettings({ ...notifSettings, weeklyReports: checked })
                  }
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Fréquence du digest</Label>
                <Select
                  value={notifSettings.digestFrequency}
                  onValueChange={(value: 'daily' | 'weekly' | 'monthly') => 
                    setNotifSettings({ ...notifSettings, digestFrequency: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Quotidien</SelectItem>
                    <SelectItem value="weekly">Hebdomadaire</SelectItem>
                    <SelectItem value="monthly">Mensuel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Intégrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-[#4A154B] flex items-center justify-center">
                    <span className="text-white font-bold">S</span>
                  </div>
                  <div>
                    <Label>Slack</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications dans votre workspace
                    </p>
                  </div>
                </div>
                <Badge variant={notifSettings.slackIntegration ? 'default' : 'secondary'}>
                  {notifSettings.slackIntegration ? 'Connecté' : 'Non connecté'}
                </Badge>
              </div>
              <Button variant="outline" className="w-full">
                Configurer Slack
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sécurité */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Paramètres de sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Authentification à deux facteurs obligatoire</Label>
                  <p className="text-sm text-muted-foreground">
                    Tous les utilisateurs doivent activer la 2FA
                  </p>
                </div>
                <Switch
                  checked={securitySettings.mfaRequired}
                  onCheckedChange={(checked) => 
                    setSecuritySettings({ ...securitySettings, mfaRequired: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Liste blanche IP</Label>
                  <p className="text-sm text-muted-foreground">
                    Restreindre l'accès à certaines IP
                  </p>
                </div>
                <Switch
                  checked={securitySettings.ipWhitelist}
                  onCheckedChange={(checked) => 
                    setSecuritySettings({ ...securitySettings, ipWhitelist: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Journal d'audit</Label>
                  <p className="text-sm text-muted-foreground">
                    Enregistrer toutes les actions sensibles
                  </p>
                </div>
                <Switch
                  checked={securitySettings.auditLogging}
                  onCheckedChange={(checked) => 
                    setSecuritySettings({ ...securitySettings, auditLogging: checked })
                  }
                />
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Timeout session (minutes)</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => 
                      setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) || 60 })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data-retention">Rétention données (jours)</Label>
                  <Input
                    id="data-retention"
                    type="number"
                    value={securitySettings.dataRetention}
                    onChange={(e) => 
                      setSecuritySettings({ ...securitySettings, dataRetention: parseInt(e.target.value) || 365 })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personnalisation */}
        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Identité visuelle
              </CardTitle>
              <CardDescription>
                Personnalisez l'apparence de votre espace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Logo de l'organisation</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Building2 className="h-12 w-12 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Glissez votre logo ici ou cliquez pour sélectionner
                    </p>
                    <Button variant="outline" size="sm">Choisir un fichier</Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Couleur principale</Label>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-primary border" />
                  <Input type="text" value="#6366f1" className="w-32 font-mono" readOnly />
                  <Button variant="outline" size="sm">Modifier</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2BSettingsPanel;
