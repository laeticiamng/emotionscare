
import React, { ComponentType } from 'react';

/**
 * Charge un composant de manière asynchrone en vérifiant à la fois l'export default
 * et les exports nommés potentiels.
 * 
 * @param importFn Fonction d'import asynchrone
 * @param exportName Nom de l'export à chercher si ce n'est pas un export default
 * @returns Une fonction qui renverra le composant ou null si non trouvé
 */
export async function loadComponent<P = {}>(
  importFn: () => Promise<any>,
  exportName?: string
): Promise<ComponentType<P> | null> {
  try {
    const module = await importFn();
    
    // Essayer d'abord l'export default
    let Component = module.default;
    
    // Si pas d'export default mais un nom d'export est fourni, essayer celui-là
    if (!Component && exportName && module[exportName]) {
      Component = module[exportName];
    }
    
    // Vérifier que c'est bien un composant React valide
    if (Component && (typeof Component === 'function' || typeof Component.render === 'function')) {
      return Component as ComponentType<P>;
    }
    
    console.error('Component not found in module:', module);
    return null;
  } catch (error) {
    console.error('Failed to load component:', error);
    return null;
  }
}
