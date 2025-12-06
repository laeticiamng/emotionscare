/**
 * Navigation Schema - Source de vérité centralisée
 * Architecture déclarative pour éliminer les boutons inactifs
 */

export type NavAction =
  | { type: "route"; to: string; prefetch?: boolean }
  | { type: "modal"; id: string; payload?: Record<string, unknown> }
  | { type: "mutation"; key: string; input?: Record<string, unknown>; optimistic?: boolean }
  | { type: "external"; href: string; newTab?: boolean }
  | { type: "compose"; steps: NavAction[] };

export type Guard = {
  requiresAuth?: boolean;
  roles?: string[];
  featureFlag?: string;
  predicate?: () => boolean;
};

export type NavNode = {
  id: string;
  labelKey: string; // i18n key
  icon?: string;
  action?: NavAction;
  children?: NavNode[];
  guard?: Guard;
  meta?: {
    description?: string;
    badge?: string;
    premium?: boolean;
  };
};

export interface NavContext {
  isAuthenticated: boolean;
  user?: {
    id: string;
    role?: string;
  };
  featureFlags?: Record<string, boolean>;
}

export interface ActionResult {
  success: boolean;
  error?: string;
  data?: unknown;
}