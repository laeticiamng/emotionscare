
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { requireAuth } from '../_shared/auth.ts';
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
  const user = await requireAuth(req);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  try {
    if (!openAIApiKey) {
      throw new Error("OpenAI API key is not configured");
    }
    const { action, assistantId, threadId, content, instructions } = await req.json();
    
    console.log(`Assistant API request: ${action}`);
    switch (action) {
      case 'create_assistant':
        // Création d'un assistant
        const createAssistantResponse = await fetch('https://api.openai.com/v1/assistants', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v1'
          },
          body: JSON.stringify({
            name: "Coach EmotionsCare",
            instructions: instructions || "Répondre avec empathie et clarté aux questions émotionnelles ou pratiques des utilisateurs.",
            model: "gpt-4",
            tools: []
          }),
        });
        
        const assistant = await createAssistantResponse.json();
        return new Response(JSON.stringify({ assistant }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      
      case 'create_thread':
        // Création d'un thread de conversation
        const createThreadResponse = await fetch('https://api.openai.com/v1/threads', {
          body: JSON.stringify({}),
        const thread = await createThreadResponse.json();
        return new Response(JSON.stringify({ thread }), {
      case 'create_message':
        // Ajout d'un message à un thread
        if (!threadId) throw new Error("Thread ID is required");
        const createMessageResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
            role: "user",
            content: content
        const message = await createMessageResponse.json();
        return new Response(JSON.stringify({ message }), {
      case 'run_assistant':
        // Exécuter l'assistant sur un thread
        if (!threadId || !assistantId) throw new Error("Thread ID and Assistant ID are required");
        const runResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
            assistant_id: assistantId
        const run = await runResponse.json();
        return new Response(JSON.stringify({ run }), {
      case 'get_messages':
        // Récupérer les messages d'un thread
        const getMessagesResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
          method: 'GET',
          }
        const messages = await getMessagesResponse.json();
        return new Response(JSON.stringify({ messages }), {
      case 'check_run':
        // Vérifier l'état d'une exécution
        if (!threadId || !content) throw new Error("Thread ID and Run ID are required");
        const runId = content; // Dans ce cas, content contient l'ID du run
        const checkRunResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
        const runStatus = await checkRunResponse.json();
        return new Response(JSON.stringify({ run: runStatus }), {
      default:
        throw new Error(`Unknown action: ${action}`);
  } catch (error) {
    console.error('Error in assistant-api function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
    }), {
      status: 500,
});
