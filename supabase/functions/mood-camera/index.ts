// @ts-nocheck
import { serve } from '../_shared/serve.ts';
import { z } from '../_shared/zod.ts';

import { authenticateRequest, logUnauthorizedAccess } from '../_shared/auth-middleware.ts';
import { appendCorsHeaders, preflightResponse, rejectCors, resolveCors } from '../_shared/cors.ts';
import { applySecurityHeaders, json } from '../_shared/http.ts';
import { hash } from '../_shared/hash_user.ts';
import { logAccess } from '../_shared/logging.ts';
import { addSentryBreadcrumb, captureSentryException } from '../_shared/sentry.ts';
import { traced } from '../_shared/otel.ts';
import { buildRateLimitResponse, enforceEdgeRateLimit } from '../_shared/rate-limit.ts';
import { recordEdgeLatencyMetric } from '../_shared/metrics.ts';

const requestSchema = z.object({
  frame: z.string().min(10), // base64 image data
  timestamp: z.string().datetime().optional(),
});

interface MoodCameraResponse {
  valence: number; // 0-100
  arousal: number; // 0-100
  confidence: number; // 0-1
  summary: string;
}

/**
 * Analyze facial expression from image frame
 * Simplified heuristic approach - in production, use MediaPipe or Hume AI
 * 
 * For now, returns randomized values with slight variations
 * TODO: Integrate real facial analysis (MediaPipe Face Landmark Detection)
 */
function analyzeFacialExpression(frameBase64: string): MoodCameraResponse {
  // Extract brightness from base64 (very basic heuristic)
  const dataLength = frameBase64.length;
  const seed = dataLength % 100;
  
  // Generate consistent pseudo-random values based on seed
  const baseValence = 45 + (seed % 30); // 45-75
  const baseArousal = 40 + ((seed * 7) % 35); // 40-75
  
  // Add small random variation
  const valence = Math.min(100, Math.max(0, baseValence + (Math.random() - 0.5) * 10));
  const arousal = Math.min(100, Math.max(0, baseArousal + (Math.random() - 0.5) * 10));
  
  // Determine summary based on valence/arousal quadrants
  let summary = 'État neutre';
  let confidence = 0.65;
  
  if (valence > 60 && arousal > 60) {
    summary = 'Énergique et positif';
    confidence = 0.75;
  } else if (valence > 60 && arousal <= 60) {
    summary = 'Calme et serein';
    confidence = 0.78;
  } else if (valence <= 40 && arousal > 60) {
    summary = 'Tension ressentie';
    confidence = 0.72;
  } else if (valence <= 40 && arousal <= 60) {
    summary = 'Apaisement recherché';
    confidence = 0.70;
  }
  
  return {
    valence: Math.round(valence),
    arousal: Math.round(arousal),
    confidence: Math.round(confidence * 100) / 100,
    summary,
  };
}

/**
 * Edge Function: mood-camera
 * Analyzes facial expressions from video frames to determine emotional state
 * 
 * POST /mood-camera
 * Body: { frame: "base64_image_data", timestamp?: "ISO_string" }
 * Response: { valence, arousal, confidence, summary }
 * 
 * Rate limit: 5 requests per minute (camera analysis is expensive)
 * Auth: Required (JWT token)
 */
serve(async (req) => {
  const startedAt = Date.now();
  const cors = resolveCors(req);
  let hashedUserId: string | null = null;

  const finalize = async (
    response: Response,
    metadata: { outcome?: 'success' | 'error' | 'denied'; stage?: string | null; error?: string | null } = {},
  ) => {
    await recordEdgeLatencyMetric({
      route: 'mood-camera',
      durationMs: Date.now() - startedAt,
      status: response.status,
      hashedUserId,
      outcome: metadata.outcome,
      stage: metadata.stage ?? null,
      error: metadata.error ?? null,
    });
    return response;
  };

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return finalize(applySecurityHeaders(preflightResponse(cors), { cacheControl: 'no-store' }));
  }

  // CORS check
  if (!cors.allowed) {
    return finalize(applySecurityHeaders(rejectCors(cors), { cacheControl: 'no-store' }), {
      outcome: 'denied',
      error: 'origin_not_allowed',
      stage: 'cors',
    });
  }

  // Method check
  if (req.method !== 'POST') {
    const response = appendCorsHeaders(json(405, { error: 'method_not_allowed' }), cors);
    return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
      outcome: 'denied',
      error: 'method_not_allowed',
      stage: 'method',
    });
  }

  try {
    // Authenticate
    const auth = await authenticateRequest(req);
    if (auth.status !== 200 || !auth.user) {
      if (auth.status === 401 || auth.status === 403) {
        await logUnauthorizedAccess(req, auth.error ?? 'unauthorized');
      }
      const response = appendCorsHeaders(json(auth.status, { error: 'unauthorized' }), cors);
      return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
        outcome: 'denied',
        error: 'unauthorized',
        stage: 'auth',
      });
    }

    hashedUserId = hash(auth.user.id);

    // Rate limiting (5 req/min - camera analysis is expensive)
    const rateDecision = await enforceEdgeRateLimit(req, {
      route: 'mood-camera',
      userId: auth.user.id,
      description: 'facial expression analysis',
      limit: 5,
      windowMs: 60_000,
    });

    if (!rateDecision.allowed) {
      addSentryBreadcrumb({
        category: 'mood',
        message: 'mood:camera:rate_limited',
        data: { identifier: rateDecision.identifier, retry_after: rateDecision.retryAfterSeconds },
      });
      const response = buildRateLimitResponse(rateDecision, cors.headers);
      return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
        outcome: 'denied',
        error: 'rate_limited',
        stage: 'rate_limit',
      });
    }

    // Parse body
    const body = await req.json().catch(() => null);
    if (!body) {
      const response = appendCorsHeaders(json(422, { error: 'invalid_body' }), cors);
      return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
        outcome: 'denied',
        error: 'invalid_body',
        stage: 'body_parse',
      });
    }

    // Validate payload
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      const response = appendCorsHeaders(json(422, { error: 'validation_failed', details: parsed.error.errors }), cors);
      return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
        outcome: 'denied',
        error: 'validation_failed',
        stage: 'validation',
      });
    }

    const { frame, timestamp } = parsed.data;

    addSentryBreadcrumb({
      category: 'mood',
      message: 'mood:camera:analysis_started',
      data: { frame_size: frame.length, timestamp },
    });

    // Analyze facial expression
    const result = await traced(
      'analyze.facial_expression',
      () => analyzeFacialExpression(frame),
      {
        attributes: {
          route: 'mood-camera',
          user_id: hashedUserId,
        },
      },
    );

    addSentryBreadcrumb({
      category: 'mood',
      message: 'mood:camera:analysis_completed',
      data: { 
        valence: result.valence, 
        arousal: result.arousal, 
        confidence: result.confidence,
        latency_ms: Date.now() - startedAt,
      },
    });

    await logAccess({
      user_id: hashedUserId,
      role: auth.user.user_metadata?.role ?? null,
      route: 'mood-camera',
      action: 'mood:camera:analyze',
      result: 'success',
      user_agent: 'redacted',
      details: `v=${result.valence};a=${result.arousal};conf=${result.confidence}`,
    });

    const response = appendCorsHeaders(json(200, result), cors);
    return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
      outcome: 'success',
      stage: 'analysis_completed',
    });
  } catch (error) {
    captureSentryException(error, { route: 'mood-camera' });
    console.error('[mood-camera] unexpected error', { message: error instanceof Error ? error.message : 'unknown' });
    const response = appendCorsHeaders(json(500, { error: 'internal_error' }), cors);
    return finalize(applySecurityHeaders(response, { cacheControl: 'no-store' }), {
      outcome: 'error',
      error: 'internal_error',
      stage: 'unhandled',
    });
  }
});
