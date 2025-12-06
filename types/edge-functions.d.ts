// Déclarations globales pour permettre le typecheck du frontend malgré les edge functions

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
  test(name: string, fn: () => void | Promise<void>): void;
  readTextFile(path: string): Promise<string>;
  cwd(): string;
};

declare type InstrumentCatalog = any;
