// Déclarations TypeScript pour Deno utilisées dans les edge functions
// Ce fichier permet au typecheck frontend de ne pas échouer sur les edge functions

declare global {
  namespace Deno {
    export namespace env {
      export function get(key: string): string | undefined;
    }
    export function test(name: string, fn: () => void | Promise<void>): void;
    export function readTextFile(path: string): Promise<string>;
    export const cwd: () => string;
    export function serve(handler: (req: Request) => Response | Promise<Response>): void;
    export function serve(options: ServeOptions): void;
  }

  interface ServeOptions {
    port?: number;
    hostname?: string;
    handler?: (req: Request) => Response | Promise<Response>;
    onListen?: (params: { hostname: string; port: number }) => void;
    onError?: (error: unknown) => Response | Promise<Response>;
  }
}

export {};
