// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, upgrade, sec-websocket-key, sec-websocket-version',
};

serve(async (req) => {
  console.log('[hume-proxy] Request received:', req.method, req.url);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log('[hume-proxy] OPTIONS request, returning CORS headers');
    return new Response(null, { headers: corsHeaders });
  }

  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";
  
  console.log('[hume-proxy] Upgrade header:', upgradeHeader);

  if (upgradeHeader.toLowerCase() !== "websocket") {
    console.error('[hume-proxy] Not a WebSocket request');
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  const HUME_API_KEY = Deno.env.get('HUME_API_KEY');
  if (!HUME_API_KEY) {
    console.error('[hume-proxy] HUME_API_KEY not configured');
    return new Response("HUME_API_KEY not configured", { status: 500 });
  }

  console.log('[hume-proxy] Upgrading to WebSocket...');
  
  try {
    // Upgrade client connection
    const { socket: clientSocket, response } = Deno.upgradeWebSocket(req);
    
    console.log('[hume-proxy] Client WebSocket upgraded');
    
    let humeSocket: WebSocket | null = null;

    clientSocket.onopen = async () => {
      console.log('[hume-proxy] Client connected, connecting to Hume AI...');
      
      try {
        // Connect to Hume WebSocket with API key
        const humeUrl = `wss://api.hume.ai/v0/stream/models?apiKey=${HUME_API_KEY}`;
        console.log('[hume-proxy] Connecting to Hume:', humeUrl.replace(HUME_API_KEY, 'REDACTED'));
        
        humeSocket = new WebSocket(humeUrl);
        
        humeSocket.onopen = () => {
          console.log('[hume-proxy] Connected to Hume AI successfully');
          clientSocket.send(JSON.stringify({ type: 'connected', message: 'Connected to Hume AI' }));
        };

        humeSocket.onmessage = (event) => {
          console.log('[hume-proxy] Message from Hume, forwarding to client');
          clientSocket.send(event.data);
        };

        humeSocket.onerror = (error) => {
          console.error('[hume-proxy] Hume socket error:', error);
          clientSocket.send(JSON.stringify({ type: 'error', message: 'Hume connection error' }));
        };

        humeSocket.onclose = () => {
          console.log('[hume-proxy] Hume socket closed');
          clientSocket.close();
        };
      } catch (error) {
        console.error('[hume-proxy] Error connecting to Hume:', error);
        clientSocket.send(JSON.stringify({ type: 'error', message: 'Failed to connect to Hume' }));
      }
    };

    clientSocket.onmessage = (event) => {
      console.log('[hume-proxy] Message from client, forwarding to Hume');
      if (humeSocket && humeSocket.readyState === WebSocket.OPEN) {
        humeSocket.send(event.data);
      } else {
        console.warn('[hume-proxy] Hume socket not ready, readyState:', humeSocket?.readyState);
      }
    };

    clientSocket.onerror = (error) => {
      console.error('[hume-proxy] Client socket error:', error);
    };

    clientSocket.onclose = () => {
      console.log('[hume-proxy] Client disconnected');
      if (humeSocket) {
        humeSocket.close();
      }
    };

    return response;
  } catch (error) {
    console.error('[hume-proxy] Error upgrading WebSocket:', error);
    return new Response(`WebSocket upgrade failed: ${error.message}`, { status: 500 });
  }
});
