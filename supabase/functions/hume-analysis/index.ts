
/**
 * hume-analysis - Analyse émotionnelle via Hume AI
 *
 * 🔒 SÉCURISÉ: Auth + Rate limit 15/min + CORS restrictif + Validation Zod
 */

// @ts-nocheck
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { authenticateRequest } from '../_shared/auth-middleware.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';
import { validateRequest, createErrorResponse, HumeAnalysisSchema } from '../_shared/validation.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  // 1. CORS check
  const corsResult = cors(req);
  const corsHeaders = {
    ...corsResult.headers,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };

  if (req.method === 'OPTIONS') {
    return preflightResponse(corsResult);
  }

  // Vérification CORS stricte
  if (!corsResult.allowed) {
    console.warn('[hume-analysis] CORS rejected - origin not allowed');
    return rejectCors(corsResult);
  }

  try {
    // 🔒 SÉCURITÉ: Authentification obligatoire
    const authResult = await authenticateRequest(req);
    if (authResult.status !== 200 || !authResult.user) {
      console.warn('[hume-analysis] Unauthorized access attempt');
      return createErrorResponse(authResult.error || 'Authentication required', authResult.status, corsHeaders);
    }

    // 🛡️ SÉCURITÉ: Rate limiting strict (15 req/min - Hume AI API)
    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'hume-analysis',
      userId: authResult.user.id,
      limit: 15,
      windowMs: 60_000,
      description: 'Hume AI emotion analysis'
    });

    if (!rateLimit.allowed) {
      console.warn('[hume-analysis] Rate limit exceeded', { userId: authResult.user.id });
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop de requêtes Hume. Réessayez dans ${rateLimit.retryAfterSeconds}s.`
      });
    }

    // ✅ VALIDATION: Validation Zod des entrées
    const validation = await validateRequest(req, HumeAnalysisSchema);
    if (!validation.success) {
      return createErrorResponse(validation.error, validation.status, corsHeaders);
    }

    const { audioData, analysisType } = validation.data;

    const humeApiKey = Deno.env.get('HUME_API_KEY');
    if (!humeApiKey) {
      console.warn('[hume-analysis] HUME_API_KEY not configured, returning mock data');

      // Simulation si pas de clé Hume AI
      const mockAnalysis = {
        emotions: [
          { name: 'joy', confidence: 0.75, intensity: 0.8 },
          { name: 'excitement', confidence: 0.65, intensity: 0.6 },
          { name: 'calm', confidence: 0.55, intensity: 0.4 }
        ],
        dominant_emotion: 'joy',
        overall_sentiment: 'positive',
        confidence_score: 0.82,
        processing_time: 1200,
        timestamp: new Date().toISOString()
      };

      return new Response(
        JSON.stringify({
          success: true,
          analysis: mockAnalysis,
          source: 'simulation'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const startTime = Date.now();

    // ===== REAL HUME AI BATCH API INTEGRATION =====
    // Step 1: Create batch job with audio/image data
    const models: any = {};

    if (analysisType === 'voice' || analysisType === 'multimodal') {
      models.prosody = {};
    }
    if (analysisType === 'facial' || analysisType === 'multimodal') {
      models.face = {};
    }

    const jobResponse = await fetch('https://api.hume.ai/v0/batch/jobs', {
      method: 'POST',
      headers: {
        'X-Hume-Api-Key': humeApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        models,
        transcription: { language: 'fr' },
        urls: [], // Using base64 data instead
        files: [{
          name: 'input',
          data: audioData, // base64 encoded audio or image
        }],
        notify: false, // Don't send webhook notification
      })
    });

    if (!jobResponse.ok) {
      const errorText = await jobResponse.text();
      console.error('[hume-analysis] Hume API job creation error:', errorText);
      throw new Error(`Hume API error: ${jobResponse.status}`);
    }

    const jobData = await jobResponse.json();
    const jobId = jobData.job_id;

    console.log('[hume-analysis] Job created:', jobId);

    // Step 2: Poll for job completion (max 30 seconds)
    let jobCompleted = false;
    let attempts = 0;
    const maxAttempts = 30; // 30 attempts with 1s interval = 30s max

    let predictions: any = null;

    while (!jobCompleted && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second

      const statusResponse = await fetch(`https://api.hume.ai/v0/batch/jobs/${jobId}`, {
        headers: {
          'X-Hume-Api-Key': humeApiKey,
        }
      });

      if (!statusResponse.ok) {
        throw new Error(`Failed to check job status: ${statusResponse.status}`);
      }

      const statusData = await statusResponse.json();

      if (statusData.state === 'COMPLETED') {
        jobCompleted = true;
        predictions = statusData.predictions;
        console.log('[hume-analysis] Job completed successfully');
      } else if (statusData.state === 'FAILED') {
        throw new Error(`Hume job failed: ${statusData.message || 'Unknown error'}`);
      }

      attempts++;
    }

    if (!jobCompleted) {
      throw new Error('Job timeout: Analysis took too long');
    }

    // Step 3: Parse predictions
    const emotions: Array<{ name: string; confidence: number; intensity: number }> = [];
    let dominantEmotion = 'neutral';
    let confidenceScore = 0;

    if (predictions && predictions.length > 0) {
      const firstPrediction = predictions[0];

      // Parse prosody emotions
      if (firstPrediction.models?.prosody?.grouped_predictions?.[0]?.predictions?.[0]?.emotions) {
        const prosodyEmotions = firstPrediction.models.prosody.grouped_predictions[0].predictions[0].emotions;
        prosodyEmotions.forEach((emotion: any) => {
          emotions.push({
            name: emotion.name,
            confidence: emotion.score,
            intensity: emotion.score
          });
        });
      }

      // Parse face emotions
      if (firstPrediction.models?.face?.grouped_predictions?.[0]?.predictions?.[0]?.emotions) {
        const faceEmotions = firstPrediction.models.face.grouped_predictions[0].predictions[0].emotions;
        faceEmotions.forEach((emotion: any) => {
          emotions.push({
            name: emotion.name,
            confidence: emotion.score,
            intensity: emotion.score
          });
        });
      }

      // Find dominant emotion
      if (emotions.length > 0) {
        emotions.sort((a, b) => b.confidence - a.confidence);
        dominantEmotion = emotions[0].name;
        confidenceScore = emotions[0].confidence;
      }
    }

    const processingTime = Date.now() - startTime;

    // Determine sentiment based on dominant emotion
    const positiveEmotions = ['joy', 'excitement', 'happiness', 'contentment', 'amusement', 'love', 'admiration'];
    const negativeEmotions = ['sadness', 'anger', 'fear', 'disgust', 'anxiety', 'disappointment'];

    let sentiment = 'neutral';
    if (positiveEmotions.includes(dominantEmotion.toLowerCase())) {
      sentiment = 'positive';
    } else if (negativeEmotions.includes(dominantEmotion.toLowerCase())) {
      sentiment = 'negative';
    }

    const analysis = {
      emotions: emotions.slice(0, 10), // Top 10 emotions
      dominant_emotion: dominantEmotion,
      overall_sentiment: sentiment,
      confidence_score: confidenceScore,
      processing_time: processingTime,
      timestamp: new Date().toISOString(),
      job_id: jobId
    };

    console.log('[hume-analysis] Analysis complete:', {
      dominant: dominantEmotion,
      confidence: confidenceScore,
      processingTime
    });

    return new Response(
      JSON.stringify({
        success: true,
        analysis,
        source: 'hume_ai'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in hume-analysis function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
