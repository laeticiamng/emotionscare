
import React, { ComponentType, LazyExoticComponent } from 'react';

export function loadComponent<T extends ComponentType<any>>(
  importFn: () => Promise<any>,
  exportName?: string
): LazyExoticComponent<T> {
  return React.lazy(async () => {
    const module = await importFn();
    // si exportName fourni, on le prend, sinon module.default
    const Component = exportName ? module[exportName] : module.default;
    if (!Component) {
      console.error(`Module loaded:`, module);
      throw new Error(
        `loadComponent: export "${exportName || 'default'}" not found in module`
      );
    }
    return { default: Component as T };
  });
}
