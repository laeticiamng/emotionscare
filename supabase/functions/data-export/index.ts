// @ts-nocheck
/**
 * Data Export - Export RGPD des données utilisateur
 * Permet aux utilisateurs d'exporter toutes leurs données personnelles
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExportData {
  exportedAt: string;
  user: {
    id: string;
    email: string;
  };
  profile?: unknown;
  moods?: unknown[];
  journalEntries?: unknown[];
  breathSessions?: unknown[];
  assessments?: unknown[];
  achievements?: unknown[];
  coachSessions?: unknown[];
  preferences?: unknown;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { format = 'json', sections } = await req.json();
    const requestedSections = sections || ['all'];
    const includeAll = requestedSections.includes('all');

    const exportData: ExportData = {
      exportedAt: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email || 'non disponible'
      }
    };

    // Récupérer toutes les données en parallèle
    const promises: Promise<void>[] = [];

    // Profil
    if (includeAll || requestedSections.includes('profile')) {
      promises.push(
        supabaseClient.from('profiles').select('*').eq('id', user.id).single()
          .then(({ data }) => { exportData.profile = data; })
      );
    }

    // Humeurs
    if (includeAll || requestedSections.includes('moods')) {
      promises.push(
        supabaseClient.from('moods').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
          .then(({ data }) => { exportData.moods = data || []; })
      );
    }

    // Journal
    if (includeAll || requestedSections.includes('journal')) {
      promises.push(
        supabaseClient.from('journal_entries').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
          .then(({ data }) => { exportData.journalEntries = data || []; })
      );
    }

    // Sessions de respiration
    if (includeAll || requestedSections.includes('breath')) {
      promises.push(
        supabaseClient.from('breath_sessions').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
          .then(({ data }) => { exportData.breathSessions = data || []; })
      );
    }

    // Évaluations
    if (includeAll || requestedSections.includes('assessments')) {
      promises.push(
        supabaseClient.from('assessments').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
          .then(({ data }) => { exportData.assessments = data || []; })
      );
    }

    // Achievements
    if (includeAll || requestedSections.includes('achievements')) {
      promises.push(
        supabaseClient.from('user_achievements').select('*, achievements(*)').eq('user_id', user.id)
          .then(({ data }) => { exportData.achievements = data || []; })
      );
    }

    // Sessions coach
    if (includeAll || requestedSections.includes('coach')) {
      promises.push(
        supabaseClient.from('ai_coach_sessions').select('*').eq('user_id', user.id)
          .then(({ data }) => { exportData.coachSessions = data || []; })
      );
    }

    // Préférences utilisateur
    if (includeAll || requestedSections.includes('preferences')) {
      promises.push(
        supabaseClient.from('user_preferences').select('*').eq('user_id', user.id).single()
          .then(({ data }) => { exportData.preferences = data; })
      );
    }

    await Promise.all(promises);

    // Générer le fichier selon le format demandé
    if (format === 'csv') {
      // Export CSV simplifié pour les humeurs
      const csvRows = ['Date,Score,Notes'];
      if (exportData.moods) {
        (exportData.moods as Array<{ created_at: string; score: number; notes?: string }>).forEach(mood => {
          csvRows.push(`${mood.created_at},${mood.score},"${(mood.notes || '').replace(/"/g, '""')}"`);
        });
      }
      
      return new Response(csvRows.join('\n'), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="emotionscare-export-${new Date().toISOString().split('T')[0]}.csv"`
        },
      });
    }

    // Export JSON par défaut
    const jsonString = JSON.stringify(exportData, null, 2);
    
    // Log l'export pour audit
    await supabaseClient.from('data_export_logs').insert({
      user_id: user.id,
      export_type: format,
      sections_exported: requestedSections,
      exported_at: new Date().toISOString()
    }).catch(() => {}); // Silent fail si table n'existe pas

    return new Response(jsonString, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="emotionscare-export-${new Date().toISOString().split('T')[0]}.json"`
      },
    });

  } catch (error) {
    console.error('[data-export] Error:', error);
    return new Response(JSON.stringify({ error: 'Erreur lors de l\'export' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
