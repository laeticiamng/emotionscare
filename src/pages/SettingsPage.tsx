
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Lock, User, Palette, Globe, Volume2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import UnifiedLayout from '@/components/unified/UnifiedLayout';

const SettingsPage: React.FC = () => {
  return (
    <UnifiedLayout>
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Paramètres</h1>
        
        <Tabs defaultValue="profile" className="w-full mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Profil</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>Compte</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span>Apparence</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>
                  Mettez à jour vos informations personnelles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/2 space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input id="name" placeholder="Votre nom" defaultValue="Jean Dupont" />
                  </div>
                  <div className="w-full md:w-1/2 space-y-2">
                    <Label htmlFor="email">Adresse e-mail</Label>
                    <Input id="email" type="email" placeholder="votre@email.com" defaultValue="jean.dupont@exemple.com" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="job">Poste / Titre</Label>
                  <Input id="job" placeholder="Votre poste" defaultValue="Responsable Marketing" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Département</Label>
                  <Select defaultValue="marketing">
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Sélectionner un département" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="rh">Ressources Humaines</SelectItem>
                      <SelectItem value="tech">Technologie</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="operations">Opérations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div>
                  <Button>Enregistrer les modifications</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Sécurité du compte</CardTitle>
                <CardDescription>
                  Gérez vos paramètres de sécurité et mot de passe
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Mot de passe actuel</Label>
                  <Input id="current-password" type="password" placeholder="••••••••" />
                </div>
                
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/2 space-y-2">
                    <Label htmlFor="new-password">Nouveau mot de passe</Label>
                    <Input id="new-password" type="password" placeholder="••••••••" />
                  </div>
                  <div className="w-full md:w-1/2 space-y-2">
                    <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                    <Input id="confirm-password" type="password" placeholder="••••••••" />
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <Button>Mettre à jour le mot de passe</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Authentification à deux facteurs</CardTitle>
                <CardDescription>
                  Renforcez la sécurité de votre compte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Authentification par SMS</p>
                    <p className="text-sm text-muted-foreground">Recevez un code par SMS pour vous connecter</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Application d'authentification</p>
                    <p className="text-sm text-muted-foreground">Utilisez une application comme Google Authenticator</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de notifications</CardTitle>
                <CardDescription>
                  Gérez comment vous souhaitez être notifié
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Rappels quotidiens</p>
                    <p className="text-sm text-muted-foreground">Recevez un rappel pour votre journal émotionnel</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Recommandations</p>
                    <p className="text-sm text-muted-foreground">Recevez des suggestions personnalisées</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Activité du coach</p>
                    <p className="text-sm text-muted-foreground">Notifications sur vos conversations avec le coach</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Activité sociale</p>
                    <p className="text-sm text-muted-foreground">Notifications de la communauté</p>
                  </div>
                  <Switch />
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <Label>Canaux de notification</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="email-notif" />
                      <Label htmlFor="email-notif">Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="push-notif" defaultChecked />
                      <Label htmlFor="push-notif">Navigateur</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="mobile-notif" defaultChecked />
                      <Label htmlFor="mobile-notif">Mobile</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Personnalisation de l'interface</CardTitle>
                <CardDescription>
                  Ajustez l'apparence de l'application à vos préférences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Thème</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <Button variant="outline" className="flex flex-col items-center justify-center h-24 hover:border-primary">
                      <Sun className="h-6 w-6 mb-2" />
                      <span>Clair</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col items-center justify-center h-24 hover:border-primary">
                      <Moon className="h-6 w-6 mb-2" />
                      <span>Sombre</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col items-center justify-center h-24 hover:border-primary border-primary">
                      <Laptop className="h-6 w-6 mb-2" />
                      <span>Système</span>
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <Label>Langue</Label>
                    </div>
                    <Select defaultValue="fr">
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Sélectionner une langue" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      <Label>Sons de l'application</Label>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <Button>Enregistrer les préférences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </UnifiedLayout>
  );
};

const Checkbox = ({ id, defaultChecked }: { id: string, defaultChecked?: boolean }) => (
  <input type="checkbox" id={id} defaultChecked={defaultChecked} className="w-4 h-4 rounded border-gray-300 focus:ring-primary" />
);

const Sun = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
  </svg>
);

const Moon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
  </svg>
);

const Laptop = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
  </svg>
);

export default SettingsPage;
