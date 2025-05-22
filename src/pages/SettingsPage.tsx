
import React from 'react';
import Shell from '@/Shell';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { useToast } from '@/hooks/use-toast';

const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { userMode } = useUserMode();
  const { toast } = useToast();
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    
    try {
      if (updateUser) {
        await updateUser({ name });
        toast({
          title: "Profil mis à jour",
          description: "Vos informations ont été mises à jour avec succès",
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de votre profil",
        variant: "destructive"
      });
    }
  };
  
  const handleUpdatePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const notifications_enabled = formData.get('notifications_enabled') === 'on';
    const email_notifications = formData.get('email_notifications') === 'on';
    
    try {
      if (updateUser) {
        await updateUser({
          preferences: {
            ...user?.preferences,
            notifications_enabled,
            email_notifications
          }
        });
        toast({
          title: "Préférences mises à jour",
          description: "Vos préférences ont été mises à jour avec succès",
        });
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de vos préférences",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Shell>
      <div className="container mx-auto py-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-4">Paramètres</h1>
          <p className="text-muted-foreground mb-6">
            Gérez votre compte et vos préférences
          </p>
          
          <Tabs defaultValue="profile">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="preferences">Préférences</TabsTrigger>
              <TabsTrigger value="account">Compte</TabsTrigger>
              {userMode === 'b2b_admin' && (
                <TabsTrigger value="admin">Administration</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <form onSubmit={handleUpdateProfile}>
                  <CardHeader>
                    <CardTitle>Informations personnelles</CardTitle>
                    <CardDescription>
                      Mettez à jour vos informations personnelles
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom</Label>
                      <Input 
                        id="name" 
                        name="name"
                        defaultValue={user?.name || ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        value={user?.email || ''}
                        disabled
                      />
                      <p className="text-sm text-muted-foreground">
                        L'adresse email ne peut pas être modifiée
                      </p>
                    </div>
                    {userMode?.includes('b2b') && (
                      <div className="space-y-2">
                        <Label htmlFor="title">Titre / Fonction</Label>
                        <Input 
                          id="title" 
                          name="title"
                          defaultValue={user?.job_title || ''}
                        />
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">Enregistrer les modifications</Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences">
              <Card>
                <form onSubmit={handleUpdatePreferences}>
                  <CardHeader>
                    <CardTitle>Préférences</CardTitle>
                    <CardDescription>
                      Personnalisez votre expérience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Notifications</h3>
                        <p className="text-sm text-muted-foreground">
                          Activer les notifications dans l'application
                        </p>
                      </div>
                      <Switch 
                        id="notifications_enabled" 
                        name="notifications_enabled"
                        defaultChecked={user?.preferences?.notifications_enabled}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Notifications par email</h3>
                        <p className="text-sm text-muted-foreground">
                          Recevoir des notifications par email
                        </p>
                      </div>
                      <Switch 
                        id="email_notifications" 
                        name="email_notifications"
                        defaultChecked={user?.preferences?.email_notifications}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">Enregistrer les préférences</Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Compte</CardTitle>
                  <CardDescription>
                    Gérer les paramètres de votre compte
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium">Type de compte</h3>
                    <p className="text-sm text-muted-foreground">
                      {userMode === 'b2c' && "Compte personnel"}
                      {userMode === 'b2b_user' && "Compte collaborateur"}
                      {userMode === 'b2b_admin' && "Compte administrateur"}
                    </p>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="font-medium text-destructive">Zone de danger</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Ces actions sont irréversibles
                    </p>
                    
                    <Button variant="destructive">
                      Supprimer mon compte
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {userMode === 'b2b_admin' && (
              <TabsContent value="admin">
                <Card>
                  <CardHeader>
                    <CardTitle>Administration</CardTitle>
                    <CardDescription>
                      Gérer les paramètres d'administration
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium">Invitations</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Gérer les invitations des collaborateurs
                      </p>
                      <Button variant="outline" onClick={() => window.location.href = "/b2b/admin/invitations"}>
                        Gérer les invitations
                      </Button>
                    </div>
                    
                    <div className="pt-4">
                      <h3 className="font-medium">Rapports</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Accéder aux rapports d'utilisation et analytiques
                      </p>
                      <Button variant="outline" onClick={() => window.location.href = "/b2b/admin/reports"}>
                        Voir les rapports
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </motion.div>
      </div>
    </Shell>
  );
};

export default SettingsPage;
