import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { resolveCors, preflightResponse, rejectCors, mergeHeaders } from "../_shared/cors.ts";
import { validateJwt } from "../_shared/auth.ts";
import { enforceEdgeRateLimit, buildRateLimitResponse } from "../_shared/rate-limit.ts";
import { z } from "../_shared/zod.ts";
import { supabase } from "../_shared/supa_client.ts";
import { addSentryBreadcrumb, captureSentryException } from "../_shared/sentry.ts";
import {
  COACH_DISCLAIMERS,
  buildCrisisReply,
  buildGenericFallback,
  buildMedicalReply,
  buildSelfHarmReply,
  buildSystemPrompt,
  buildUserPrompt,
  CoachLocale,
  CoachMode,
} from "./prompts.ts";

interface CoachPayload {
  thread_id?: string;
  message: string;
  mode: CoachMode;
  locale: CoachLocale;
  user_hash?: string;
}

interface ModelResult {
  text: string;
  model: string;
}

const encoder = new TextEncoder();
const MAX_BODY_SIZE = 4000;

const payloadSchema = z.object({
  thread_id: z.string().min(6).max(120).optional(),
  message: z.string().min(1).max(2000),
  mode: z.enum(["b2c", "b2b"]).default("b2c"),
  locale: z.enum(["fr", "en"]).default("fr"),
  user_hash: z.string().min(32).max(128).optional(),
});

const SELF_HARM_PATTERN = /(suicide|me tuer|me faire du mal|en finir|plus envie de vivre|kill myself|end my life)/i;
const CRISIS_PATTERN = /(violence|agression|menace|arme|hurt (them|someone)|kill (him|her|them)|danger immédiat)/i;
const MEDICAL_PATTERN = /(ordonnance|prescription|dosage|dose|médicament|medicine dose|pill|antidépresseur|antibiotique)/i;

function redactSensitive(text: string): string {
  if (!text) return "";
  const withoutEmails = text.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email]");
  const withoutPhones = withoutEmails.replace(/\b(?:\+?\d[\d\s\-]{7,}\d)\b/g, "[tel]");
  return withoutPhones.slice(0, 280);
}

function detectGuardrail(message: string): "self_harm" | "crisis" | "medical" | null {
  if (SELF_HARM_PATTERN.test(message)) return "self_harm";
  if (CRISIS_PATTERN.test(message)) return "crisis";
  if (MEDICAL_PATTERN.test(message)) return "medical";
  return null;
}

async function runModeration(message: string): Promise<boolean> {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) return false;

  try {
    const response = await fetch("https://api.openai.com/v1/moderations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "omni-moderation-latest",
        input: message.slice(0, MAX_BODY_SIZE),
      }),
    });

    if (!response.ok) {
      console.warn("[ai-coach] moderation call failed", await response.text());
      return false;
    }

    const payload = await response.json();
    const flagged = Boolean(payload?.results?.[0]?.flagged);
    return flagged;
  } catch (error) {
    console.warn("[ai-coach] moderation exception", error);
    return false;
  }
}

async function generateModelReply(payload: CoachPayload): Promise<ModelResult> {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) {
    return { text: buildGenericFallback(payload.locale), model: "fallback" };
  }

  try {
    const systemPrompt = buildSystemPrompt(payload.mode, payload.locale);
    const userPrompt = buildUserPrompt(payload.message, payload.locale);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.4,
        max_output_tokens: 320,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      console.warn("[ai-coach] model error", await response.text());
      return { text: buildGenericFallback(payload.locale), model: "fallback" };
    }

    const data = await response.json();
    const candidate = data?.choices?.[0]?.message?.content;
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return { text: candidate.trim(), model: data?.model ?? "gpt-4o-mini" };
    }
    return { text: buildGenericFallback(payload.locale), model: "fallback" };
  } catch (error) {
    console.warn("[ai-coach] model exception", error);
    return { text: buildGenericFallback(payload.locale), model: "fallback" };
  }
}

async function persistLog(userId: string, threadId: string, text: string, mode: CoachMode) {
  if (!userId) return;
  try {
    await supabase.from("coach_logs").insert({
      user_id: userId,
      thread_id: threadId,
      summary_text: redactSensitive(text),
      mode,
    });
  } catch (error) {
    console.warn("[ai-coach] coach_logs insert failed", error);
  }
}

function buildThreadId(payload: CoachPayload): string {
  if (payload.thread_id) return payload.thread_id;
  if (payload.user_hash && payload.user_hash.length >= 12) {
    return `${payload.user_hash.slice(0, 12)}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return crypto.randomUUID();
}

async function parseRequest(req: Request): Promise<CoachPayload> {
  if (req.method === "GET") {
    const url = new URL(req.url);
    const encoded = url.searchParams.get("body");
    if (!encoded) {
      const err = new Error("missing_body");
      (err as Error & { status?: number }).status = 422;
      throw err;
    }
    try {
      const decoded = decodeURIComponent(encoded);
      const raw = JSON.parse(decoded);
      return payloadSchema.parse(raw);
    } catch (error) {
      console.warn("[ai-coach] invalid SSE payload", error);
      const err = new Error("invalid_body");
      (err as Error & { status?: number }).status = 422;
      throw err;
    }
  }

  try {
    const json = await req.json();
    return payloadSchema.parse(json);
  } catch (error) {
    console.warn("[ai-coach] invalid JSON payload", error);
    const err = new Error("invalid_body");
    (err as Error & { status?: number }).status = 422;
    throw err;
  }
}

function createStream(threadId: string, text: string, locale: CoachLocale): ReadableStream<Uint8Array> {
  const chunks = splitText(text);
  const disclaimers = COACH_DISCLAIMERS[locale];
  const payloadMeta = JSON.stringify({ type: "meta", threadId, disclaimers });

  return new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(`data: ${payloadMeta}\n\n`));
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "delta", content: chunk })}\n\n`));
      }
      controller.enqueue(encoder.encode("data: [END]\n\n"));
      controller.close();
    },
  });
}

function splitText(text: string): string[] {
  if (!text) return [];
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  if (!sentences.length) {
    return [text];
  }

  const normalized: string[] = [];
  for (const sentence of sentences) {
    if (sentence.length <= 120) {
      normalized.push(sentence);
      continue;
    }
    for (let i = 0; i < sentence.length; i += 120) {
      normalized.push(sentence.slice(i, i + 120));
    }
  }
  return normalized;
}

function guardrailResponse(type: "self_harm" | "crisis" | "medical", locale: CoachLocale): string {
  if (type === "self_harm") return buildSelfHarmReply(locale);
  if (type === "crisis") return buildCrisisReply(locale);
  return buildMedicalReply(locale);
}

serve(async (req) => {
  const cors = resolveCors(req);

  if (req.method === "OPTIONS") {
    return preflightResponse(cors);
  }

  if (!cors.allowed) {
    return rejectCors(cors);
  }

  const baseHeaders = mergeHeaders(cors.headers, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  });

  try {
    addSentryBreadcrumb({ category: "coach", message: "coach:request:start" });

    let user;
    try {
      user = await validateJwt(req);
    } catch {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: baseHeaders,
      });
    }

    const rateDecision = await enforceEdgeRateLimit(req, {
      route: "ai-coach",
      userId: user.id,
      description: "coach-message",
    });

    if (!rateDecision.allowed) {
      return buildRateLimitResponse(rateDecision, baseHeaders, {
        message: "Trop de requêtes coach. Réessaie dans un instant.",
      });
    }

    const payload = await parseRequest(req);
    const threadId = buildThreadId(payload);
    const guardrail = detectGuardrail(payload.message);
    const flagged = await runModeration(payload.message);
    const triggered = guardrail ?? (flagged ? "crisis" : null);

    const finalText = triggered
      ? guardrailResponse(triggered, payload.locale)
      : (await generateModelReply(payload)).text;

    await persistLog(user.id, threadId, finalText, payload.mode);

    if (req.method === "GET") {
      const stream = createStream(threadId, finalText, payload.locale);
      const headers = mergeHeaders(cors.headers, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      });
      addSentryBreadcrumb({ category: "coach", message: "coach:response:stream" });
      return new Response(stream, { headers });
    }

    addSentryBreadcrumb({ category: "coach", message: "coach:response:json" });
    return new Response(
      JSON.stringify({
        thread_id: threadId,
        messages: [
          { role: "assistant", content: finalText },
        ],
        disclaimers: COACH_DISCLAIMERS[payload.locale],
      }),
      { headers: baseHeaders },
    );
  } catch (error) {
    if (error instanceof Error && typeof (error as Error & { status?: number }).status === "number") {
      const status = (error as Error & { status?: number }).status ?? 500;
      return new Response(JSON.stringify({ error: error.message }), {
        status,
        headers: baseHeaders,
      });
    }
    console.error("[ai-coach] unexpected error", error);
    captureSentryException(error instanceof Error ? error : new Error("ai-coach failure"));
    return new Response(JSON.stringify({ error: "coach_unavailable" }), {
      status: 500,
      headers: baseHeaders,
    });
  }
});

export const __testables = {
  detectGuardrail,
  splitText,
  redactSensitive,
  buildThreadId,
};
