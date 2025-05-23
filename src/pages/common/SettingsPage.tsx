
import React from 'react';
import Shell from '@/Shell';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import ModeToggle from '@/components/ui/mode-toggle';

const SettingsPage: React.FC = () => {
  return (
    <Shell>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Paramètres</h1>
        
        <Tabs defaultValue="account" className="space-y-6">
          <TabsList>
            <TabsTrigger value="account">Compte</TabsTrigger>
            <TabsTrigger value="appearance">Apparence</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations du profil</CardTitle>
                <CardDescription>
                  Modifiez les informations de votre compte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input id="name" defaultValue="Utilisateur" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="utilisateur@exemple.com" />
                </div>
                <Button>Sauvegarder</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sécurité</CardTitle>
                <CardDescription>
                  Gérez les paramètres de sécurité de votre compte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current_password">Mot de passe actuel</Label>
                  <Input id="current_password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new_password">Nouveau mot de passe</Label>
                  <Input id="new_password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Confirmez le mot de passe</Label>
                  <Input id="confirm_password" type="password" />
                </div>
                <Button>Changer le mot de passe</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thème</CardTitle>
                <CardDescription>
                  Personnalisez l'apparence de l'application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="theme">Thème</Label>
                  <ModeToggle />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de notification</CardTitle>
                <CardDescription>
                  Configurez comment et quand vous souhaitez être notifié
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Emails</p>
                    <p className="text-sm text-muted-foreground">
                      Recevez des notifications par email
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Analyse d'émotions</p>
                    <p className="text-sm text-muted-foreground">
                      Notifications pour les résultats d'analyse
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Recommandations</p>
                    <p className="text-sm text-muted-foreground">
                      Recevez des suggestions personnalisées
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <Button>Sauvegarder</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
};

export default SettingsPage;
