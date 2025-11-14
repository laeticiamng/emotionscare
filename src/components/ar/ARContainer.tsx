/**
 * AR Container - Phase 4.5
 * Main wrapper for AR experiences with Three.js and WebXR support
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAR } from '@/contexts/ARContext';
import { useARPermissions } from '@/hooks/useARPermissions';
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';

export interface ARContainerProps {
  children: React.ReactNode;
  onPermissionDenied?: () => void;
  className?: string;
}

export function ARContainer({ children, onPermissionDenied, className }: ARContainerProps) {
  const { arMode, error, setError } = useAR();
  const { allPermissionsGranted, requestAllPermissions } = useARPermissions();
  const containerRef = useRef<HTMLDivElement>(null);
  const [permissionRequested, setPermissionRequested] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Request permissions on mount
  useEffect(() => {
    const requestPermissions = async () => {
      if (!permissionRequested) {
        try {
          const granted = await requestAllPermissions();
          setPermissionRequested(true);

          if (!granted) {
            setError('Permissions required for AR');
            onPermissionDenied?.();
          } else {
            setIsReady(true);
            logger.info('AR permissions granted', {}, 'AR');
          }
        } catch (err) {
          logger.error('Failed to request AR permissions', err as Error, 'AR');
          setError('Failed to request permissions');
        }
      }
    };

    if (arMode === 'immersive') {
      requestPermissions();
    } else {
      setIsReady(true);
    }
  }, [arMode, permissionRequested, requestAllPermissions, onPermissionDenied, setError]);

  // Handle fullscreen for immersive mode
  useEffect(() => {
    if (arMode === 'immersive' && isReady && containerRef.current && allPermissionsGranted) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current
          .requestFullscreen()
          .catch((err) => logger.warn('Fullscreen request denied', err as Error, 'AR'));
      }
    }
  }, [arMode, isReady, allPermissionsGranted]);

  const handleExitAR = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => logger.error('Exit fullscreen failed', err as Error, 'AR'));
    }
  }, []);

  // Show loading state
  if (arMode === 'immersive' && !isReady) {
    return (
      <div
        className={cn(
          'fixed inset-0 bg-black flex items-center justify-center z-50',
          className
        )}
      >
        <div className="text-center text-white">
          <div className="w-16 h-16 rounded-full border-4 border-white border-t-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold">Initialisation AR...</p>
          {!allPermissionsGranted && (
            <p className="text-sm text-gray-300 mt-2">
              En attente des permissions
            </p>
          )}
        </div>
      </div>
    );
  }

  // Show permission denied state
  if (arMode === 'immersive' && !allPermissionsGranted && permissionRequested) {
    return (
      <div
        className={cn(
          'fixed inset-0 bg-black flex items-center justify-center z-50',
          className
        )}
      >
        <div className="text-center text-white max-w-md">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold mb-2">Permissions Requises</h2>
          <p className="text-gray-300 mb-6">
            L'accès à la caméra et aux capteurs est nécessaire pour l'expérience AR.
          </p>
          <button
            onClick={handleExitAR}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
          >
            Quitter AR
          </button>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div
        className={cn(
          'fixed inset-0 bg-black flex items-center justify-center z-50',
          className
        )}
      >
        <div className="text-center text-white max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Erreur AR</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={handleExitAR}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
          >
            Quitter AR
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full',
        arMode === 'immersive' ? 'fixed inset-0' : 'h-full',
        className
      )}
    >
      {/* AR Canvas/Content */}
      <div className="w-full h-full">
        {children}
      </div>

      {/* Exit AR button (visible in immersive mode) */}
      {arMode === 'immersive' && isReady && (
        <button
          onClick={handleExitAR}
          className="absolute top-4 left-4 z-50 px-4 py-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-all font-semibold text-sm"
        >
          Quitter AR ✕
        </button>
      )}

      {/* Info bar */}
      {arMode === 'immersive' && isReady && allPermissionsGranted && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 bg-black bg-opacity-50 text-white rounded-lg text-sm">
          Mode AR actif
        </div>
      )}
    </div>
  );
}
