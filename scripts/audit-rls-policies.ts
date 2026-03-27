// @ts-nocheck
#!/usr/bin/env tsx
/**
 * Audit RLS Policies Supabase
 * Vérifie que toutes les tables sensibles ont des RLS policies
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yaincoxihiqdksxgrsrk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU';

const supabase = createClient(supabaseUrl, supabaseKey);

// Tables critiques qui DOIVENT avoir RLS
const CRITICAL_TABLES = [
  'profiles',
  'scan_face',
  'scan_voice',
  'scan_text',
  'journal_entries',
  'music_generations',
  'coach_sessions',
  'meditation_sessions',
  'org_memberships',
  'team_emotion_summary',
];

interface TableInfo {
  table_name: string;
  has_rls: boolean;
  policies_count: number;
  status: 'OK' | 'WARNING' | 'CRITICAL';
}

async function auditRLSPolicies() {
  console.log('🔒 AUDIT RLS POLICIES - Supabase\n');
  console.log('═'.repeat(60) + '\n');

  const results: TableInfo[] = [];

  for (const tableName of CRITICAL_TABLES) {
    console.log(`Vérification: ${tableName}...`);
    
    // Note: Avec anon key, on ne peut pas interroger pg_policies directement
    // On va vérifier indirectement en tentant un accès
    
    try {
      // Tentative de lecture (devrait échouer si RLS bien configuré et user non auth)
      const { error } = await supabase.from(tableName).select('*').limit(1);
      
      let status: 'OK' | 'WARNING' | 'CRITICAL' = 'OK';
      let has_rls = true;
      
      if (error) {
        if (error.message.includes('permission denied') || 
            error.message.includes('RLS')) {
          // RLS actif (bon signe)
          status = 'OK';
          has_rls = true;
        } else if (error.message.includes('does not exist')) {
          // Table n'existe pas encore
          status = 'WARNING';
          has_rls = false;
        } else {
          // Autre erreur
          status = 'WARNING';
          has_rls = false;
        }
      } else {
        // Pas d'erreur = RLS peut-être manquant ou table vide
        status = 'WARNING';
        has_rls = false;
      }
      
      results.push({
        table_name: tableName,
        has_rls,
        policies_count: -1, // Non déterminable avec anon key
        status,
      });
      
      console.log(`  ${status === 'OK' ? '✓' : '⚠️'} ${tableName}: ${status}\n`);
    } catch (err) {
      console.log(`  ❌ Erreur: ${tableName}\n`);
      results.push({
        table_name: tableName,
        has_rls: false,
        policies_count: 0,
        status: 'CRITICAL',
      });
    }
  }

  // Synthèse
  console.log('\n' + '═'.repeat(60));
  console.log('\n📊 SYNTHÈSE RLS POLICIES\n');
  
  const ok = results.filter(r => r.status === 'OK').length;
  const warnings = results.filter(r => r.status === 'WARNING').length;
  const critical = results.filter(r => r.status === 'CRITICAL').length;
  
  console.log(`  ✓ Tables OK : ${ok}`);
  console.log(`  ⚠️  Warnings : ${warnings}`);
  console.log(`  ❌ Critical : ${critical}`);
  
  console.log('\n💡 Note: Audit complet nécessite service_role key');
  console.log('   Pour audit détaillé, utiliser Supabase Dashboard > SQL Editor\n');
  
  if (critical > 0) {
    console.log('❌ Certaines tables critiques nécessitent RLS !\n');
    process.exit(1);
  } else if (warnings > 0) {
    console.log('⚠️  Vérification manuelle recommandée\n');
    process.exit(0);
  } else {
    console.log('✅ RLS semble configuré sur tables critiques\n');
    process.exit(0);
  }
}

auditRLSPolicies().catch(console.error);
