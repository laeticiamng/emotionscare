// @ts-nocheck
import React, { useMemo } from 'react';
import { Feather, Monitor } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  type VRExperienceMode,
  type VRModePreference,
  useVRSafetyStore,
} from '@/store/vrSafety.store';

interface VRModeControlsProps {
  className?: string;
}

const resolveActiveMode = (
  prefersReducedMotion: boolean,
  preference: VRModePreference,
  fallbackEnabled: boolean,
  lowPerformance: boolean,
  nextAutoMode: VRExperienceMode,
): VRExperienceMode => {
  if (prefersReducedMotion) {
    return 'vr_soft';
  }
  if (preference === '2d') {
    return '2d';
  }
  if (preference === 'soft') {
    return 'vr_soft';
  }
  if (fallbackEnabled || lowPerformance || nextAutoMode === '2d') {
    return '2d';
  }
  if (nextAutoMode === 'vr_soft') {
    return 'vr_soft';
  }
  return 'vr';
};

export const VRModeControls: React.FC<VRModeControlsProps> = ({ className }) => {
  const modePreference = useVRSafetyStore((state) => state.modePreference);
  const setModePreference = useVRSafetyStore((state) => state.setModePreference);
  const prefersReducedMotion = useVRSafetyStore((state) => state.prefersReducedMotion);
  const fallbackEnabled = useVRSafetyStore((state) => state.fallbackEnabled);
  const lowPerformance = useVRSafetyStore((state) => state.lowPerformance);
  const nextAutoMode = useVRSafetyStore((state) => state.nextAutoMode);
  const allowExtensionCTA = useVRSafetyStore((state) => state.allowExtensionCTA);

  const activeMode = useMemo(
    () => resolveActiveMode(prefersReducedMotion, modePreference, fallbackEnabled, lowPerformance, nextAutoMode),
    [prefersReducedMotion, modePreference, fallbackEnabled, lowPerformance, nextAutoMode],
  );

  const toggleSoftMode = () => {
    if (prefersReducedMotion) {
      return;
    }
    setModePreference(modePreference === 'soft' ? 'auto' : 'soft');
  };

  const toggle2DMode = () => {
    setModePreference(modePreference === '2d' ? 'auto' : '2d');
  };

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <Button
        type="button"
        variant={activeMode === 'vr_soft' ? 'secondary' : 'outline'}
        aria-pressed={activeMode === 'vr_soft'}
        onClick={toggleSoftMode}
        disabled={prefersReducedMotion}
        className="gap-2"
      >
        <Feather className="h-4 w-4" aria-hidden="true" />
        Mode doux
      </Button>

      <Button
        type="button"
        variant={activeMode === '2d' ? 'secondary' : 'outline'}
        aria-pressed={activeMode === '2d'}
        onClick={toggle2DMode}
        className="gap-2"
      >
        <Monitor className="h-4 w-4" aria-hidden="true" />
        Mode 2D
      </Button>

      <div className="flex items-center gap-2 text-xs text-white/70">
        {prefersReducedMotion && (
          <Badge variant="outline" className="border-white/30 text-white">
            prefers-reduced-motion
          </Badge>
        )}
        {fallbackEnabled && (
          <Badge variant="secondary" className="bg-white/10 text-white">
            Fallback automatique
          </Badge>
        )}
        {allowExtensionCTA && activeMode !== '2d' && (
          <Badge variant="outline" className="border-emerald-400/40 text-emerald-200">
            Extension dispo
          </Badge>
        )}
      </div>
    </div>
  );
};

export default VRModeControls;
