
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { requireRole } from '../_shared/auth.ts';
import OpenAI from "https://esm.sh/openai@4.0.0";
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
    if (!openAIApiKey) {
      throw new Error("OpenAI API key is not configured");
    }
    const openai = new OpenAI({
      apiKey: openAIApiKey,
    const { prompt, model = "gpt-4o-mini", emotion, action } = await req.json();
    // Prepare the system message based on action
    let systemMessage = "You are an AI coach specialized in emotional wellbeing.";
    
    if (action === "get_recommendation") {
      systemMessage += ` The user is feeling ${emotion || "neutral"}. Provide a short, helpful recommendation.`;
    } else if (action === "analyze_emotion") {
      systemMessage += " Analyze the emotional content of the user's message.";
    } else if (action === "generate_music") {
      systemMessage += ` Recommend a music style or specific songs for someone feeling ${emotion || "neutral"}.`;
    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: systemMessage
        },
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    const completion = response.choices[0].message.content;
    return new Response(
      JSON.stringify({ response: completion }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error("Error in coach-ai function:", error);
      JSON.stringify({ error: error.message }),
        status: 500,
});
