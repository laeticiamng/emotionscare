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

interface TestUser {
  email: string;
  password: string;
  role: 'b2c' | 'b2b_user' | 'b2b_admin';
  name: string;
}

const testUsers: TestUser[] = [
  {
    email: 'b2c@exemple.fr',
    password: 'b2c',
    role: 'b2c',
    name: 'Utilisateur B2C'
  },
  {
    email: 'user@exemple.fr',
    password: 'user',
    role: 'b2b_user',
    name: 'Utilisateur B2B'
  },
  {
    email: 'admin@exemple.fr',
    password: 'admin',
    role: 'b2b_admin',
    name: 'Administrateur B2B'
  }
];

async function ensureTestUsers() {
  for (const { email, password, role, name } of testUsers) {
    // Find user by email using listUsers
    const { data: { users }, error: fetchError } = await supabase.auth.admin.listUsers();
    if (fetchError) {
      console.error(`Error fetching users:`, fetchError.message);
      continue;
    }
    
    const existing = users.find(user => user.email === email);

    if (existing) {
      const currentRole = existing.user_metadata?.role;
      const currentName = existing.user_metadata?.name;
      if (currentRole !== role || currentName !== name) {
        const { error: updateError } = await supabase.auth.admin.updateUserById(existing.id, {
          password,
          email_confirm: true,
          user_metadata: { role, name }
        });
        if (updateError) {
          console.error(`Error updating user ${email}:`, updateError.message);
        } else {
          console.log(`Test user ${email} updated.`);
        }
      } else {
        console.log(`Test user ${email} already exists.`);
      }
      continue;
    }

    const { error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role }
    });

    if (createError) {
      console.error(`Error creating user ${email}:`, createError.message);
    } else {
      console.log(`Test user ${email} created.`);
    }
  }
}

ensureTestUsers().then(() => process.exit(0));
