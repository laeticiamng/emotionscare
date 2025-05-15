import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { Shield, Lock, Download } from 'lucide-react';

const DataPrivacySettings = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const [isSaving, setIsSaving] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'json' | 'csv'>('pdf');
  
  const handlePrivacyChange = (key: string, value: boolean) => {
    if (!preferences.privacy || typeof preferences.privacy === 'string') {
      // Initialize privacy object if it doesn't exist or is a string
      updatePreferences({
        privacy: {
          [key]: value,
          profileVisibility: 'private'
        }
      });
    } else {
      // Update existing privacy object
      updatePreferences({
        privacy: {
          ...preferences.privacy,
          [key]: value
        }
      });
    }
  };
  
  const handleProfileVisibilityChange = (visibility: 'public' | 'team' | 'private') => {
    if (!preferences.privacy || typeof preferences.privacy === 'string') {
      // Initialize privacy object if it doesn't exist or is a string
      updatePreferences({
        privacy: {
          profileVisibility: visibility
        }
      });
    } else {
      // Update existing privacy object
      updatePreferences({
        privacy: {
          ...preferences.privacy,
          profileVisibility: visibility
        }
      });
    }
  };
  
  // Handle incognito mode toggle
  const handleIncognitoModeToggle = () => {
    const currentValue = preferences.incognitoMode || false;
    updatePreferences({ 
      incognitoMode: !currentValue 
    });
  };
  
  // Handle journal locking toggle
  const handleJournalLockingToggle = () => {
    const currentValue = preferences.lockJournals || false;
    updatePreferences({ 
      lockJournals: !currentValue 
    });
  };
  
  const getPrivacyValue = (key: string): boolean => {
    if (!preferences.privacy || typeof preferences.privacy === 'string') {
      return false;
    }
    return preferences.privacy[key] || false;
  };
  
  const getProfileVisibility = (): 'public' | 'team' | 'private' => {
    if (!preferences.privacy || typeof preferences.privacy === 'string') {
      return 'private';
    }
    return preferences.privacy.profileVisibility || 'private';
  };
  
  // Get export format
  const getExportFormat = (): 'pdf' | 'json' | 'csv' => {
    return preferences.dataExport || 'pdf';
  };
  
  // Handle export format change
  const handleExportFormatChange = (format: 'pdf' | 'json' | 'csv') => {
    updatePreferences({
      dataExport: format
    });
  };
  
  const handleExportData = () => {
    // Implement export data logic here
  };

  // Handle anonymous mode toggle
  const handleAnonymousMode = (enabled: boolean) => {
    // Implement anonymous mode logic here
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Confidentialité et protection des données
        </CardTitle>
        <CardDescription>
          Gérez comment vos données sont utilisées et qui peut voir vos informations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Confidentialité du profil</h3>
          
          <RadioGroup 
            value={getProfileVisibility()} 
            onValueChange={(value: 'public' | 'team' | 'private') => handleProfileVisibilityChange(value)}
          >
            <div className="flex items-start space-x-2 mb-3">
              <RadioGroupItem value="public" id="public" className="mt-1" />
              <div>
                <Label htmlFor="public" className="font-medium">Public</Label>
                <p className="text-sm text-muted-foreground">
                  Votre profil et vos données émotionnelles sont visibles par tous les membres
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2 mb-3">
              <RadioGroupItem value="team" id="team" className="mt-1" />
              <div>
                <Label htmlFor="team" className="font-medium">Équipe uniquement</Label>
                <p className="text-sm text-muted-foreground">
                  Vos données ne sont visibles que par les membres de votre équipe
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="private" id="private" className="mt-1" />
              <div>
                <Label htmlFor="private" className="font-medium">Privé</Label>
                <p className="text-sm text-muted-foreground">
                  Vos données ne sont visibles que par vous et les administrateurs
                </p>
              </div>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Options de confidentialité</h3>
          
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Mode incognito</Label>
              <p className="text-sm text-muted-foreground">
                Masquez temporairement votre présence et votre activité
              </p>
            </div>
            <Switch
              checked={preferences.incognitoMode || false}
              onCheckedChange={handleIncognitoModeToggle}
            />
          </div>
          
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Verrouillage des journaux</Label>
              <p className="text-sm text-muted-foreground">
                Exige une authentification supplémentaire pour accéder à vos journaux
              </p>
            </div>
            <Switch
              checked={preferences.lockJournals || false}
              onCheckedChange={handleJournalLockingToggle}
            />
          </div>
          
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Partage de données anonymisées</Label>
              <p className="text-sm text-muted-foreground">
                Contribuer à l'amélioration des services avec des données anonymisées
              </p>
            </div>
            <Switch
              checked={getPrivacyValue('anonymousDataContribution')}
              onCheckedChange={(checked) => handlePrivacyChange('anonymousDataContribution', checked)}
            />
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Exportation de données</h3>
          <p className="text-sm text-muted-foreground">
            Choisissez le format par défaut pour l'exportation de vos données
          </p>
          
          <Select 
            value={getExportFormat()}
            onValueChange={(value) => handleExportFormatChange(value as 'pdf' | 'json' | 'csv')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Format d'exportation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="w-full mt-2">
            <Download className="mr-2 h-4 w-4" />
            Exporter mes données
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataPrivacySettings;
