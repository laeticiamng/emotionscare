// @ts-nocheck
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
    const upgrade = req.headers.get("upgrade") || "";
    if (upgrade.toLowerCase() !== "websocket") {
      return new Response("Expected websocket", { status: 426 });
    }

    const { socket, response } = Deno.upgradeWebSocket(req);
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY not configured');
      socket.close(1008, 'API key not configured');
      return response;
    }

    let openAISocket: WebSocket | null = null;
    let sessionCreated = false;

    // Connect to OpenAI Realtime API
    socket.onopen = () => {
      console.log('✅ Client WebSocket connected');
      
      const url = 'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01';
      openAISocket = new WebSocket(url, [
        'realtime',
        `openai-insecure-api-key.${OPENAI_API_KEY}`,
        'openai-beta.realtime-v1'
      ]);

      openAISocket.onopen = () => {
        console.log('✅ Connected to OpenAI Realtime API');
      };

      openAISocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('📨 OpenAI message:', data.type);

        // Send session.update AFTER receiving session.created
        if (data.type === 'session.created' && !sessionCreated) {
          sessionCreated = true;
          console.log('📝 Session created, sending configuration...');
          
          const sessionUpdate = {
            type: 'session.update',
            session: {
              modalities: ['text', 'audio'],
              instructions: `Tu es un assistant vocal pour EmotionsCare. Tu contrôles un lecteur de musique thérapeutique.
              
Commandes disponibles:
- "play" ou "jouer" : démarre la musique
- "pause" : met en pause
- "suivant" ou "next" : piste suivante
- "précédent" ou "previous" : piste précédente
- "génère musique [émotion]" : génère musique adaptée (calme, joyeuse, énergique, etc.)
- "arrête" ou "stop" : arrête la musique

Réponds TOUJOURS en français de manière concise et naturelle. Confirme chaque action vocalement.`,
              voice: 'nova',
              input_audio_format: 'pcm16',
              output_audio_format: 'pcm16',
              input_audio_transcription: {
                model: 'whisper-1'
              },
              turn_detection: {
                type: 'server_vad',
                threshold: 0.5,
                prefix_padding_ms: 300,
                silence_duration_ms: 1000
              },
              tools: [
                {
                  type: 'function',
                  name: 'control_music_player',
                  description: 'Contrôle le lecteur de musique (play, pause, next, previous, stop)',
                  parameters: {
                    type: 'object',
                    properties: {
                      action: {
                        type: 'string',
                        enum: ['play', 'pause', 'next', 'previous', 'stop'],
                        description: 'Action à effectuer sur le player'
                      }
                    },
                    required: ['action']
                  }
                },
                {
                  type: 'function',
                  name: 'generate_music',
                  description: 'Génère de la musique adaptée à une émotion spécifique',
                  parameters: {
                    type: 'object',
                    properties: {
                      emotion: {
                        type: 'string',
                        description: 'Émotion cible (calme, joyeux, énergique, triste, anxieux, créatif, etc.)'
                      },
                      intensity: {
                        type: 'number',
                        description: 'Intensité émotionnelle de 0 à 100',
                        minimum: 0,
                        maximum: 100
                      }
                    },
                    required: ['emotion']
                  }
                }
              ],
              tool_choice: 'auto',
              temperature: 0.8,
              max_response_output_tokens: 'inf'
            }
          };

          openAISocket?.send(JSON.stringify(sessionUpdate));
          console.log('✅ Session configuration sent');
        }

        // Forward all messages to client
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(event.data);
        }
      };

      openAISocket.onerror = (error) => {
        console.error('❌ OpenAI WebSocket error:', error);
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: 'error',
            error: 'OpenAI connection error'
          }));
        }
      };

      openAISocket.onclose = () => {
        console.log('🔌 OpenAI WebSocket closed');
        if (socket.readyState === WebSocket.OPEN) {
          socket.close();
        }
      };
    };

    // Forward client messages to OpenAI
    socket.onmessage = (event) => {
      if (openAISocket?.readyState === WebSocket.OPEN) {
        console.log('📤 Forwarding client message to OpenAI');
        openAISocket.send(event.data);
      }
    };

    socket.onerror = (error) => {
      console.error('❌ Client WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('🔌 Client WebSocket closed');
      openAISocket?.close();
    };

    return response;

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorDetails = error instanceof Error ? error.stack : String(error);
    console.error('❌ Error in realtime-voice-commands:', errorMessage, errorDetails);
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      }
    );
  }
});
