// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Templates de génération d'histoires basées sur les intentions
const generateStoryContent = (intentions: string[], style: string = 'relaxation') => {
  const intentionText = intentions.join(', ');
  
  const templates: Record<string, (words: string[]) => string> = {
    relaxation: (words) => `
Dans un espace hors du temps, vous découvrez un sanctuaire façonné par vos propres pensées.

${words[0] ? `La première essence, celle de "${words[0]}", vous enveloppe comme une brume douce et légère. Elle porte en elle tout ce dont vous avez besoin en cet instant.` : ''}

${words[1] ? `Puis vient "${words[1]}", qui danse autour de vous en spirales apaisantes. Chaque mouvement dissout les tensions que vous portiez sans le savoir.` : ''}

${words[2] ? `Enfin, "${words[2]}" se révèle comme une lumière intérieure, illuminant les recoins de votre être avec une tendresse infinie.` : ''}

Votre respiration s'harmonise naturellement avec ce récit qui vous appartient. Chaque inspiration vous remplit de cette énergie nouvelle, chaque expiration libère ce qui ne vous sert plus.

Vous êtes exactement là où vous devez être. Ce moment est le vôtre.
    `.trim(),
    
    adventure: (words) => `
Le portail s'ouvre devant vous, révélant un monde où les règles sont réécrites par l'imagination.

${words[0] ? `Votre première découverte : un cristal de "${words[0]}" qui pulse d'une énergie ancienne. Il reconnaît quelque chose en vous.` : ''}

${words[1] ? `Le chemin vous mène vers "${words[1]}", gardé par des créatures bienveillantes qui vous saluent comme un ami de longue date.` : ''}

${words[2] ? `Au cœur de ce royaume, "${words[2]}" vous attend - la réponse que vous cherchiez depuis toujours.` : ''}

Cette aventure n'est que le début. À chaque respiration, vous devenez plus fort, plus sage, plus vous-même.
    `.trim(),
    
    meditation: (words) => `
Fermez les yeux. Laissez le monde extérieur s'estomper.

${words[0] ? `"${words[0]}" - ce mot résonne dans le silence. Pas comme un son, mais comme une sensation qui traverse chaque cellule de votre corps.` : ''}

${words[1] ? `"${words[1]}" rejoint la première vibration, créant une harmonie que seul votre cœur peut entendre.` : ''}

${words[2] ? `Et "${words[2]}" complète cette trinité, formant un cercle parfait de paix intérieure.` : ''}

Ici, dans cet espace sacré, vous êtes complet. Vous êtes en paix. Vous êtes chez vous.
    `.trim()
  };
  
  const template = templates[style] || templates.relaxation;
  return template(intentions);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname;

    // Endpoint principal POST pour génération directe d'histoire
    if ((path === '/' || path === '') && req.method === 'POST') {
      const { intentions, style = 'relaxation', duration = 'medium' } = await req.json();
      
      if (!intentions || !Array.isArray(intentions) || intentions.length === 0) {
        return new Response(JSON.stringify({ 
          error: 'Au moins une intention est requise' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const validIntentions = intentions.filter((i: string) => i && i.trim());
      const storyId = `story_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      const content = generateStoryContent(validIntentions, style);
      
      // Calcul de la durée en fonction du paramètre
      const durationMap: Record<string, number> = {
        short: 120,
        medium: 300,
        long: 600
      };
      const durationSeconds = durationMap[duration] || 300;
      
      const story = {
        id: storyId,
        title: `Voyage de ${validIntentions.slice(0, 2).join(' & ')}`,
        content,
        intentions: validIntentions,
        style,
        duration: durationSeconds,
        createdAt: new Date().toISOString()
      };

      console.log('Generated story:', { id: storyId, intentions: validIntentions, style });

      return new Response(JSON.stringify(story), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Endpoint pour démarrer une session interactive
    if (path === '/story/start' && req.method === 'POST') {
      const { genre, language = 'fr', intensity = 'epic' } = await req.json();
      
      const sessionId = `story_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      const coverUrl = `https://picsum.photos/400/600?random=${sessionId}`;
      const sseUrl = `/story/stream/${sessionId}`;

      return new Response(JSON.stringify({
        session_id: sessionId,
        cover_url: coverUrl,
        sse_url: sseUrl
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (path.startsWith('/story/stream/') && req.method === 'GET') {
      const sessionId = path.split('/')[3];
      
      const headers = {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      };

      const stream = new ReadableStream({
        start(controller) {
          const chapterData = {
            type: 'chapter',
            payload: {
              id: 'ch1',
              text: 'Dans les confins de l\'espace, votre vaisseau dérive silencieusement vers une station mystérieuse. Les écrans clignotent faiblement, et vous sentez que quelque chose d\'extraordinaire vous attend...',
              art_url: `https://picsum.photos/600/400?random=ch1_${sessionId}`
            }
          };
          
          controller.enqueue(`data: ${JSON.stringify(chapterData)}\n\n`);

          setTimeout(() => {
            const choicesData = {
              type: 'choices',
              payload: {
                items: [
                  { id: 'ch1_courage', label: 'Avancer courageusement vers la station' },
                  { id: 'ch1_analyze', label: 'Analyser les signaux avant de bouger' },
                  { id: 'ch1_retreat', label: 'Faire demi-tour prudemment' }
                ]
              }
            };
            controller.enqueue(`data: ${JSON.stringify(choicesData)}\n\n`);
          }, 2000);

          setTimeout(() => {
            const musicData = {
              type: 'music',
              payload: {
                track_url: 'https://www.soundjay.com/misc/sounds/beep-07a.wav'
              }
            };
            controller.enqueue(`data: ${JSON.stringify(musicData)}\n\n`);
          }, 3000);
        }
      });

      return new Response(stream, { headers });
    }

    if (path === '/story/choice' && req.method === 'POST') {
      const { session_id, choice_id } = await req.json();
      console.log('Choice made:', { session_id, choice_id });
      
      return new Response(JSON.stringify({ ack: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (path === '/story/export' && req.method === 'POST') {
      const { session_id, format = 'mp3', include_artwork = true } = await req.json();
      
      const downloadUrl = `https://example.com/exports/${session_id}.${format}`;
      const transcriptUrl = `https://example.com/transcripts/${session_id}.json`;
      
      return new Response(JSON.stringify({
        download_url: downloadUrl,
        transcript_url: transcriptUrl
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });

  } catch (error) {
    console.error('Error in story-synth function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});