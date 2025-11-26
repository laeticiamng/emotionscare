// Deno types declaration for build system compatibility
declare namespace Deno {
  export const env: {
    get(key: string): string | undefined;
  };
  export function serve(handler: (req: Request) => Response | Promise<Response>): void;
  export function test(name: string, fn: () => void | Promise<void>): void;
  export function readTextFile(path: string): Promise<string>;
  export function cwd(): string;
}
