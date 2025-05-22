
import React from 'react';
import Shell from '@/Shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { ThemePreview } from '@/components/preferences/ThemePreview';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const PreferencesPage: React.FC = () => {
  const { preferences, updatePreferences, resetPreferences, isLoading } = useUserPreferences();
  const [activeTab, setActiveTab] = React.useState('appearance');

  const handleUpdateTheme = (theme: 'light' | 'dark' | 'system') => {
    updatePreferences({ theme }).then(() => {
      toast.success('Thème mis à jour');
    });
  };

  const handleToggleNotification = (type: 'email' | 'push' | 'inApp', value: boolean) => {
    const updatedNotifications = {
      ...preferences.notifications,
      [type]: value
    };
    
    updatePreferences({ notifications: updatedNotifications }).then(() => {
      toast.success('Préférences de notification mises à jour');
    });
  };

  const handleTogglePrivacy = (type: 'shareData' | 'analytics', value: boolean) => {
    const updatedPrivacy = {
      ...preferences.privacy,
      [type]: value
    };
    
    updatePreferences({ privacy: updatedPrivacy }).then(() => {
      toast.success('Préférences de confidentialité mises à jour');
    });
  };

  const handleUpdateAccessibility = (key: 'fontSize' | 'contrast' | 'reducedMotion', value: any) => {
    const updatedAccessibility = {
      ...preferences.accessibility,
      [key]: value
    };
    
    updatePreferences({ accessibility: updatedAccessibility }).then(() => {
      toast.success('Préférences d\'accessibilité mises à jour');
    });
  };

  const handleReset = () => {
    resetPreferences();
    toast.success('Préférences réinitialisées');
  };

  return (
    <Shell>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Préférences</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="appearance">Apparence</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibilité</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Apparence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Thème</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {['light', 'dark', 'system'].map((theme) => (
                      <div 
                        key={theme}
                        className={`border rounded-lg p-4 cursor-pointer transition-all hover:border-primary ${
                          preferences.theme === theme ? 'border-primary ring-2 ring-primary ring-opacity-50' : ''
                        }`}
                        onClick={() => handleUpdateTheme(theme as any)}
                      >
                        <p className="font-medium mb-2 capitalize">{theme}</p>
                        <div className="h-24 w-full">
                          <ThemePreview theme={theme as any} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Personnalisez vos préférences de notifications pour rester informé de ce qui compte pour vous.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notifications par e-mail</h4>
                      <p className="text-sm text-muted-foreground">Recevoir des notifications par e-mail</p>
                    </div>
                    <Switch 
                      checked={preferences.notifications?.email ?? false} 
                      onCheckedChange={(checked) => handleToggleNotification('email', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notifications push</h4>
                      <p className="text-sm text-muted-foreground">Recevoir des notifications push sur votre appareil</p>
                    </div>
                    <Switch 
                      checked={preferences.notifications?.push ?? false} 
                      onCheckedChange={(checked) => handleToggleNotification('push', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notifications in-app</h4>
                      <p className="text-sm text-muted-foreground">Recevoir des notifications dans l'application</p>
                    </div>
                    <Switch 
                      checked={preferences.notifications?.inApp ?? false} 
                      onCheckedChange={(checked) => handleToggleNotification('inApp', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Confidentialité</CardTitle>
                <CardDescription>
                  Gérez la façon dont vos données sont utilisées et partagées.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Partage de données</h4>
                      <p className="text-sm text-muted-foreground">Autoriser le partage de vos données pour améliorer l'expérience</p>
                    </div>
                    <Switch 
                      checked={preferences.privacy?.shareData ?? false}
                      onCheckedChange={(checked) => handleTogglePrivacy('shareData', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Analytiques</h4>
                      <p className="text-sm text-muted-foreground">Autoriser la collecte de données d'utilisation anonymes</p>
                    </div>
                    <Switch 
                      checked={preferences.privacy?.analytics ?? true}
                      onCheckedChange={(checked) => handleTogglePrivacy('analytics', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="accessibility">
            <Card>
              <CardHeader>
                <CardTitle>Accessibilité</CardTitle>
                <CardDescription>
                  Personnalisez l'interface pour améliorer votre expérience d'utilisation.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-4">Taille de police</h4>
                  <RadioGroup 
                    value={preferences.accessibility?.fontSize || 'medium'} 
                    onValueChange={(value) => handleUpdateAccessibility('fontSize', value)}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="small" id="font-small" />
                      <Label htmlFor="font-small" className="text-sm">Petite</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="font-medium" />
                      <Label htmlFor="font-medium">Moyenne</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="large" id="font-large" />
                      <Label htmlFor="font-large" className="text-lg">Grande</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <h4 className="font-medium mb-4">Contraste</h4>
                  <RadioGroup 
                    value={preferences.accessibility?.contrast || 'normal'} 
                    onValueChange={(value) => handleUpdateAccessibility('contrast', value)}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="normal" id="contrast-normal" />
                      <Label htmlFor="contrast-normal">Normal</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="contrast-high" />
                      <Label htmlFor="contrast-high">Élevé</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Réduire les animations</h4>
                    <p className="text-sm text-muted-foreground">Limiter les animations et les effets visuels</p>
                  </div>
                  <Switch 
                    checked={preferences.accessibility?.reducedMotion ?? false}
                    onCheckedChange={(checked) => handleUpdateAccessibility('reducedMotion', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={handleReset} disabled={isLoading}>
            Réinitialiser toutes les préférences
          </Button>
        </div>
      </div>
    </Shell>
  );
};

export default PreferencesPage;
