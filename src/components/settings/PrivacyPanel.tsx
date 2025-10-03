// @ts-nocheck
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Camera, 
  Mic, 
  Heart, 
  MapPin, 
  Users, 
  Coins,
  ExternalLink,
  Lock
} from 'lucide-react';
import { useRouter } from '@/hooks/router';

const PRIVACY_TOGGLES = [
  {
    key: 'cam',
    icon: Camera,
    title: 'Caméra',
    description: 'Pour les filtres émotions et analyse faciale',
    sensitive: true
  },
  {
    key: 'mic',
    icon: Mic, 
    title: 'Microphone',
    description: 'Pour les sessions vocales et coaching',
    sensitive: true
  },
  {
    key: 'hr',
    icon: Heart,
    title: 'Fréquence cardiaque',
    description: 'Capteurs Bluetooth pour Bubble Beat',
    sensitive: false
  },
  {
    key: 'gps',
    icon: MapPin,
    title: 'Géolocalisation',
    description: 'Contexte environnemental (optionnel)',
    sensitive: true
  },
  {
    key: 'social',
    icon: Users,
    title: 'Partage social',
    description: 'Cocon social et gamification équipe',
    sensitive: false
  },
  {
    key: 'nft',
    icon: Coins,
    title: 'NFT & récompenses',
    description: 'Badges blockchain et certificats',
    sensitive: false
  }
];

/**
 * Panel de gestion des préférences de confidentialité et capteurs
 */
export const PrivacyPanel: React.FC = () => {
  const router = useRouter();
  
  // Mock state - in reality this would come from usePrivacyPrefs hook
  const [preferences, setPreferences] = React.useState({
    cam: false,
    mic: false,
    hr: true,
    gps: false,
    social: true,
    nft: false
  });

  const [lockedByOrg, setLockedByOrg] = React.useState({
    cam: false,
    mic: false,
    hr: false,
    gps: true, // Example: GPS locked by organization
    social: false,
    nft: false
  });

  const handleToggle = async (key: string, value: boolean) => {
    // Optimistic update
    setPreferences(prev => ({ ...prev, [key]: value }));
    
    try {
      // Mock API call - PATCH /me/privacy_prefs
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Privacy setting changed - silent tracking
    } catch (error) {
      // Rollback on error
      setPreferences(prev => ({ ...prev, [key]: !value }));
      // Update failed - silent
    }
  };

  const sensitiveCount = PRIVACY_TOGGLES.filter(toggle => 
    toggle.sensitive && preferences[toggle.key as keyof typeof preferences]
  ).length;

  return (
    <div className="space-y-4">
      {/* Privacy summary */}
      <Alert>
        <Lock className="h-4 w-4" />
        <AlertDescription>
          Vous contrôlez vos données. {sensitiveCount} capteur{sensitiveCount !== 1 ? 's' : ''} 
          {sensitiveCount === 0 ? '' : ' sensible' + (sensitiveCount > 1 ? 's' : '')} activé{sensitiveCount !== 1 ? 's' : ''}.
        </AlertDescription>
      </Alert>

      {/* Privacy toggles */}
      <div className="space-y-4">
        {PRIVACY_TOGGLES.map(toggle => {
          const Icon = toggle.icon;
          const isEnabled = preferences[toggle.key as keyof typeof preferences];
          const isLocked = lockedByOrg[toggle.key as keyof typeof lockedByOrg];
          
          return (
            <div 
              key={toggle.key}
              className={`flex items-start gap-3 p-3 rounded-lg border ${
                isLocked ? 'bg-muted/50' : 'bg-background'
              }`}
            >
              <div className={`p-2 rounded-lg ${
                isEnabled && !isLocked ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Label htmlFor={toggle.key} className="font-medium">
                    {toggle.title}
                  </Label>
                  {toggle.sensitive && (
                    <span className="text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                      Sensible
                    </span>
                  )}
                  {isLocked && (
                    <Lock className="w-3 h-3 text-muted-foreground" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {toggle.description}
                </p>
              </div>
              
              <Switch
                id={toggle.key}
                checked={isEnabled}
                onCheckedChange={(checked) => handleToggle(toggle.key, checked)}
                disabled={isLocked}
                role="switch"
                aria-checked={isEnabled}
                aria-describedby={`${toggle.key}-description`}
              />
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button 
          variant="outline" 
          onClick={() => router.push('/help/privacy')}
          className="flex-1"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          En savoir plus
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => {
            // Reset all toggles to false (most private setting)
            const resetPrefs = Object.keys(preferences).reduce((acc, key) => {
              acc[key] = false;
              return acc;
            }, {} as any);
            setPreferences(resetPrefs);
          }}
          className="flex-1"
        >
          Tout désactiver
        </Button>
      </div>

      {/* Organization notice */}
      {Object.values(lockedByOrg).some(Boolean) && (
        <Alert>
          <AlertDescription className="text-xs">
            <strong>Note :</strong> Certains réglages sont gérés par votre organisation 
            et ne peuvent pas être modifiés individuellement.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};