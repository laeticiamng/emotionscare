import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { buildCorsHeaders, getAuthContext, isSuiteEnabled, jsonResponse, serviceClient } from '../_shared/b2b.ts';

function isHeatmapEnabled(): boolean {
  return (Deno.env.get('FF_B2B_HEATMAP') ?? 'false').toLowerCase() === 'true';
}

const PERIOD_PATTERN = /^[0-9]{4}-(0[1-9]|1[0-2])$/;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: buildCorsHeaders(req) });
  }

  try {
    if (!isSuiteEnabled() || !isHeatmapEnabled()) {
      return jsonResponse(req, 404, { error: 'not_found' });
    }

    if (req.method !== 'GET') {
      return jsonResponse(req, 405, { error: 'method_not_allowed' });
    }

    const auth = await getAuthContext(req).catch((error) => {
      if (error instanceof Response) return error;
      return jsonResponse(req, 401, { error: 'unauthorized' });
    });

    if (auth instanceof Response) {
      return auth;
    }

    if (auth.orgRole !== 'admin' && auth.orgRole !== 'manager') {
      return jsonResponse(req, 403, { error: 'forbidden' });
    }

    const { data, error } = await serviceClient
      .from('org_heatmap_mv')
      .select('period', { distinct: true })
      .eq('org_id', auth.orgId)
      .order('period', { ascending: false })
      .limit(24);

    if (error) {
      console.error('[b2b:heatmap-periods] failed to load periods', { error: error.message });
      return jsonResponse(req, 500, { error: 'query_failed' });
    }

    const periods = (data ?? [])
      .map((row) => (typeof row.period === 'string' ? row.period : null))
      .filter((value): value is string => Boolean(value) && PERIOD_PATTERN.test(value));

    const unique = Array.from(new Set(periods));

    return jsonResponse(req, 200, { periods: unique });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error('[b2b:heatmap-periods] unexpected error', { error: error instanceof Error ? error.message : 'unknown' });
    return jsonResponse(req, 500, { error: 'unexpected_error' });
  }
});
