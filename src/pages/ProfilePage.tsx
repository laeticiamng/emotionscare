
import React, { useState } from 'react';
import Shell from '@/Shell';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Save, User, Settings, Bell, Shield } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // États du formulaire
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || 'Utilisateur',
    lastName: user?.lastName || '',
    email: user?.email || 'utilisateur@example.com',
    phone: '',
    bio: '',
  });
  
  // Gérer les changements de champs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Simuler la sauvegarde des modifications
  const handleSaveProfile = () => {
    setIsLoading(true);
    
    // Simuler une requête API
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Profil mis à jour avec succès');
    }, 1000);
  };
  
  return (
    <Shell>
      <div className="container py-10 max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mon profil</h1>
            <p className="text-muted-foreground">
              Gérez vos informations personnelles et préférences
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Carte de profil */}
          <Card className="md:col-span-1">
            <CardHeader>
              <div className="flex justify-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/avatar.png" alt="Avatar" />
                  <AvatarFallback>
                    <User className="h-12 w-12 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-center mt-4">{profileData.firstName} {profileData.lastName}</CardTitle>
              <CardDescription className="text-center">{profileData.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Membre depuis</span>
                  <span>Juin 2023</span>
                </div>
                <div className="flex justify-between">
                  <span>Dernière connexion</span>
                  <span>Aujourd'hui</span>
                </div>
                <div className="flex justify-between">
                  <span>Type de compte</span>
                  <span className="font-medium text-primary">Premium</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Formulaires */}
          <div className="md:col-span-2">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="general" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Général</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Sécurité</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="general">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations générales</CardTitle>
                    <CardDescription>
                      Mettez à jour vos informations personnelles
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nom</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        placeholder="(Optionnel)"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Input
                        id="bio"
                        name="bio"
                        value={profileData.bio}
                        onChange={handleInputChange}
                        placeholder="Parlez-nous de vous..."
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={handleSaveProfile} 
                      disabled={isLoading}
                      className="ml-auto"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 mr-2 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
                          Sauvegarde...
                        </div>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Enregistrer
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Préférences de notifications</CardTitle>
                    <CardDescription>
                      Configurez comment vous souhaitez être notifié
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Notifications par email</h4>
                          <p className="text-sm text-muted-foreground">
                            Recevez des mises à jour sur votre activité
                          </p>
                        </div>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm">Désactiver</Button>
                          <Button size="sm" variant="default">Activer</Button>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Rappels quotidiens</h4>
                          <p className="text-sm text-muted-foreground">
                            Recevez des rappels pour vos activités quotidiennes
                          </p>
                        </div>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm">Désactiver</Button>
                          <Button size="sm">Activer</Button>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Notifications de nouveaux contenus</h4>
                          <p className="text-sm text-muted-foreground">
                            Soyez informé lorsque de nouveaux contenus sont disponibles
                          </p>
                        </div>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm">Désactiver</Button>
                          <Button size="sm">Activer</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Paramètres de sécurité</CardTitle>
                    <CardDescription>
                      Gérez les paramètres de sécurité de votre compte
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Mot de passe actuel</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nouveau mot de passe</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="ml-auto">Mettre à jour le mot de passe</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default ProfilePage;
