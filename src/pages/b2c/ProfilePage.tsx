
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { notificationService } from '@/services/notification-service';

const ProfilePage: React.FC = () => {
  const { user, updateUser, updatePreferences } = useAuth();
  const { toast } = useToast();
  const [name, setName] = React.useState(user?.name || '');
  const [isUpdating, setIsUpdating] = React.useState(false);
  
  React.useEffect(() => {
    setName(user?.name || '');
  }, [user]);
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !updateUser) return;
    
    setIsUpdating(true);
    
    try {
      await updateUser({ name });
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès",
      });
      
      // Create a notification for the user
      if (user.id) {
        await notificationService.createNotification({
          user_id: user.id,
          title: "Profil mis à jour",
          message: "Vos informations de profil ont été mises à jour avec succès.",
          type: "info",
          read: false
        });
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour du profil",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleUpdateThemeMode = async (theme: string) => {
    if (!user || !updatePreferences) return;
    
    try {
      await updatePreferences({
        theme
      });
      
      toast({
        title: "Thème mis à jour",
        description: "Le thème de l'application a été changé",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour du thème",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Mon profil</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Mon compte
                <ModeToggle />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user?.avatar_url || user?.avatarUrl} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              
              <h2 className="text-xl font-semibold mb-1">{user?.name}</h2>
              <p className="text-muted-foreground mb-4">{user?.email}</p>
              
              <div className="text-sm text-center mb-6">
                <p className="text-muted-foreground">Compte créé le {new Date(user?.created_at || '').toLocaleDateString()}</p>
              </div>
              
              <Button variant="outline" className="w-full" disabled>
                Changer d'avatar
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="general">
            <TabsList className="mb-4">
              <TabsTrigger value="general">Général</TabsTrigger>
              <TabsTrigger value="preferences">Préférences</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>Informations générales</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Votre nom complet"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={user?.email}
                        disabled
                        placeholder="Votre email"
                      />
                    </div>
                    
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? 'Mise à jour...' : 'Enregistrer les modifications'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Préférences d'affichage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Thème</h3>
                      <div className="flex flex-wrap gap-3">
                        <Button 
                          variant={user?.preferences?.theme === 'light' ? 'default' : 'outline'} 
                          onClick={() => handleUpdateThemeMode('light')}
                        >
                          Clair
                        </Button>
                        <Button 
                          variant={user?.preferences?.theme === 'dark' ? 'default' : 'outline'}
                          onClick={() => handleUpdateThemeMode('dark')}
                        >
                          Sombre
                        </Button>
                        <Button 
                          variant={user?.preferences?.theme === 'system' ? 'default' : 'outline'}
                          onClick={() => handleUpdateThemeMode('system')}
                        >
                          Système
                        </Button>
                        <Button 
                          variant={user?.preferences?.theme === 'pastel' ? 'default' : 'outline'}
                          onClick={() => handleUpdateThemeMode('pastel')}
                        >
                          Pastel
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Préférences de notification</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Gérez vos préférences de notification pour personnaliser votre expérience.</p>
                  <p>Fonctionnalité à venir...</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle>Confidentialité</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Gérez vos paramètres de confidentialité.</p>
                  <p>Fonctionnalité à venir...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
