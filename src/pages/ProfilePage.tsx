
import React from 'react';
import Shell from '@/Shell';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { getUserInitials } from '@/utils/userHelpers';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <Shell>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Profil</h1>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="general">Informations générales</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="preferences">Préférences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>Mettez à jour vos informations de profil</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="text-xl">{getUserInitials(user)}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">Changer d'avatar</Button>
                  </div>
                  
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet</Label>
                      <Input id="name" defaultValue={user?.name || ''} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={user?.email || ''} readOnly />
                      <p className="text-xs text-muted-foreground">L'email ne peut pas être modifié</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input id="phone" defaultValue={user?.phone || ''} />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Enregistrer les modifications</Button>
                </CardFooter>
              </Card>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Vos badges</CardTitle>
                    <CardDescription>Les badges que vous avez obtenus</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      <Badge variant="outline" className="px-3 py-1">🌟 Premier pas</Badge>
                      <Badge variant="outline" className="px-3 py-1">🎵 Mélomane</Badge>
                      <Badge variant="outline" className="px-3 py-1">📝 Journaliste</Badge>
                      <Badge variant="outline" className="px-3 py-1">🧘 Zen master</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Informations du compte</CardTitle>
                    <CardDescription>Détails sur votre compte</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-4">
                      <div className="flex flex-col">
                        <dt className="text-sm font-medium text-muted-foreground">Type de compte</dt>
                        <dd>Compte {user?.role === 'b2b_admin' ? 'Administrateur' : user?.role === 'b2b_user' ? 'Collaborateur' : 'Personnel'}</dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="text-sm font-medium text-muted-foreground">Date d'inscription</dt>
                        <dd>15 janvier 2023</dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="text-sm font-medium text-muted-foreground">Dernière connexion</dt>
                        <dd>Aujourd'hui à 14:32</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Sécurité</CardTitle>
                <CardDescription>Gérez vos paramètres de sécurité</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Changer de mot de passe</h3>
                  <div className="space-y-4">
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
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Mettre à jour le mot de passe</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Préférences</CardTitle>
                <CardDescription>Gérez vos préférences personnelles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Notifications</h3>
                  {/* Notification preferences would go here */}
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Langue et région</h3>
                  {/* Language and region settings would go here */}
                </div>
              </CardContent>
              <CardFooter>
                <Button>Enregistrer les préférences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
};

export default ProfilePage;
