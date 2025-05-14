
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Sliders, Bell, Shield, User, FileDown } from 'lucide-react';
import { useUserPreferences } from '@/hooks/useUserPreferences';

const B2CPreferences: React.FC = () => {
  const { preferences, updatePreferences } = useUserPreferences();

  const handleExportProfile = () => {
    // Mock function for exporting profile
    const exportFormat = preferences.dataExport || 'pdf';
    const timestamp = new Date().toISOString().split('T')[0];
    
    const exportData = {
      timestamp,
      userData: {
        name: "Utilisateur",
        emotionalProfile: "Équilibré",
        preferences: { ...preferences }
      }
    };
    
    // In a real implementation, this would generate a file for download
    console.log(`Exporting profile as ${exportFormat}:`, exportData);
    
    // Show feedback to user
    alert(`Votre profil émotionnel a été exporté au format ${exportFormat.toUpperCase()}`);
  };
  
  const handleToggleAutoAdapt = (enabled: boolean) => {
    updatePreferences({ dynamicTheme: enabled ? 'emotion' : 'none' });
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Préférences</h1>
      <p className="text-muted-foreground mb-4">
        Personnalisez votre expérience sur EmotionsCare selon vos besoins.
      </p>
      
      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="appearance">Apparence</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
          <TabsTrigger value="profile">Profil</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sliders className="h-5 w-5" />
                <span>Thème et affichage</span>
              </CardTitle>
              <CardDescription>
                Personnalisez l'apparence de l'interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Thème</Label>
                  <Select 
                    defaultValue={preferences.theme || 'light'} 
                    onValueChange={(value) => updatePreferences({ theme: value })}
                  >
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Sélectionner un thème" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Clair</SelectItem>
                      <SelectItem value="dark">Sombre</SelectItem>
                      <SelectItem value="system">Système</SelectItem>
                      <SelectItem value="pastel">Pastel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fontSize">Taille de police</Label>
                  <Select 
                    defaultValue={preferences.fontSize || 'medium'} 
                    onValueChange={(value) => updatePreferences({ fontSize: value })}
                  >
                    <SelectTrigger id="fontSize">
                      <SelectValue placeholder="Sélectionner une taille" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Petite</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="large">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label>Adaptation automatique basée sur vos émotions</Label>
                  <p className="text-sm text-muted-foreground">
                    L'interface s'adaptera automatiquement en fonction de votre état émotionnel
                  </p>
                </div>
                <Switch 
                  checked={preferences.dynamicTheme === 'emotion'}
                  onCheckedChange={handleToggleAutoAdapt}
                />
              </div>
              
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label>Réduire les animations</Label>
                  <p className="text-sm text-muted-foreground">
                    Limiter les effets visuels pour plus de confort
                  </p>
                </div>
                <Switch 
                  checked={preferences.reducedAnimations}
                  onCheckedChange={(checked) => updatePreferences({ reducedAnimations: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </CardTitle>
              <CardDescription>
                Configurez les alertes et rappels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label>Activer les notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevez des rappels et conseils personnalisés
                  </p>
                </div>
                <Switch 
                  checked={preferences.notificationsEnabled}
                  onCheckedChange={(checked) => updatePreferences({ notificationsEnabled: checked })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notifFrequency">Fréquence des rappels</Label>
                <Select 
                  defaultValue={preferences.notificationFrequency || 'daily'} 
                  onValueChange={(value) => updatePreferences({ notificationFrequency: value })}
                >
                  <SelectTrigger id="notifFrequency">
                    <SelectValue placeholder="Choisir une fréquence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Plusieurs fois par jour</SelectItem>
                    <SelectItem value="daily">Une fois par jour</SelectItem>
                    <SelectItem value="weekly">Une fois par semaine</SelectItem>
                    <SelectItem value="custom">Personnalisé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notifTone">Style des notifications</Label>
                <Select 
                  defaultValue={preferences.notificationTone || 'gentle'} 
                  onValueChange={(value) => updatePreferences({ notificationTone: value })}
                >
                  <SelectTrigger id="notifTone">
                    <SelectValue placeholder="Choisir un style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gentle">Doux et calme</SelectItem>
                    <SelectItem value="neutral">Neutre</SelectItem>
                    <SelectItem value="energetic">Énergique et motivant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span>Confidentialité et données</span>
              </CardTitle>
              <CardDescription>
                Gérez la protection de vos informations émotionnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label>Mode incognito</Label>
                  <p className="text-sm text-muted-foreground">
                    Aucune donnée ne sera enregistrée pendant la session
                  </p>
                </div>
                <Switch 
                  checked={preferences.incognitoMode}
                  onCheckedChange={(checked) => updatePreferences({ incognitoMode: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label>Verrouiller les entrées de journal</Label>
                  <p className="text-sm text-muted-foreground">
                    Protection par code de vos entrées confidentielles
                  </p>
                </div>
                <Switch 
                  checked={preferences.lockJournals}
                  onCheckedChange={(checked) => updatePreferences({ lockJournals: checked })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dataExport">Format d'exportation de données</Label>
                <Select 
                  defaultValue={preferences.dataExport || 'pdf'} 
                  onValueChange={(value) => updatePreferences({ dataExport: value })}
                >
                  <SelectTrigger id="dataExport">
                    <SelectValue placeholder="Choisir un format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" className="w-full gap-2" onClick={handleExportProfile}>
                <FileDown className="h-4 w-4" />
                <span>Exporter mon profil émotionnel</span>
              </Button>
              
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>Profil personnel</span>
              </CardTitle>
              <CardDescription>
                Gérez vos informations personnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Nom d'affichage</Label>
                  <input 
                    type="text" 
                    id="displayName"
                    className="w-full p-2 border rounded-md"
                    defaultValue={preferences.displayName || ''}
                    onChange={(e) => updatePreferences({ displayName: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pronouns">Pronoms</Label>
                  <Select 
                    defaultValue={preferences.pronouns || 'il'} 
                    onValueChange={(value) => updatePreferences({ pronouns: value })}
                  >
                    <SelectTrigger id="pronouns">
                      <SelectValue placeholder="Choix des pronoms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="il">Il</SelectItem>
                      <SelectItem value="elle">Elle</SelectItem>
                      <SelectItem value="iel">Iel</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button variant="outline" className="w-full gap-2">
                <Download className="h-4 w-4" />
                <span>Télécharger mes données</span>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2CPreferences;
