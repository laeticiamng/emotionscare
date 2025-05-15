
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Shield, Download, Lock, UserX, Globe, Users } from 'lucide-react';

type DataExportFormat = 'pdf' | 'json' | 'csv';

const DataPrivacySettings = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const [dataFormat, setDataFormat] = useState<DataExportFormat>('json');
  const [exportInProgress, setExportInProgress] = useState(false);
  
  const handleExportData = () => {
    setExportInProgress(true);
    
    // Simuler l'exportation (à remplacer par une vraie exportation)
    setTimeout(() => {
      // Logique d'exportation ici
      setExportInProgress(false);
      // Notification ou téléchargement
    }, 2000);
  };
  
  const handlePrivacyChange = (key: string, value: boolean) => {
    if (!preferences.privacy || typeof preferences.privacy === 'string') {
      // Initialiser privacy si non défini ou si c'est une chaîne
      updatePreferences({
        privacy: {
          [key]: value
        }
      });
    } else {
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
      updatePreferences({
        privacy: {
          profileVisibility: visibility
        }
      });
    } else {
      updatePreferences({
        privacy: {
          ...preferences.privacy,
          profileVisibility: visibility
        }
      });
    }
  };

  // Obtenir les valeurs actuelles de confidentialité, en tenant compte des structures potentiellement différentes
  const privacy = preferences.privacy && typeof preferences.privacy === 'object' ? preferences.privacy : {};
  
  // Récupérer les valeurs de manière sécurisée avec des valeurs par défaut
  const shareData = privacy.shareData ?? false;
  const anonymizeReports = privacy.anonymizeReports ?? true;
  const profileVisibility = privacy.profileVisibility || 'team';
  const anonymousMode = privacy.anonymousMode ?? false;
  const fullAnonymity = preferences.fullAnonymity ?? false;

  return (
    <div className="space-y-6">
      {/* Partage de données */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span>Partage de données</span>
          </CardTitle>
          <CardDescription>
            Contrôlez comment vos données sont utilisées et partagées
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="share-data" className="font-medium">
                Partager les données anonymisées
              </Label>
              <p className="text-sm text-muted-foreground">
                Contribuez à l'amélioration de nos services en partageant des données anonymisées
              </p>
            </div>
            <Switch
              id="share-data"
              checked={shareData}
              onCheckedChange={(checked) => handlePrivacyChange('shareData', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="anonymize-reports" className="font-medium">
                Anonymiser les rapports d'équipe
              </Label>
              <p className="text-sm text-muted-foreground">
                Masquer votre identité dans les rapports d'équipe
              </p>
            </div>
            <Switch
              id="anonymize-reports"
              checked={anonymizeReports}
              onCheckedChange={(checked) => handlePrivacyChange('anonymizeReports', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="full-anonymity" className="font-medium">
                Mode anonyme complet
              </Label>
              <p className="text-sm text-muted-foreground">
                Utiliser l'application en mode entièrement anonyme
              </p>
            </div>
            <Switch
              id="full-anonymity"
              checked={fullAnonymity}
              onCheckedChange={(checked) => updatePreferences({ fullAnonymity: checked })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="anonymous-mode" className="font-medium">
                Mode incognito
              </Label>
              <p className="text-sm text-muted-foreground">
                Masquer temporairement votre activité aux autres utilisateurs
              </p>
            </div>
            <Switch
              id="anonymous-mode"
              checked={anonymousMode}
              onCheckedChange={(checked) => handlePrivacyChange('anonymousMode', checked)}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Visibilité du profil */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span>Visibilité du profil</span>
          </CardTitle>
          <CardDescription>
            Déterminez qui peut voir votre profil et vos informations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={profileVisibility}
            onValueChange={(value) => handleProfileVisibilityChange(value as 'public' | 'team' | 'private')}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="public" id="public" />
              <Label htmlFor="public" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <div>
                  <span className="font-medium">Public</span>
                  <p className="text-xs text-muted-foreground">Visible par tous les utilisateurs</p>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="team" id="team" />
              <Label htmlFor="team" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <div>
                  <span className="font-medium">Équipe</span>
                  <p className="text-xs text-muted-foreground">Visible par votre équipe uniquement</p>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="private" id="private" />
              <Label htmlFor="private" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <div>
                  <span className="font-medium">Privé</span>
                  <p className="text-xs text-muted-foreground">Visible uniquement par vous</p>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
      
      {/* Exportation des données */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            <span>Exportation des données</span>
          </CardTitle>
          <CardDescription>
            Téléchargez vos données personnelles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="export-format">Format d'exportation</Label>
                <Select value={dataFormat} onValueChange={(value) => setDataFormat(value as DataExportFormat)}>
                  <SelectTrigger id="export-format">
                    <SelectValue placeholder="Sélectionnez un format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleExportData}
                disabled={exportInProgress}
                className="mt-auto"
              >
                {exportInProgress ? 'Exportation en cours...' : 'Exporter mes données'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Suppression du compte */}
      <Card className="border-red-100 bg-red-50 dark:bg-red-900/10 dark:border-red-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <UserX className="h-5 w-5" />
            <span>Suppression du compte</span>
          </CardTitle>
          <CardDescription className="dark:text-red-300/80">
            Cette action est irréversible et supprimera toutes vos données
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive">
            Demander la suppression du compte
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataPrivacySettings;
