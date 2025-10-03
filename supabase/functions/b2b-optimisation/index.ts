import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import {
  buildCorsHeaders,
  getAuthContext,
  isSuiteEnabled,
  jsonResponse,
  serviceClient,
} from '../_shared/b2b.ts';

const instrumentLabels: Record<string, string> = {
  WEMWBS: 'Équilibre émotionnel',
  CBI: 'Prévention du surmenage',
  UWES: 'Engagement au travail',
};

function enforceSuiteEnabled(req: Request) {
  if (!isSuiteEnabled()) {
    throw jsonResponse(req, 404, { error: 'not_found' });
  }
}

function sanitizeText(value: string): string {
  return value.replace(/\d+/g, '').replace(/\s+/g, ' ').trim();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: buildCorsHeaders(req) });
  }

  try {
    enforceSuiteEnabled(req);

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

    const url = new URL(req.url);
    const period = url.searchParams.get('period');
    if (period && !/^\d{4}-\d{2}$/.test(period)) {
      return jsonResponse(req, 400, { error: 'invalid_period' });
    }

    let query = serviceClient
      .from('org_assess_rollups')
      .select('instrument, period, text_summary')
      .eq('org_id', auth.orgId)
      .not('text_summary', 'is', null)
      .order('period', { ascending: false })
      .order('instrument', { ascending: true })
      .limit(12);

    if (period) {
      query = query.eq('period', period);
    }

    const { data, error } = await query;
    if (error) {
      console.error('[b2b] optimisation query failed', error);
      return jsonResponse(req, 500, { error: 'query_failed' });
    }

    const suggestions = (data ?? [])
      .map((row, index) => ({
        id: `${row.instrument}-${index}`,
        title: instrumentLabels[row.instrument] ?? 'Optimisation',
        period: row.period,
        description: sanitizeText(row.text_summary ?? '').slice(0, 280),
      }))
      .filter((item) => item.description.length > 0)
      .slice(0, 6);

    return jsonResponse(req, 200, { suggestions });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error('[b2b] optimisation error', error);
    return jsonResponse(req, 500, { error: 'unexpected_error' });
  }
});
