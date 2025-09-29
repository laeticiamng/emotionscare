const IS_NODE_RUNTIME = typeof process !== 'undefined' && Boolean(process.versions?.node);
const REMOTE_SPECIFIER = 'https://esm.sh/@supabase/supabase-js@2';

const modulePromise = IS_NODE_RUNTIME
  ? import('@supabase/supabase-js')
  : import(/* @vite-ignore */ REMOTE_SPECIFIER);

const mod = await modulePromise;
export const createClient = (mod as typeof import('@supabase/supabase-js')).createClient;
