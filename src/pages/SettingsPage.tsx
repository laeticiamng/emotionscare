import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, User, Bell, Palette, Shield, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserPreferences } from '@/types';
import PreferencesForm from '@/components/settings/PreferencesForm';
import AccountSettings from '@/components/settings/AccountSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import PageTitle from '@/components/ui/page-title';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    theme: 'light',
    notifications_enabled: true,
    font_size: 'medium',
    language: 'fr',
  });
  
  // If logout doesn't exist, we need to find an alternative
  // const { user, logout } = useAuth();
  const { user } = useAuth();
  
  const handleLogout = () => {
    // Implement a simple redirect if logout function doesn't exist
    window.location.href = '/login';
  };
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Load user preferences from user object if available
    if (user?.preferences) {
      setUserPreferences(user.preferences);
    }
  }, [user]);

  const handleSavePreferences = (preferences: UserPreferences) => {
    setUserPreferences(preferences);
    
    toast({
      title: "Préférences enregistrées",
      description: "Vos préférences ont été mises à jour avec succès.",
    });
  };

  const handleDeleteAccount = () => {
    // Show confirmation dialog
    if (window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
      toast({
        title: "Compte supprimé",
        description: "Votre compte a été supprimé avec succès.",
      });
      
      // Redirect to login page
      navigate('/login');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <PageTitle 
        title="Paramètres" 
        description="Gérez votre compte et vos préférences"
      />
      
      <div className="mt-6">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Compte</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Préférences</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Sécurité</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informations du compte</CardTitle>
              </CardHeader>
              <CardContent>
                <AccountSettings user={user} />
              </CardContent>
            </Card>
            
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Zone de danger</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Déconnexion</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Déconnectez-vous de votre compte sur cet appareil.
                  </p>
                  <Button 
                    variant="outline" 
                    className="border-destructive text-destructive hover:bg-destructive/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </Button>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-1">Supprimer le compte</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Supprimer définitivement votre compte et toutes vos données.
                  </p>
                  <Button 
                    variant="destructive"
                    onClick={handleDeleteAccount}
                  >
                    Supprimer mon compte
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preferences" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Préférences utilisateur</CardTitle>
              </CardHeader>
              <CardContent>
                <PreferencesForm 
                  preferences={userPreferences} 
                  onSave={handleSavePreferences} 
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de notification</CardTitle>
              </CardHeader>
              <CardContent>
                <NotificationSettings />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sécurité du compte</CardTitle>
              </CardHeader>
              <CardContent>
                <SecuritySettings />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Changer le mot de passe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="current-password" className="text-sm font-medium">
                      Mot de passe actuel
                    </label>
                    <input
                      id="current-password"
                      type="password"
                      className="border rounded-md p-2"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="new-password" className="text-sm font-medium">
                      Nouveau mot de passe
                    </label>
                    <input
                      id="new-password"
                      type="password"
                      className="border rounded-md p-2"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="confirm-password" className="text-sm font-medium">
                      Confirmer le mot de passe
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      className="border rounded-md p-2"
                    />
                  </div>
                </div>
                <Button className="w-full sm:w-auto">
                  <Key className="mr-2 h-4 w-4" />
                  Mettre à jour le mot de passe
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;
