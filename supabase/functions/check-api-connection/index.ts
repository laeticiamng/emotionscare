
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
      console.error("API key missing");
      throw new Error("API key missing");
    }
    // Simple request to OpenAI to check connection with the new model format
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`
      }
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API returned status ${response.status}: ${errorText}`);
      throw new Error(`API returned status ${response.status}`);
    const data = await response.json();
    
    // Check if we have access to the required models
    const availableModels = data.data.map((model: any) => model.id);
    const requiredModels = [
      "gpt-4o-mini-2024-07-18", 
      "gpt-4o-2024-08-06"
    ];
    // Check if at least one of our required models is available
    const hasRequiredModel = requiredModels.some(model => 
      availableModels.includes(model) || 
      availableModels.some((m: string) => m.startsWith(model.split('-').slice(0, 2).join('-')))
    );
    if (!hasRequiredModel) {
      console.warn("No required models available:", requiredModels);
      console.log("Available models:", availableModels);
    return new Response(JSON.stringify({ 
      connected: true,
      models: data.data?.length || 0,
      hasRequiredModels: hasRequiredModel
    }), {
  } catch (error) {
    console.error('Error checking OpenAI API connection:', error);
      connected: false,
      error: error.message
      status: 500,
});
