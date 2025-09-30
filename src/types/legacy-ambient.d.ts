/**
 * Déclarations ambient pour les fichiers legacy
 * Ces déclarations permettent au typecheck de passer sans modifier les fichiers legacy
 */

// Déclarations pour scripts/
declare module '*/scripts/routes-audit' {
  const content: any;
  export default content;
}

declare module '*/scripts/routes-sync' {
  const content: any;
  export default content;
}

declare module '*/scripts/seed-e2e' {
  const content: any;
  export default content;
}

declare module '*/scripts/test/seed.min' {
  const content: any;
  export default content;
}

// Déclarations pour services/
declare module '*/services/api/tests/journal.test' {
  const content: any;
  export default content;
}

declare module '*/services/gam/server' {
  const content: any;
  export default content;
}

declare module '*/services/privacy/server' {
  const content: any;
  export default content;
}

declare module '*/services/scan/server' {
  const content: any;
  export default content;
}

declare module '*/services/vr/server' {
  const content: any;
  export default content;
}

// Extension de l'interface Window pour gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
  
  // Extension pour ImportMeta (utilisé dans les scripts)
  interface ImportMeta {
    main?: boolean;
  }
}

// Types manquants pour les composants legacy
declare type ActivityFiltersState = {
  activityType?: string;
  dateFrom?: string;
  dateTo?: string;
};

export {};
