import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { authorizeRole } from "../_shared/auth.ts";
import { logAccess } from "../_shared/logging.ts";
import {
  COACH_DISCLAIMERS,
  CoachAudience,
  CoachHistoryEntry,
  buildSystemPrompt,
  buildUserPrompt,
  defaultCoachResponse,
  generateSuggestions,
  normalizeEmotion,
  sanitizeHistory,
  truncate,
} from "./prompts.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CoachRequestPayload {
  message: string;
  emotion: string | null;
  audience: CoachAudience;
  consent: boolean;
  consentToken: string | null;
  history: CoachHistoryEntry[];
  personality: string | null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const { user, status } = await authorizeRole(req, ["b2c", "b2b_user", "b2b_admin", "admin"]);
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let payload: CoachRequestPayload;

  try {
    const body = await req.json();
    payload = parseCoachRequest(body);
  } catch (error) {
    console.error("ai-coach: invalid payload", error);
    return new Response(JSON.stringify({ error: "Requête invalide" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!payload.consent) {
    return new Response(
      JSON.stringify({
        error: "Consentement requis",
        disclaimers: COACH_DISCLAIMERS,
      }),
      {
        status: 412,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  const normalizedEmotion = normalizeEmotion(payload.emotion);
  const sanitizedHistory = sanitizeHistory(payload.history);
  const systemPrompt = buildSystemPrompt(payload.audience, payload.personality ?? undefined);
  const userPrompt = buildUserPrompt({
    message: payload.message,
    emotion: normalizedEmotion,
    history: sanitizedHistory,
    disclaimers: COACH_DISCLAIMERS,
  });

  const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
  let source: "openai" | "fallback" = "fallback";
  let coachResponse = defaultCoachResponse(payload.message, payload.audience);

  if (openaiApiKey) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            ...sanitizedHistory.map((entry) => ({
              role: entry.role === "assistant" ? "assistant" : "user",
              content: entry.content,
            })),
            { role: "user", content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 360,
        }),
      });

      if (!response.ok) {
        console.error("ai-coach: OpenAI error", await response.text());
      } else {
        const data = await response.json();
        const candidate = data?.choices?.[0]?.message?.content?.trim();
        if (candidate) {
          coachResponse = candidate;
          source = "openai";
        }
      }
    } catch (error) {
      console.error("ai-coach: OpenAI call failed", error);
    }
  } else {
    console.warn("ai-coach: OPENAI_API_KEY missing, using fallback response");
  }

  const suggestions = generateSuggestions(normalizedEmotion, payload.audience);

  const responseBody = {
    response: coachResponse,
    suggestions,
    disclaimers: COACH_DISCLAIMERS,
    meta: {
      emotion: normalizedEmotion,
      source,
      timestamp: new Date().toISOString(),
      audience: payload.audience,
    },
  };

  try {
    await logAccess({
      user_id: user.id,
      role: extractUserRole(user),
      route: "ai-coach",
      action: "generate_response",
      result: "success",
      ip_address: req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? undefined,
      user_agent: req.headers.get("user-agent") ?? undefined,
      details: JSON.stringify({ emotion: normalizedEmotion, source, audience: payload.audience }),
    });
  } catch (error) {
    console.warn("ai-coach: logAccess failed", error);
  }

  return new Response(JSON.stringify(responseBody), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});

function extractUserRole(user: any): string | null {
  if (!user) return null;
  const metadataRole = typeof user.app_metadata?.role === "string" ? user.app_metadata.role : null;
  if (metadataRole) return metadataRole;
  if (Array.isArray(user.app_metadata?.roles) && user.app_metadata.roles.length) {
    return user.app_metadata.roles[0];
  }
  return null;
}

function parseCoachRequest(body: any): CoachRequestPayload {
  if (!body || typeof body.message !== "string" || !body.message.trim()) {
    throw new Error("missing-message");
  }

  const history = Array.isArray(body.history)
    ? body.history.map((entry: any) => ({
        role: entry?.role === "assistant" ? "assistant" : "user",
        content: typeof entry?.content === "string" ? entry.content : "",
      }))
    : [];

  return {
    message: truncate(body.message, 1200),
    emotion: typeof body.emotion === "string" ? body.emotion : null,
    audience: body.audience === "b2b" ? "b2b" : "b2c",
    consent: body?.consent === true,
    consentToken: typeof body?.consentToken === "string" ? truncate(body.consentToken, 120) : null,
    history,
    personality: typeof body?.personality === "string" ? body.personality : null,
  };
}

