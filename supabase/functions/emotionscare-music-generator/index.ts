
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { emotion, intensity = 0.7 } = await req.json()
    
    console.log(`🎵 EmotionsCare Music Generator - Génération pour émotion: ${emotion}, intensité: ${intensity}`)

    // Mapping des émotions vers des fichiers audio réels
    const emotionAudioMap = {
      calm: '/sounds/nature-calm.mp3',
      energetic: '/sounds/upbeat-energy.mp3', 
      focused: '/sounds/focus-ambient.mp3',
      happy: '/sounds/upbeat-energy.mp3',
      sad: '/sounds/nature-calm.mp3',
      angry: '/sounds/upbeat-energy.mp3',
      anxious: '/sounds/nature-calm.mp3',
      confident: '/sounds/upbeat-energy.mp3'
    }

    // Générer une playlist complète basée sur l'émotion
    const generatePlaylist = (targetEmotion: string) => {
      const baseAudio = emotionAudioMap[targetEmotion as keyof typeof emotionAudioMap] || '/sounds/ambient-calm.mp3'
      
      const tracks = []
      for (let i = 1; i <= 8; i++) {
        tracks.push({
          id: `${targetEmotion}-track-${i}`,
          title: `${getEmotionTitle(targetEmotion)} ${i}`,
          artist: getEmotionArtist(targetEmotion),
          url: baseAudio,
          audioUrl: baseAudio, // Pour compatibilité
          duration: Math.floor(Math.random() * 240) + 120, // 2-6 minutes
          emotion: targetEmotion,
          energy: getEnergyLevel(targetEmotion),
          valence: getValence(targetEmotion),
          bpm: getBpm(targetEmotion),
          genre: getGenre(targetEmotion),
          mood: targetEmotion,
          therapeuticBenefits: getTherapeuticBenefits(targetEmotion),
          recommendedContext: getRecommendedContext(targetEmotion)
        })
      }
      return tracks
    }

    function getEmotionTitle(emotion: string): string {
      const titles = {
        calm: 'Sérénité',
        energetic: 'Dynamisme', 
        focused: 'Concentration',
        happy: 'Joie',
        sad: 'Mélancolie',
        angry: 'Libération',
        anxious: 'Apaisement',
        confident: 'Assurance'
      }
      return titles[emotion as keyof typeof titles] || 'Harmonie'
    }

    function getEmotionArtist(emotion: string): string {
      const artists = {
        calm: 'Nature Therapy',
        energetic: 'Energy Boost',
        focused: 'Deep Focus', 
        happy: 'Joy Collective',
        sad: 'Healing Sounds',
        angry: 'Release Therapy',
        anxious: 'Calm Mind',
        confident: 'Power Vibes'
      }
      return artists[emotion as keyof typeof artists] || 'Therapeutic Music'
    }

    function getEnergyLevel(emotion: string): number {
      const energyMap = {
        calm: 0.2, energetic: 0.9, focused: 0.5, happy: 0.8,
        sad: 0.3, angry: 0.7, anxious: 0.4, confident: 0.7
      }
      return energyMap[emotion as keyof typeof energyMap] || 0.5
    }

    function getValence(emotion: string): number {
      const valenceMap = {
        calm: 0.6, energetic: 0.8, focused: 0.5, happy: 0.9,
        sad: 0.2, angry: 0.3, anxious: 0.3, confident: 0.8
      }
      return valenceMap[emotion as keyof typeof valenceMap] || 0.5
    }

    function getBpm(emotion: string): number {
      const bpmMap = {
        calm: 70, energetic: 130, focused: 80, happy: 120,
        sad: 60, angry: 140, anxious: 75, confident: 110
      }
      return bpmMap[emotion as keyof typeof bpmMap] || 80
    }

    function getGenre(emotion: string): string {
      const genreMap = {
        calm: 'Ambient', energetic: 'Electronic', focused: 'Minimal',
        happy: 'Pop', sad: 'Acoustic', angry: 'Rock', 
        anxious: 'New Age', confident: 'Upbeat'
      }
      return genreMap[emotion as keyof typeof genreMap] || 'Ambient'
    }

    function getTherapeuticBenefits(emotion: string): string[] {
      const benefitsMap = {
        calm: ['Réduction du stress', 'Relaxation profonde', 'Amélioration du sommeil'],
        energetic: ['Boost de motivation', 'Amélioration de l\'humeur', 'Augmentation de l\'énergie'],
        focused: ['Amélioration de la concentration', 'Productivité accrue', 'Clarté mentale'],
        happy: ['Élévation de l\'humeur', 'Sentiment de bien-être', 'Optimisme'],
        sad: ['Libération émotionnelle', 'Acceptation', 'Guérison intérieure'],
        angry: ['Canalisation de la colère', 'Libération des tensions', 'Équilibre émotionnel'],
        anxious: ['Réduction de l\'anxiété', 'Calme intérieur', 'Stabilité émotionnelle'],
        confident: ['Renforcement de la confiance', 'Empowerment', 'Assurance personnelle']
      }
      return benefitsMap[emotion as keyof typeof benefitsMap] || ['Bien-être général']
    }

    function getRecommendedContext(emotion: string): string[] {
      const contextMap = {
        calm: ['Méditation', 'Avant le coucher', 'Moments de détente'],
        energetic: ['Sport', 'Réveil', 'Motivation matinale'],
        focused: ['Travail', 'Étude', 'Tâches importantes'],
        happy: ['Célébration', 'Moments sociaux', 'Loisirs'],
        sad: ['Introspection', 'Moments difficiles', 'Thérapie'],
        angry: ['Défoulement', 'Sport intense', 'Libération'],
        anxious: ['Stress', 'Préparation d\'examen', 'Situations difficiles'],
        confident: ['Présentation', 'Entretien', 'Défis personnels']
      }
      return contextMap[emotion as keyof typeof contextMap] || ['Usage général']
    }

    const playlist = {
      id: `playlist-${Date.now()}`,
      name: `Thérapie ${emotion.charAt(0).toUpperCase() + emotion.slice(1)}`,
      emotion: emotion,
      description: `Playlist thérapeutique personnalisée pour l'état émotionnel ${emotion}`,
      tracks: generatePlaylist(emotion),
      intensity: intensity,
      createdAt: new Date().toISOString(),
      therapeuticProfile: {
        targetEmotion: emotion,
        intensity: intensity,
        expectedBenefits: getTherapeuticBenefits(emotion),
        recommendedUsage: getRecommendedContext(emotion),
        sessionDuration: '15-30 minutes',
        adaptationLevel: 'Personnalisé'
      }
    }

    console.log(`✅ Playlist générée avec succès: ${playlist.tracks.length} morceaux pour ${emotion}`)

    return new Response(
      JSON.stringify(playlist),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Erreur dans emotionscare-music-generator:', error)
    return new Response(
      JSON.stringify({ error: 'Erreur lors de la génération musicale' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
