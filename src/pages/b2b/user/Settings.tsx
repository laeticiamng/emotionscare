
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NotificationSettings from '@/components/settings/NotificationSettings';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import PrivacySettings from '@/components/settings/PrivacySettings';
import PersonalActivityLogs from '@/components/account/PersonalActivityLogs';

const B2BUserSettings = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  const handleSave = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Vos préférences ont été enregistrées avec succès."
    });
  };
  
  return (
    <div className="container max-w-4xl py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Paramètres utilisateur professionnel</h1>
        <p className="text-muted-foreground">
          Personnalisez votre expérience dans l'environnement professionnel
        </p>
      </div>
      
      <Tabs defaultValue="appearance">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="appearance">Apparence</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
          <TabsTrigger value="ethics">Données &amp; éthique</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thème</CardTitle>
              <CardDescription>
                Personnalisez l'apparence de l'application (dans les limites de votre entreprise)
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
                  <Select defaultValue="medium">
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
                
                <div className="border p-4 rounded-md bg-muted/30">
                  <p className="text-sm text-muted-foreground">
                    Note : Certains paramètres d'apparence peuvent être limités par la configuration de votre entreprise.
                  </p>
                </div>

                <Button onClick={handleSave}>Enregistrer les changements</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <NotificationSettings />
          
          <Card>
            <CardHeader>
              <CardTitle>Notifications professionnelles</CardTitle>
              <CardDescription>
                Configurez les notifications spécifiques à votre environnement de travail
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Rappels de bien-être</p>
                  <p className="text-sm text-muted-foreground">
                    Recevez des rappels pour prendre soin de votre bien-être au travail
                  </p>
                </div>
                <Switch defaultChecked={true} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Alertes d'équipe</p>
                  <p className="text-sm text-muted-foreground">
                    Notifications concernant votre équipe et vos collaborateurs
                  </p>
                </div>
                <Switch defaultChecked={true} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Mises à jour de l'entreprise</p>
                  <p className="text-sm text-muted-foreground">
                    Nouvelles et mises à jour importantes de votre entreprise
                  </p>
                </div>
                <Switch defaultChecked={true} />
              </div>
              
              <Button onClick={handleSave}>Enregistrer les préférences</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Confidentialité</CardTitle>
              <CardDescription>
                Gérez qui peut voir vos données et comment elles sont utilisées
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="profile-visibility">Visibilité du profil</Label>
                    <p className="text-sm text-muted-foreground">
                      Qui peut voir votre profil et vos activités
                    </p>
                  </div>
                  <Select defaultValue="team">
                    <SelectTrigger id="profile-visibility" className="w-[180px]">
                      <SelectValue placeholder="Visibilité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="team">Mon équipe uniquement</SelectItem>
                      <SelectItem value="organization">Toute l'organisation</SelectItem>
                      <SelectItem value="private">Privé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="data-sharing">Partage des données avec les managers</Label>
                    <p className="text-sm text-muted-foreground">
                      Autorise le partage de vos données émotionnelles anonymisées
                    </p>
                  </div>
                  <Switch id="data-sharing" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="journal-privacy">Journal privé</Label>
                    <p className="text-sm text-muted-foreground">
                      Masque le contenu de votre journal émotionnel
                    </p>
                  </div>
                  <Switch id="journal-privacy" defaultChecked />
                </div>
                
                <div className="border p-4 rounded-md bg-blue-50 dark:bg-blue-900/20">
                  <p className="text-sm">
                    <strong>Information :</strong> Certains paramètres de confidentialité peuvent être définis par votre entreprise. Les données partagées avec les managers sont toujours anonymisées.
                  </p>
                </div>
                
                <Button onClick={handleSave}>Enregistrer les préférences</Button>
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

export default B2BUserSettings;
