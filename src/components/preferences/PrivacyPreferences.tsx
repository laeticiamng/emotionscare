// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPreferences, PrivacyPreferences } from "@/types/preferences";

interface PrivacyPreferencesProps {
  privacy?: string | PrivacyPreferences;
  onUpdate?: (values: Partial<UserPreferences>) => void;
}

const PrivacyPreferencesComponent: React.FC<PrivacyPreferencesProps> = ({
  privacy,
  onUpdate
}) => {
  const getPrivacySettings = (): PrivacyPreferences => {
    if (!privacy) {
      return {
        shareData: false,
        shareEmotions: false,
        shareActivity: false,
        publicProfile: false,
        dataSharing: false,
        analytics: false,
        thirdParty: false,
        anonymizeReports: true,
        profileVisibility: 'private'
      };
    }
    
    if (typeof privacy === 'string') {
      return {
        shareData: privacy !== 'private',
        shareEmotions: privacy !== 'private',
        shareActivity: privacy !== 'private',
        publicProfile: privacy !== 'private',
        dataSharing: privacy !== 'private',
        analytics: privacy !== 'private',
        thirdParty: privacy !== 'private',
        anonymizeReports: true,
        profileVisibility: privacy
      };
    }
    
    return privacy as PrivacyPreferences;
  };
  
  const privacySettings = getPrivacySettings();
  
  const handleUpdatePrivacy = (key: keyof PrivacyPreferences, value: any) => {
    if (onUpdate) {
      const updatedPrivacy: PrivacyPreferences = {
        ...privacySettings,
        [key]: value
      };
      onUpdate({ privacy: updatedPrivacy });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Partage de données</h3>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="share-data">Partager mon activité</Label>
            <p className="text-sm text-muted-foreground">
              Accepter de partager anonymement les données émotionnelles pour améliorer l'application
            </p>
          </div>
          <Switch 
            id="share-data"
            checked={privacySettings.shareData || privacySettings.dataSharing || false}
            onCheckedChange={(checked) => handleUpdatePrivacy('shareData', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="analytics">Données analytiques</Label>
            <p className="text-sm text-muted-foreground">
              Autoriser la collecte des données d'utilisation pour améliorer le service
            </p>
          </div>
          <Switch 
            id="analytics"
            checked={privacySettings.analytics || false}
            onCheckedChange={(checked) => handleUpdatePrivacy('analytics', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="third-party">Partage avec des tiers</Label>
            <p className="text-sm text-muted-foreground">
              Autoriser le partage de données anonymisées avec nos partenaires
            </p>
          </div>
          <Switch 
            id="third-party"
            checked={privacySettings.thirdParty || false}
            onCheckedChange={(checked) => handleUpdatePrivacy('thirdParty', checked)}
          />
        </div>
      </div>
      
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Confidentialité des rapports</h3>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="anonymize-reports">Anonymiser les rapports</Label>
            <p className="text-sm text-muted-foreground">
              Masquer vos informations personnelles dans les rapports d'équipe
            </p>
          </div>
          <Switch 
            id="anonymize-reports"
            checked={privacySettings.anonymizeReports || false}
            onCheckedChange={(checked) => handleUpdatePrivacy('anonymizeReports', checked)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="profile-visibility">Visibilité du profil</Label>
        <Select 
          value={privacySettings.profileVisibility || 'private'} 
          onValueChange={(value) => handleUpdatePrivacy('profileVisibility', value)}
        >
          <SelectTrigger id="profile-visibility">
            <SelectValue placeholder="Choisir la visibilité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="private">Privé (visible par vous uniquement)</SelectItem>
            <SelectItem value="team">Équipe (visible par votre équipe)</SelectItem>
            <SelectItem value="organization">Organisation (visible dans votre entreprise)</SelectItem>
            <SelectItem value="public">Public (visible par tous)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          Ce paramètre contrôle qui peut voir votre profil et votre statut émotionnel
        </p>
      </div>
      
      <div className="mt-6 pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          Vous pouvez modifier vos préférences de confidentialité à tout moment.
          Consultez notre <Link to="/legal/privacy" className="text-primary underline">politique de confidentialité</Link> pour plus d'informations.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPreferencesComponent;
