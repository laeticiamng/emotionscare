
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Types
interface EmotionInput {
  name: string;
  score: number;
  valence?: number;
  arousal?: number;
}

interface AnalgesicPreset {
  presetTag: string;
  tempo: number;
  instrumental: boolean;
  extraPrompt: string;
}

interface HumeEmotionScore {
  name: string;
  score: number;
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Routeur antalgique
const ANALGESIC_ROUTER = (emo: EmotionInput): AnalgesicPreset => {
  const { name, valence = 0, arousal = 0.5 } = emo;

  if (name === "pain" || name === "disgust" || name === "sad") {
    return {
      presetTag: "serene peaceful",
      tempo: 65,
      instrumental: true,
      extraPrompt: "field-recording pluie légère, piano doux reverb, drone basse respirante"
    };
  }

  if (name === "anger" || (arousal > 0.7 && valence < -0.2)) {
    return {
      presetTag: "hopeful uplifting",
      tempo: 72,
      instrumental: false,
      extraPrompt: "cordes chaleureuses, voix douce féminine, paroles en français rassurantes"
    };
  }

  if (name === "anxious" || name === "fear" || arousal > 0.6) {
    return {
      presetTag: "lonely isolated",
      tempo: 60,
      instrumental: true,
      extraPrompt: "pads respirants, bruits roses, pas de percussions marquées"
    };
  }

  return {
    presetTag: "optimistic uplifting",
    tempo: 80,
    instrumental: false,
    extraPrompt: "guitare acoustique douce, ambiance chaleureuse"
  };
};

// Presets simplifiés (principales catégories)
const MAIN_PRESETS = [
  { tag: "serene peaceful", style: "ambient 65 BPM", prompt: "serene peaceful ambient" },
  { tag: "hopeful uplifting", style: "folk 72 BPM", prompt: "hopeful uplifting folk" },
  { tag: "lonely isolated", style: "drone 60 BPM", prompt: "lonely isolated drone" },
  { tag: "optimistic uplifting", style: "acoustic 80 BPM", prompt: "optimistic uplifting acoustic" }
];

// Parcours thérapeutiques
const THERAPEUTIC_PATHS: Record<string, string[]> = {
  sad: ["serene peaceful", "hopeful uplifting", "optimistic uplifting", "optimistic uplifting"],
  anger: ["hopeful uplifting", "serene peaceful", "hopeful uplifting", "optimistic uplifting"],
  fear: ["serene peaceful", "lonely isolated", "hopeful uplifting", "optimistic uplifting"],
  anxious: ["lonely isolated", "serene peaceful", "hopeful uplifting", "optimistic uplifting"],
  pain: ["serene peaceful", "hopeful uplifting", "hopeful uplifting", "optimistic uplifting"],
  neutral: ["serene peaceful", "hopeful uplifting", "optimistic uplifting", "optimistic uplifting"]
};

// Fonction principale
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, text, language = "Français", taskId } = await req.json();
    
    console.log(`🎵 EmotionsCare Antalgique - Action: ${action}`);

    if (action === 'generate-analgesic-track') {
      return await generateAnalgesicTrack(text, language);
    }
    
    if (action === 'generate-therapeutic-sequence') {
      return await generateTherapeuticSequence(text, language);
    }
    
    if (action === 'get-track-status') {
      return await getTrackStatus(taskId);
    }

    throw new Error(`Action inconnue: ${action}`);

  } catch (error) {
    console.error('❌ Erreur EmotionsCare Antalgique:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function generateAnalgesicTrack(text: string, language: string) {
  console.log(`🎵 Génération track antalgique pour: "${text.slice(0, 50)}..."`);
  
  // 1. Analyser émotion avec Hume
  const emotions = await detectEmotion(text);
  const mainEmotion: EmotionInput = {
    name: emotions[0]?.name || "neutral",
    score: emotions[0]?.score || 0.5,
    arousal: emotions[0]?.score || 0.5
  };
  
  // 2. Router vers preset antalgique
  const analgesicPreset = ANALGESIC_ROUTER(mainEmotion);
  
  // 3. Trouver preset correspondant
  const preset = MAIN_PRESETS.find(p => p.tag === analgesicPreset.presetTag) || MAIN_PRESETS[0];
  
  // 4. Générer avec Suno
  const prompt = `${language} | ${preset.style} | mood ${preset.tag} | ${analgesicPreset.extraPrompt} | tempo ${analgesicPreset.tempo} BPM`;
  
  const taskId = await generateSunoMusic({
    prompt,
    style: preset.style,
    title: `${preset.tag} relief`,
    instrumental: analgesicPreset.instrumental
  });
  
  console.log(`✅ Track antalgique généré - Task ID: ${taskId}`);
  
  return new Response(
    JSON.stringify({
      taskId,
      preset: analgesicPreset,
      emotions: [mainEmotion]
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function generateTherapeuticSequence(text: string, language: string) {
  console.log(`🎵 Génération séquence thérapeutique pour: "${text.slice(0, 50)}..."`);
  
  // 1. Analyser émotion
  const emotions = await detectEmotion(text);
  const startEmotion = emotions[0]?.name || "neutral";
  
  // 2. Créer parcours
  const path = THERAPEUTIC_PATHS[startEmotion.toLowerCase()] || THERAPEUTIC_PATHS.neutral;
  const steps = path.map((presetTag, index) => ({
    preset: presetTag,
    tempo: 65 + (index * 5),
    duration: index === 0 ? 30 : 60,
    description: getStepDescription(index)
  }));
  
  const sequence = {
    steps,
    totalDuration: steps.reduce((sum, step) => sum + step.duration, 0),
    startEmotion: path[0],
    targetEmotion: path[path.length - 1]
  };
  
  // 3. Générer premier track avec Suno
  const firstPreset = MAIN_PRESETS.find(p => p.tag === steps[0].preset) || MAIN_PRESETS[0];
  const prompt = `${language} | parcours thérapeutique évolutif | ${firstPreset.style} | mood progression ${sequence.startEmotion} vers ${sequence.targetEmotion} | tempo ${steps[0].tempo} BPM progressif`;
  
  const taskId = await generateSunoMusic({
    prompt,
    style: firstPreset.style,
    title: `Parcours thérapeutique: ${sequence.startEmotion} → ${sequence.targetEmotion}`,
    instrumental: true
  });
  
  console.log(`✅ Séquence thérapeutique générée - Task ID: ${taskId}`);
  
  return new Response(
    JSON.stringify({ taskId, sequence }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

function getStepDescription(stepIndex: number): string {
  const descriptions = [
    "Accueil et reconnaissance de l'émotion",
    "Transition douce vers l'apaisement", 
    "Émergence de l'espoir et du réconfort",
    "Ancrage dans un état positif stable"
  ];
  return descriptions[stepIndex] || "Étape thérapeutique";
}

async function detectEmotion(text: string): Promise<HumeEmotionScore[]> {
  const humeApiKey = Deno.env.get('HUME_API_KEY');
  if (!humeApiKey) {
    throw new Error('HUME_API_KEY not configured');
  }

  const response = await fetch('https://api.hume.ai/v0/core/synchronous', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Hume-Api-Key': humeApiKey,
    },
    body: JSON.stringify({
      models: { emotion: {} },
      raw_text: text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Hume API error: ${response.status}`);
  }

  const data = await response.json();
  return data.entities[0]?.predictions.emotion.emotions || [];
}

async function generateSunoMusic(payload: any): Promise<string> {
  const sunoApiKey = Deno.env.get('SUNO_API_KEY');
  if (!sunoApiKey) {
    throw new Error('SUNO_API_KEY not configured');
  }

  // Utilisation de l'API stable sunoapi.org recommandée
  const response = await fetch('https://api.sunoapi.org/api/v1/music', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sunoApiKey}`,
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      prompt: payload.prompt,
      style: payload.style,
      title: payload.title,
      custom_mode: true, // Mode V4 pour qualité optimale
      instrumental: payload.instrumental || false,
      wait_audio: false, // Streaming pour réponse rapide (20s)
      make_instrumental: payload.instrumental || false,
      model: 'V4_5'
    }),
  });

  if (!response.ok) {
    throw new Error(`Suno API error: ${response.status}`);
  }

  const data = await response.json();
  return data.taskId;
}

async function getTrackStatus(taskId: string) {
  const sunoApiKey = Deno.env.get('SUNO_API_KEY');
  if (!sunoApiKey) {
    throw new Error('SUNO_API_KEY not configured');
  }

  // Utilisation de l'API stable pour vérification du statut
  const response = await fetch(`https://api.sunoapi.org/api/v1/tasks/${taskId}`, {
    headers: {
      'Authorization': `Bearer ${sunoApiKey}`,
      'Accept': 'application/json'
    },
  });

  if (!response.ok) {
    throw new Error(`Suno Task Status Error: ${response.status}`);
  }

  const data = await response.json();
  return new Response(
    JSON.stringify(data),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
