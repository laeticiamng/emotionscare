
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Bell, 
  Moon, 
  Sun, 
  Monitor, 
  Globe, 
  Shield, 
  Trash2,
  Download,
  Upload
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'sonner';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { userMode } = useUserMode();
  const { theme, setTheme } = useTheme();
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false,
    updates: true
  });

  const [privacy, setPrivacy] = useState({
    analytics: true,
    dataSharing: false,
    profileVisibility: 'private'
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    toast.success('Préférences de notification mises à jour');
  };

  const handlePrivacyChange = (key: string, value: boolean | string) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
    toast.success('Paramètres de confidentialité mis à jour');
  };

  const handleExportData = () => {
    toast.info('Export des données en cours...');
    // Simulation d'export
    setTimeout(() => {
      toast.success('Données exportées avec succès');
    }, 2000);
  };

  const handleDeleteAccount = () => {
    toast.error('Suppression de compte non implémentée pour la démo');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Paramètres
          </h1>
          <p className="text-muted-foreground">
            Personnalisez votre expérience EmotionsCare
          </p>
        </div>
        <Badge variant="outline">
          {userMode === 'b2c' ? 'Particulier' : 
           userMode === 'b2b_user' ? 'Collaborateur' : 
           'Administrateur'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Apparence */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Apparence
            </CardTitle>
            <CardDescription>
              Personnalisez l'interface selon vos préférences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-medium">Thème</Label>
              <RadioGroup 
                value={theme} 
                onValueChange={(value) => setTheme(value as any)}
                className="grid grid-cols-3 gap-4"
              >
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light" className="flex items-center gap-2 cursor-pointer">
                    <Sun className="h-4 w-4" />
                    Clair
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark" className="flex items-center gap-2 cursor-pointer">
                    <Moon className="h-4 w-4" />
                    Sombre
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="system" id="system" />
                  <Label htmlFor="system" className="flex items-center gap-2 cursor-pointer">
                    <Monitor className="h-4 w-4" />
                    Système
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">Langue</Label>
              <RadioGroup defaultValue="fr" className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fr" id="fr" />
                  <Label htmlFor="fr" className="flex items-center gap-2 cursor-pointer">
                    <Globe className="h-4 w-4" />
                    Français
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="en" id="en" disabled />
                  <Label htmlFor="en" className="flex items-center gap-2 cursor-pointer opacity-50">
                    <Globe className="h-4 w-4" />
                    English (bientôt disponible)
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Gérez vos préférences de notification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notif" className="text-base font-medium">
                    Notifications par email
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Recevez des mises à jour par email
                  </p>
                </div>
                <Switch 
                  id="email-notif"
                  checked={notifications.email}
                  onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notif" className="text-base font-medium">
                    Notifications push
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Alertes sur votre appareil
                  </p>
                </div>
                <Switch 
                  id="push-notif"
                  checked={notifications.push}
                  onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="marketing-notif" className="text-base font-medium">
                    Communications marketing
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Nouvelles fonctionnalités et offres
                  </p>
                </div>
                <Switch 
                  id="marketing-notif"
                  checked={notifications.marketing}
                  onCheckedChange={(checked) => handleNotificationChange('marketing', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="updates-notif" className="text-base font-medium">
                    Mises à jour du produit
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Nouvelles versions et améliorations
                  </p>
                </div>
                <Switch 
                  id="updates-notif"
                  checked={notifications.updates}
                  onCheckedChange={(checked) => handleNotificationChange('updates', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Confidentialité */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Confidentialité et Sécurité
            </CardTitle>
            <CardDescription>
              Contrôlez vos données et votre vie privée
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="analytics" className="text-base font-medium">
                    Analytiques d'usage
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Nous aider à améliorer l'application
                  </p>
                </div>
                <Switch 
                  id="analytics"
                  checked={privacy.analytics}
                  onCheckedChange={(checked) => handlePrivacyChange('analytics', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="data-sharing" className="text-base font-medium">
                    Partage de données
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Partager des données anonymisées
                  </p>
                </div>
                <Switch 
                  id="data-sharing"
                  checked={privacy.dataSharing}
                  onCheckedChange={(checked) => handlePrivacyChange('dataSharing', checked)}
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  onClick={handleExportData}
                  className="w-full justify-start"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exporter mes données
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => toast.info('Fonctionnalité en développement')}
                  className="w-full justify-start"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Importer des données
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gestion du compte */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Gestion du Compte
            </CardTitle>
            <CardDescription>
              Actions importantes sur votre compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-800 mb-2">
                Zone de danger
              </h4>
              <p className="text-sm text-orange-700 mb-4">
                Ces actions sont irréversibles. Procédez avec prudence.
              </p>
              
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  onClick={() => toast.info('Fonctionnalité en développement')}
                  className="w-full justify-start border-orange-300 text-orange-700 hover:bg-orange-100"
                >
                  Réinitialiser mes données
                </Button>
                
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAccount}
                  className="w-full justify-start"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer mon compte
                </Button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Besoin d'aide ? Contactez notre support à support@emotionscare.com
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
