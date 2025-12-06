
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MusicGenerationRequest {
  emotion: string;
  intensity?: number;
  genre?: string;
  duration?: number;
  prompt?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body: MusicGenerationRequest = await req.json();
    const { emotion, intensity = 0.5, genre, duration = 120, prompt } = body;

    console.log(`Generating music for emotion: ${emotion}, intensity: ${intensity}`);

    // Generate music based on emotion and parameters
    const musicResult = await generateMusicForEmotion(emotion, intensity, genre, duration, prompt);

    return new Response(
      JSON.stringify(musicResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in music-generation:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        id: null,
        url: null,
        status: 'error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function generateMusicForEmotion(
  emotion: string, 
  intensity: number, 
  genre?: string, 
  duration: number = 120,
  customPrompt?: string
) {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Map emotions to music characteristics
  const emotionMusicMap = {
    happy: {
      tempo: 'upbeat',
      key: 'major',
      instruments: ['piano', 'guitar', 'drums'],
      mood: 'joyful'
    },
    sad: {
      tempo: 'slow',
      key: 'minor',
      instruments: ['piano', 'strings', 'ambient'],
      mood: 'melancholic'
    },
    calm: {
      tempo: 'slow',
      key: 'major',
      instruments: ['ambient', 'nature sounds', 'soft piano'],
      mood: 'peaceful'
    },
    angry: {
      tempo: 'fast',
      key: 'minor',
      instruments: ['electric guitar', 'heavy drums'],
      mood: 'intense'
    },
    anxious: {
      tempo: 'moderate',
      key: 'minor',
      instruments: ['ambient', 'soft strings'],
      mood: 'soothing'
    },
    energetic: {
      tempo: 'fast',
      key: 'major',
      instruments: ['synth', 'drums', 'bass'],
      mood: 'motivating'
    }
  };

  const musicStyle = emotionMusicMap[emotion] || emotionMusicMap.calm;
  
  // Generate music prompt based on emotion and style
  let musicPrompt = customPrompt || generateMusicPrompt(emotion, musicStyle, intensity, genre);

  // In a real implementation, this would call an AI music generation service
  // For now, we return a mock response with metadata
  const generatedMusic = {
    id: `music_${Date.now()}_${emotion}`,
    url: generateMockAudioUrl(emotion, intensity),
    prompt: musicPrompt,
    style: musicStyle.mood,
    duration: duration,
    status: 'generated',
    emotion: emotion,
    intensity: intensity,
    metadata: {
      tempo: musicStyle.tempo,
      key: musicStyle.key,
      instruments: musicStyle.instruments,
      genre: genre || 'ambient',
      generatedAt: new Date().toISOString()
    }
  };

  console.log('Generated music:', generatedMusic);
  return generatedMusic;
}

function generateMusicPrompt(emotion: string, style: any, intensity: number, genre?: string): string {
  const intensityDescriptor = intensity > 0.7 ? 'intense' : intensity > 0.4 ? 'moderate' : 'gentle';
  const genreDescriptor = genre ? `${genre} style` : 'ambient style';
  
  const prompts = {
    happy: `Create an uplifting and ${intensityDescriptor} ${genreDescriptor} track with ${style.tempo} tempo in ${style.key} key. Include ${style.instruments.join(', ')} to create a ${style.mood} atmosphere.`,
    sad: `Compose a ${intensityDescriptor} and emotional ${genreDescriptor} piece with ${style.tempo} tempo in ${style.key} key. Use ${style.instruments.join(', ')} to evoke a ${style.mood} feeling.`,
    calm: `Generate a ${intensityDescriptor} and peaceful ${genreDescriptor} track with ${style.tempo} tempo. Incorporate ${style.instruments.join(', ')} for a ${style.mood} ambiance.`,
    angry: `Create a ${intensityDescriptor} and powerful ${genreDescriptor} composition with ${style.tempo} tempo. Use ${style.instruments.join(', ')} to express ${style.mood} energy.`,
    anxious: `Compose a ${intensityDescriptor} and comforting ${genreDescriptor} piece designed to reduce anxiety. Include ${style.instruments.join(', ')} for a ${style.mood} effect.`,
    energetic: `Generate an ${intensityDescriptor} and dynamic ${genreDescriptor} track with ${style.tempo} tempo. Use ${style.instruments.join(', ')} to create ${style.mood} vibes.`
  };

  return prompts[emotion] || prompts.calm;
}

function generateMockAudioUrl(emotion: string, intensity: number): string {
  // In a real implementation, this would return the actual generated audio URL
  // For demo purposes, we create a data URL or reference to a placeholder
  const mockUrls = {
    happy: '/audio/generated/happy-music.mp3',
    sad: '/audio/generated/sad-music.mp3',
    calm: '/audio/generated/calm-music.mp3',
    angry: '/audio/generated/intense-music.mp3',
    anxious: '/audio/generated/soothing-music.mp3',
    energetic: '/audio/generated/energetic-music.mp3'
  };

  // Return a mock URL that includes emotion and intensity parameters
  const baseUrl = mockUrls[emotion] || mockUrls.calm;
  return `${baseUrl}?intensity=${intensity}&timestamp=${Date.now()}`;
}
