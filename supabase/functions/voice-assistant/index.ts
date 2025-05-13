
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { audioData, currentEmotionalState } = await req.json();

    if (!audioData) {
      throw new Error("Données audio manquantes");
    }

    // 1. Traitement initial pour convertir l'audio en texte via OpenAI Whisper
    console.log("Transcription de l'audio avec Whisper...");
    let transcriptionResponse;
    
    try {
      // Convertir les données base64 en blob
      const audioBlob = await fetch(audioData).then(res => res.blob());
      
      // Créer un FormData pour l'API Whisper
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.webm");
      formData.append("model", "whisper-1");
      formData.append("language", "fr");
      
      transcriptionResponse = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${Deno.env.get('OPENAI_API_KEY')}`
        },
        body: formData
      });
    } catch (error) {
      console.error("Erreur lors de la transcription audio:", error);
      throw new Error("Échec de la transcription audio");
    }

    if (!transcriptionResponse.ok) {
      console.error("Erreur API Whisper:", await transcriptionResponse.text());
      throw new Error(`Erreur API Whisper: ${transcriptionResponse.status}`);
    }

    const transcriptionData = await transcriptionResponse.json();
    const transcribedText = transcriptionData.text;
    
    if (!transcribedText || transcribedText.trim() === '') {
      throw new Error("Aucun texte détecté dans l'audio");
    }

    console.log("Texte transcrit:", transcribedText);

    // 2. Interpréter l'intention avec GPT
    const contextPrompt = `
      Tu es un assistant de navigation vocal pour une application de bien-être émotionnel.
      L'utilisateur vient de dire: "${transcribedText}".
      ${currentEmotionalState ? `Son état émotionnel actuel est: ${currentEmotionalState}.` : ''}
      
      Détermine l'action que l'utilisateur souhaite effectuer dans l'application.
      
      Possibilités d'actions:
      - open_journal: Ouvrir le journal émotionnel
      - start_meditation: Démarrer une séance de méditation
      - play_music: Jouer de la musique adaptée à son état
      - scan_emotion: Lancer un scan émotionnel
      - coach_chat: Discuter avec le coach IA
      - show_dashboard: Afficher le tableau de bord
      - search_content: Rechercher du contenu spécifique
      - help: Afficher l'aide
      - none: Aucune action reconnue
      
      Réponds sous format JSON avec:
      - action: Le code de l'action à effectuer
      - parameters: Paramètres additionnels (durée, type, etc.)
      - confidence: Niveau de confiance (0-1)
      - original_text: Le texte transcrit
      - response_message: Un message court à dire à l'utilisateur pour confirmer l'action
    `;

    const intentResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: contextPrompt },
          { role: "user", content: transcribedText }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!intentResponse.ok) {
      console.error("Erreur API GPT:", await intentResponse.text());
      throw new Error(`Erreur API GPT: ${intentResponse.status}`);
    }

    const intentData = await intentResponse.json();
    const intentResult = JSON.parse(intentData.choices[0].message.content);

    // 3. Retourner les résultats
    console.log("Action détectée:", intentResult.action);
    
    return new Response(
      JSON.stringify({
        success: true,
        transcribedText,
        action: intentResult.action,
        parameters: intentResult.parameters || {},
        confidence: intentResult.confidence,
        responseMessage: intentResult.response_message
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erreur dans la fonction voice-assistant:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Une erreur s'est produite lors du traitement de la commande vocale."
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
