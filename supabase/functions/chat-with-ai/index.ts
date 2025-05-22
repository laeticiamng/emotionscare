
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { authorizeRole } from "../_shared/auth.ts";
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
// Cache implementation for frequent requests (24h TTL)
const cache = new Map();
const CACHE_TTL = 86400 * 1000; // 24 hours in milliseconds
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  const { user, status } = await authorizeRole(req, ['b2c', 'b2b_user', 'b2b_admin', 'admin']);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  try {
    if (!openAIApiKey) {
      console.error("OpenAI API key not configured");
      throw new Error("OpenAI API key is not configured");
    }
    // Parse request body
    const { 
      message, 
      userContext, 
      sessionId, 
      stream = false, 
      model = "gpt-4o-mini", // Default to cheaper model
      temperature = 0.6, 
      max_tokens = 512, 
      top_p = 1.0,
      module = "chat",  // Default module type
      cacheEnabled = true // Enable caching by default for efficiency
    } = await req.json();
    
    console.log(`Request to OpenAI API - Module: ${module}, Model: ${model}`);
    console.log("User context:", userContext);
    // Check cache for FAQ-type questions (only for non-streaming responses)
    if (!stream && cacheEnabled && !userContext) {
      const cacheKey = `${model}:${message || ''}`;
      const cachedResponse = cache.get(cacheKey);
      
      if (cachedResponse) {
        console.log("Returning cached response");
        return new Response(JSON.stringify(cachedResponse), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    // Build system prompt based on module and context
    let systemPrompt = '';
    if (module === 'premium-support') {
      systemPrompt = `Tu es un assistant de support premium ultra-avancé pour EmotionsCare, une plateforme de bien-être mental
      pour les professionnels de santé. Tu dois fournir une assistance exceptionnelle, empathique et proactive.
      ${userContext?.detectedEmotion ? `L'utilisateur exprime actuellement une émotion de type: ${userContext.detectedEmotion}.` : ''}
      Adapte ton ton et tes réponses à l'état émotionnel de l'utilisateur. Sois particulièrement attentif, rassurant et précis.
      Si tu ne peux pas résoudre un problème, propose immédiatement un contact prioritaire avec un spécialiste humain.
      Réponds toujours en français, de manière chaleureuse et professionnelle.`;
    } else if (module === 'help-center') {
      systemPrompt = `Tu es un assistant du centre d'aide pour EmotionsCare.
      Fournis des réponses concises, précises et faciles à comprendre sur les fonctionnalités
      et l'utilisation de la plateforme. Si possible, suggère des tutoriels ou articles pertinents.
      Réponds toujours en français, de manière claire et pédagogique.`;
    } else if (userContext) {
      systemPrompt = `Tu es un assistant de bien-être professionnel pour les travailleurs de la santé. 
       ${userContext.recentEmotions ? `L'utilisateur a récemment ressenti: ${userContext.recentEmotions}.` : ''}
       ${userContext.currentScore ? `Son état émotionnel actuel est évalué à: ${userContext.currentScore}/100.` : ''}
       ${userContext.lastEmotionDate ? `Sa dernière émotion enregistrée date de: ${userContext.lastEmotionDate}` : ''}
       Adapte tes réponses à son contexte émotionnel, reste bienveillant et factuel. 
       Réponds toujours en français de manière précise et directe.`;
    } else {
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message }
    ];
    // Build OpenAI request body with the specified parameters
    const requestBody = {
      model: model,
      messages: messages,
      temperature: temperature,
      max_tokens: max_tokens,
      top_p: top_p,
      stream: stream
    };
    console.log("Request to OpenAI:", JSON.stringify({
      model: requestBody.model,
      messageCount: requestBody.messages.length,
      temperature: requestBody.temperature,
      stream: requestBody.stream
    }));
    // If stream is activated, handle streaming
    if (stream) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      // Return the stream directly
      return new Response(response.body, {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
    } 
    // Regular non-streaming request
    else {
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'OpenAI API error');
      const data = await response.json();
      const result = {
        response: data.choices[0].message.content,
        model: data.model,
        usage: data.usage,
        session_id: sessionId
      };
      // Cache the response if caching is enabled
      if (cacheEnabled && !userContext) {
        const cacheKey = `${model}:${message || ''}`;
        cache.set(cacheKey, result);
        
        // Set timeout to clear cache entry after TTL
        setTimeout(() => {
          cache.delete(cacheKey);
        }, CACHE_TTL);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  } catch (error) {
    console.error("Error in chat-with-ai function:", error);
    return new Response(JSON.stringify({
      error: error.message || "An error occurred processing your request",
    }), {
      status: 500,
});
