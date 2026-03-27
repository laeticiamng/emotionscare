// @ts-nocheck
/**
 * Experience Layer — useRouteExperience
 * Hook that syncs the current route with the experience store.
 * Must be used inside a Router context (has access to useLocation).
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useExperienceStore } from '../store/experience.store';
import { getRouteExperienceConfig } from '../config/immersionRegistry';

/**
 * Call this once in a component that lives inside the Router context.
 * It will keep immersion level and transition config in sync with the current route.
 */
export function useRouteExperience() {
  const location = useLocation();
  const setImmersionLevel = useExperienceStore((s) => s.setImmersionLevel);
  const setTransition = useExperienceStore((s) => s.setTransition);

  useEffect(() => {
    const config = getRouteExperienceConfig(location.pathname);
    setImmersionLevel(config.immersionLevel);
    setTransition(config.transition);
  }, [location.pathname, setImmersionLevel, setTransition]);
}
