import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE);

async function upsertUser(email) {
  const { data, error } = await supa.from('profiles').upsert({ email }, { onConflict: 'email' }).select().single();
  if (error) throw error;
  return data;
}

async function ensureOrg(name) {
  const { data, error } = await supa.from('orgs').upsert({ name }, { onConflict: 'name' }).select().single();
  if (error) throw error;
  return data;
}

async function ensureMember(org_id, user_email, role) {
  const { data: u } = await supa.from('profiles').select('id').eq('email', user_email).single();
  await supa.from('org_members').upsert({ org_id, user_id: u.id, role });
}

(async () => {
  const b2c = await upsertUser('test.b2c@emotions.care');
  const b2b = await upsertUser('test.b2b@emotions.care');
  const adm = await upsertUser('test.admin@emotions.care');
  const org = await ensureOrg('QA Org');

  await ensureMember(org.id, b2b.email, 'employee');
  await ensureMember(org.id, adm.email, 'manager');

  console.log('Seed OK:', { b2c: b2c.email, b2b: b2b.email, admin: adm.email, org: org.name });
})().catch((e) => { console.error(e); process.exit(1); });
