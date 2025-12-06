
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Service clients réimplémentés pour Deno
class HumeClient {
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async detectEmotion(text: string) {
    const response = await fetch('https://api.hume.ai/v0/core/synchronous', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hume-Api-Key': this.apiKey,
      },
      body: JSON.stringify({
        models: { emotion: {} },
        raw_text: text,
      }),
    });

    if (!response.ok) {
      throw new Error(`Hume API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.entities[0]?.predictions.emotion.emotions ?? [];
  }
}

class SunoClient {
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateLyrics(prompt: string, callBackUrl?: string) {
    const response = await fetch('https://api.suno.ai/v1/lyrics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        callback_url: callBackUrl,
      }),
    });

    if (!response.ok) {
      throw new Error(`Suno Lyrics API Error: ${response.status}`);
    }

    return await response.json();
  }

  async generateMusic(params: any) {
    // Utilisation de l'API stable sunoapi.org
    const response = await fetch('https://api.sunoapi.org/api/v1/music', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        prompt: params.prompt,
        style: params.style,
        title: params.title,
        custom_mode: true, // Mode V4 pour qualité optimale
        instrumental: params.instrumental || false,
        wait_audio: false, // Streaming pour réponse rapide (20s)
        model: params.model || 'V4_5',
        callback_url: params.callBackUrl,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Suno Music API Error: ${response.status} - ${errorData}`);
    }

    return await response.json();
  }
}

// Presets simplifiés pour Deno
const PRESETS = [
  { tag: "happy upbeat", style: "pop-funk 120 BPM", prompt: "happy upbeat pop-funk with energetic drums and funky bass" },
  { tag: "sad melancholic", style: "piano ballad 70 BPM", prompt: "sad melancholic piano ballad with emotional vocals and minor keys" },
  { tag: "calm peaceful", style: "ambient 70 BPM", prompt: "calm peaceful ambient with soft pads and gentle textures" },
  { tag: "energetic motivated", style: "electronic dance 128 BPM", prompt: "energetic motivated electronic dance with pulsing beats" },
  { tag: "romantic love", style: "soul 80 BPM", prompt: "romantic love soul with warm vocals and smooth arrangements" },
  // ... (autres presets abrégés pour la concision)
];

const EMOTION_MAPPING: Record<string, string> = {
  'joy': 'happy upbeat',
  'happiness': 'happy upbeat',
  'sadness': 'sad melancholic',
  'anger': 'energetic motivated',
  'fear': 'calm peaceful',
  'love': 'romantic love',
  'calm': 'calm peaceful',
  'excitement': 'energetic motivated',
};

function choosePreset(emotions: any[]) {
  if (!emotions || emotions.length === 0) {
    return PRESETS[0];
  }

  const topEmotion = emotions.sort((a, b) => b.score - a.score)[0];
  const mappedTag = EMOTION_MAPPING[topEmotion.name.toLowerCase()];
  
  if (mappedTag) {
    const preset = PRESETS.find(p => p.tag === mappedTag);
    if (preset) return preset;
  }

  return PRESETS[0]; // Default
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { text, language = "English", callBackUrl, userId } = await req.json()
    
    console.log(`🎵 EmotionsCare Text-to-Track: Processing text: "${text?.slice(0, 50)}..."`)

    if (!text || typeof text !== 'string') {
      throw new Error('Text parameter is required and must be a string')
    }

    // Initialize clients
    const humeApiKey = Deno.env.get('HUME_API_KEY')
    const sunoApiKey = Deno.env.get('SUNO_API_KEY')
    
    if (!humeApiKey || !sunoApiKey) {
      throw new Error('Missing required API keys (HUME_API_KEY, SUNO_API_KEY)')
    }

    const hume = new HumeClient(humeApiKey)
    const suno = new SunoClient(sunoApiKey)

    // 1. Analyze emotions with Hume
    console.log('🎭 Analyzing emotions...')
    const emotions = await hume.detectEmotion(text)
    
    // 2. Choose preset
    const preset = choosePreset(emotions)
    console.log(`🎨 Selected preset: "${preset.tag}"`)
    
    // 3. Generate optimized prompt
    const themeText = text.slice(0, 80).replace(/[^\w\s]/gi, '')
    const prompt = `${language} | ${preset.style} | mood ${preset.tag} | theme: ${themeText}`
    
    // 4. Generate lyrics and music
    console.log('🎵 Generating lyrics and music...')
    
    const [lyricsResponse, musicResponse] = await Promise.all([
      suno.generateLyrics(`${preset.prompt} | Theme: ${themeText} | Language: ${language}`, callBackUrl),
      suno.generateMusic({
        prompt,
        style: preset.style,
        title: text.slice(0, 50),
        customMode: false,
        instrumental: false,
        model: "V4_5",
        callBackUrl,
      }),
    ])

    // 5. Save to database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const trackData = {
      suno_audio_id: musicResponse.taskId,
      title: text.slice(0, 50),
      meta: {
        lyricsTaskId: lyricsResponse.taskId,
        musicTaskId: musicResponse.taskId,
        preset,
        emotions: emotions.slice(0, 5),
        originalText: text,
        language,
        userId,
        generatedAt: new Date().toISOString(),
      },
      lyrics: {
        prompt: `${preset.prompt} | Theme: ${themeText} | Language: ${language}`,
        status: 'generating',
      },
    }

    const { data: savedTrack, error: saveError } = await supabase
      .from('emotionscare_songs')
      .insert(trackData)
      .select()
      .single()

    if (saveError) {
      console.error('❌ Error saving track:', saveError)
      throw new Error('Failed to save track to database')
    }

    const response = {
      success: true,
      track: savedTrack,
      lyricsTaskId: lyricsResponse.taskId,
      musicTaskId: musicResponse.taskId,
      preset,
      emotions: emotions.slice(0, 5),
      metadata: {
        originalText: text,
        language,
        timestamp: new Date().toISOString(),
        userId,
      },
    }

    console.log(`✅ EmotionsCare Text-to-Track: Successfully generated track ${savedTrack.id}`)

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )

  } catch (error) {
    console.error('❌ EmotionsCare Text-to-Track Error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
