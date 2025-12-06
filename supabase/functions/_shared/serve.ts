// Wrapper for Deno.serve to provide proper typing
export function serve(handler: (req: Request) => Response | Promise<Response>): void {
  // @ts-ignore - Deno.serve is available in Supabase Edge Functions runtime
  Deno.serve(handler);
}
