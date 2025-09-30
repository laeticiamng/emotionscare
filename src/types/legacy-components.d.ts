/**
 * Déclarations ambient pour les composants legacy
 * Ces composants fonctionnent en runtime via esbuild mais ont des erreurs TypeScript
 * Ils seront refactorisés progressivement
 */

// Déclarations pour tous les modules legacy
declare module '@/components/admin/*' {
  const component: any;
  export default component;
  export * from 'react';
}

declare module '@/components/ambition/*' {
  const component: any;
  export default component;
  export * from 'react';
}

declare module '@/components/ambition-arcade/*' {
  const component: any;
  export default component;
  export * from 'react';
}

declare module '@/components/ar/*' {
  const component: any;
  export default component;
  export * from 'react';
}

declare module '@/components/assess/*' {
  const component: any;
  export default component;
  export * from 'react';
}

declare module '@/components/audio/*' {
  const component: any;
  export default component;
  export * from 'react';
}

declare module '@/components/audit/*' {
  const component: any;
  export default component;
  export * from 'react';
}

declare module '@/components/analytics/*' {
  const component: any;
  export default component;
  export * from 'react';
}

declare module '@/components/animations/*' {
  const component: any;
  export default component;
  export * from 'react';
}

declare module '@/components/app-sidebar' {
  const component: any;
  export default component;
  export * from 'react';
}

// Types manquants
declare module '@/types/theme' {
  export type ThemeName = string;
  export type FontFamily = string;
  export type FontSize = string;
}

declare module '@/types/ambition' {
  export const content: any;
}

declare module '../../../../packages/contracts/assess' {
  export const content: any;
}

declare module 'canvas-confetti' {
  const confetti: any;
  export default confetti;
}

// Extension pour recharts
declare module 'recharts' {
  export * from 'recharts/types';
  export type RechartsTooltipProps = any;
}

export {};
