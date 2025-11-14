import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { sha256Hex } from "@/lib/hash";
import { logger } from '@/lib/logger';

export const COACH_DISCLAIMERS = [
  "Le coach IA ne remplace pas un professionnel de santé ou de santé mentale.",
  "En cas de danger immédiat ou de détresse, contactez les services d'urgence (112 en Europe) ou un proche de confiance.",
  "Vos échanges sont anonymisés et destinés à un accompagnement confidentiel sans collecte de données sensibles.",
] as const;

export type CoachAudience = "b2c" | "b2b";

export interface CoachHistoryItem {
  role: "user" | "assistant";
  content: string;
}

export interface CoachRequestOptions {
  message: string;
  emotion?: string | null;
  history: CoachHistoryItem[];
  audience: CoachAudience;
  consentToken: string;
  personality: string;
  conversationId: string;
  userId: string | null;
  startedAt: number | null;
}

export interface CoachResponsePayload {
  message: string;
  suggestions: string[];
  disclaimers: string[];
  meta: {
    emotion: string;
    source: string;
    timestamp: string;
    audience: CoachAudience;
  };
}

interface CoachFunctionMeta {
  emotion?: string;
  source?: string;
  timestamp?: string;
  audience?: CoachAudience;
}

const coachFunctionSchema = z.object({
  response: z.string(),
  suggestions: z.array(z.string()).optional(),
  disclaimers: z.array(z.string()).optional(),
  meta: z
    .object({
      emotion: z.string().optional(),
      source: z.string().optional(),
      timestamp: z.string().optional(),
      audience: z.enum(["b2c", "b2b"]).optional(),
    })
    .optional(),
});

const SUMMARY_INSTRUCTIONS = `Tu es un agent de conformité EmotionsCare.
Tu reçois l'historique d'un échange entre un utilisateur et un coach IA.
Rédige un résumé anonymisé sans mentionner de noms propres ni de détails identifiants.
Réponds en JSON strict avec le format suivant :
{
  "summary": "phrase synthétique (max 180 caractères)",
  "signals": ["mot-clé 1", "mot-clé 2", "mot-clé 3"]
}
Ne fournis aucune autre clé que summary et signals.`;

const HASH_TRUNCATE = 240;
const HISTORY_LIMIT = 6;

function normalizeEmotionLabel(value?: string | null): string {
  if (!value) return "neutre";
  const sanitized = value
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

  const map: Record<string, string> = {
    joie: "joie",
    heureux: "joie",
    positive: "joie",
    enthousiaste: "joie",
    tristesse: "tristesse",
    triste: "tristesse",
    chagrin: "tristesse",
    colere: "colere",
    fache: "colere",
    furieux: "colere",
    peur: "peur",
    anxiete: "peur",
    anxieux: "peur",
    stress: "peur",
    stresse: "peur",
    neutre: "neutre",
    fatigue: "neutre",
  };

  return map[sanitized] ?? "neutre";
}

function clampHistory(history: CoachHistoryItem[], limit = HISTORY_LIMIT): CoachHistoryItem[] {
  return history.slice(-limit).map(item => ({
    role: item.role,
    content: truncateForSummary(item.content),
  }));
}

function truncateForSummary(text: string, maxLength = HASH_TRUNCATE): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}

const hashText = sha256Hex;

async function summarizeConversation(history: CoachHistoryItem[]): Promise<string | null> {
  try {
    if (!history.length) {
      return null;
    }

    const { data: assistantData, error: assistantError } = await supabase.functions.invoke("assistant-api", {
      body: {
        action: "create_assistant",
        instructions: SUMMARY_INSTRUCTIONS,
      },
    });

    if (assistantError) throw assistantError;

    const assistantId = assistantData?.assistant?.id as string | undefined;
    if (!assistantId) {
      throw new Error("assistant-id-missing");
    }

    const { data: threadData, error: threadError } = await supabase.functions.invoke("assistant-api", {
      body: { action: "create_thread" },
    });

    if (threadError) throw threadError;

    const threadId = threadData?.thread?.id as string | undefined;
    if (!threadId) {
      throw new Error("thread-id-missing");
    }

    const payload = {
      history: history.map(item => ({
        role: item.role,
        text: truncateForSummary(item.content, 200),
      })),
    };

    const { error: messageError } = await supabase.functions.invoke("assistant-api", {
      body: {
        action: "create_message",
        threadId,
        content: JSON.stringify(payload),
      },
    });

    if (messageError) throw messageError;

    const { data: runData, error: runError } = await supabase.functions.invoke("assistant-api", {
      body: {
        action: "run_assistant",
        threadId,
        assistantId,
      },
    });

    if (runError) throw runError;

    let status = runData?.run?.status as string | undefined;
    const runId = runData?.run?.id as string | undefined;

    if (!runId) {
      throw new Error("run-id-missing");
    }

    let safetyCounter = 0;
    while ((status === "queued" || status === "in_progress") && safetyCounter < 8) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const { data: checkData, error: checkError } = await supabase.functions.invoke("assistant-api", {
        body: {
          action: "check_run",
          threadId,
          content: runId,
        },
      });

      if (checkError) throw checkError;
      status = checkData?.run?.status as string | undefined;
      safetyCounter += 1;
    }

    const { data: messagesData, error: messagesError } = await supabase.functions.invoke("assistant-api", {
      body: {
        action: "get_messages",
        threadId,
      },
    });

    if (messagesError) throw messagesError;

    const records = (messagesData?.messages?.data ?? []) as Array<{
      role?: string;
      content?: Array<{ text?: { value?: string } }>;
    }>;

    const assistantMessage = records.find(item => item.role === "assistant");
    const rawText = assistantMessage?.content?.[0]?.text?.value;

    if (!rawText) {
      return null;
    }

    try {
      const parsed = JSON.parse(rawText) as { summary?: string; signals?: string[] };
      if (parsed?.summary) {
        const extras = Array.isArray(parsed.signals) ? parsed.signals : [];
        return [parsed.summary, ...extras.map(signal => `• ${signal}`)].join(" ").trim();
      }
    } catch (err) {
      logger.warn("coachService: unable to parse assistant summary", err, 'SYSTEM');
    }

    return rawText.trim();
  } catch (error) {
    logger.warn("coachService: summarizeConversation failure", error, 'SYSTEM');
    return null;
  }
}

async function recordAnonymizedCoachLog(params: {
  audience: CoachAudience;
  consentToken: string;
  history: CoachHistoryItem[];
  response: string;
  suggestions: string[];
  emotion: string;
  personality: string;
  conversationId: string;
  userId: string | null;
  startedAt: number | null;
}) {
  try {
    if (!params.userId) return;

    const historyForSummary = clampHistory(params.history, HISTORY_LIMIT);
    const summary = await summarizeConversation(historyForSummary);

    const lastUserMessage = params.history
      .slice()
      .reverse()
      .find(item => item.role === "user")?.content ?? "";

    let hashedMessage = "";
    let hashedResponse = "";

    try {
      [hashedMessage, hashedResponse] = await Promise.all([
        hashText(lastUserMessage),
        hashText(params.response),
      ]);
    } catch (error) {
      logger.warn("coachService: unable to hash conversation payload", error, 'SYSTEM');
    }

    const messagesCount = params.history.filter(item => item.role === "user").length;
    const sessionDuration = params.startedAt ? Math.max(1, Math.round((Date.now() - params.startedAt) / 1000)) : null;

    const notesPayload = {
      consentToken: params.consentToken,
      conversationId: params.conversationId,
      summary: summary ?? null,
      hashed: {
        lastUser: hashedMessage,
        coach: hashedResponse,
      },
    };

    const insertPayload: Record<string, unknown> = {
      user_id: params.userId,
      coach_personality: params.personality,
      messages_count: messagesCount,
      session_duration: sessionDuration,
      session_notes: JSON.stringify(notesPayload),
      techniques_suggested: params.suggestions,
      emotions_detected: { dominant: params.emotion },
      resources_provided: null,
    };

    insertPayload["updated_at"] = new Date().toISOString();

    const { error } = await supabase.from("ai_coach_sessions").insert(insertPayload);
    if (error) {
      logger.warn("coachService: unable to record anonymized log", error, 'SYSTEM');
    }
  } catch (error) {
    logger.warn("coachService: unexpected error while logging", error, 'SYSTEM');
  }
}

export async function requestCoachResponse(options: CoachRequestOptions): Promise<CoachResponsePayload | null> {
  try {
    const trimmedMessage = options.message.trim();
    if (!trimmedMessage) {
      logger.warn("coachService: empty message provided", undefined, 'SYSTEM');
      return null;
    }

    const limitedHistory = clampHistory(options.history, HISTORY_LIMIT);

    const { data, error } = await supabase.functions.invoke("ai-coach", {
      body: {
        message: trimmedMessage,
        emotion: options.emotion,
        audience: options.audience,
        consent: true,
        consentToken: options.consentToken,
        history: limitedHistory,
        personality: options.personality,
      },
    });

    if (error) {
      logger.error("coachService: unable to contact AI coach", error, 'SYSTEM');
      return null;
    }

    const parsed = coachFunctionSchema.safeParse(data);

    if (!parsed.success) {
      logger.error("coachService: invalid payload", parsed.error.flatten(), 'SYSTEM');
      return null;
    }

    const meta: CoachFunctionMeta = parsed.data.meta ?? {};
    const normalizedEmotion = normalizeEmotionLabel(meta.emotion ?? options.emotion);

    const message = parsed.data.response.trim();
    const suggestions = (parsed.data.suggestions ?? []).filter(Boolean);
    const disclaimers = parsed.data.disclaimers?.length ? parsed.data.disclaimers : [...COACH_DISCLAIMERS];

    const logHistory: CoachHistoryItem[] = [
      ...options.history,
      { role: "assistant", content: message },
    ];

    await recordAnonymizedCoachLog({
      audience: options.audience,
      consentToken: options.consentToken,
      history: logHistory,
      response: message,
      suggestions,
      emotion: normalizedEmotion,
      personality: options.personality,
      conversationId: options.conversationId,
      userId: options.userId,
      startedAt: options.startedAt,
    });

    return {
      message,
      suggestions,
      disclaimers,
      meta: {
        emotion: normalizedEmotion,
        source: meta.source ?? "fallback",
        timestamp: meta.timestamp ?? new Date().toISOString(),
        audience: meta.audience ?? options.audience,
      },
    };
  } catch (error) {
    logger.error("coachService: unexpected error", error as Error, 'SYSTEM');
    return null;
  }
}

export const __coachInternals = {
  normalizeEmotionLabel,
  clampHistory,
  truncateForSummary,
  hashText,
};

