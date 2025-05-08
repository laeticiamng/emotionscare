
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import NotificationSettings from '@/components/settings/NotificationSettings';
import PreferencesForm from '@/components/preferences/PreferencesForm';
import { Settings, User, Bell, Palette, Shield, LogOut, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      toast({
        title: 'Déconnexion réussie',
        description: 'Vous avez été déconnecté avec succès.'
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Erreur de déconnexion',
        description: 'Une erreur est survenue lors de la déconnexion. Veuillez réessayer.',
        variant: 'destructive'
      });
    }
  };
  
  const handleSaveProfile = () => {
    setIsSaving(true);
    
    // Simuler une sauvegarde
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: 'Profil mis à jour',
        description: 'Vos informations de profil ont été mises à jour avec succès.'
      });
    }, 1000);
  };
  
  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Paramètres</h1>
          <p className="text-muted-foreground mt-1">
            Gérez votre compte et vos préférences
          </p>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar avec avatars et informations de base */}
        <div className="md:w-1/4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  {user?.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={user.name} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-primary" />
                  )}
                </div>
                <h3 className="font-medium text-lg">{user?.name || 'Utilisateur'}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                {user?.role && (
                  <Badge variant="outline" className="mt-2">
                    {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                  </Badge>
                )}
              </div>
              
              <Separator className="my-4" />
              
              {/* Nav Tabs */}
              <div className="flex flex-col space-y-1">
                <Button 
                  variant={activeTab === 'profile' ? 'secondary' : 'ghost'}
                  className="justify-start"
                  onClick={() => setActiveTab('profile')}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profil
                </Button>
                <Button 
                  variant={activeTab === 'appearance' ? 'secondary' : 'ghost'}
                  className="justify-start"
                  onClick={() => setActiveTab('appearance')}
                >
                  <Palette className="mr-2 h-4 w-4" />
                  Apparence
                </Button>
                <Button 
                  variant={activeTab === 'notifications' ? 'secondary' : 'ghost'}
                  className="justify-start"
                  onClick={() => setActiveTab('notifications')}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </Button>
                <Button 
                  variant={activeTab === 'privacy' ? 'secondary' : 'ghost'}
                  className="justify-start"
                  onClick={() => setActiveTab('privacy')}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Confidentialité
                </Button>
              </div>
              
              <Separator className="my-4" />
              
              <Button 
                variant="destructive" 
                className="w-full flex items-center"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations personnelles
                </CardTitle>
                <CardDescription>
                  Gérez vos informations de profil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nom complet</Label>
                    <Input id="fullName" defaultValue={user?.name || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Adresse e-mail</Label>
                    <Input id="email" type="email" defaultValue={user?.email || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Entreprise</Label>
                    <Input id="company" placeholder="Votre entreprise" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Poste</Label>
                    <Input id="position" placeholder="Votre poste" />
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Biographie</Label>
                  <textarea
                    id="bio"
                    className="w-full min-h-[100px] p-2 rounded-md border border-input bg-background"
                    placeholder="Parlez-nous de vous..."
                  ></textarea>
                </div>
              </CardContent>
              <CardFooter className="border-t p-4 bg-muted/20">
                <Button 
                  onClick={handleSaveProfile} 
                  disabled={isSaving}
                  className="ml-auto flex items-center"
                >
                  {isSaving ? (
                    <>Enregistrement...</>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Enregistrer les modifications
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {activeTab === 'appearance' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Apparence
                </CardTitle>
                <CardDescription>
                  Personnalisez l'apparence de l'application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PreferencesForm />
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Gérez vos préférences de notification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NotificationSettings />
              </CardContent>
              <CardFooter className="border-t p-4 bg-muted/20">
                <Button 
                  className="ml-auto flex items-center"
                >
                  Enregistrer les préférences
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {activeTab === 'privacy' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Confidentialité et sécurité
                </CardTitle>
                <CardDescription>
                  Gérez vos paramètres de confidentialité et de sécurité
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Partage des données</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Partager mes statistiques d'émotion</Label>
                      <p className="text-sm text-muted-foreground">
                        Autoriser le partage anonyme de mes données pour améliorer le service
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Mode confidentiel par défaut</Label>
                      <p className="text-sm text-muted-foreground">
                        Activer le mode confidentiel pour tous les scans émotionnels
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Sécurité du compte</h3>
                  
                  <div className="space-y-4">
                    <Label>Type d'authentification</Label>
                    <RadioGroup defaultValue="email" className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="email" id="email-auth" />
                        <Label htmlFor="email-auth">Email et mot de passe</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="2fa" id="2fa-auth" disabled />
                        <Label htmlFor="2fa-auth" className="text-muted-foreground">Double authentification (Bientôt disponible)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Button variant="outline">Modifier le mot de passe</Button>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Suppression du compte</h3>
                  <p className="text-sm text-muted-foreground">
                    La suppression de votre compte est définitive et entraînera la perte de toutes vos données.
                  </p>
                  <Button variant="destructive">Supprimer mon compte</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
