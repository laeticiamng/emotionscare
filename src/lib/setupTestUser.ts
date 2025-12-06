
import { supabase } from './supabase-client';

async function seedTestUser() {
  // Check if the user already exists in our profiles or a similar table
  const { data: existing, error: selectErr } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', 'personneltest@example.com')
    .single();

  if (selectErr) {
    // If the error is not "no rows returned", it's a real error
    if (selectErr.code !== 'PGRST116') {
      console.error('Impossible de vérifier l\'existence du test user :', selectErr);
    }
    
    // Continue to try creating the user as it might not exist
  } else if (existing) {
    console.log('🟢 Utilisateur PersonnelTest déjà présent, rien à faire.');
    return;
  }

  // Create test user
  const testId = '00000000-0000-0000-0000-000000000001'; // Fixed UUID for reproducibility
  const { data, error: insertErr } = await supabase
    .from('profiles')
    .insert({
      id: testId,
      email: 'personneltest@example.com',
      role: 'Médecin', // Using the proper enum value from UserRole
      name: 'PersonnelTest',
    })
    .select('id, email, role, name')
    .single();

  if (insertErr || !data) {
    console.error('❌ Échec création PersonnelTest :', insertErr);
  } else {
    console.log('✅ Test user créé :', data);
  }
}

// Run at app startup to seed
seedTestUser()
  .then(() => console.log('Seed terminé'))
  .catch(console.error);
