import { createClient } from './supabase.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const logClient = createClient(supabaseUrl, serviceKey);

export interface AccessLogEntry {
  user_id: string | null;
  role?: string | null;
  route: string;
  action: string;
  result: 'success' | 'denied' | 'error';
  ip_address?: string | null;
  user_agent?: string | null;
  details?: string | null;
}

export async function logAccess(entry: AccessLogEntry): Promise<void> {
  try {
    await logClient.from('audit_logs').insert({
      ...entry,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to log access:', error);
  }
}
