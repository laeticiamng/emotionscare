"use client";
import React from "react";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader, Card, Button, ProgressBar, Sparkline } from "@/COMPONENTS.reg"; // ProgressBar/Sparkline ajoutés en P6
import { recordEvent } from "@/lib/scores/events"; // si P6 non intégré, cet import peut être ignoré (no-op)
import { useAuth } from "@/contexts/AuthContext";
import {
  invokeEmotionScan,
  getEmotionScanHistory,
  summarizeLikertAnswers,
  deriveScore10,
  EmotionScanHistoryEntry,
  EmotionAnalysisResult,
  persistEmotionScanResult,
} from "@/services/emotionScan.service";

const POS = [
  { id: "active", label: "Actif(ve)" },
  { id: "determined", label: "Déterminé(e)" },
  { id: "attentive", label: "Attentif(ve)" },
  { id: "inspired", label: "Inspiré(e)" },
  { id: "alert", label: "Alerte" }
] as const;

const NEG = [
  { id: "upset", label: "Contrarié(e)" },
  { id: "hostile", label: "Hostile" },
  { id: "ashamed", label: "Honteux(se)" },
  { id: "nervous", label: "Nerveux(se)" },
  { id: "afraid", label: "Effrayé(e)" }
] as const;

type Likert = 1 | 2 | 3 | 4 | 5;
type QuestionId = (typeof POS[number] | typeof NEG[number])["id"];
type ResponsesState = Partial<Record<QuestionId, Likert>>;

const LIKERT_VALUE = z.number().int().min(1).max(5);
export const emotionScanResponsesSchema = z.object(
  [...POS, ...NEG].reduce(
    (acc, question) => {
      acc[question.id] = LIKERT_VALUE;
      return acc;
    },
    {} as Record<QuestionId, z.ZodNumber>
  )
);

export type EmotionScanResponses = z.infer<typeof emotionScanResponsesSchema>;

const LOCAL_HISTORY_KEY = "emotion_scan_history_v2";

function loadLocalHistory(): number[] {
  try {
    const payload = localStorage.getItem(LOCAL_HISTORY_KEY);
    if (!payload) return [];
    const parsed = JSON.parse(payload);
    return Array.isArray(parsed) ? parsed.filter((value: unknown) => typeof value === "number") : [];
  } catch {
    return [];
  }
}

function saveLocalHistory(values: number[]) {
  try {
    localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(values.slice(-12)));
  } catch {
    // ignore storage errors (private mode, quota, etc.)
  }
}

export default function EmotionScanPage() {
  const [resp, setResp] = React.useState<ResponsesState>({});
  const [submitted, setSubmitted] = React.useState(false);
  const [analysis, setAnalysis] = React.useState<EmotionAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [localHistory, setLocalHistory] = React.useState<number[]>(() => loadLocalHistory());
  const [invalidQuestions, setInvalidQuestions] = React.useState<QuestionId[]>([]);
  const formErrorId = React.useId();
  const errorRef = React.useRef<HTMLParagraphElement | null>(null);

  const { user } = useAuth();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (!user?.id) {
      setLocalHistory(loadLocalHistory());
    }
  }, [user?.id]);

  React.useEffect(() => {
    if (errorMessage) {
      errorRef.current?.focus();
    }
  }, [errorMessage]);

  const { data: remoteHistory = [], isLoading: historyLoading } = useQuery({
    queryKey: ["emotion-scan-history", user?.id],
    queryFn: () => getEmotionScanHistory(user!.id, 12),
    enabled: Boolean(user?.id),
    staleTime: 60 * 1000,
  });

  const historyEntries: EmotionScanHistoryEntry[] = React.useMemo(
    () => (user?.id ? remoteHistory : []),
    [remoteHistory, user?.id]
  );

  const sparklineValues = React.useMemo(() => {
    if (user?.id) {
      return [...historyEntries].reverse().map(entry => entry.normalizedBalance);
    }
    return localHistory;
  }, [historyEntries, localHistory, user?.id]);

  const latestScores = historyEntries[0]?.scores;

  const emotionScanMutation = useMutation({
    mutationFn: (payload: { text: string; context?: string; previousEmotions?: Record<string, number> }) =>
      invokeEmotionScan(payload),
    onMutate: () => {
      setErrorMessage(null);
    },
    onSuccess: (result) => {
      setAnalysis(result);
    },
    onError: (error: unknown) => {
      console.error("Emotion scan analysis failed", error);
      setAnalysis(null);
      setErrorMessage(error instanceof Error ? error.message : "Analyse impossible pour le moment");
    },
  });

  const pa = POS.reduce((s, q) => s + ((resp[q.id] ?? 0) as number), 0); // 0..25
  const na = NEG.reduce((s, q) => s + ((resp[q.id] ?? 0) as number), 0); // 0..25
  const balance = pa - na; // -25..25
  const completion = [...POS, ...NEG].filter(q => !!resp[q.id]).length / 10; // 0..1

  function labelForBalance(b: number) {
    if (b >= 8) return "Équilibre positif";
    if (b >= 3) return "Plutôt positif";
    if (b > -3) return "Neutre";
    if (b > -8) return "Tendu";
    return "Négatif";
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setErrorMessage(null);
    setInvalidQuestions([]);

    const validation = emotionScanResponsesSchema.safeParse(resp);

    if (!validation.success) {
      const missing = Array.from(
        new Set(
          validation.error.issues
            .map((issue) => issue.path[0])
            .filter((value): value is QuestionId => typeof value === "string")
        )
      );

      setInvalidQuestions(missing);
      setErrorMessage("Veuillez répondre aux 10 questions avant de lancer l'analyse.");
      return;
    }

    const normalized = validation.data as Record<QuestionId, Likert>;

    const positiveAnswers = POS.map(question => ({ ...question, value: normalized[question.id] as Likert }));
    const negativeAnswers = NEG.map(question => ({ ...question, value: normalized[question.id] as Likert }));

    const summaryText = summarizeLikertAnswers(positiveAnswers, negativeAnswers, balance);

    try {
      const result = await emotionScanMutation.mutateAsync({
        text: summaryText,
        context: "Auto-évaluation I-PANAS-SF",
        previousEmotions: latestScores,
      });

      if (user?.id) {
        try {
          const entry = await persistEmotionScanResult({
            userId: user.id,
            summary: summaryText,
            context: "Auto-évaluation I-PANAS-SF",
            result,
            stats: { positiveAffect: pa, negativeAffect: na, balance },
            previousEmotions: latestScores ?? null,
            scanType: "ipanassf",
          });

          queryClient.setQueryData<EmotionScanHistoryEntry[]>(
            ["emotion-scan-history", user.id],
            (previous = []) => [entry, ...previous].slice(0, 12),
          );

          await queryClient.invalidateQueries({ queryKey: ["recent-scans", user.id] });
        } catch (persistError) {
          console.error("Failed to persist emotion scan", persistError);
          setErrorMessage("Analyse enregistrée localement. Synchronisation impossible pour le moment.");
          setLocalHistory(prev => {
            const next = [...prev, result.emotionalBalance].slice(-12);
            saveLocalHistory(next);
            return next;
          });
        }
      } else {
        setLocalHistory(prev => {
          const next = [...prev, result.emotionalBalance].slice(-12);
          saveLocalHistory(next);
          return next;
        });
      }

      try {
        recordEvent?.({
          module: "emotion-scan",
          startedAt: new Date().toISOString(),
          endedAt: new Date().toISOString(),
          durationSec: 60,
          score: result.emotionalBalance,
          meta: { pa, na, balance, mood: result.dominantEmotion },
        });
      } catch {}
    } catch {
      // handled in mutation onError
    }

    setTimeout(() => document.getElementById("scan-result")?.scrollIntoView({ behavior: "smooth", block: "start" }), 10);
  }

  return (
    <main id="main-content" aria-label="Emotion Scan">
      <PageHeader title="Emotion Scan" subtitle="Auto-évaluation rapide (I-PANAS-SF)" />
      <Card>
        <form onSubmit={onSubmit} aria-describedby={errorMessage ? formErrorId : undefined}>
          <fieldset aria-invalid={invalidQuestions.length > 0 && submitted}>
            <legend>Émotions positives</legend>
            {POS.map(q => (
              <LikertRow
                key={q.id}
                id={q.id}
                label={q.label}
                value={resp[q.id]}
                onChange={(v) => setResp(r => ({ ...r, [q.id]: v }))}
                showError={submitted && invalidQuestions.includes(q.id)}
              />
            ))}
          </fieldset>

          <fieldset style={{ marginTop: 12 }} aria-invalid={invalidQuestions.length > 0 && submitted}>
            <legend>Émotions négatives</legend>
            {NEG.map(q => (
              <LikertRow
                key={q.id}
                id={q.id}
                label={q.label}
                value={resp[q.id]}
                onChange={(v) => setResp(r => ({ ...r, [q.id]: v }))}
                showError={submitted && invalidQuestions.includes(q.id)}
              />
            ))}
          </fieldset>

          {errorMessage && invalidQuestions.length > 0 && (
            <p
              id={formErrorId}
              ref={errorRef}
              role="alert"
              tabIndex={-1}
              style={{ color: "var(--destructive)", marginTop: 8 }}
            >
              {errorMessage}
            </p>
          )}

          <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
            <ProgressBar value={completion * 100} max={100} />
            <Button
              type="submit"
              data-ui="primary-cta"
              aria-disabled={completion < 1 || emotionScanMutation.isPending}
              disabled={completion < 1 || emotionScanMutation.isPending}
              aria-describedby={errorMessage ? formErrorId : undefined}
            >
              {emotionScanMutation.isPending ? "Analyse en cours…" : "Calculer"}
            </Button>
          </div>
        </form>
      </Card>

      {(submitted || emotionScanMutation.isPending || analysis) && (
        <Card id="scan-result" style={{ marginTop: 12, display: "grid", gap: 12 }}>
          <header>
            <h2>Résultat &amp; analyse IA</h2>
            <p style={{ marginTop: 4, color: "var(--muted-foreground)" }}>
              Synthèse de votre auto-évaluation et recommandations générées par l'IA.
            </p>
          </header>

          <section aria-live="polite" style={{ display: "grid", gap: 4 }}>
            <p><strong>PA</strong> (positif) : {pa} / 25</p>
            <p><strong>NA</strong> (négatif) : {na} / 25</p>
            <p>
              <strong>Balance</strong> (PA - NA) : {balance} — <em>{labelForBalance(balance)}</em>
            </p>
          </section>

          {errorMessage && (
            <p role="alert" style={{ color: "var(--destructive)" }}>
              {errorMessage}
            </p>
          )}

          {emotionScanMutation.isPending && (
            <p style={{ color: "var(--muted-foreground)" }}>Analyse de vos réponses…</p>
          )}

          {analysis && (
            <section aria-label="Analyse IA" style={{ display: "grid", gap: 8 }}>
              <div>
                <p>
                  <strong>Émotion dominante :</strong> {analysis.dominantEmotion}
                </p>
                <p>
                  <strong>Confiance :</strong> {analysis.confidence}% · <strong>Équilibre émotionnel :</strong> {analysis.emotionalBalance}/100
                </p>
              </div>

              <EmotionScoresGrid scores={analysis.emotions} />

              {analysis.insights.length > 0 && (
                <div>
                  <h3>Insights clés</h3>
                  <ul style={{ paddingLeft: 18, marginTop: 4 }}>
                    {analysis.insights.map((insight) => (
                      <li key={insight}>{insight}</li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.recommendations.length > 0 && (
                <div>
                  <h3>Recommandations personnalisées</h3>
                  <ul style={{ paddingLeft: 18, marginTop: 4 }}>
                    {analysis.recommendations.map((recommendation) => (
                      <li key={recommendation}>{recommendation}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          <section aria-label="Historique des scans" style={{ display: "grid", gap: 8 }}>
            <h3>Historique des 12 derniers scans</h3>
            {historyLoading && user?.id ? (
              <p style={{ color: "var(--muted-foreground)" }}>Chargement de votre historique…</p>
            ) : sparklineValues.length ? (
              <div style={{ display: "grid", gap: 8 }}>
                <Sparkline values={sparklineValues} width={320} height={56} />
                {user?.id && historyEntries.length > 0 && (
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 6 }}>
                    {historyEntries.slice(0, 3).map(entry => (
                      <li key={entry.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                        <span>{formatHistoryLabel(entry)}</span>
                        <span>{deriveScore10(entry.normalizedBalance).toFixed(1)}/10</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <p style={{ color: "var(--muted-foreground)" }}>Aucun historique disponible pour le moment.</p>
            )}
          </section>
        </Card>
      )}
    </main>
  );
}

function LikertRow({ id, label, value, onChange, showError }: { id: string; label: string; value?: Likert; onChange: (v: Likert) => void; showError: boolean }) {
  const opts: Likert[] = [1, 2, 3, 4, 5];
  const errorId = `${id}-error`;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr repeat(5, minmax(32px, auto))", alignItems: "center", gap: 6, paddingBlock: 4 }}>
      <label htmlFor={`${id}-3`} style={{ whiteSpace: "nowrap" }}>{label}</label>
      {opts.map(v => (
        <label key={v} style={{ display: "grid", placeItems: "center" }} aria-label={`${label} ${v}`}>
          <input
            type="radio"
            name={id}
            id={`${id}-${v}`}
            checked={value === v}
            onChange={() => onChange(v)}
            aria-describedby={showError ? errorId : undefined}
            aria-invalid={showError}
          />
          <small>{v}</small>
        </label>
      ))}
      {showError && (
        <span
          id={errorId}
          role="alert"
          style={{ gridColumn: "1 / -1", fontSize: "0.875rem", color: "var(--destructive)" }}
        >
          Sélection requise pour {label.toLowerCase()}.
        </span>
      )}
    </div>
  );
}

function EmotionScoresGrid({ scores }: { scores: Record<string, number> }) {
  const sorted = React.useMemo(
    () => Object.entries(scores).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0)).slice(0, 6),
    [scores]
  );

  if (!sorted.length) return null;

  return (
    <div style={{ display: "grid", gap: 4 }}>
      <h3>Scores émotionnels</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8 }}>
        {sorted.map(([key, value]) => (
          <div key={key} style={{ border: "1px solid var(--border)", borderRadius: 8, padding: 8 }}>
            <p style={{ fontWeight: 600, textTransform: "capitalize" }}>{key}</p>
            <p style={{ color: "var(--muted-foreground)" }}>{value.toFixed(1)} / 10</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatHistoryLabel(entry: EmotionScanHistoryEntry) {
  const date = new Date(entry.createdAt);
  const formatter = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const dateLabel = formatter.format(date);
  return entry.mood ? `${dateLabel} · ${entry.mood}` : dateLabel;
}
