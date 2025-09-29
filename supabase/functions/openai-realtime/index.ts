import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    console.log('🎤 Starting OpenAI Realtime WebSocket proxy...');
    
    // Extract the WebSocket upgrade headers
    const upgrade = req.headers.get('upgrade');
    if (upgrade !== 'websocket') {
      return new Response('Expected WebSocket', { status: 426 });
    }

    const { socket, response } = Deno.upgradeWebSocket(req);
    
    // Connect to OpenAI Realtime API
    const openAIWs = new WebSocket(
      'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01',
      [],
      {
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'OpenAI-Beta': 'realtime=v1'
        }
      }
    );

    let sessionCreated = false;

    // Forward messages from client to OpenAI
    socket.onmessage = (event) => {
      console.log('📤 Client -> OpenAI:', event.data);
      if (openAIWs.readyState === WebSocket.OPEN) {
        openAIWs.send(event.data);
      }
    };

    // Forward messages from OpenAI to client
    openAIWs.onmessage = (event) => {
      console.log('📥 OpenAI -> Client:', event.data);
      const data = JSON.parse(event.data);
      
      // Send session.update after receiving session.created
      if (data.type === 'session.created' && !sessionCreated) {
        sessionCreated = true;
        console.log('🎯 Session created, sending configuration...');
        
        const sessionUpdate = {
          type: 'session.update',
          session: {
            modalities: ['text', 'audio'],
            instructions: `Tu es un assistant vocal EmotionsCare, spécialisé dans le bien-être émotionnel et la santé mentale. 
            Tu aides les utilisateurs avec empathie et bienveillance. Tu peux:
            - Analyser leurs émotions et proposer des conseils
            - Suggérer des exercices de respiration
            - Recommander de la musique thérapeutique
            - Offrir un soutien émotionnel
            
            Réponds toujours en français et avec chaleur humaine.`,
            voice: 'alloy',
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
                name: 'analyze_emotion',
                description: 'Analyser l\'état émotionnel de l\'utilisateur et proposer des recommandations',
                parameters: {
                  type: 'object',
                  properties: {
                    emotion: { type: 'string', description: 'L\'émotion principale détectée' },
                    intensity: { type: 'number', description: 'Intensité de 1 à 10' },
                    context: { type: 'string', description: 'Contexte ou situation' }
                  },
                  required: ['emotion', 'intensity']
                }
              },
              {
                type: 'function',
                name: 'suggest_music',
                description: 'Suggérer de la musique thérapeutique basée sur l\'état émotionnel',
                parameters: {
                  type: 'object',
                  properties: {
                    mood: { type: 'string', description: 'Humeur actuelle' },
                    goal: { type: 'string', description: 'Objectif thérapeutique (relaxation, énergie, etc.)' }
                  },
                  required: ['mood', 'goal']
                }
              },
              {
                type: 'function',
                name: 'breathing_exercise',
                description: 'Guider un exercice de respiration personnalisé',
                parameters: {
                  type: 'object',
                  properties: {
                    technique: { type: 'string', description: 'Type d\'exercice (4-7-8, cohérence cardiaque, etc.)' },
                    duration: { type: 'number', description: 'Durée en minutes' }
                  },
                  required: ['technique']
                }
              }
            ],
            tool_choice: 'auto',
            temperature: 0.8,
            max_response_output_tokens: 'inf'
          }
        };
        
        openAIWs.send(JSON.stringify(sessionUpdate));
      }
      
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(event.data);
      }
    };

    // Handle connection events
    socket.onopen = () => {
      console.log('🔗 Client WebSocket connected');
    };

    socket.onclose = () => {
      console.log('🔌 Client WebSocket disconnected');
      if (openAIWs.readyState === WebSocket.OPEN) {
        openAIWs.close();
      }
    };

    socket.onerror = (error) => {
      console.error('❌ Client WebSocket error:', error);
    };

    openAIWs.onopen = () => {
      console.log('🤖 Connected to OpenAI Realtime API');
    };

    openAIWs.onclose = () => {
      console.log('🤖 Disconnected from OpenAI Realtime API');
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };

    openAIWs.onerror = (error) => {
      console.error('❌ OpenAI WebSocket error:', error);
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };

    return response;

  } catch (error) {
    console.error('❌ Realtime proxy error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});