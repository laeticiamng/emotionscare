import React from 'react';

type ProviderWithProps = [React.ComponentType<any>, Record<string, any>?];

/**
 * Compose plusieurs providers React en un seul composant.
 * Élimine la "pyramide de providers" tout en maintenant l'ordre d'imbrication.
 *
 * Usage:
 *   const AppProviders = composeProviders([
 *     [QueryClientProvider, { client: queryClient }],
 *     [AuthProvider],
 *     [ThemeProvider, { defaultTheme: 'system' }],
 *   ]);
 *   <AppProviders>{children}</AppProviders>
 */
export function composeProviders(providers: ProviderWithProps[]): React.FC<{ children: React.ReactNode }> {
  return function ComposedProviders({ children }: { children: React.ReactNode }) {
    return providers.reduceRight<React.ReactNode>(
      (acc, [Provider, props = {}]) => <Provider {...props}>{acc}</Provider>,
      children
    ) as React.ReactElement;
  };
}
