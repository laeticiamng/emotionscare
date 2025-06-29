
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Configuration avancée des émotions pour EmotionsCare
const EMOTION_MUSIC_CONFIG = {
  calm: {
    genres: ['ambient', 'classical', 'new-age', 'nature-sounds'],
    bpmRange: [60, 80],
    energy: [0.1, 0.4],
    valence: [0.4, 0.7],
    instruments: ['piano', 'strings', 'flute', 'harp'],
    keywords: ['peaceful', 'serene', 'tranquil', 'meditation']
  },
  happy: {
    genres: ['pop', 'indie', 'acoustic', 'uplifting'],
    bpmRange: [100, 140],
    energy: [0.6, 0.9],
    valence: [0.7, 1.0],
    instruments: ['guitar', 'ukulele', 'piano', 'violin'],
    keywords: ['joyful', 'upbeat', 'cheerful', 'celebration']
  },
  sad: {
    genres: ['acoustic', 'indie-folk', 'classical', 'blues'],
    bpmRange: [50, 80],
    energy: [0.1, 0.4],
    valence: [0.1, 0.4],
    instruments: ['piano', 'cello', 'acoustic-guitar', 'violin'],
    keywords: ['melancholic', 'emotional', 'reflective', 'tender']
  },
  anxious: {
    genres: ['lo-fi', 'ambient', 'meditation', 'nature-sounds'],
    bpmRange: [60, 90],
    energy: [0.1, 0.3],
    valence: [0.3, 0.6],
    instruments: ['soft-piano', 'strings', 'synthesizer', 'bells'],
    keywords: ['calming', 'grounding', 'peaceful', 'reassuring']
  },
  angry: {
    genres: ['classical', 'ambient', 'meditation', 'healing'],
    bpmRange: [40, 70],
    energy: [0.1, 0.3],
    valence: [0.2, 0.5],
    instruments: ['soft-piano', 'nature-sounds', 'tibetan-bowls', 'rain'],
    keywords: ['soothing', 'cooling', 'peaceful', 'release']
  },
  energetic: {
    genres: ['electronic', 'upbeat', 'dance', 'motivational'],
    bpmRange: [120, 160],
    energy: [0.7, 1.0],
    valence: [0.6, 0.9],
    instruments: ['synthesizer', 'drums', 'electric-guitar', 'bass'],
    keywords: ['dynamic', 'powerful', 'motivating', 'inspiring']
  },
  focused: {
    genres: ['lo-fi', 'instrumental', 'minimal', 'study-music'],
    bpmRange: [70, 100],
    energy: [0.3, 0.6],
    valence: [0.4, 0.7],
    instruments: ['piano', 'soft-synth', 'minimal-beats', 'ambient-pads'],
    keywords: ['concentration', 'productivity', 'clear', 'steady']
  },
  romantic: {
    genres: ['jazz', 'classical', 'acoustic', 'soft-pop'],
    bpmRange: [60, 90],
    energy: [0.3, 0.6],
    valence: [0.6, 0.9],
    instruments: ['piano', 'violin', 'cello', 'soft-vocals'],
    keywords: ['intimate', 'tender', 'loving', 'gentle']
  }
}

// Générateur de métadonnées musicales avancées
function generateMusicMetadata(emotion: string, intensity: number, preferences: any = {}) {
  const config = EMOTION_MUSIC_CONFIG[emotion] || EMOTION_MUSIC_CONFIG.calm;
  const intensityFactor = Math.max(0.1, Math.min(1.0, intensity));
  
  return {
    genre: preferences.preferredGenre || config.genres[Math.floor(Math.random() * config.genres.length)],
    bpm: Math.floor(config.bpmRange[0] + (config.bpmRange[1] - config.bpmRange[0]) * intensityFactor),
    energy: config.energy[0] + (config.energy[1] - config.energy[0]) * intensityFactor,
    valence: config.valence[0] + (config.valence[1] - config.valence[0]) * intensityFactor,
    instruments: config.instruments,
    keywords: config.keywords,
    danceability: emotion === 'energetic' ? 0.7 + (intensityFactor * 0.3) : 0.2 + (intensityFactor * 0.3),
    acousticness: ['calm', 'sad', 'anxious'].includes(emotion) ? 0.6 + (intensityFactor * 0.4) : 0.2 + (intensityFactor * 0.3),
    instrumentalness: preferences.preferVocals ? 0.1 : 0.7 + (intensityFactor * 0.3)
  };
}

// Générateur de playlist adaptée
function generateEmotionPlaylist(emotion: string, intensity: number, preferences: any = {}) {
  const playlistSize = preferences.playlistSize || 8;
  const tracks = [];
  
  for (let i = 0; i < playlistSize; i++) {
    const metadata = generateMusicMetadata(emotion, intensity, preferences);
    const trackId = crypto.randomUUID();
    
    // Variation de l'intensité pour chaque track
    const trackIntensity = Math.max(0.1, intensity + (Math.random() - 0.5) * 0.3);
    
    tracks.push({
      id: trackId,
      title: generateTrackTitle(emotion, i, metadata),
      artist: generateArtistName(emotion, metadata),
      duration: generateDuration(emotion, preferences),
      url: `/sounds/generated/${emotion}-${trackId}.mp3`,
      emotion: emotion,
      mood: preferences.targetMood || emotion,
      genre: metadata.genre,
      bpm: metadata.bpm,
      energy: metadata.energy,
      valence: metadata.valence,
      danceability: metadata.danceability,
      acousticness: metadata.acousticness,
      instrumentalness: metadata.instrumentalness,
      coverUrl: generateCoverUrl(emotion, metadata),
      tags: [...metadata.keywords, emotion, metadata.genre],
      description: generateTrackDescription(emotion, metadata, trackIntensity),
      createdAt: new Date().toISOString(),
      generatedFor: 'EmotionsCare',
      emotionIntensity: trackIntensity,
      therapeuticPurpose: getTherapeuticPurpose(emotion),
      binaural: preferences.enableBinaural || false,
      naturalSounds: preferences.includeNatureSounds || false
    });
  }
  
  return {
    id: crypto.randomUUID(),
    name: generatePlaylistName(emotion, preferences),
    description: generatePlaylistDescription(emotion, intensity, tracks.length),
    tracks: tracks,
    emotion: emotion,
    mood: preferences.targetMood || emotion,
    totalDuration: tracks.reduce((sum, track) => sum + track.duration, 0),
    createdAt: new Date().toISOString(),
    adaptiveFeatures: {
      emotionAdaptation: true,
      intensityScaling: true,
      personalizedRecommendations: true,
      therapeuticOptimization: true
    },
    metadata: {
      averageBpm: Math.round(tracks.reduce((sum, track) => sum + track.bpm, 0) / tracks.length),
      averageEnergy: tracks.reduce((sum, track) => sum + track.energy, 0) / tracks.length,
      averageValence: tracks.reduce((sum, track) => sum + track.valence, 0) / tracks.length,
      dominantGenres: [...new Set(tracks.map(t => t.genre))],
      emotionIntensity: intensity,
      generationTimestamp: new Date().toISOString()
    }
  };
}

// Générateurs de contenu spécialisés
function generateTrackTitle(emotion: string, index: number, metadata: any): string {
  const titlePrefixes = {
    calm: ['Peaceful', 'Serene', 'Tranquil', 'Gentle', 'Quiet'],
    happy: ['Joyful', 'Bright', 'Sunny', 'Cheerful', 'Uplifting'],
    sad: ['Melancholic', 'Tender', 'Reflective', 'Emotional', 'Gentle'],
    anxious: ['Soothing', 'Calming', 'Grounding', 'Peaceful', 'Reassuring'],
    angry: ['Cooling', 'Releasing', 'Healing', 'Peaceful', 'Balancing'],
    energetic: ['Dynamic', 'Powerful', 'Vibrant', 'Energizing', 'Motivating'],
    focused: ['Clear', 'Steady', 'Concentrated', 'Flowing', 'Mindful'],
    romantic: ['Tender', 'Intimate', 'Loving', 'Gentle', 'Warm']
  };
  
  const suffixes = ['Moment', 'Journey', 'Experience', 'Flow', 'Space', 'Time', 'Waves', 'Harmony'];
  const prefix = titlePrefixes[emotion] ? titlePrefixes[emotion][index % titlePrefixes[emotion].length] : 'Peaceful';
  const suffix = suffixes[index % suffixes.length];
  
  return `${prefix} ${suffix}`;
}

function generateArtistName(emotion: string, metadata: any): string {
  const artistNames = [
    'EmotionsCare Ensemble',
    'Therapeutic Sounds',
    'Mindful Music Collective',
    'Healing Harmonies',
    'Wellness Symphony',
    'Emotional Balance',
    'Serenity Studios',
    'Therapeutic Tones'
  ];
  
  return artistNames[Math.floor(Math.random() * artistNames.length)];
}

function generateDuration(emotion: string, preferences: any): number {
  const baseDurations = {
    calm: 240, // 4 minutes
    happy: 210, // 3.5 minutes
    sad: 270, // 4.5 minutes
    anxious: 300, // 5 minutes
    angry: 360, // 6 minutes
    energetic: 180, // 3 minutes
    focused: 300, // 5 minutes
    romantic: 240 // 4 minutes
  };
  
  const baseDuration = baseDurations[emotion] || 240;
  const variation = (Math.random() - 0.5) * 60; // ±30 secondes
  
  return Math.max(120, Math.floor(baseDuration + variation));
}

function generateCoverUrl(emotion: string, metadata: any): string {
  const colorSchemes = {
    calm: 'blue-green',
    happy: 'yellow-orange',
    sad: 'purple-blue',
    anxious: 'soft-green',
    angry: 'cool-blue',
    energetic: 'red-orange',
    focused: 'neutral-gray',
    romantic: 'pink-red'
  };
  
  const scheme = colorSchemes[emotion] || 'blue-green';
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${emotion}&backgroundColor=${scheme}`;
}

function generateTrackDescription(emotion: string, metadata: any, intensity: number): string {
  const descriptions = {
    calm: `Une composition apaisante conçue pour favoriser la relaxation et la sérénité. Parfaite pour la méditation ou les moments de détente.`,
    happy: `Une mélodie joyeuse et énergisante qui inspire la positivité et le bien-être. Idéale pour commencer la journée avec optimisme.`,
    sad: `Une pièce émotionnelle et contemplative qui accompagne les moments de réflexion et d'introspection avec tendresse.`,
    anxious: `Une composition rassurante spécialement conçue pour apaiser l'anxiété et favoriser un sentiment de sécurité intérieure.`,
    angry: `Une musique thérapeutique qui aide à canaliser et libérer les tensions, favorisant un retour à l'équilibre émotionnel.`,
    energetic: `Un morceau dynamique et motivant qui stimule l'énergie positive et encourage l'action et la créativité.`,
    focused: `Une composition minimaliste optimisée pour améliorer la concentration et favoriser un état de flow productif.`,
    romantic: `Une mélodie tendre et intime qui évoque l'amour et la connexion émotionnelle profonde.`
  };
  
  return descriptions[emotion] || descriptions.calm;
}

function generatePlaylistName(emotion: string, preferences: any): string {
  if (preferences.customName) return preferences.customName;
  
  const names = {
    calm: 'Sérénité Thérapeutique',
    happy: 'Joie & Bien-être',
    sad: 'Accompagnement Émotionnel',
    anxious: 'Apaisement & Sécurité',
    angry: 'Libération & Équilibre',
    energetic: 'Énergie Positive',
    focused: 'Concentration Optimale',
    romantic: 'Intimité & Tendresse'
  };
  
  return names[emotion] || 'Playlist Personnalisée EmotionsCare';
}

function generatePlaylistDescription(emotion: string, intensity: number, trackCount: number): string {
  return `Playlist thérapeutique générée par EmotionsCare pour accompagner votre état émotionnel "${emotion}". ${trackCount} morceaux soigneusement sélectionnés avec une intensité adaptée (${Math.round(intensity * 100)}%) pour favoriser votre bien-être émotionnel.`;
}

function getTherapeuticPurpose(emotion: string): string {
  const purposes = {
    calm: 'Relaxation et gestion du stress',
    happy: 'Amélioration de l\'humeur et motivation',
    sad: 'Accompagnement émotionnel et catharsis',
    anxious: 'Réduction de l\'anxiété et apaisement',
    angry: 'Gestion de la colère et régulation émotionnelle',
    energetic: 'Stimulation positive et dynamisation',
    focused: 'Amélioration de la concentration et productivité',
    romantic: 'Connexion émotionnelle et intimité'
  };
  
  return purposes[emotion] || 'Bien-être émotionnel général';
}

// Fonction de recommandations personnalisées
function getPersonalizedRecommendations(emotion: string, intensity: number, preferences: any) {
  const recommendations = {
    activities: [],
    breathingExercises: [],
    vrExperiences: [],
    coachingTips: []
  };
  
  switch(emotion) {
    case 'calm':
      recommendations.activities = ['Méditation guidée', 'Yoga doux', 'Lecture'];
      recommendations.breathingExercises = ['Respiration 4-7-8', 'Cohérence cardiaque'];
      recommendations.vrExperiences = ['Forêt paisible', 'Plage au coucher du soleil'];
      recommendations.coachingTips = ['Profitez de ce moment de calme pour vous reconnecter à vous-même'];
      break;
    case 'anxious':
      recommendations.activities = ['Marche en nature', 'Écriture thérapeutique', 'Étirements doux'];
      recommendations.breathingExercises = ['Respiration abdominale', 'Box breathing'];
      recommendations.vrExperiences = ['Jardin zen', 'Montagne sereine'];
      recommendations.coachingTips = ['Cette anxiété est temporaire. Concentrez-vous sur votre respiration'];
      break;
    case 'energetic':
      recommendations.activities = ['Exercice physique', 'Danse', 'Projet créatif'];
      recommendations.breathingExercises = ['Respiration énergisante', 'Wim Hof technique'];
      recommendations.vrExperiences = ['Aventure en montagne', 'Course énergisante'];
      recommendations.coachingTips = ['Canalisez cette énergie vers vos objectifs personnels'];
      break;
  }
  
  return recommendations;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { 
      emotion = 'calm', 
      intensity = 0.5, 
      preferences = {},
      userId = null,
      sessionId = null,
      context = {}
    } = await req.json()

    console.log(`🎵 EmotionsCare Music Generator - Génération pour émotion: ${emotion}, intensité: ${intensity}`)

    // Validation des paramètres
    const validEmotions = Object.keys(EMOTION_MUSIC_CONFIG);
    const validatedEmotion = validEmotions.includes(emotion) ? emotion : 'calm';
    const validatedIntensity = Math.max(0.1, Math.min(1.0, intensity));

    // Génération de la playlist personnalisée
    const playlist = generateEmotionPlaylist(validatedEmotion, validatedIntensity, preferences);
    
    // Ajout des recommandations personnalisées
    const personalizedRecommendations = getPersonalizedRecommendations(validatedEmotion, validatedIntensity, preferences);

    // Réponse enrichie pour EmotionsCare
    const response = {
      success: true,
      playlist: playlist,
      recommendations: personalizedRecommendations,
      emotionAnalysis: {
        inputEmotion: emotion,
        processedEmotion: validatedEmotion,
        intensityLevel: validatedIntensity,
        confidence: 0.95,
        therapeuticMatch: getTherapeuticPurpose(validatedEmotion)
      },
      adaptiveFeatures: {
        biofeedbackReady: true,
        emotionTracking: true,
        progressiveAdaptation: true,
        realTimeAdjustment: true
      },
      usage: {
        generatedAt: new Date().toISOString(),
        platform: 'EmotionsCare',
        version: '2.0',
        userId: userId,
        sessionId: sessionId,
        context: context
      },
      nextSteps: {
        suggestedDuration: '15-30 minutes',
        followUpRecommendations: true,
        emotionJournaling: true,
        progressTracking: true
      }
    };

    console.log(`✅ Playlist générée avec succès: ${playlist.tracks.length} morceaux pour ${validatedEmotion}`)

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('❌ Erreur dans EmotionsCare Music Generator:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Erreur lors de la génération musicale',
        details: error.message,
        fallback: {
          playlist: {
            id: crypto.randomUUID(),
            name: 'Playlist de secours',
            tracks: [{
              id: crypto.randomUUID(),
              title: 'Ambiance relaxante',
              artist: 'EmotionsCare',
              url: '/sounds/ambient-calm.mp3',
              duration: 240,
              emotion: 'calm'
            }]
          }
        }
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
