
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { UserPreferences, NotificationPreference } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemeSettingsForm from '@/components/preferences/ThemeSettingsForm';
import NotificationPreferencesComponent from '@/components/preferences/NotificationPreferences';
import DataPrivacySettings from '@/components/preferences/DataPrivacySettings';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader } from 'lucide-react';

type PreferencesFormProps = {
  defaultActiveTab?: string;
  onSave?: (preferences: UserPreferences) => void;
  onCancel?: () => void;
}

const PreferencesForm: React.FC<PreferencesFormProps> = ({ defaultActiveTab = "theme", onSave, onCancel }) => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Préférences initiales (utilisées si l'utilisateur n'a pas de préférences définies)
  const initialPreferences: UserPreferences = {
    theme: 'system', 
    fontSize: 'medium',
    fontFamily: 'system',
    reduceMotion: false,
    colorBlindMode: false,
    autoplayMedia: true,
    notifications: {
      enabled: true,
      emailEnabled: true,
      pushEnabled: false,
      inAppEnabled: true,
      types: {
        system: true,
        emotion: true,
        coach: true,
        journal: true,
        community: true,
        achievement: true
      },
      frequency: 'daily'
    },
    privacy: {
      shareData: false,
      anonymizeReports: true,
      profileVisibility: 'team'
    }
  };

  // Utilisation des préférences utilisateur ou des valeurs par défaut
  const userPreferences = user?.preferences || initialPreferences;

  // État local pour les modifications en cours
  const [formPreferences, setFormPreferences] = useState<UserPreferences>(userPreferences);

  // Fonction pour mettre à jour une propriété spécifique
  const updatePreference = (key: keyof UserPreferences, value: any) => {
    setFormPreferences(prev => ({ ...prev, [key]: value }));
  };

  // Fonction pour mettre à jour les notifications
  const updateNotifications = (notificationData: Partial<NotificationPreference>) => {
    const currentNotifications = 
      typeof formPreferences.notifications === 'boolean' 
        ? { enabled: formPreferences.notifications, emailEnabled: false }
        : formPreferences.notifications || { enabled: true, emailEnabled: false };

    setFormPreferences(prev => ({
      ...prev,
      notifications: {
        ...currentNotifications,
        ...notificationData
      }
    }));
  };

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (user) {
        // Ensure dashboardLayout is properly typed
        const updatedPreferences = {
          ...formPreferences,
          dashboardLayout: formPreferences.dashboardLayout as string
        };
        
        const updatedUser = await updateUser({
          ...user,
          preferences: updatedPreferences
        });
        toast({
          title: "Préférences mises à jour",
          description: "Vos préférences ont été enregistrées avec succès.",
          variant: "success",
        });
        
        if (onSave) {
          onSave(updatedPreferences);
        }
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les préférences.",
        variant: "destructive",
      });
      console.error("Erreur lors de la mise à jour des préférences:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue={defaultActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-5 w-full">
          <TabsTrigger value="theme">Thème</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
          <TabsTrigger value="accessibility" className="hidden md:flex">Accessibilité</TabsTrigger>
          <TabsTrigger value="account" className="hidden md:flex">Compte</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="theme">
            <ThemeSettingsForm />
          </TabsContent>
          
          <TabsContent value="notifications">
            <NotificationPreferencesComponent />
          </TabsContent>
          
          <TabsContent value="privacy">
            <DataPrivacySettings />
          </TabsContent>
          
          <TabsContent value="accessibility">
            <Card>
              <CardHeader>
                <CardTitle>Accessibilité</CardTitle>
                <CardDescription>
                  Personnalisez l'application pour améliorer votre expérience d'utilisation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">
                  Les paramètres d'accessibilité seront disponibles prochainement.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres du compte</CardTitle>
                <CardDescription>
                  Gérez les paramètres de votre compte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">
                  Les paramètres de compte seront disponibles prochainement.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
      
      <Separator />
      
      <div className="flex justify-end gap-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
          Enregistrer les préférences
        </Button>
      </div>
    </form>
  );
};

export default PreferencesForm;
