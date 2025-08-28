
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// URLs d'audio de test qui fonctionnent réellement
const WORKING_AUDIO_URLS = {
  calm: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  energetic: 'https://www.soundjay.com/misc/sounds/bell-ringing-01.wav',
  happy: 'https://www.soundjay.com/misc/sounds/bell-ringing-02.wav',
  focus: 'https://www.soundjay.com/misc/sounds/bell-ringing-03.wav',
  relaxed: 'https://www.soundjay.com/misc/sounds/bell-ringing-04.wav'
}

// Fonction pour générer une playlist basée sur l'émotion
function generatePlaylistForEmotion(emotion: string, intensity: number = 0.7) {
  console.log(`🎵 EmotionsCare Music Generator - Génération pour émotion: ${emotion}, intensité: ${intensity}`)
  
  const emotionLower = emotion.toLowerCase()
  
  // Sélectionner l'URL audio appropriée
  const audioUrl = WORKING_AUDIO_URLS[emotionLower as keyof typeof WORKING_AUDIO_URLS] || WORKING_AUDIO_URLS.calm
  
  // Générer une playlist avec plusieurs morceaux
  const tracks = Array.from({ length: 6 + Math.floor(Math.random() * 3) }, (_, i) => ({
    id: `track-${emotion}-${i + 1}`,
    title: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Track ${i + 1}`,
    artist: `AI Composer ${String.fromCharCode(65 + i)}`,
    duration: 180 + Math.floor(Math.random() * 120), // 3-5 minutes
    url: audioUrl,
    audioUrl: audioUrl,
    coverUrl: `https://picsum.photos/300/300?random=${i}`,
    emotion: emotionLower,
    genre: getGenreForEmotion(emotionLower),
    bpm: getBpmForEmotion(emotionLower, intensity),
    energy: intensity,
    valence: getValenceForEmotion(emotionLower)
  }))

  const playlist = {
    id: `playlist-${emotion}-${Date.now()}`,
    name: `Playlist ${emotion.charAt(0).toUpperCase() + emotion.slice(1)}`,
    description: `Musique générée automatiquement pour l'émotion ${emotion}`,
    coverUrl: `https://picsum.photos/400/400?random=${emotion}`,
    emotion: emotionLower,
    mood: emotionLower,
    tracks
  }

  console.log(`✅ Playlist générée avec succès: ${tracks.length} morceaux pour ${emotion}`)
  return playlist
}

function getGenreForEmotion(emotion: string): string {
  const genreMap: { [key: string]: string } = {
    calm: 'ambient',
    energetic: 'electronic',
    happy: 'pop',
    sad: 'acoustic',
    focus: 'lo-fi',
    relaxed: 'chillout'
  }
  return genreMap[emotion] || 'ambient'
}

function getBpmForEmotion(emotion: string, intensity: number): number {
  const baseBpm: { [key: string]: number } = {
    calm: 60,
    energetic: 128,
    happy: 120,
    sad: 70,
    focus: 80,
    relaxed: 65
  }
  const base = baseBpm[emotion] || 80
  return Math.round(base * (0.8 + intensity * 0.4))
}

function getValenceForEmotion(emotion: string): number {
  const valenceMap: { [key: string]: number } = {
    calm: 0.5,
    energetic: 0.8,
    happy: 0.9,
    sad: 0.2,
    focus: 0.6,
    relaxed: 0.7
  }
  return valenceMap[emotion] || 0.5
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { emotion, intensity = 0.7 } = await req.json()

    if (!emotion) {
      return new Response(
        JSON.stringify({ error: 'Emotion parameter is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    const playlist = generatePlaylistForEmotion(emotion, intensity)

    return new Response(
      JSON.stringify(playlist),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error in emotionscare-music-generator:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
