/**
 * Download Audio - Proxy for CORS-safe audio file download
 * Fetches audio from external URL and returns with proper headers
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ALLOWED_ORIGINS = [
  'https://emotionscare.com',
  'https://www.emotionscare.com',
  'https://emotions-care.lovable.app',
  'http://localhost:5173',
];

function getCorsHeaders(req) {
  const origin = req.headers.get('origin') ?? '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: getCorsHeaders(req) });
  }

  try {
    const { audioUrl, filename } = await req.json();

    if (!audioUrl) {
      return new Response(JSON.stringify({ error: 'audioUrl is required' }), {
        status: 400,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    console.log('[download-audio] Fetching:', audioUrl);

    // Validate URL
    let url: URL;
    try {
      url = new URL(audioUrl);
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid URL' }), {
        status: 400,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    // Fetch the audio file
    const response = await fetch(audioUrl, {
      headers: {
        'User-Agent': 'EmotionsCare/1.0',
      },
    });

    if (!response.ok) {
      console.error('[download-audio] Fetch failed:', response.status);
      return new Response(JSON.stringify({ error: `Failed to fetch audio: ${response.status}` }), {
        status: response.status,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    // Get content type
    const contentType = response.headers.get('content-type') || 'audio/mpeg';
    const contentLength = response.headers.get('content-length');

    // Generate filename if not provided
    const finalFilename = filename || `emotionscare-music-${Date.now()}.mp3`;

    // Stream the response
    const headers: Record<string, string> = {
      ...getCorsHeaders(req),
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${finalFilename}"`,
    };

    if (contentLength) {
      headers['Content-Length'] = contentLength;
    }

    console.log('[download-audio] Streaming:', finalFilename, 'Size:', contentLength);

    return new Response(response.body, { headers });

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('[download-audio] Error:', errorMessage);
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
    });
  }
});
