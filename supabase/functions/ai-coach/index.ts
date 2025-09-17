import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { authorizeRole } from "../_shared/auth.ts";
import { logAccess } from "../_shared/logging.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};


const COACH_DISCLAIMERS = [
  "Le coach IA ne remplace pas un professionnel de santé ou de santé mentale.",
  "En cas de danger immédiat ou de détresse, contactez les services d'urgence (112 en Europe) ou un proche de confiance.",
  "Vos échanges sont anonymisés et destinés à un accompagnement confidentiel sans collecte de données sensibles.",
] as const;

type CoachAudience = "b2c" | "b2b";

interface CoachHistoryEntry {
  role: "user" | "assistant";
  content: string;
}

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

function buildSystemPrompt(audience: CoachAudience, personality?: string): string {
  const tone = audience === "b2b"
    ? "Adopte un ton professionnel, orienté performance collective et qualité de collaboration."
    : "Adopte un ton chaleureux, accessible et centré sur le bien-être personnel.";

  const personalityLine = personality
    ? `Personnalité demandée: ${personality}.`
    : "Tu incarnes un coach bienveillant et expert en psychologie positive.";

  const disclaimers = COACH_DISCLAIMERS.map((item) => `- ${item}`).join("\n");

  return [
    "Tu es un coach EmotionsCare.",
    personalityLine,
    tone,
    "Respecte strictement la confidentialité et rappelle que les échanges sont anonymisés.",
    "Rappels de sécurité à intégrer naturellement dans la réponse :",
    disclaimers,
    "Ne collecte ni ne demande jamais de données personnelles.",
    "En cas de signes de détresse ou de danger, incite à contacter immédiatement les services d'urgence.",
    "Réponds en français clair, avec empathie et professionnalisme.",
  ].join("\n");
}

function buildUserPrompt(params: {
  message: string;
  emotion: string;
  history: CoachHistoryEntry[];
  disclaimers: readonly string[];
}): string {
  const historyBlock = params.history.length
    ? params.history.map((entry) => {
        const speaker = entry.role === "assistant" ? "Coach" : "Utilisateur";
        return `${speaker}: ${entry.content}`;
      }).join("\n")
    : "Aucun échange précédent.";

  return [
    `Emotion détectée ou déclarée: ${params.emotion}.`,
    "Historique récent:",
    historyBlock,
    "Nouveau message à traiter:",
    params.message,
    "Structure attendue de ta réponse:",
    "1. Accueil empathique en deux phrases maximum.",
    "2. Conseils pratiques en trois puces maximum, adaptés à l'émotion identifiée.",
    `3. Rappel sécurité synthétique (ex: ${params.disclaimers[0]}).`,
    "Termine par une question ouverte encourageant l'utilisateur à poursuivre la conversation.",
  ].join("\n");
}

function normalizeEmotion(value: string | null): string {
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
    enthousiasme: "joie",
    tristesse: "tristesse",
    triste: "tristesse",
    chagrin: "tristesse",
    colere: "colere",
    fache: "colere",
    furieux: "colere",
    frustration: "colere",
    peur: "peur",
    anxiete: "peur",
    anxieux: "peur",
    stress: "peur",
    inquietude: "peur",
    neutre: "neutre",
    fatigue: "neutre",
    calme: "neutre",
  };

  return map[sanitized] ?? "neutre";
}

function sanitizeHistory(history: CoachHistoryEntry[]): CoachHistoryEntry[] {
  if (!Array.isArray(history)) return [];
  return history
    .map((entry) => {
      if (!entry || typeof entry.content !== "string") return null;
      const role = entry.role === "assistant" ? "assistant" : entry.role === "user" ? "user" : null;
      if (!role) return null;
      return {
        role,
        content: truncate(entry.content, 600),
      };
    })
    .filter((entry): entry is CoachHistoryEntry => entry !== null)
    .slice(-6);
}

function truncate(value: string, limit: number): string {
  if (value.length <= limit) return value;
  return `${value.slice(0, limit - 1)}…`;
}

function generateSuggestions(emotion: string, audience: CoachAudience): string[] {
  const baseSuggestions: Record<string, string[]> = {
    joie: [
      "Partagez cette énergie positive avec votre entourage.",
      "Notez trois raisons de reconnaissance pour ancrer ce ressenti.",
      "Planifiez une activité qui prolonge cet élan positif.",
    ],
    tristesse: [
      "Prenez dix minutes pour respirer profondément et accueillir l'émotion.",
      "Écrivez ce qui vous pèse et identifiez un petit geste réconfortant.",
      "Contactez une personne de confiance pour partager ce que vous ressentez.",
    ],
    colere: [
      "Faites trois cycles de respiration 4-6 pour relâcher la tension.",
      "Mettez des mots sur ce qui déclenche votre colère avant d'agir.",
      "Bougez votre corps ou marchez cinq minutes pour dissiper l'énergie.",
    ],
    peur: [
      "Identifiez ce qui est sous votre contrôle immédiat.",
      "Fractionnez la situation en petites étapes rassurantes.",
      "Pratiquez un ancrage sensoriel : décrivez ce que vous voyez, entendez, touchez.",
    ],
    neutre: [
      "Prenez un moment pour vérifier vos besoins de base (repos, hydratation, alimentation).",
      "Planifiez une micro-pause revitalisante dans votre journée.",
      "Essayez une activité créative ou apaisante pour nourrir votre énergie.",
    ],
  };

  const professionalSuggestions: Record<string, string[]> = {
    joie: [
      "Partagez cette dynamique positive avec votre équipe pour renforcer la cohésion.",
      "Identifiez ce qui a favorisé cette réussite et capitalisez dessus.",
      "Saluez publiquement l'effort collectif qui soutient ce ressenti.",
    ],
    tristesse: [
      "Planifiez un point avec un collègue de confiance pour verbaliser la situation.",
      "Clarifiez une petite action qui allègera votre charge professionnelle.",
      "Identifiez les ressources internes (RH, manager) qui peuvent vous soutenir.",
    ],
    colere: [
      "Posez le cadre : notez les faits objectivement avant d'échanger.",
      "Organisez une discussion en prenant le temps de respirer et d'écouter activement.",
      "Transformez l'énergie en plan d'action concret et mesurable.",
    ],
    peur: [
      "Partagez vos inquiétudes avec votre manager pour clarifier les attentes.",
      "Transformez les incertitudes en hypothèses et actions priorisées.",
      "Mobilisez un collègue comme partenaire de soutien sur le sujet concerné.",
    ],
    neutre: [
      "Définissez une intention claire pour votre journée professionnelle.",
      "Planifiez une pause pour recharger votre attention entre deux dossiers.",
      "Célébrez un progrès récent pour entretenir votre motivation.",
    ],
  };

  const catalog = audience === "b2b" ? professionalSuggestions : baseSuggestions;
  return catalog[emotion] ?? catalog["neutre"];
}

function defaultCoachResponse(message: string, audience: CoachAudience): string {
  const base = message.trim().length
    ? "Merci pour votre partage. Prenons un instant pour respirer et regarder comment avancer ensemble."
    : "Je suis là pour vous accompagner. Parlez-moi de ce que vous vivez en ce moment.";

  const reminder = audience === "b2b"
    ? "Ces conseils ne remplacent pas un accompagnement professionnel et ne se substituent pas aux décisions de votre organisation."
    : "Ces conseils ne remplacent pas un accompagnement médical ou psychologique professionnel.";

  return [base, reminder, COACH_DISCLAIMERS[1]].join(" ");
}

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

