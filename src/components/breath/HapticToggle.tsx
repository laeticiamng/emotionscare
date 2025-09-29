import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Smartphone } from 'lucide-react';
import { useBreathStore } from '@/store/breath.store';

export const HapticToggle: React.FC = () => {
  const { hapticEnabled, setHapticEnabled } = useBreathStore();
  
  // Check if device supports vibration
  const supportsHaptic = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  if (!supportsHaptic) {
    return null; // Hide on devices that don't support vibration
  }

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-3">
        <Smartphone className="w-4 h-4 text-muted-foreground" />
        <div>
          <Label 
            htmlFor="haptic-toggle"
            className="font-medium cursor-pointer"
          >
            Vibrations légères
          </Label>
          <p className="text-xs text-muted-foreground">
            Petite vibration au changement de phase
          </p>
        </div>
      </div>
      
      <Switch
        id="haptic-toggle"
        checked={hapticEnabled}
        onCheckedChange={setHapticEnabled}
        aria-label="Activer les vibrations légères"
      />
    </div>
  );
};