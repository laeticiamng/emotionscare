// Déclarations globales pour permettre le typecheck du frontend malgré les edge functions

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
  test(name: string, fn: () => void | Promise<void>): void;
  readTextFile(path: string): Promise<string>;
  cwd(): string;
  serve(handler: (req: Request) => Response | Promise<Response>): void;
};

declare type InstrumentCatalog = any;
