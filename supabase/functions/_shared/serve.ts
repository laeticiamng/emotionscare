// Wrapper for Deno.serve to provide proper typing
export function serve(handler: (req: Request) => Response | Promise<Response>): void {
  Deno.serve(handler);
}
