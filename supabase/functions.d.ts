// Déclaration de module pour ignorer les edge functions lors du typecheck frontend
declare module 'supabase/functions/*' {
  const content: any;
  export default content;
}

declare module '*.ts' {
  export function serve(handler: (req: Request) => Response | Promise<Response>): void;
  export function assertEquals(actual: any, expected: any): void;
  export function assertMatch(actual: string, pattern: RegExp): void;
  export function createClient(url: string, key: string, options?: any): any;
}

// Déclarations pour les imports Deno/esm.sh utilisés dans les edge functions
declare module 'https://deno.land/std@0.168.0/http/server.ts' {
  export function serve(handler: (req: Request) => Response | Promise<Response>): void;
}

declare module 'https://deno.land/std@0.190.0/http/server.ts' {
  export function serve(handler: (req: Request) => Response | Promise<Response>): void;
}

declare module 'https://esm.sh/@supabase/supabase-js@2' {
  export function createClient(url: string, key: string, options?: any): any;
}

declare module 'https://esm.sh/@supabase/supabase-js@2.39.3' {
  export function createClient(url: string, key: string, options?: any): any;
}

declare module 'https://esm.sh/@supabase/supabase-js@2.43.4' {
  export function createClient(url: string, key: string, options?: any): any;
}

declare module 'https://esm.sh/@supabase/supabase-js@2.45.0' {
  export function createClient(url: string, key: string, options?: any): any;
}

// Déclaration pour le module partagé local
declare module '../_shared/supabase.ts' {
  export function createClient(url: string, key: string, options?: any): any;
}

declare module '../_shared/auth.ts' {
  export function authorizeRole(req: Request, roles: string[]): Promise<any>;
}

// Déclarations globales pour Deno (utilisées dans les edge functions)
declare namespace Deno {
  export namespace env {
    export function get(key: string): string | undefined;
  }
  export function test(name: string, fn: () => void | Promise<void>): void;
}

// Types pour éviter les erreurs TypeScript dans les edge functions
declare global {
  type InstrumentCatalog = any;
}
