// @ts-nocheck
// Stub pour éviter les erreurs dans les scripts legacy
export const buildUnifiedRoutes = () => [];

export const ROUTES_MANIFEST: RouteManifestEntry[] = [];

export const validateRoutesManifest = () => ({
  valid: true,
  errors: [] as string[]
});

export interface RouteManifestEntry {
  path: string;
  component: string;
  module?: string;
  auth?: boolean | string;
  role?: string;
}

export default buildUnifiedRoutes;
