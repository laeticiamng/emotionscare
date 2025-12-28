/**
 * Suno Lyrics - Génération de paroles via API Suno
 * Documentation: https://docs.sunoapi.org/suno-api/generate-lyrics
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUNO_API_BASE = 'https://api.sunoapi.org';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const sunoApiKey = Deno.env.get('SUNO_API_KEY');
    
    if (!sunoApiKey) {
      console.error('[suno-lyrics] No SUNO_API_KEY configured');
      return new Response(JSON.stringify({ 
        success: false,
        error: 'API key not configured'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { action, prompt, taskId } = body;

    // Action: generate lyrics
    if (action === 'generate' || !action) {
      if (!prompt) {
        return new Response(JSON.stringify({ 
          success: false,
          error: 'Prompt is required'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('[suno-lyrics] Generating lyrics with prompt:', prompt);

      const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
      const callBackUrl = `${supabaseUrl}/functions/v1/suno-callback`;

      const response = await fetch(`${SUNO_API_BASE}/api/v1/lyrics`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sunoApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          callBackUrl
        })
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error(`[suno-lyrics] Suno API error ${response.status}:`, errorText);
        return new Response(JSON.stringify({ 
          success: false,
          error: `Suno API error: ${response.status}`
        }), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const data = await response.json();
      console.log('[suno-lyrics] Suno response:', JSON.stringify(data));

      const lyricsTaskId = data?.data?.taskId || data?.taskId;

      return new Response(JSON.stringify({ 
        success: true,
        data: {
          taskId: lyricsTaskId,
          status: 'pending'
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Action: check status
    if (action === 'status') {
      if (!taskId) {
        return new Response(JSON.stringify({ 
          success: false,
          error: 'taskId is required'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('[suno-lyrics] Checking status for taskId:', taskId);

      // Documentation: https://docs.sunoapi.org/suno-api/get-lyrics-generation-details
      const response = await fetch(
        `${SUNO_API_BASE}/api/v1/lyrics/record-info?taskId=${encodeURIComponent(taskId)}`,
        {
          headers: {
            'Authorization': `Bearer ${sunoApiKey}`,
          }
        }
      );

      if (!response.ok) {
        console.error(`[suno-lyrics] Status check failed: ${response.status}`);
        return new Response(JSON.stringify({ 
          success: false,
          error: `Status check failed: ${response.status}`
        }), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const data = await response.json();
      console.log('[suno-lyrics] Status response:', JSON.stringify(data));

      // Parse response - format: { code: 200, data: { status: "SUCCESS", response: { text: "...", title: "..." } } }
      const status = data?.data?.status;
      const lyricsData = data?.data?.response;
      const isComplete = status === 'SUCCESS' || status === 'TEXT_SUCCESS';

      return new Response(JSON.stringify({ 
        success: true,
        data: {
          taskId,
          status: isComplete ? 'completed' : (status?.toLowerCase() || 'pending'),
          lyrics: isComplete ? lyricsData?.text : null,
          title: isComplete ? lyricsData?.title : null,
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      success: false,
      error: `Unknown action: ${action}`
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('[suno-lyrics] Error:', errorMessage);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
