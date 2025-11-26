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

// Module declarations for Deno URL imports
declare module 'https://esm.sh/@supabase/supabase-js@2' {
  export * from '@supabase/supabase-js';
}

declare module 'https://esm.sh/@supabase/supabase-js@2.39.3' {
  export * from '@supabase/supabase-js';
}

declare module 'https://deno.land/x/zod@v3.22.4/mod.ts' {
  export * from 'zod';
}

declare module 'https://esm.sh/openai@4' {
  export * from 'openai';
}

declare module 'https://esm.sh/openai@4.28.0' {
  export * from 'openai';
}

declare module 'https://deno.land/std@0.208.0/crypto/mod.ts' {
  export function timingSafeEqual(a: ArrayBuffer, b: ArrayBuffer): boolean;
}

declare module 'https://deno.land/std@0.208.0/encoding/base64.ts' {
  export function encode(data: ArrayBuffer | Uint8Array | string): string;
  export function decode(data: string): Uint8Array;
}

declare module 'https://esm.sh/resend@2.0.0' {
  export class Resend {
    constructor(apiKey: string);
    emails: {
      send(options: {
        from: string;
        to: string | string[];
        subject: string;
        html?: string;
        text?: string;
      }): Promise<{ data: { id: string } | null; error: Error | null }>;
    };
  }
}

// Deno standard library HTTP server
declare module 'https://deno.land/std@0.168.0/http/server.ts' {
  export function serve(handler: (req: Request) => Response | Promise<Response>): void;
}

declare module 'https://deno.land/std@0.177.0/http/server.ts' {
  export function serve(handler: (req: Request) => Response | Promise<Response>): void;
}

declare module 'https://deno.land/std@0.190.0/http/server.ts' {
  export function serve(handler: (req: Request) => Response | Promise<Response>): void;
}

// Additional OpenAI versions
declare module 'https://esm.sh/openai@4.100.0' {
  import OpenAI from 'openai';
  export default OpenAI;
  export * from 'openai';
}

// NPM imports via Deno
declare module 'npm:resend@4.0.0' {
  export class Resend {
    constructor(apiKey: string);
    emails: {
      send(options: {
        from: string;
        to: string | string[];
        subject: string;
        html?: string;
        text?: string;
        react?: any;
        headers?: Record<string, string>;
        tags?: Array<{ name: string; value: string }>;
      }): Promise<{ data: { id: string } | null; error: Error | null }>;
    };
  }
}

declare module 'npm:resend' {
  export class Resend {
    constructor(apiKey: string);
    emails: {
      send(options: {
        from: string;
        to: string | string[];
        subject: string;
        html?: string;
        text?: string;
        react?: any;
        headers?: Record<string, string>;
        tags?: Array<{ name: string; value: string }>;
      }): Promise<{ data: { id: string } | null; error: Error | null }>;
    };
  }
}

// Déclarations globales pour Deno (utilisées dans les edge functions)
declare namespace Deno {
  export namespace env {
    export function get(key: string): string | undefined;
  }
  export function test(name: string, fn: () => void | Promise<void>): void;
  export function serve(handler: (req: Request) => Response | Promise<Response>): void;
}

// Types pour éviter les erreurs TypeScript dans les edge functions
declare global {
  type InstrumentCatalog = any;
}
