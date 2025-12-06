// @ts-nocheck

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

/**
 * Hook qui surveille les problèmes d'accès aux dashboards et
 * remonte des informations utiles en cas de problème
 */
export function useDashboardMonitor() {
  const location = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    // Vérifier si l'URL correspond à un pattern de dashboard
    const isDashboardPath = 
      location.pathname.includes('/dashboard') || 
      location.pathname.includes('/b2b/user') || 
      location.pathname.includes('/b2b/admin');
      
    // Logger des infos utiles pour comprendre les problèmes de routage
    if (isDashboardPath) {
      logger.info('[DashboardMonitor] Accès à un tableau de bord', {
        path: location.pathname,
        search: location.search,
        hash: location.hash,
        state: location.state
      }, 'UI');
      
      // Détecter les URL malformées comme souvent rapporté dans les audits
      if (location.pathname.includes('//') || location.pathname.endsWith('//')) {
        logger.warn('[DashboardMonitor] URL malformée détectée', { pathname: location.pathname }, 'UI');
        
        toast({
          title: "URL malformée détectée",
          description: "Une erreur de navigation a été détectée et va être corrigée",
          variant: "destructive"
        });
      }
    }
  }, [location, toast]);

  // Ce hook est uniquement pour la surveillance, pas besoin de retourner quoi que ce soit
  return null;
}

export default useDashboardMonitor;
