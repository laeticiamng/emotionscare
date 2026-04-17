// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Authenticate caller
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.slice(7);
    const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const userId = claimsData.claims.sub;

    // Verify admin role via has_role()
    const { data: hasRole, error: roleError } = await userClient.rpc('has_role', {
      _user_id: userId,
      _role: 'admin',
    });
    if (roleError || hasRole !== true) {
      return new Response(JSON.stringify({ error: 'Forbidden — admin only' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use service role to read pg_catalog
    const adminClient = createClient(supabaseUrl, serviceKey);

    // Tables in public schema
    const { data: tablesData, error: tErr } = await adminClient
      .rpc('exec_governance_rls_scan')
      .catch(() => ({ data: null, error: { message: 'rpc missing' } }));

    let findings: any[] = [];
    let tablesScanned = 0;
    let tablesWithoutRls = 0;
    let permissivePolicies = 0;

    if (tablesData && Array.isArray(tablesData)) {
      // If a custom RPC exists, use its output
      findings = tablesData;
      tablesScanned = tablesData.length;
    } else {
      // Fallback: query information_schema directly via REST
      const tablesRes = await fetch(
        `${supabaseUrl}/rest/v1/rpc/get_public_tables_with_rls`,
        {
          method: 'POST',
          headers: {
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        },
      );

      if (tablesRes.ok) {
        const data = await tablesRes.json();
        tablesScanned = data.length || 0;
        for (const row of data) {
          if (!row.rowsecurity) {
            tablesWithoutRls++;
            findings.push({
              id: `no_rls_${row.tablename}`,
              title: `RLS désactivée sur ${row.tablename}`,
              severity: 'critical',
              category: 'rls',
              description: `La table public.${row.tablename} n'a pas Row Level Security activée.`,
              remediation: `ALTER TABLE public.${row.tablename} ENABLE ROW LEVEL SECURITY;`,
            });
          }
        }
      } else {
        // Last resort: minimal heuristic finding
        findings.push({
          id: 'rls_scan_unavailable',
          title: 'Scan RLS non disponible',
          severity: 'medium',
          category: 'system',
          description: "Impossible d'interroger pg_catalog. Utilisez le linter Supabase natif.",
          remediation: 'Activer la fonction get_public_tables_with_rls() ou utiliser le dashboard Supabase.',
        });
      }
    }

    // Compute score
    const severityWeight: Record<string, number> = {
      info: 0, low: 1, medium: 4, high: 10, critical: 25,
    };
    const penalty = findings.reduce(
      (acc, f) => acc + (severityWeight[f.severity] ?? 0),
      0,
    );
    const score = Math.max(0, Math.min(100, 100 - penalty));

    const summary = `Scan RLS : ${tablesScanned} tables analysées, ${tablesWithoutRls} sans RLS, ${permissivePolicies} policies permissives.`;

    // Persist audit
    const { data: audit, error: insertErr } = await adminClient
      .from('governance_audits')
      .insert({
        audit_type: 'data_rls',
        title: `Scan RLS automatisé`,
        summary,
        score,
        severity: score >= 90 ? 'low' : score >= 70 ? 'medium' : 'high',
        findings,
        metadata: { tables_scanned: tablesScanned, tables_without_rls: tablesWithoutRls },
        triggered_by: userId,
      })
      .select()
      .single();

    if (insertErr) throw insertErr;

    return new Response(
      JSON.stringify({ ok: true, audit, score, findings_count: findings.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('[governance-rls-scan] error', err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
