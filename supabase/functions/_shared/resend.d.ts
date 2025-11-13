// Type declarations for Resend in Deno edge functions
declare module 'npm:resend@4.0.0' {
  export class Resend {
    constructor(apiKey: string);
    emails: {
      send(options: {
        from: string;
        to: string[];
        subject: string;
        html: string;
        headers?: Record<string, string>;
        tags?: Array<{ name: string; value: string }>;
      }): Promise<{ data?: { id: string }; error?: any }>;
    };
  }
}
