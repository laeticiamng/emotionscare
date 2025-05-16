import React, { useState } from 'react';
import { User } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { UserPreferences } from '@/types/preferences';

interface UserDetailViewProps {
  user: User;
  onClose?: () => void;
  onUpdate?: (user: User) => void;
}

const UserDetailView: React.FC<UserDetailViewProps> = ({ 
  user, 
  onClose, 
  onUpdate 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [localUser, setLocalUser] = useState<User>(user);
  
  // If preferences is undefined, initialize with default values
  if (!localUser.preferences) {
    localUser.preferences = {
      theme: 'system',
      fontSize: 'md',
      fontFamily: 'system',
      reduceMotion: false,
      colorBlindMode: false,
      autoplayMedia: true,
      soundEffects: true,
      haptics: true,
      dataCollection: false,
      language: 'fr',
      privacyLevel: 'balanced',
      animations: true,
      notifications: {
        email: true,
        push: true,
        sounds: true
      },
      sound: {
        volume: 0.5,
        effects: true,
        music: true
      },
      privacy: {
        shareData: false,
        profileVisibility: 'private',
        showProfile: true,
        shareActivity: true,
        allowMessages: true,
        allowNotifications: true
      }
    };
  }
  
  // Handle updating user data
  const handleUpdate = (key: string, value: any) => {
    setLocalUser(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Save changes
  const handleSave = () => {
    if (onUpdate) {
      onUpdate(localUser);
    }
  };
  
  // Format date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get enrollment status
  const getEnrollmentStatus = () => {
    if (localUser.onboarded) {
      return <Badge className="bg-green-500">Onboardé</Badge>;
    }
    return <Badge variant="outline">Non onboardé</Badge>;
  };
  
  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Détails de l'utilisateur</CardTitle>
        <Button variant="outline" onClick={onClose}>Fermer</Button>
      </CardHeader>
      
      <CardContent>
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-md">
          <div>
            <p className="text-sm text-muted-foreground">Nom</p>
            <p className="font-medium">{localUser.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{localUser.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Rôle</p>
            <Badge variant="outline">{localUser.role}</Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">ID</p>
            <p className="font-medium text-xs truncate">{localUser.id}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Date d'inscription</p>
            <p className="font-medium">{formatDate(localUser.created_at)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Statut</p>
            {getEnrollmentStatus()}
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="preferences">Préférences</TabsTrigger>
            <TabsTrigger value="activity">Activité</TabsTrigger>
            <TabsTrigger value="emotions">Émotions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informations générales</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Département</h4>
                  <p>{localUser.department || 'Non spécifié'}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Position</h4>
                  <p>{localUser.position || 'Non spécifiée'}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Dernière connexion</h4>
                  <p>{formatDate(localUser.updated_at)}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Status d'onboarding</h4>
                  <p>{localUser.onboarded ? 'Complété' : 'Non complété'}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <Button onClick={handleSave}>Sauvegarder les modifications</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preferences">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Préférences utilisateur</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Thème</h4>
                  <p>{localUser.preferences?.theme || 'Système'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Taille de police</h4>
                  <p>{localUser.preferences?.fontSize || 'Moyenne'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Langue</h4>
                  <p>{localUser.preferences?.language || 'Français'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Réduction des animations</h4>
                  <p>{localUser.preferences?.reduceMotion ? 'Activé' : 'Désactivé'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Mode daltonien</h4>
                  <p>{localUser.preferences?.colorBlindMode ? 'Activé' : 'Désactivé'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Lecture automatique des médias</h4>
                  <p>{localUser.preferences?.autoplayMedia ? 'Activé' : 'Désactivé'}</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="activity">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Historique d'activité</h3>
              <p className="text-muted-foreground">Aucune activité récente à afficher.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="emotions">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Données émotionnelles</h3>
              <p className="text-muted-foreground">Aucune donnée émotionnelle disponible pour cet utilisateur.</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserDetailView;
