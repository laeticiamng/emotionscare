
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { requireRole } from '../_shared/auth.ts';
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  const user = await requireRole(req, ['b2c', 'b2b_user', 'b2b_admin', 'admin']);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  try {
    const { emojis, text, audio_url, user_context } = await req.json();
    
    // Construct prompt based on available input and user context
    let prompt = "Analyse l'état émotionnel d'un professionnel de santé basé sur les éléments suivants:\n\n";
    if (emojis && emojis.length > 0) {
      prompt += `Emojis utilisés: ${emojis}\n\n`;
    }
    if (text && text.length > 0) {
      prompt += `Texte exprimé: "${text}"\n\n`;
    if (audio_url) {
      prompt += `Un message audio a été enregistré (non accessible pour analyse directe).\n\n`;
    // Add user context if available (historical data, patterns)
    if (user_context) {
      if (user_context.recent_emotions) {
        prompt += `Émotions récentes: ${user_context.recent_emotions}\n\n`;
      }
      if (user_context.emotional_trend) {
        prompt += `Tendance émotionnelle: ${user_context.emotional_trend}\n\n`;
      if (user_context.job_role) {
        prompt += `Rôle professionnel: ${user_context.job_role}\n\n`;
    // If no input is provided, return a default response
    if ((!emojis || emojis.length === 0) && (!text || text.length === 0) && !audio_url) {
      return new Response(JSON.stringify({
        emotion: "neutral",
        score: 50,
        confidence: 0.5,
        feedback: "Nous n'avons pas assez d'informations pour analyser votre état émotionnel. Essayez d'ajouter des emojis ou du texte pour obtenir un feedback personnalisé.",
        recommendations: [
          "Prenez un moment pour réfléchir à votre état émotionnel actuel",
          "Essayez le scan émotionnel avec au moins un emoji ou quelques mots"
        ]
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    // Enhanced prompt with more detailed instructions for better analysis
    prompt += "Fournir une analyse approfondie de l'état émotionnel sous ce format:\n";
    prompt += "1. Identifier l'émotion principale ressentie (choisir parmi: happy, calm, focused, anxious, sad, angry, frustrated, tired, energetic, neutral)\n";
    prompt += "2. Un score numérique entre 0 et 100 (0 étant un état très négatif, 100 étant excellent)\n";
    prompt += "3. Un niveau de confiance dans l'analyse (0.1 à 1.0)\n";
    prompt += "4. Un feedback bienveillant et professionnel de 2-3 phrases, adapté aux professionnels de santé\n";
    prompt += "5. Trois recommandations concrètes et personnalisées pour améliorer le bien-être\n";
    prompt += "6. Si le score est inférieur à 40, suggérer une micro-pause VR et une playlist musicale apaisante\n\n";
    prompt += "Format de sortie: JSON avec les champs: 'emotion' (string), 'score' (number), 'confidence' (number), 'feedback' (string), 'recommendations' (array of strings)";
    console.log('Calling OpenAI with prompt:', prompt);
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Tu es un assistant spécialisé en analyse émotionnelle et bien-être pour les professionnels de santé.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
        response_format: { type: "json_object" }
      }),
    const data = await response.json();
    console.log('OpenAI response:', data);
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from OpenAI');
    // Parse the JSON string from the response content
    let analysisResult;
    try {
      analysisResult = JSON.parse(data.choices[0].message.content);
      
      // Ensure all required fields are present with fallbacks
      analysisResult = {
        emotion: analysisResult.emotion || "neutral",
        score: analysisResult.score || 50,
        confidence: analysisResult.confidence || 0.5,
        feedback: analysisResult.feedback || "Notre système a analysé votre état émotionnel. Prenez un moment pour réfléchir à comment vous vous sentez.",
        recommendations: Array.isArray(analysisResult.recommendations) ? 
          analysisResult.recommendations : 
          ["Prenez quelques respirations profondes", "Faites une courte pause", "Hydratez-vous"]
      };
    } catch (e) {
      console.error('Failed to parse OpenAI response:', e);
      // Fallback response
        feedback: "Notre système n'a pas pu analyser votre état émotionnel avec précision. Voici un conseil général: prenez un moment pour respirer profondément et recentrez-vous sur vos priorités.",
          "Prenez 5 minutes pour vous détendre",
          "Essayez quelques respirations profondes",
          "Considérez une courte pause"
    return new Response(JSON.stringify(analysisResult), {
  } catch (error) {
    console.error('Error in enhanced-emotion-analyze function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      emotion: "neutral",
      score: 50,
      confidence: 0.5,
      feedback: "Désolé, une erreur est survenue lors de l'analyse. Voici un feedback par défaut: Votre état émotionnel semble mitigé aujourd'hui. Prenez le temps de vous recentrer et de respirer profondément.",
      recommendations: [
        "Prenez quelques respirations profondes",
        "Essayez à nouveau dans quelques instants",
        "Si le problème persiste, contactez le support technique"
      ]
    }), {
      status: 500,
});
