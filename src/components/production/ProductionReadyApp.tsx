
import React, { useEffect } from 'react';
import { initProductionSecurity } from '@/lib/security/productionSecurity';
import { initBuildOptimizations } from '@/utils/buildOptimization';
import { useProductionMonitoring } from '@/hooks/useProductionMonitoring';

interface ProductionReadyAppProps {
  children: React.ReactNode;
}

/**
 * Wrapper pour l'application en mode production
 */
const ProductionReadyApp: React.FC<ProductionReadyAppProps> = ({ children }) => {
  const { isMonitoring } = useProductionMonitoring();

  useEffect(() => {
    if (import.meta.env.PROD) {
      try {
        // Initialiser la sécurité production
        initProductionSecurity();
        
        // Initialiser les optimisations
        initBuildOptimizations();
        
        console.log('🚀 Production mode activated');
      } catch (error) {
        console.error('❌ Production initialization failed:', error);
      }
    }
  }, []);

  return (
    <>
      {children}
      {isMonitoring && (
        <div 
          id="production-monitor" 
          style={{ display: 'none' }}
          data-monitoring="active"
        />
      )}
    </>
  );
};

export default ProductionReadyApp;
