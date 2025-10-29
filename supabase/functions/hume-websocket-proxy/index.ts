// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, upgrade',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  const HUME_API_KEY = Deno.env.get('HUME_API_KEY');
  if (!HUME_API_KEY) {
    return new Response("HUME_API_KEY not configured", { status: 500 });
  }

  // Upgrade client connection
  const { socket: clientSocket, response } = Deno.upgradeWebSocket(req);
  
  let humeSocket: WebSocket | null = null;

  clientSocket.onopen = async () => {
    console.log('[hume-proxy] Client connected, connecting to Hume...');
    
    try {
      // Connect to Hume WebSocket with API key
      humeSocket = new WebSocket(`wss://api.hume.ai/v0/stream/models?apiKey=${HUME_API_KEY}`);
      
      humeSocket.onopen = () => {
        console.log('[hume-proxy] Connected to Hume AI');
        clientSocket.send(JSON.stringify({ type: 'connected', message: 'Connected to Hume AI' }));
      };

      humeSocket.onmessage = (event) => {
        // Forward Hume messages to client
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
    // Forward client messages to Hume
    if (humeSocket && humeSocket.readyState === WebSocket.OPEN) {
      humeSocket.send(event.data);
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
});
