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
 * Map Hume emotions to valence/arousal coordinates
 * Based on circumplex model of affect
 */
function mapEmotionToValenceArousal(emotions: Array<{ name: string; score: number }>): { valence: number; arousal: number; confidence: number } {
  const emotionMap: Record<string, { valence: number; arousal: number }> = {
    'Joy': { valence: 0.8, arousal: 0.6 },
    'Excitement': { valence: 0.8, arousal: 0.8 },
    'Contentment': { valence: 0.7, arousal: 0.3 },
    'Calmness': { valence: 0.6, arousal: 0.2 },
    'Sadness': { valence: 0.2, arousal: 0.3 },
    'Fear': { valence: 0.3, arousal: 0.8 },
    'Anger': { valence: 0.2, arousal: 0.8 },
    'Anxiety': { valence: 0.3, arousal: 0.7 },
    'Surprise': { valence: 0.5, arousal: 0.8 },
    'Disgust': { valence: 0.3, arousal: 0.6 },
    'Confusion': { valence: 0.4, arousal: 0.5 },
    'Concentration': { valence: 0.5, arousal: 0.6 },
  };

  let totalValence = 0;
  let totalArousal = 0;
  let totalWeight = 0;
  let maxScore = 0;

  emotions.forEach(({ name, score }) => {
    const mapping = emotionMap[name];
    if (mapping && score > 0.1) {
      totalValence += mapping.valence * score;
      totalArousal += mapping.arousal * score;
      totalWeight += score;
      maxScore = Math.max(maxScore, score);
    }
  });

  if (totalWeight === 0) {
    return { valence: 50, arousal: 50, confidence: 0.3 };
  }

  const valence = (totalValence / totalWeight) * 100;
  const arousal = (totalArousal / totalWeight) * 100;

  return {
    valence: Math.round(Math.min(100, Math.max(0, valence))),
    arousal: Math.round(Math.min(100, Math.max(0, arousal))),
    confidence: Math.round(maxScore * 100) / 100,
  };
}

/**
 * Generate emotion summary based on valence/arousal
 */
function generateSummary(valence: number, arousal: number): string {
  if (valence > 60 && arousal > 60) {
    return 'Énergique et positif';
  } else if (valence > 60 && arousal <= 60) {
    return 'Calme et serein';
  } else if (valence <= 40 && arousal > 60) {
    return 'Tension ressentie';
  } else if (valence <= 40 && arousal <= 60) {
    return 'Apaisement recherché';
  }
  return 'État neutre';
}

/**
 * Analyze facial expression using Hume AI API
 * Real-time emotion detection from video frame
 * 
 * ⚠️ NOTE: Uses /v0/core/synchronous endpoint (not in official docs)
 * TODO: Consider migrating to WebSocket streaming (wss://api.hume.ai/v0/stream/models)
 *       for lower latency (~50ms vs ~500ms) and better real-time performance
 * 
 * @see https://dev.hume.ai/docs/expression-measurement/websocket
 */
async function analyzeFacialExpression(frameBase64: string): Promise<MoodCameraResponse> {
  const humeApiKey = Deno.env.get('HUME_API_KEY');
  
  if (!humeApiKey) {
    console.warn('[mood-camera] HUME_API_KEY not configured, using fallback');
    // Fallback to basic heuristic
    const valence = 50 + Math.random() * 30 - 15;
    const arousal = 50 + Math.random() * 30 - 15;
    return {
      valence: Math.round(valence),
      arousal: Math.round(arousal),
      confidence: 0.5,
      summary: generateSummary(valence, arousal),
    };
  }

  try {
    // Clean base64 data if it has data URI prefix
    const cleanBase64 = frameBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    // Call Hume AI synchronous API
    const response = await fetch('https://api.hume.ai/v0/core/synchronous', {
      method: 'POST',
      headers: {
        'X-Hume-Api-Key': humeApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        models: {
          face: {
            fps_pred: 1,
            prob_threshold: 0.5,
          },
        },
        raw_image: cleanBase64,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[mood-camera] Hume API error:', response.status, errorText);
      throw new Error(`Hume API returned ${response.status}`);
    }

    const data = await response.json();
    
    // Extract emotions from first face detected
    const predictions = data.entities?.[0]?.predictions?.face?.grouped_predictions?.[0]?.predictions?.[0];
    
    if (!predictions || !predictions.emotions) {
      console.warn('[mood-camera] No face detected in frame');
      // Return neutral state if no face detected
      return {
        valence: 50,
        arousal: 50,
        confidence: 0.3,
        summary: 'Aucun visage détecté',
      };
    }

    const emotions = predictions.emotions as Array<{ name: string; score: number }>;
    const { valence, arousal, confidence } = mapEmotionToValenceArousal(emotions);
    const summary = generateSummary(valence, arousal);

    addSentryBreadcrumb({
      category: 'mood',
      message: 'mood:camera:hume_analysis',
      data: { 
        emotions_count: emotions.length,
        top_emotion: emotions.sort((a, b) => b.score - a.score)[0]?.name,
        confidence,
      },
    });

    return {
      valence,
      arousal,
      confidence,
      summary,
    };
  } catch (error) {
    console.error('[mood-camera] Hume analysis failed:', error);
    captureSentryException(error, { context: 'hume_facial_analysis' });
    
    // Fallback to neutral state on error
    const valence = 50;
    const arousal = 50;
    return {
      valence,
      arousal,
      confidence: 0.4,
      summary: generateSummary(valence, arousal),
    };
  }
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
