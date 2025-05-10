
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPreferences } from '@/types';
import PreferencesForm from './PreferencesForm';
import { useToast } from '@/hooks/use-toast';

const UserPreferencesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    theme: 'light',
    fontSize: 'medium',
    language: 'fr',
    notifications: true,
    autoplayVideos: false,
    showEmotionPrompts: true,
    privacyLevel: 'standard',
    dataCollection: true,
    notifications_enabled: true,
  });

  useEffect(() => {
    if (user && user.preferences) {
      setUserPreferences({
        ...userPreferences,
        ...user.preferences
      });
    }
  }, [user]);

  const handleSavePreferences = async (preferences: UserPreferences) => {
    if (user && updateUser) {
      try {
        // Make sure we create a new user object instead of modifying the existing one
        await updateUser({
          ...user,
          preferences: {
            ...preferences,
            // Assurer la compatibilité entre les deux formats
            notifications_enabled: preferences.notifications,
          }
        });
        setUserPreferences(preferences);
        toast({
          title: "Préférences mises à jour",
          description: "Vos préférences ont été enregistrées avec succès.",
        });
        navigate('/dashboard');
      } catch (error) {
        console.error("Erreur lors de la mise à jour des préférences:", error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la sauvegarde des préférences.",
          variant: "destructive"
        });
      }
    } else {
      console.error("User ou updateUser non disponibles");
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour modifier vos préférences.",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Préférences Utilisateur</CardTitle>
        </CardHeader>
        <CardContent>
          <PreferencesForm 
            preferences={userPreferences} 
            onSave={handleSavePreferences} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPreferencesPage;
