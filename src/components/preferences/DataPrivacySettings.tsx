
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DataPrivacyProps {
  preferences: {
    privacy: {
      shareData: boolean;
      collectAnalytics: boolean;
      cookiePreferences: {
        necessary: boolean;
        functional: boolean;
        performance: boolean;
        marketing: boolean;
      };
    };
  };
  onUpdate: (preferences: any) => void;
  isLoading?: boolean;
}

const DataPrivacySettings: React.FC<DataPrivacyProps> = ({ 
  preferences: initialPreferences, 
  onUpdate,
  isLoading = false
}) => {
  // Create a mutable copy of the preferences to work with
  const [preferences, setPreferences] = useState({
    privacy: {
      ...initialPreferences.privacy,
      cookiePreferences: {
        ...initialPreferences.privacy.cookiePreferences
      }
    }
  });
  
  const { toast } = useToast();

  const handleShareDataToggle = () => {
    const updatedPreferences = {
      ...preferences,
      privacy: {
        ...preferences.privacy,
        shareData: !preferences.privacy.shareData
      }
    };
    setPreferences(updatedPreferences);
  };

  const handleAnalyticsToggle = () => {
    const updatedPreferences = {
      ...preferences,
      privacy: {
        ...preferences.privacy,
        collectAnalytics: !preferences.privacy.collectAnalytics
      }
    };
    setPreferences(updatedPreferences);
  };

  const handleCookieToggle = (cookieType: keyof typeof preferences.privacy.cookiePreferences) => {
    // Don't allow toggling necessary cookies
    if (cookieType === 'necessary') return;
    
    const updatedPreferences = {
      ...preferences,
      privacy: {
        ...preferences.privacy,
        cookiePreferences: {
          ...preferences.privacy.cookiePreferences,
          [cookieType]: !preferences.privacy.cookiePreferences[cookieType]
        }
      }
    };
    setPreferences(updatedPreferences);
  };

  const handleSave = () => {
    onUpdate(preferences);
    toast({
      title: "Préférences mises à jour",
      description: "Vos paramètres de confidentialité ont été enregistrés.",
    });
  };

  const handleReset = () => {
    setPreferences({
      privacy: {
        ...initialPreferences.privacy,
        cookiePreferences: {
          ...initialPreferences.privacy.cookiePreferences
        }
      }
    });
    toast({
      title: "Préférences réinitialisées",
      description: "Vos paramètres de confidentialité ont été rétablis.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Confidentialité des données</CardTitle>
        <CardDescription>
          Gérez comment vos données sont collectées et utilisées.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert variant="warning" className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-900/50">
          <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            Ces paramètres affectent la manière dont nous personnalisons votre expérience.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="share-data" className="font-medium">Partage de données</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Autorise le partage de données anonymisées pour améliorer les services
              </p>
            </div>
            <Switch 
              id="share-data" 
              checked={preferences.privacy.shareData} 
              onCheckedChange={handleShareDataToggle}
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="collect-analytics" className="font-medium">Collecte d'analytiques</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Permet la collecte de données d'utilisation pour améliorer l'expérience
              </p>
            </div>
            <Switch 
              id="collect-analytics" 
              checked={preferences.privacy.collectAnalytics} 
              onCheckedChange={handleAnalyticsToggle}
              disabled={isLoading}
            />
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-medium mb-3">Préférences de cookies</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="necessary-cookies" className="font-medium">Cookies nécessaires</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Requis pour le fonctionnement du site
                </p>
              </div>
              <Switch 
                id="necessary-cookies" 
                checked={true} 
                disabled={true}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="functional-cookies" className="font-medium">Cookies fonctionnels</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Permettent des fonctionnalités améliorées
                </p>
              </div>
              <Switch 
                id="functional-cookies" 
                checked={preferences.privacy.cookiePreferences.functional} 
                onCheckedChange={() => handleCookieToggle('functional')}
                disabled={isLoading}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="performance-cookies" className="font-medium">Cookies de performance</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Nous aident à comprendre comment vous utilisez le site
                </p>
              </div>
              <Switch 
                id="performance-cookies" 
                checked={preferences.privacy.cookiePreferences.performance} 
                onCheckedChange={() => handleCookieToggle('performance')}
                disabled={isLoading}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="marketing-cookies" className="font-medium">Cookies marketing</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Utilisés pour vous montrer du contenu pertinent
                </p>
              </div>
              <Switch 
                id="marketing-cookies" 
                checked={preferences.privacy.cookiePreferences.marketing} 
                onCheckedChange={() => handleCookieToggle('marketing')}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleReset} disabled={isLoading}>
          Réinitialiser
        </Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Enregistrement..." : "Enregistrer les préférences"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DataPrivacySettings;
