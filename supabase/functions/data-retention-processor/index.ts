// @ts-nocheck
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': req.headers.get('Origin') || '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { manual } = await req.json().catch(() => ({ manual: false }));

    console.log(`[Data Retention] Starting ${manual ? 'manual' : 'automatic'} process`);

    // Fetch all retention rules
    const { data: rules, error: rulesError } = await supabase
      .from('data_retention_rules')
      .select('*');

    if (rulesError) throw rulesError;

    let totalArchived = 0;
    let totalDeleted = 0;
    const results = [];

    for (const rule of rules || []) {
      console.log(`[Data Retention] Processing rule for ${rule.entity_type}`);

      // Step 1: Archive expired data if archive_enabled
      if (rule.archive_enabled) {
        const { data: archiveResult, error: archiveError } = await supabase.rpc(
          'archive_expired_data',
          {
            p_entity_type: rule.entity_type,
            p_retention_days: rule.retention_days,
          }
        );

        if (!archiveError && archiveResult?.[0]?.archived_count) {
          totalArchived += archiveResult[0].archived_count;
          console.log(`[Data Retention] Archived ${archiveResult[0].archived_count} ${rule.entity_type}`);
        }
      }

      // Step 2: Send notifications for upcoming expirations
      const notificationDate = new Date();
      notificationDate.setDate(notificationDate.getDate() + rule.notification_days_before);

      // Find data that will expire soon
      let tableName = rule.entity_type;
      const { data: expiringData, error: expiringError } = await supabase
        .from(tableName)
        .select('id, user_id, created_at')
        .lt('created_at', new Date(Date.now() - rule.retention_days * 24 * 60 * 60 * 1000 + rule.notification_days_before * 24 * 60 * 60 * 1000).toISOString())
        .gte('created_at', new Date(Date.now() - rule.retention_days * 24 * 60 * 60 * 1000).toISOString())
        .limit(1000);

      if (!expiringError && expiringData && expiringData.length > 0) {
        // Group by user
        const userGroups = expiringData.reduce((acc, item) => {
          if (!acc[item.user_id]) acc[item.user_id] = [];
          acc[item.user_id].push(item);
          return acc;
        }, {} as Record<string, any[]>);

        // Create notifications for each user
        for (const [userId, items] of Object.entries(userGroups)) {
          const expirationDate = new Date(items[0].created_at);
          expirationDate.setDate(expirationDate.getDate() + rule.retention_days);

          // Check if notification already sent recently
          const { data: existingNotif } = await supabase
            .from('retention_notifications')
            .select('id')
            .eq('user_id', userId)
            .eq('entity_type', rule.entity_type)
            .gte('sent_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
            .single();

          if (!existingNotif) {
            await supabase.from('retention_notifications').insert({
              user_id: userId,
              entity_type: rule.entity_type,
              entities_count: items.length,
              expiration_date: expirationDate.toISOString().split('T')[0],
              notification_type: 'warning',
            });

            console.log(`[Data Retention] Notification sent to user ${userId} for ${items.length} ${rule.entity_type}`);
          }
        }
      }

      // Step 3: Auto-delete if enabled
      if (rule.auto_delete_enabled) {
        // Delete from original table
        const { error: deleteError } = await supabase
          .from(tableName)
          .delete()
          .lt('created_at', new Date(Date.now() - rule.retention_days * 24 * 60 * 60 * 1000).toISOString());

        if (!deleteError) {
          console.log(`[Data Retention] Auto-deleted expired ${rule.entity_type}`);
        }

        // Mark archives as deleted
        const { data: deletedArchives, error: markDeletedError } = await supabase
          .from('data_archives')
          .update({ deleted_at: new Date().toISOString() })
          .eq('entity_type', rule.entity_type)
          .lt('expires_at', new Date().toISOString())
          .is('deleted_at', null)
          .select('id');

        if (!markDeletedError && deletedArchives) {
          totalDeleted += deletedArchives.length;
          console.log(`[Data Retention] Marked ${deletedArchives.length} archives as deleted`);
        }
      }

      results.push({
        entity_type: rule.entity_type,
        archived: rule.archive_enabled,
        auto_deleted: rule.auto_delete_enabled,
      });
    }

    // Log the retention process
    await supabase.from('audit_logs').insert({
      user_id: null,
      action: 'data_retention_process',
      details: {
        manual,
        totalArchived,
        totalDeleted,
        results,
        timestamp: new Date().toISOString(),
      },
    });

    console.log(`[Data Retention] Process completed: ${totalArchived} archived, ${totalDeleted} deleted`);

    return new Response(
      JSON.stringify({
        success: true,
        archived: totalArchived,
        deleted: totalDeleted,
        results,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[Data Retention] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
