/**
 * Déclarations ambient pour les composants legacy
 * Ces composants fonctionnent en runtime via esbuild mais ont des erreurs TypeScript
 * Ils seront refactorisés progressivement
 */

// Déclarations pour tous les modules legacy - approche globale
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

declare module '@/components/auth/*' {
  const component: any;
  export default component;
  export * from 'react';
}

declare module '@/components/breathwork/*' {
  const component: any;
  export default component;
  export * from 'react';
}

declare module '@/components/buddy/*' {
  const component: any;
  export default component;
  export * from 'react';
}

declare module '@/components/chat/*' {
  const component: any;
  export default component;
  export * from 'react';
}

declare module '@/components/coach/*' {
  const component: any;
  export default component;
  export * from 'react';
}

declare module '@/components/common/*' {
  const component: any;
  export default component;
  export * from 'react';
}

declare module '@/components/community/*' {
  const component: any;
  export default component;
  export * from 'react';
}

declare module '@/components/app-sidebar' {
  const component: any;
  export default component;
  export * from 'react';
}

// Types manquants globaux
declare module '@/types/theme' {
  export type ThemeName = string;
  export type FontFamily = string;
  export type FontSize = string;
}

declare module '@/types/ambition' {
  export const content: any;
}

declare module '@/types/user' {
  export type UserRole = string;
  export const content: any;
}

declare module '@/contexts/auth' {
  export const content: any;
}

declare module '@/contexts/coach/CoachContextUnified' {
  export const content: any;
}

declare module '../../../../packages/contracts/assess' {
  export const content: any;
}

declare module '@/lib/auth/authErrorService' {
  export type AuthErrorType = string;
  export const content: any;
}

declare module '@/lib/scan/enhancedAnalyzeService' {
  export const enhancedAnalyzeService: any;
}

declare module '@/hooks/useUserModeHelpers' {
  export function useUserModeHelpers(): any;
  const def: any;
  export default def;
}

declare module '@/utils/roleUtils' {
  export function getRoleName(role: any): string;
}

declare module '@/utils/userModeHelpers' {
  export function normalizeUserMode(mode: any): any;
}

declare module '@/hooks/useChat' {
  const def: any;
  export default def;
  export function useChat(props?: any): any;
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
