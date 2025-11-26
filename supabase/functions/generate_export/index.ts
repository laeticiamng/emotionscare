// @ts-nocheck
/**
 * generate_export - Génération d'exports de données utilisateur
 *
 * 🔒 SÉCURISÉ: Auth utilisateur + Rate limit 10/min + CORS restrictif
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { withMonitoring } from '../_shared/monitoring-wrapper.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

interface ExportRequest {
  export_type: 'analytics' | 'vr_sessions' | 'breath_sessions' | 'music_history' | 'emotional_logs' | 'custom';
  date_from?: string;
  date_to?: string;
  format?: 'json' | 'csv';
  filters?: Record<string, any>;
}

/**
 * Generic export function for various data types
 * NOT for GDPR exports (use dsar-handler instead)
 * Use cases: analytics exports, custom reports, data analysis
 */
const handler = withMonitoring('generate_export', async (req) => {
  const corsResult = cors(req);
  const corsHeaders = {
    ...corsResult.headers,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };

  if (req.method === 'OPTIONS') {
    return preflightResponse(corsResult);
  }

  if (!corsResult.allowed) {
    return rejectCors(corsResult);
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'generate_export',
      userId: user.id,
      limit: 10,
      windowMs: 60_000,
      description: 'User data export generation',
    });

    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
      });
    }

    const exportRequest: ExportRequest = await req.json();
    const { export_type, date_from, date_to, format = 'json', filters = {} } = exportRequest;

    const dateFrom = date_from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const dateTo = date_to || new Date().toISOString();

    let exportData: any = {};
    let fileName = '';

    // Generate export based on type
    switch (export_type) {
      case 'vr_sessions': {
        const { data: vrSessions } = await supabase
          .from('vr_sessions')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', dateFrom)
          .lte('created_at', dateTo)
          .order('created_at', { ascending: false });

        exportData = {
          export_type: 'vr_sessions',
          user_id: user.id,
          date_range: { from: dateFrom, to: dateTo },
          total_sessions: vrSessions?.length || 0,
          sessions: vrSessions || [],
          generated_at: new Date().toISOString(),
        };
        fileName = `vr-sessions-${user.id}-${Date.now()}`;
        break;
      }

      case 'breath_sessions': {
        const { data: breathSessions } = await supabase
          .from('breath_sessions')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', dateFrom)
          .lte('created_at', dateTo)
          .order('created_at', { ascending: false });

        exportData = {
          export_type: 'breath_sessions',
          user_id: user.id,
          date_range: { from: dateFrom, to: dateTo },
          total_sessions: breathSessions?.length || 0,
          sessions: breathSessions || [],
          generated_at: new Date().toISOString(),
        };
        fileName = `breath-sessions-${user.id}-${Date.now()}`;
        break;
      }

      case 'music_history': {
        const { data: musicHistory } = await supabase
          .from('user_music_preferences')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', dateFrom)
          .lte('created_at', dateTo)
          .order('created_at', { ascending: false });

        exportData = {
          export_type: 'music_history',
          user_id: user.id,
          date_range: { from: dateFrom, to: dateTo },
          preferences: musicHistory || [],
          generated_at: new Date().toISOString(),
        };
        fileName = `music-history-${user.id}-${Date.now()}`;
        break;
      }

      case 'emotional_logs': {
        const { data: emotionalLogs } = await supabase
          .from('emotional_check_ins')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', dateFrom)
          .lte('created_at', dateTo)
          .order('created_at', { ascending: false });

        exportData = {
          export_type: 'emotional_logs',
          user_id: user.id,
          date_range: { from: dateFrom, to: dateTo },
          total_check_ins: emotionalLogs?.length || 0,
          logs: emotionalLogs || [],
          generated_at: new Date().toISOString(),
        };
        fileName = `emotional-logs-${user.id}-${Date.now()}`;
        break;
      }

      case 'analytics': {
        // Comprehensive analytics export
        const [vrData, breathData, musicData, emotionalData] = await Promise.all([
          supabase.from('vr_sessions').select('*').eq('user_id', user.id).gte('created_at', dateFrom).lte('created_at', dateTo),
          supabase.from('breath_sessions').select('*').eq('user_id', user.id).gte('created_at', dateFrom).lte('created_at', dateTo),
          supabase.from('user_music_preferences').select('*').eq('user_id', user.id).gte('created_at', dateFrom).lte('created_at', dateTo),
          supabase.from('emotional_check_ins').select('*').eq('user_id', user.id).gte('created_at', dateFrom).lte('created_at', dateTo),
        ]);

        exportData = {
          export_type: 'analytics',
          user_id: user.id,
          date_range: { from: dateFrom, to: dateTo },
          summary: {
            vr_sessions: vrData.data?.length || 0,
            breath_sessions: breathData.data?.length || 0,
            music_preferences: musicData.data?.length || 0,
            emotional_check_ins: emotionalData.data?.length || 0,
          },
          data: {
            vr_sessions: vrData.data || [],
            breath_sessions: breathData.data || [],
            music_preferences: musicData.data || [],
            emotional_check_ins: emotionalData.data || [],
          },
          generated_at: new Date().toISOString(),
        };
        fileName = `analytics-${user.id}-${Date.now()}`;
        break;
      }

      case 'custom': {
        // Custom export based on filters
        exportData = {
          export_type: 'custom',
          user_id: user.id,
          filters,
          date_range: { from: dateFrom, to: dateTo },
          generated_at: new Date().toISOString(),
          message: 'Custom export - implement specific logic as needed',
        };
        fileName = `custom-export-${user.id}-${Date.now()}`;
        break;
      }

      default:
        return new Response(JSON.stringify({
          error: 'Invalid export type',
          allowed_types: ['analytics', 'vr_sessions', 'breath_sessions', 'music_history', 'emotional_logs', 'custom']
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    // Convert to requested format
    let fileContent: string;
    let contentType: string;

    if (format === 'csv') {
      fileContent = convertToCSV(exportData);
      contentType = 'text/csv';
      fileName += '.csv';
    } else {
      fileContent = JSON.stringify(exportData, null, 2);
      contentType = 'application/json';
      fileName += '.json';
    }

    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('user-exports')
      .upload(fileName, fileContent, {
        contentType,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      // If storage fails, return data directly
      return new Response(JSON.stringify({
        success: true,
        data: exportData,
        note: 'Storage upload failed, returning data directly',
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate signed URL (valid for 1 hour)
    const { data: signedUrlData, error: signedUrlError } = await supabase
      .storage
      .from('user-exports')
      .createSignedUrl(fileName, 60 * 60); // 1 hour

    const downloadUrl = signedUrlData?.signedUrl;

    // Log export in export_jobs table
    await supabase.from('export_jobs').insert({
      user_id: user.id,
      export_type,
      status: 'completed',
      format,
      file_path: fileName,
      completed_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify({
      success: true,
      export_type,
      format,
      download_url: downloadUrl,
      file_name: fileName,
      record_count: exportData.sessions?.length || exportData.logs?.length || exportData.preferences?.length || 0,
      generated_at: exportData.generated_at,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[generate_export] Error:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Export generation failed'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function convertToCSV(data: any): string {
  const sections = [];

  sections.push(`Export Type: ${data.export_type}`);
  sections.push(`User ID: ${data.user_id}`);
  sections.push(`Generated At: ${data.generated_at}`);
  sections.push(`Date Range: ${data.date_range?.from} to ${data.date_range?.to}`);
  sections.push('');

  if (data.sessions) {
    sections.push('Sessions:');
    sections.push('ID,Created At,Duration,Type,Metadata');
    data.sessions.forEach((session: any) => {
      sections.push(`"${session.id}","${session.created_at}","${session.duration || 'N/A'}","${session.type || 'N/A'}","${JSON.stringify(session.metadata || {}).replace(/"/g, '""')}"`);
    });
  }

  if (data.logs) {
    sections.push('Emotional Logs:');
    sections.push('ID,Created At,Emotion,Intensity,Notes');
    data.logs.forEach((log: any) => {
      sections.push(`"${log.id}","${log.created_at}","${log.emotion || 'N/A'}","${log.intensity || 'N/A'}","${log.notes || ''}"`);
    });
  }

  if (data.preferences) {
    sections.push('Music Preferences:');
    sections.push('ID,Created At,Genre,Artist,Track');
    data.preferences.forEach((pref: any) => {
      sections.push(`"${pref.id}","${pref.created_at}","${pref.genre || 'N/A'}","${pref.artist || 'N/A'}","${pref.track || 'N/A'}"`);
    });
  }

  if (data.summary) {
    sections.push('');
    sections.push('Summary:');
    Object.entries(data.summary).forEach(([key, value]) => {
      sections.push(`${key}: ${value}`);
    });
  }

  return sections.join('\n');
}

serve(handler);
