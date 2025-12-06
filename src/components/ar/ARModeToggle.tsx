/**
 * AR Mode Toggle - Phase 4.5
 * Toggle between AR and fallback modes
 */

import React, { useEffect } from 'react';
import { Headset, Monitor } from 'lucide-react';
import { useARSupport } from '@/hooks/useARPermissions';
import { useAR } from '@/contexts/ARContext';
import { cn } from '@/lib/utils';

export interface ARModeToggleProps {
  className?: string;
}

export function ARModeToggle({ className }: ARModeToggleProps) {
  const { isSupported, deviceType, loading } = useARSupport();
  const { arMode, setARMode } = useAR();

  // Auto-enable immersive AR if supported
  useEffect(() => {
    if (isSupported && !loading) {
      setARMode('immersive');
    }
  }, [isSupported, loading, setARMode]);

  if (loading) {
    return (
      <div className={cn('flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg', className)}>
        <div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-indigo-600 animate-spin" />
        <span className="text-sm text-gray-600">Vérification AR...</span>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Mode indicator */}
      <div
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg transition-all',
          arMode === 'immersive'
            ? 'bg-indigo-100 text-indigo-700'
            : 'bg-gray-100 text-gray-600'
        )}
      >
        {arMode === 'immersive' ? (
          <>
            <Headset className="w-4 h-4" />
            <span className="text-sm font-semibold">Mode AR</span>
            {isSupported && <span className="text-xs">✓ Supporté</span>}
          </>
        ) : (
          <>
            <Monitor className="w-4 h-4" />
            <span className="text-sm font-semibold">Mode 3D</span>
          </>
        )}
      </div>

      {/* Device info */}
      {isSupported && (
        <div className="text-xs text-gray-500">
          ({deviceType === 'ios'
            ? 'iPhone/iPad'
            : deviceType === 'android'
              ? 'Android'
              : 'Bureau'})
        </div>
      )}

      {/* Toggle button (only if supported) */}
      {isSupported && (
        <button
          onClick={() => setARMode(arMode === 'immersive' ? 'fallback' : 'immersive')}
          className="ml-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-semibold"
          aria-label={arMode === 'immersive' ? 'Passer en mode 3D' : 'Passer en mode AR'}
        >
          Basculer
        </button>
      )}

      {/* Warning for unsupported devices */}
      {!isSupported && (
        <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
          AR non supporté - Mode 3D utilisé
        </div>
      )}
    </div>
  );
}
