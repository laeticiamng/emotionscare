
import React from 'react';
import Shell from '@/Shell';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/hooks/use-theme';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, Moon, Sun, Palette, Bell, VolumeX, Volume2, 
  Languages, Shield, Lock, LogOut, Save
} from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

const SettingsPage: React.FC = () => {
  const theme = useTheme();
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: "Paramètres enregistrés",
      description: "Vos paramètres ont été mis à jour avec succès."
    });
  };

  return (
    <Shell>
      <div className="container mx-auto py-8">
        <PageHeader
          title="Paramètres"
          description="Personnalisez l'application selon vos préférences"
          icon={<Settings className="h-6 w-6" />}
        />

        <Tabs defaultValue="appearance" className="mt-8">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Apparence</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              <span className="hidden sm:inline">Audio</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Confidentialité</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Compte</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thème</CardTitle>
                  <CardDescription>
                    Personnalisez l'apparence de l'application selon vos préférences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <Button 
                      variant={theme.theme === "light" ? "default" : "outline"}
                      onClick={() => theme.setTheme("light")}
                      className="w-full sm:w-auto justify-start"
                    >
                      <Sun className="h-5 w-5 mr-2" />
                      Mode clair
                    </Button>
                    <Button 
                      variant={theme.theme === "dark" ? "default" : "outline"}
                      onClick={() => theme.setTheme("dark")}
                      className="w-full sm:w-auto justify-start"
                    >
                      <Moon className="h-5 w-5 mr-2" />
                      Mode sombre
                    </Button>
                    <Button 
                      variant={theme.theme === "system" ? "default" : "outline"}
                      onClick={() => theme.setTheme("system")}
                      className="w-full sm:w-auto justify-start"
                    >
                      <Settings className="h-5 w-5 mr-2" />
                      Système
                    </Button>
                  </div>

                  <div>
                    <Label className="mb-2 block">Taille de la police</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner la taille" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Petite</SelectItem>
                        <SelectItem value="medium">Moyenne</SelectItem>
                        <SelectItem value="large">Grande</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="mb-2 block">Langue</Label>
                    <Select defaultValue="fr">
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner la langue" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres des notifications</CardTitle>
                <CardDescription>
                  Configurez comment et quand vous souhaitez être notifié
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notifications dans l'application</p>
                      <p className="text-sm text-muted-foreground">Activer les notifications dans l'application</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">Recevoir des notifications par email</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Rappels de méditation</p>
                      <p className="text-sm text-muted-foreground">Rappels pour vos sessions planifiées</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Mises à jour du journal</p>
                      <p className="text-sm text-muted-foreground">Rappels pour écrire dans votre journal</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audio">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres audio</CardTitle>
                <CardDescription>
                  Configurez les paramètres audio et musicaux
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Volume général</Label>
                      <span className="text-sm text-muted-foreground">75%</span>
                    </div>
                    <Slider defaultValue={[75]} max={100} step={1} />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Volume des méditations</Label>
                      <span className="text-sm text-muted-foreground">80%</span>
                    </div>
                    <Slider defaultValue={[80]} max={100} step={1} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Sons de l'interface</p>
                      <p className="text-sm text-muted-foreground">Sons de notifications et interactions</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Téléchargement automatique</p>
                      <p className="text-sm text-muted-foreground">Télécharger les médias pour une utilisation hors ligne</p>
                    </div>
                    <Switch />
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
                  Gérez vos paramètres de confidentialité et de sécurité
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Journal privé</p>
                      <p className="text-sm text-muted-foreground">Maintenir votre journal strictement privé</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Données d'analyse</p>
                      <p className="text-sm text-muted-foreground">Partager des données anonymes pour améliorer l'application</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Mode incognito</p>
                      <p className="text-sm text-muted-foreground">Masquer votre activité des autres utilisateurs</p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="pt-4">
                  <Button variant="outline" className="w-full">
                    Télécharger mes données
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres du compte</CardTitle>
                <CardDescription>
                  Gérez les informations de votre compte et les préférences de sécurité
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="name">Nom complet</Label>
                    <Input id="name" defaultValue="Utilisateur Test" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="utilisateur@example.com" />
                  </div>
                  <div>
                    <Label htmlFor="password">Mot de passe actuel</Label>
                    <Input id="password" type="password" placeholder="********" />
                  </div>
                  <div>
                    <Label htmlFor="new-password">Nouveau mot de passe</Label>
                    <Input id="new-password" type="password" placeholder="********" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                  <Button variant="destructive" className="sm:w-auto w-full">
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </Button>
                  <Button className="sm:w-auto w-full" onClick={handleSaveSettings}>
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer les modifications
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
};

export default SettingsPage;
