// Déclaration de module pour ignorer les edge functions lors du typecheck frontend
declare module 'supabase/functions/*' {
  const content: any;
  export default content;
}

declare module '*.ts' {
  export function serve(handler: (req: Request) => Response | Promise<Response>): void;
  export function assertEquals(actual: any, expected: any): void;
  export function assertMatch(actual: string, pattern: RegExp): void;
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
