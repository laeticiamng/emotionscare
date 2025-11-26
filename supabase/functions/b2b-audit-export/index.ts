import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import {
  appendAuditLog,
  buildCorsHeaders,
  getAuthContext,
  isSuiteEnabled,
  jsonResponse,
  serviceClient,
  sha256,
} from '../_shared/b2b.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

const EXPORT_BUCKET = Deno.env.get('B2B_AUDIT_BUCKET') ?? 'b2b-audit-exports';

function enforceSuiteEnabled(req: Request) {
  if (!isSuiteEnabled()) {
    throw jsonResponse(req, 404, { error: 'not_found' });
  }
}

function buildCsv(rows: Array<{ occurred_at: string; event: string; target: string | null; text_summary: string }>) {
  const header = 'occurred_at,event,target,text_summary';
  const sanitize = (value: string | null | undefined) => {
    if (!value) return '';
    return '"' + value.replace(/"/g, '""') + '"';
  };
  const lines = rows.map((row) =>
    [row.occurred_at ?? '', row.event ?? '', row.target ?? '', row.text_summary ?? '']
      .map((value) => sanitize(value))
      .join(','),
  );
  return [header, ...lines].join('\n');
}

serve(async (req) => {
  const corsHeaders = {
    ...buildCorsHeaders(req),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    enforceSuiteEnabled(req);

    if (req.method !== 'POST') {
      return jsonResponse(req, 405, { error: 'method_not_allowed' });
    }

    const auth = await getAuthContext(req).catch((error) => {
      if (error instanceof Response) return error;
      return jsonResponse(req, 401, { error: 'unauthorized' });
    });

    if (auth instanceof Response) {
      return auth;
    }

    if (auth.orgRole !== 'admin') {
      return jsonResponse(req, 403, { error: 'forbidden' });
    }

    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'b2b-audit-export',
      userId: auth.userId,
      limit: 10,
      windowMs: 60_000,
      description: 'B2B audit export API',
    });

    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        error: 'Too many requests',
        retryAfter: rateLimit.retryAfter,
      });
    }

    const { data, error } = await serviceClient
      .from('org_audit_logs')
      .select('occurred_at, event, target, text_summary')
      .eq('org_id', auth.orgId)
      .order('occurred_at', { ascending: false })
      .limit(1000);

    if (error) {
      console.error('[b2b] audit export query failed', error);
      return jsonResponse(req, 500, { error: 'query_failed' });
    }

    const rows = data ?? [];
    const csv = buildCsv(rows);
    const fileName = `audit-${auth.orgId}-${Date.now()}.csv`;
    const filePath = `${auth.orgId}/${fileName}`;

    let signedUrl: string | null = null;
    let expiresAt: string | null = null;
    let fallbackSignature: string | null = null;

    try {
      const blob = new Blob([csv], { type: 'text/csv' });
      const { error: uploadError } = await serviceClient.storage.from(EXPORT_BUCKET).upload(filePath, blob, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'text/csv',
      });

      if (uploadError) {
        throw uploadError;
      }

      const { data: signed } = await serviceClient.storage.from(EXPORT_BUCKET).createSignedUrl(filePath, 900);
      if (signed?.signedUrl) {
        signedUrl = signed.signedUrl;
        expiresAt = new Date(Date.now() + 900 * 1000).toISOString();
      }
    } catch (storageError) {
      console.warn('[b2b] audit export storage fallback', storageError);
      fallbackSignature = await sha256(csv);
    }

    await appendAuditLog({
      orgId: auth.orgId,
      actorId: auth.userId,
      event: 'audit.export.generated',
      target: `org:${auth.orgId}`,
      summary: `Export CSV généré (${rows.length} lignes)`,
    });

    return jsonResponse(req, 200, {
      success: true,
      url: signedUrl,
      expires_at: expiresAt,
      fallback: fallbackSignature ? { signature: fallbackSignature, csv } : null,
    });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error('[b2b] audit export error', error);
    return jsonResponse(req, 500, { error: 'unexpected_error' });
  }
});
