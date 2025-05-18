
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NotificationSettings from '@/components/settings/NotificationSettings';
import NotificationPreferences from '@/components/settings/NotificationPreferences';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import PrivacySettings from '@/components/settings/PrivacySettings';
import PersonalActivityLogs from '@/components/account/PersonalActivityLogs';

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('appearance');
  
  // État pour les paramètres d'apparence
  const [appearanceSettings, setAppearanceSettings] = useState({
    fontSize: 'medium',
    fontFamily: 'system',
    reduceMotion: false,
    colorBlindMode: false
  });
  
  // État pour les paramètres de sécurité
  const [securitySettings, setSecuritySettings] = useState({
    enableTwoFactor: false,
    privateMode: false,
    dataSharing: true,
    rememberMe: true
  });
  
  // Fonction pour mettre à jour les paramètres d'apparence
  const handleAppearanceChange = (key: string, value: any) => {
    setAppearanceSettings(prev => ({ ...prev, [key]: value }));
  };
  
  // Fonction pour mettre à jour les paramètres de sécurité
  const handleSecurityChange = (key: string, value: boolean) => {
    setSecuritySettings(prev => ({ ...prev, [key]: value }));
  };
  
  // Fonction pour sauvegarder les changements
  const handleSave = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Vos préférences ont été enregistrées avec succès."
    });
  };
  
  return (
    <div className="container max-w-4xl py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Paramètres</h1>
        <p className="text-muted-foreground">
          Personnalisez votre expérience et configurez vos préférences
        </p>
      </div>
      
      <Tabs defaultValue="appearance" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="appearance">Apparence</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibilité</TabsTrigger>
          <TabsTrigger value="ethics">Données &amp; éthique</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thème</CardTitle>
              <CardDescription>
                Personnalisez l'apparence de l'application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className={`border rounded-md p-4 cursor-pointer ${theme === 'light' ? 'border-primary' : 'border-muted'}`}
                       onClick={() => setTheme('light')}>
                    <div className="h-20 bg-background border rounded mb-2"></div>
                    <p className="text-center font-medium">Clair</p>
                  </div>
                  
                  <div className={`border rounded-md p-4 cursor-pointer ${theme === 'dark' ? 'border-primary' : 'border-muted'}`}
                       onClick={() => setTheme('dark')}>
                    <div className="h-20 bg-black border rounded mb-2"></div>
                    <p className="text-center font-medium">Sombre</p>
                  </div>
                  
                  <div className={`border rounded-md p-4 cursor-pointer ${theme === 'system' ? 'border-primary' : 'border-muted'}`}
                       onClick={() => setTheme('system')}>
                    <div className="h-20 bg-gradient-to-r from-white to-black border rounded mb-2"></div>
                    <p className="text-center font-medium">Système</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="font-size">Taille de police</Label>
                  <Select 
                    value={appearanceSettings.fontSize}
                    onValueChange={(value) => handleAppearanceChange('fontSize', value)}
                  >
                    <SelectTrigger id="font-size">
                      <SelectValue placeholder="Choisir une taille" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Petite</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="large">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="font-family">Police de caractères</Label>
                  <Select 
                    value={appearanceSettings.fontFamily}
                    onValueChange={(value) => handleAppearanceChange('fontFamily', value)}
                  >
                    <SelectTrigger id="font-family">
                      <SelectValue placeholder="Choisir une police" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">Système</SelectItem>
                      <SelectItem value="sans">Sans Serif</SelectItem>
                      <SelectItem value="serif">Serif</SelectItem>
                      <SelectItem value="mono">Mono</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSave}>Enregistrer les changements</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <NotificationPreferences />
          <NotificationSettings />
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sécurité et confidentialité</CardTitle>
              <CardDescription>
                Gérez les paramètres de sécurité et de confidentialité de votre compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="two-factor">Authentification à deux facteurs</Label>
                    <p className="text-sm text-muted-foreground">
                      Renforce la sécurité de votre compte
                    </p>
                  </div>
                  <Switch 
                    id="two-factor" 
                    checked={securitySettings.enableTwoFactor}
                    onCheckedChange={(checked) => handleSecurityChange('enableTwoFactor', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="private-mode">Mode privé</Label>
                    <p className="text-sm text-muted-foreground">
                      Masque votre journal et vos analyses émotionnelles
                    </p>
                  </div>
                  <Switch 
                    id="private-mode" 
                    checked={securitySettings.privateMode}
                    onCheckedChange={(checked) => handleSecurityChange('privateMode', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="data-sharing">Partage de données anonymes</Label>
                    <p className="text-sm text-muted-foreground">
                      Contribue à l'amélioration de nos services
                    </p>
                  </div>
                  <Switch 
                    id="data-sharing" 
                    checked={securitySettings.dataSharing}
                    onCheckedChange={(checked) => handleSecurityChange('dataSharing', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="remember-me">Rester connecté</Label>
                    <p className="text-sm text-muted-foreground">
                      Mémoriser votre session après fermeture du navigateur
                    </p>
                  </div>
                  <Switch 
                    id="remember-me" 
                    checked={securitySettings.rememberMe}
                    onCheckedChange={(checked) => handleSecurityChange('rememberMe', checked)}
                  />
                </div>
                
                <Button onClick={handleSave}>Enregistrer les changements</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Actions sensibles</CardTitle>
              <CardDescription>
                Actions qui affecteront votre compte et vos données
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <Button variant="outline" className="w-full">
                  Changer le mot de passe
                </Button>
                <Button variant="outline" className="w-full">
                  Exporter mes données
                </Button>
                <Button variant="destructive" className="w-full">
                  Supprimer mon compte
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="accessibility" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Accessibilité</CardTitle>
              <CardDescription>
                Configurez les paramètres d'accessibilité pour améliorer votre expérience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="reduce-motion">Réduire les animations</Label>
                    <p className="text-sm text-muted-foreground">
                      Minimise les animations et transitions
                    </p>
                  </div>
                  <Switch 
                    id="reduce-motion" 
                    checked={appearanceSettings.reduceMotion}
                    onCheckedChange={(checked) => handleAppearanceChange('reduceMotion', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="color-blind-mode">Mode daltonien</Label>
                    <p className="text-sm text-muted-foreground">
                      Optimise les couleurs pour le daltonisme
                    </p>
                  </div>
                  <Switch 
                    id="color-blind-mode" 
                    checked={appearanceSettings.colorBlindMode}
                    onCheckedChange={(checked) => handleAppearanceChange('colorBlindMode', checked)}
                  />
                </div>
                
                <Button onClick={handleSave}>Enregistrer les changements</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ethics" className="space-y-6">
          <PrivacySettings />
          <PersonalActivityLogs />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
