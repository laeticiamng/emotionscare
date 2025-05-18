import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl =
  process.env.VITE_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  '';

const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  '';

if (!supabaseUrl || !serviceKey) {
  console.error('Missing Supabase configuration.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function ensureTestUser() {
  const email = 'utilisateur@exemple.fr';
  const password = 'admin';

  const { data: existing, error: fetchError } = await supabase.auth.admin.getUserByEmail(email);
  if (fetchError) {
    console.error('Error fetching user:', fetchError.message);
    return;
  }

  if (existing?.user) {
    console.log('Test user already exists.');
    return;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name: 'Utilisateur test', role: 'b2c' }
  });

  if (error) {
    console.error('Error creating test user:', error.message);
    return;
  }

  console.log('Test user created:', data.user?.id);
}

ensureTestUser().then(() => process.exit(0));
