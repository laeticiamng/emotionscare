
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from '@/components/theme/ThemeProvider';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Bell, CheckCircle, Eye, EyeOff, Shield, User } from 'lucide-react';

const SettingsPage = () => {
  const { theme, setTheme, reduceMotion, setReduceMotion } = useTheme();
  const { user, updateUser } = useAuth();
  const [notificationEmail, setNotificationEmail] = useState(true);
  const [notificationApp, setNotificationApp] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSaveProfile = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Profil mis à jour avec succès");
    }, 1000);
  };

  const handleChangePassword = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Mot de passe modifié avec succès");
    }, 1000);
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as any);
    toast.success(`Thème ${newTheme} appliqué`);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Paramètres</h1>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-4 sm:grid-cols-4 max-w-md">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Apparence</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Informations personnelles
              </CardTitle>
              <CardDescription>
                Modifiez vos informations personnelles et vos préférences de compte.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input 
                    id="name" 
                    defaultValue={user?.name || 'Utilisateur'} 
                    placeholder="Votre nom"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    defaultValue={user?.email || 'utilisateur@exemple.fr'} 
                    placeholder="votre@email.com" 
                    disabled
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Biographie</Label>
                <Textarea 
                  id="bio" 
                  placeholder="Parlez un peu de vous"
                  defaultValue=""
                  rows={4}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveProfile} disabled={loading}>
                {loading ? 'Sauvegarde...' : 'Enregistrer les modifications'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Préférences de notification
              </CardTitle>
              <CardDescription>
                Configurez comment et quand vous souhaitez être notifié.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notifications par email</p>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des mises à jour par email
                  </p>
                </div>
                <Switch
                  checked={notificationEmail}
                  onCheckedChange={setNotificationEmail}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notifications dans l'application</p>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications dans l'application
                  </p>
                </div>
                <Switch
                  checked={notificationApp}
                  onCheckedChange={setNotificationApp}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Rapports hebdomadaires</p>
                  <p className="text-sm text-muted-foreground">
                    Recevoir un résumé hebdomadaire de vos activités
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Apparence</CardTitle>
              <CardDescription>
                Personnalisez l'apparence de l'application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Thème</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant={theme === 'light' ? 'default' : 'outline'} 
                    onClick={() => handleThemeChange('light')}
                    className="justify-start"
                  >
                    <Sun className="mr-2 h-4 w-4" />
                    Clair
                  </Button>
                  <Button 
                    variant={theme === 'dark' ? 'default' : 'outline'} 
                    onClick={() => handleThemeChange('dark')}
                    className="justify-start"
                  >
                    <Moon className="mr-2 h-4 w-4" />
                    Sombre
                  </Button>
                  <Button 
                    variant={theme === 'system' ? 'default' : 'outline'} 
                    onClick={() => handleThemeChange('system')}
                    className="justify-start"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Système
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Réduire les animations</p>
                  <p className="text-sm text-muted-foreground">
                    Pour les personnes sensibles au mouvement
                  </p>
                </div>
                <Switch
                  checked={reduceMotion}
                  onCheckedChange={setReduceMotion}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Sécurité
              </CardTitle>
              <CardDescription>
                Gérez la sécurité de votre compte et vos préférences de confidentialité.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Changer de mot de passe</h3>
                <div className="space-y-2">
                  <Label htmlFor="current-password">Mot de passe actuel</Label>
                  <div className="relative">
                    <Input 
                      id="current-password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nouveau mot de passe</Label>
                  <Input 
                    id="new-password" 
                    type="password" 
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    placeholder="••••••••"
                  />
                </div>
                <Button onClick={handleChangePassword} disabled={loading}>
                  {loading ? 'Modification...' : 'Changer le mot de passe'}
                </Button>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium">Confidentialité des données</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Partage de données anonymisées</p>
                    <p className="text-sm text-muted-foreground">
                      Contribuer à l'amélioration du service avec des données anonymisées
                    </p>
                  </div>
                  <Switch
                    checked={dataSharing}
                    onCheckedChange={setDataSharing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
