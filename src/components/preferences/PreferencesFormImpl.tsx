
import React, { useState, useEffect } from 'react';
import { UserPreferences } from '@/types/preferences';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NotificationsPreferencesComponent from './NotificationsPreferences';
import DisplayPreferences from './DisplayPreferences';
import PrivacyPreferencesComponent from './PrivacyPreferences';
import { Loader2 } from 'lucide-react';

interface PreferencesFormProps {
  preferences: UserPreferences;
  onSave: (values: Partial<UserPreferences>) => Promise<void>;
  isLoading?: boolean;
}

const PreferencesFormImpl: React.FC<PreferencesFormProps> = ({ 
  preferences,
  onSave,
  isLoading = false
}) => {
  const [currentPrefs, setCurrentPrefs] = useState<UserPreferences>({ ...preferences });
  const [activeTab, setActiveTab] = useState('display');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setCurrentPrefs(preferences);
  }, [preferences]);

  const handleUpdatePreferences = (values: Partial<UserPreferences>) => {
    setCurrentPrefs(prev => ({ ...prev, ...values }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (hasChanges) {
      await onSave(currentPrefs);
      setHasChanges(false);
    }
  };

  const handleReset = () => {
    setCurrentPrefs(preferences);
    setHasChanges(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Préférences utilisateur</CardTitle>
      </CardHeader>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="display">Affichage</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
        </TabsList>
        <CardContent>
          <TabsContent value="display">
            <DisplayPreferences 
              theme={currentPrefs.theme || 'system'} 
              fontSize={currentPrefs.fontSize || 'medium'}
              language={currentPrefs.language || 'fr'}
              reduceMotion={currentPrefs.reduceMotion || false}
              colorBlindMode={currentPrefs.colorBlindMode || ''}
              onUpdate={handleUpdatePreferences}
            />
          </TabsContent>
          <TabsContent value="notifications">
            <NotificationsPreferencesComponent 
              notifications={currentPrefs.notifications || {
                enabled: false,
                emailEnabled: false,
                pushEnabled: false
              }}
              onUpdate={handleUpdatePreferences}
            />
          </TabsContent>
          <TabsContent value="privacy">
            <PrivacyPreferencesComponent 
              privacy={currentPrefs.privacy}
              onUpdate={handleUpdatePreferences}
            />
          </TabsContent>
        </CardContent>
      </Tabs>
      <CardFooter className="flex justify-end gap-3">
        <Button 
          variant="outline" 
          onClick={handleReset}
          disabled={!hasChanges || isLoading}
        >
          Annuler
        </Button>
        <Button 
          onClick={handleSave}
          disabled={!hasChanges || isLoading}
          className="relative"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enregistrer
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PreferencesFormImpl;
