#!/usr/bin/env ts-node
import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import 'dotenv/config';

export interface CliOptions {
  start?: string;
  end?: string;
  user?: string;
  action?: string;
  limit?: number;
  export?: string;
}

export function parseArgs(argv: string[]): CliOptions {
  const opts: CliOptions = {};
  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [key, value] = arg.slice(2).split('=');
    switch (key) {
      case 'start':
        opts.start = value;
        break;
      case 'end':
        opts.end = value;
        break;
      case 'user':
        opts.user = value;
        break;
      case 'action':
        opts.action = value;
        break;
      case 'limit':
        opts.limit = Number(value);
        break;
      case 'export':
        opts.export = value;
        break;
      default:
        console.warn(`Unknown option ${key}`);
    }
  }
  return opts;
}

export async function fetchAccessLogs(opts: CliOptions) {
  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    '';
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
    '';

  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing Supabase configuration');
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  let query = supabase
    .from('access_logs')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(opts.limit ?? 100);

  if (opts.start) query = query.gte('timestamp', opts.start);
  if (opts.end) query = query.lte('timestamp', opts.end);
  if (opts.user) query = query.eq('user_id', opts.user);
  if (opts.action) query = query.ilike('action', `%${opts.action}%`);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return { data, supabase } as const;
}

async function run() {
  const opts = parseArgs(process.argv.slice(2));
  const { data, supabase } = await fetchAccessLogs(opts);

  if (opts.export) {
    writeFileSync(opts.export, JSON.stringify(data, null, 2));
    console.log(`Exported ${data.length} logs to ${opts.export}`);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }

  try {
    await supabase.from('admin_access_logs').insert({
      admin_id: process.env.ADMIN_ID || 'cli',
      action: 'fetch_access_logs',
      timestamp: new Date().toISOString(),
      details: JSON.stringify(opts)
    });
  } catch (err) {
    console.warn('Failed to record log access:', err);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  run().catch(err => {
    console.error(err.message);
    process.exit(1);
  });
}
