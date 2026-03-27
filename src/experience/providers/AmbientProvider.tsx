// @ts-nocheck
/**
 * Experience Layer — AmbientProvider
 * Top-level provider that initializes the experience system.
 * Does NOT depend on Router context — can be placed anywhere.
 *
 * Route sync is handled separately by useRouteExperience() hook
 * which must be called inside a Router context.
 */

import React, { useEffect, useCallback, useRef } from 'react';
import { useExperienceStore } from '../store/experience.store';

interface AmbientProviderProps {
  children: React.ReactNode;
}

/**
 * AmbientProvider:
 * 1. Syncs time-of-day every 5 minutes
 * 2. Refreshes device tier on resize
 * 3. Injects ambient CSS custom properties on :root
 */
export function AmbientProvider({ children }: AmbientProviderProps) {
  const refreshTimeOfDay = useExperienceStore((s) => s.refreshTimeOfDay);
  const refreshDeviceTier = useExperienceStore((s) => s.refreshDeviceTier);
  const palette = useExperienceStore((s) => s.ambient.palette);
  const lightIntensity = useExperienceStore((s) => s.ambient.lightIntensity);
  const motionIntensity = useExperienceStore((s) => s.ambient.motionIntensity);
  const fogDensity = useExperienceStore((s) => s.ambient.fogDensity);

  // Refresh time-of-day every 5 minutes
  useEffect(() => {
    refreshTimeOfDay();
    const interval = setInterval(refreshTimeOfDay, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshTimeOfDay]);

  // Refresh device tier on resize (debounced)
  const resizeTimeout = useRef<ReturnType<typeof setTimeout>>();
  const handleResize = useCallback(() => {
    clearTimeout(resizeTimeout.current);
    resizeTimeout.current = setTimeout(refreshDeviceTier, 500);
  }, [refreshDeviceTier]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout.current);
    };
  }, [handleResize]);

  // Inject ambient CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--ambient-primary', palette.primary);
    root.style.setProperty('--ambient-secondary', palette.secondary);
    root.style.setProperty('--ambient-glow', palette.glow);
    root.style.setProperty('--ambient-fog', palette.fog);
    root.style.setProperty('--ambient-bg', palette.background);
    root.style.setProperty('--ambient-particle', palette.particle);
    root.style.setProperty('--ambient-light', String(lightIntensity));
    root.style.setProperty('--ambient-motion', String(motionIntensity));
    root.style.setProperty('--ambient-fog-density', String(fogDensity));
  }, [palette, lightIntensity, motionIntensity, fogDensity]);

  return <>{children}</>;
}
