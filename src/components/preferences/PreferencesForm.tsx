
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { UserPreferences } from '@/types';
import ThemeSelectionField from './ThemeSelectionField';
import FontSizeField from './FontSizeField';
import ColorAccentField from './ColorAccentField';
import { updateUser } from '@/lib/userService';

const PreferencesForm: React.FC = () => {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize with default preferences if user doesn't have them
  const defaultPreferences: UserPreferences = {
    theme: "light",
    fontSize: "medium",
    backgroundColor: "default",
    accentColor: "#FF6F61",
    notifications: {
      email: true,
      push: true,
      sms: false
    }
  };
  
  // Use user's existing preferences or defaults
  const [preferences, setPreferences] = useState<UserPreferences>(
    user?.preferences || defaultPreferences
  );

  // Update preferences when user changes
  useEffect(() => {
    if (user?.preferences) {
      setPreferences(user.preferences);
    }
  }, [user?.preferences]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour modifier vos préférences",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Update user with new preferences
      const updatedUser = await updateUser({
        ...user,
        preferences: preferences
      });
      
      setUser(updatedUser);
      
      toast({
        title: "Préférences mises à jour",
        description: "Vos préférences ont été enregistrées avec succès"
      });
    } catch (error) {
      console.error("Failed to update preferences:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour vos préférences",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Préférences d'affichage</CardTitle>
          <CardDescription>
            Personnalisez votre expérience sur EmotionsCare
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ThemeSelectionField 
            value={preferences.theme} 
            onChange={(theme) => setPreferences({...preferences, theme})} 
          />
          
          <FontSizeField 
            value={preferences.fontSize}
            onChange={(fontSize) => setPreferences({...preferences, fontSize})}
          />
          
          <ColorAccentField 
            value={preferences.accentColor}
            onChange={(accentColor) => setPreferences({...preferences, accentColor})}
          />
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : "Enregistrer les préférences"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default PreferencesForm;
