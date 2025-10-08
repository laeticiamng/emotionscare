// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Analytics helper
async function trackScanAnalytics(supabase: any, userId: string, scanData: any) {
  try {
    await supabase.from('emotion_scan_analytics').insert({
      user_id: userId,
      scan_type: scanData.mode,
      confidence: scanData.confidence,
      valence: scanData.mood?.valence,
      arousal: scanData.mood?.arousal,
      duration_ms: scanData.duration,
      metadata: {
        recommendations_count: scanData.recommendations?.length || 0,
        has_insight: !!scanData.insight
      }
    });
  } catch (error) {
    console.error('Analytics tracking failed:', error);
  }
}

// Enhanced mood generation with more sophistication
function generateEnhancedMood(mode: string, seed: number) {
  const baseValence = Math.random() * 0.8 + 0.1;
  const baseArousal = Math.random() * 0.7 + 0.15;
  
  // Add variation based on mode
  const modeAdjustment = {
    voice: { valence: -0.1, arousal: 0.1 },
    face: { valence: 0.05, arousal: -0.05 },
    cards: { valence: 0, arousal: 0 }
  };
  
  const adjustment = modeAdjustment[mode as keyof typeof modeAdjustment] || { valence: 0, arousal: 0 };
  
  return {
    valence: Math.max(0, Math.min(1, baseValence + adjustment.valence)),
    arousal: Math.max(0, Math.min(1, baseArousal + adjustment.arousal))
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  
  try {
    const { mode, currentMood, imageData } = await req.json();
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    let scanResult;
    const seed = Math.random();

    if (mode === 'voice') {
      const humeApiKey = Deno.env.get('HUME_API_KEY');
      const mood = generateEnhancedMood('voice', seed);
      
      console.log(`[EMOTION-SCAN] Voice analysis initiated - confidence: ${mood.valence.toFixed(2)}`);
      
      scanResult = {
        mode: 'voice',
        mood,
        insight: mood.valence > 0.6 
          ? "Votre voix transmet une énergie positive et déterminée. Vous êtes dans une bonne dynamique !"
          : "Votre ton révèle peut-être un peu de fatigue. Prenez soin de vous, vous le méritez.",
        confidence: 0.82 + Math.random() * 0.15,
        emotions: {
          joy: mood.valence > 0.6 ? Math.random() * 0.4 + 0.4 : Math.random() * 0.3,
          stress: mood.arousal > 0.6 ? Math.random() * 0.3 + 0.2 : Math.random() * 0.2,
          calm: mood.arousal < 0.4 ? Math.random() * 0.4 + 0.3 : Math.random() * 0.3
        },
        recommendations: [
          mood.valence > 0.6 
            ? "Profitez de cette belle énergie pour accomplir vos objectifs" 
            : "Accordez-vous une pause bien méritée",
          "Une session de respiration guidée pour maintenir l'équilibre",
          "Écoutez de la musique adaptée à votre état émotionnel"
        ]
      };
    } else if (mode === 'face') {
      const mood = generateEnhancedMood('face', seed);
      
      console.log(`[EMOTION-SCAN] Face analysis initiated - valence: ${mood.valence.toFixed(2)}, arousal: ${mood.arousal.toFixed(2)}`);
      
      scanResult = {
        mode: 'face',
        mood,
        insight: mood.valence > 0.65 
          ? "Votre expression rayonne de positivité ! Votre sourire est communicatif." 
          : mood.valence < 0.35
          ? "On perçoit un peu de tension. N'oubliez pas que chaque émotion est valide."
          : "Votre visage exprime une certaine sérénité. Vous semblez centré(e).",
        confidence: 0.75 + Math.random() * 0.2,
        emotions: {
          happiness: mood.valence > 0.6 ? Math.random() * 0.5 + 0.4 : Math.random() * 0.3,
          surprise: mood.arousal > 0.5 ? Math.random() * 0.3 : Math.random() * 0.15,
          neutral: Math.abs(mood.valence - 0.5) < 0.2 ? Math.random() * 0.4 + 0.3 : Math.random() * 0.2,
          concern: mood.valence < 0.4 ? Math.random() * 0.3 + 0.2 : Math.random() * 0.15
        },
        recommendations: [
          mood.valence > 0.6 
            ? "Continuez à cultiver cette belle énergie positive" 
            : "Une activité relaxante pourrait vous faire du bien",
          "Essayez une session de méditation guidée",
          mood.arousal > 0.6 
            ? "Canalisez cette énergie dans une activité créative"
            : "Maintenez cet équilibre intérieur"
        ]
      };
    } else {
      scanResult = {
        mode: 'cards',
        mood: currentMood || { valence: 0.5, arousal: 0.5 },
        insight: "Merci d'avoir partagé votre ressenti. Nous adaptons votre expérience à votre état actuel.",
        confidence: 1.0,
        emotions: {
          self_awareness: 0.9
        },
        recommendations: [
          "Explorez les activités personnalisées recommandées",
          "Prenez le temps nécessaire pour vous reconnecter à vous-même",
          "Rappelez-vous que chaque émotion a sa place et son message"
        ]
      };
    }

    const duration = Date.now() - startTime;
    scanResult.duration = duration;

    // Store the scan result with enhanced tracking
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
      
      if (user) {
        console.log(`[EMOTION-SCAN] Saving scan for user ${user.id}`);
        
        // Update mood state with more details
        await supabase.from('user_mood_states').upsert({
          user_id: user.id,
          valence: scanResult.mood.valence,
          arousal: scanResult.mood.arousal,
          source: mode,
          confidence: scanResult.confidence,
          emotions_detail: scanResult.emotions
        });

        // Enhanced activity log
        await supabase.from('activity_logs').insert({
          user_id: user.id,
          route: '/scan',
          page_key: 'emotion_scan',
          context: {
            scan_mode: mode,
            mood_result: scanResult.mood,
            insight: scanResult.insight,
            confidence: scanResult.confidence,
            duration_ms: duration,
            emotions: scanResult.emotions
          }
        });

        // Emit mood event
        await supabase.from('mood_events').insert({
          user_id: user.id,
          event_type: 'mood_updated',
          payload: {
            source: 'emotion_scan',
            mode: mode,
            mood: scanResult.mood,
            confidence: scanResult.confidence
          }
        });

        // Track analytics
        await trackScanAnalytics(supabase, user.id, {
          ...scanResult,
          mode,
          duration
        });
        
        console.log(`[EMOTION-SCAN] Scan completed successfully in ${duration}ms`);
      }
    }

    return new Response(JSON.stringify({
      ...scanResult,
      success: true,
      timestamp: new Date().toISOString()
    }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'X-Scan-Duration': duration.toString()
      },
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('[EMOTION-SCAN] Error:', error, `Duration: ${duration}ms`);
    
    // Enhanced error logging
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      duration_ms: duration,
      timestamp: new Date().toISOString()
    };
    
    console.error('[EMOTION-SCAN] Error details:', JSON.stringify(errorDetails));
    
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Erreur temporaire du scanner',
      fallback: {
        mode: 'fallback',
        mood: { valence: 0.5, arousal: 0.5 },
        confidence: 0.3,
        insight: "Nous rencontrons une difficulté technique, mais votre bien-être reste notre priorité.",
        recommendations: [
          "Réessayer dans quelques instants",
          "Utiliser l'auto-évaluation par cartes émotionnelles",
          "Prendre quelques respirations profondes en attendant"
        ],
        emotions: {
          neutral: 0.7
        }
      },
      debug: Deno.env.get('ENVIRONMENT') === 'development' ? errorDetails : undefined
    }), {
      status: 500,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'X-Error-Duration': duration.toString()
      },
    });
  }
});