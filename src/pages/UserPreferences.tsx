
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UserPreferences as UserPreferencesType } from '@/types/preferences';
import { usePreferences } from '@/hooks/usePreferences';

const UserPreferences: React.FC = () => {
  const { preferences, updatePreferences, isLoading: isPreferencesLoading } = usePreferences();
  const { toast } = useToast();

  const [userPreferences, setUserPreferences] = useState<UserPreferencesType>({
    theme: 'system',
    fontSize: 'medium',
    fontFamily: 'inter',
    language: 'fr',
    notifications: false,
    soundEnabled: true,
    privacyLevel: 'private',
    onboardingCompleted: false,
    dashboardLayout: 'standard'
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (preferences) {
      setUserPreferences({
        ...userPreferences,
        ...preferences,
      });
    }
  }, [preferences]);

  const handlePreferenceChange = useCallback(
    (key: keyof UserPreferencesType, value: string | boolean) => {
      setUserPreferences((prevPreferences) => ({
        ...prevPreferences,
        [key]: value,
      }));
    },
    []
  );

  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      await updatePreferences(userPreferences);
      toast({
        title: 'Préférences sauvegardées',
        description: 'Vos préférences ont été mises à jour avec succès.',
      });
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error?.message || 'Une erreur est survenue lors de la sauvegarde des préférences.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isPreferencesLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Préférences utilisateur</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="theme">Thème</Label>
              <Select 
                value={userPreferences.theme as string} 
                onValueChange={(value) => handlePreferenceChange('theme', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un thème" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Clair</SelectItem>
                  <SelectItem value="dark">Sombre</SelectItem>
                  <SelectItem value="system">Système</SelectItem>
                  <SelectItem value="pastel">Pastel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="fontSize">Taille de la police</Label>
              <Select 
                value={userPreferences.fontSize as string} 
                onValueChange={(value) => handlePreferenceChange('fontSize', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner une taille" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Petite</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="large">Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Langue</Label>
            <Input
              id="language"
              type="text"
              value={userPreferences.language || ''}
              onChange={(e) => handlePreferenceChange('language', e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between rounded-md border p-3 shadow-sm">
            <Label htmlFor="notifications">Notifications</Label>
            <Switch
              id="notifications"
              checked={Boolean(userPreferences.notifications)}
              onCheckedChange={(checked) => handlePreferenceChange('notifications', checked)}
            />
          </div>

          <Button onClick={handleSavePreferences} disabled={isSaving}>
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder les préférences'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPreferences;
