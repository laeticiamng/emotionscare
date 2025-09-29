import 'dotenv/config';
import { createClient, type User } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined to seed the QA environment.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const ORG_DOMAIN = 'ec-e2e.qa';
const ORG_NAME = 'EmotionsCare QA Org';
const TEST_USER_EMAIL = 'qa.e2e@emotions.care';
const TEAM_NAME = 'Harmonie QA';

async function ensureOrganization() {
  const { data, error } = await supabase
    .from('organizations')
    .upsert(
      {
        name: ORG_NAME,
        domain: ORG_DOMAIN,
        settings: {
          locale: 'fr-FR',
          seed: 'ci',
          contact: 'qa@emotions.care',
        },
      },
      { onConflict: 'domain' }
    )
    .select()
    .eq('domain', ORG_DOMAIN)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function ensureAuthUser(email: string): Promise<User> {
  const existing = await supabase.auth.admin.getUserByEmail(email);
  if (existing.data?.user) {
    return existing.data.user;
  }

  const created = await supabase.auth.admin.createUser({
    email,
    password: process.env.SEED_CI_PASSWORD ?? 'EmotionsCare#QA1',
    email_confirm: true,
    user_metadata: {
      full_name: 'QA E2E Flow',
      onboarding_completed: true,
    },
  });

  if (created.error || !created.data.user) {
    throw created.error ?? new Error('Unable to create QA seed user.');
  }

  return created.data.user;
}

async function ensureProfile(user: User, orgId: string) {
  const { error } = await supabase.from('profiles').upsert(
    {
      id: user.id,
      email: user.email,
      name: 'QA Explorateur·rice',
      role: 'admin',
      organization_id: orgId,
      is_test_account: true,
      preferences: {
        locale: 'fr-FR',
        theme: 'calm',
        onboardingCompleted: true,
        favoriteModules: ['scan', 'music', 'coach'],
      },
      bio: 'Compte automatisé pour valider les flux QA sans données cliniques sensibles.',
    },
    { onConflict: 'id' }
  );

  if (error) {
    throw error;
  }
}

async function ensureMembership(userId: string, orgId: string) {
  const { error } = await supabase.from('org_memberships').upsert(
    {
      org_id: orgId,
      user_id: userId,
      role: 'admin',
      team_name: TEAM_NAME,
    },
    { onConflict: 'org_id,user_id' }
  );

  if (error) {
    throw error;
  }
}

async function ensureFeatureFlags() {
  const flags = [
    {
      flag_name: 'FF_ORCH_EMPATHY_FLOW',
      instrument_domain: 'orchestration',
      is_enabled: true,
      rollout_percentage: 100,
      metadata: {
        description: 'Parcours orchestration QA activé pour les flux VR et coach.',
      },
    },
    {
      flag_name: 'FF_ASSESS_EMOTIVE_STORY',
      instrument_domain: 'assessments',
      is_enabled: true,
      rollout_percentage: 100,
      metadata: {
        description: 'Questionnaires textuels pour validations end-to-end sans scores numériques.',
      },
    },
  ];

  for (const flag of flags) {
    const { error } = await supabase
      .from('clinical_feature_flags')
      .upsert(flag, { onConflict: 'flag_name' });

    if (error) {
      throw error;
    }
  }
}

async function ensureOrgAssessRollup(orgId: string) {
  const { error } = await supabase
    .from('org_assess_rollups')
    .upsert(
      {
        org_id: orgId,
        period: '2025-QA',
        instrument: 'empathie_collective',
        n: 5,
        text_summary:
          'Les équipes témoignent d’une ambiance apaisée, d’échanges solidaires et d’une progression qualitative ressentie.',
      },
      { onConflict: 'org_id,period,instrument' }
    );

  if (error) {
    throw error;
  }
}

async function ensureMusicSession(userId: string) {
  const { data: existing } = await supabase
    .from('music_sessions')
    .select('id')
    .eq('user_id', userId)
    .contains('suno_track_ids', ['seed-ec-e2e'])
    .maybeSingle();

  if (existing) {
    return;
  }

  const { error } = await supabase.from('music_sessions').insert({
    user_id: userId,
    mood_tag: 'harmonie sereine',
    suno_track_ids: ['seed-ec-e2e'],
  });

  if (error) {
    throw error;
  }
}

async function main() {
  const organization = await ensureOrganization();
  const user = await ensureAuthUser(TEST_USER_EMAIL);

  await ensureProfile(user, organization.id);
  await ensureMembership(user.id, organization.id);
  await ensureFeatureFlags();
  await ensureOrgAssessRollup(organization.id);
  await ensureMusicSession(user.id);

  console.log('Seed completed', {
    organization: organization.name,
    domain: organization.domain,
    user: user.email,
    team: TEAM_NAME,
  });
}

main().catch((error) => {
  console.error('Seed failed', error);
  process.exit(1);
});
