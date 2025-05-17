
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types/types';
import { UserPreferences } from '@/types/preferences';
import DisplayPreferences from './DisplayPreferences';
import NotificationPreferences from './NotificationPreferences';
import PrivacyPreferences from './PrivacyPreferences';
import { useAuth } from '@/contexts/AuthContext';

// Define allowed font size values in TypeScript
export type FontSize = 'small' | 'medium' | 'large' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface PreferencesFormProps {
  user: User;
  onPreferencesSave?: (preferences: UserPreferences) => void;
  className?: string;
}

const PreferencesForm: React.FC<PreferencesFormProps> = ({
  user,
  onPreferencesSave,
  className = ''
}) => {
  const { toast } = useToast();
  const auth = useAuth();
  const [activeTab, setActiveTab] = useState('display');
  
  const defaultPreferences: UserPreferences = {
    theme: 'system',
    fontSize: 'medium',
    fontFamily: 'system',
    reduceMotion: false,
    colorBlindMode: false,
    autoplayMedia: true,
    soundEnabled: true,
    notifications: {
      enabled: true,
      emailEnabled: true,
      pushEnabled: true,
      inAppEnabled: true,
      types: {
        system: true,
        emotion: true,
        coach: true,
        journal: true,
        community: true,
        achievement: true,
      },
      frequency: 'immediate',
    },
    privacy: {
      shareData: true,
      anonymizeReports: false,
      profileVisibility: 'public',
    }
  };
  
  const [preferences, setPreferences] = useState<UserPreferences>(
    user.preferences || defaultPreferences
  );

  const handlePreferencesChange = (newPartialPreferences: Partial<UserPreferences>) => {
    setPreferences(prev => ({
      ...prev,
      ...newPartialPreferences,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Call the save function if provided
      if (onPreferencesSave) {
        onPreferencesSave(preferences);
      } 
      // Or use the context update function if available
      else if (auth.updateUser) {
        await auth.updateUser({
          ...user,
          preferences,
          role: user.role || 'b2c', // Ensure role is always defined
        });
      }

      toast({
        title: 'Préférences mises à jour',
        description: 'Vos préférences ont été enregistrées avec succès.',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour vos préférences.',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Préférences utilisateur</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="display">Affichage</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
            </TabsList>
            <TabsContent value="display">
              <DisplayPreferences
                preferences={preferences}
                onChange={handlePreferencesChange}
              />
            </TabsContent>
            <TabsContent value="notifications">
              <NotificationPreferences
                preferences={preferences}
                onChange={handlePreferencesChange}
              />
            </TabsContent>
            <TabsContent value="privacy">
              <PrivacyPreferences
                preferences={preferences}
                onChange={handlePreferencesChange}
              />
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" type="button">
              Annuler
            </Button>
            <Button type="submit">
              Enregistrer les préférences
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default PreferencesForm;
