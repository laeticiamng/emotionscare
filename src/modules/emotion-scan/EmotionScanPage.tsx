"use client";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Sentry from "@sentry/react";
import PageHeader from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/ui/ProgressBar";
import { Sparkline } from "@/ui/Sparkline"; // ProgressBar/Sparkline ajoutés en P6
import { recordEvent } from "@/lib/scores/events"; // si P6 non intégré, cet import peut être ignoré (no-op)
import { logger } from "@/lib/logger";
import { useAuth } from "@/contexts/AuthContext";
import { useError } from "@/contexts";
import { LoadingState } from "@/components/loading/LoadingState";
import { UnifiedEmptyState } from "@/components/ui/unified-empty-state";
import { History } from "lucide-react";
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

type Likert = 1|2|3|4|5;
type Resp = Record<(typeof POS[number] | typeof NEG[number])["id"], Likert | undefined>;

type EmotionScanMutationVariables = {
  text: string;
  context?: string;
  previousEmotions?: Record<string, number>;
  accessToken?: string | null;
  pa: number;
  na: number;
  balance: number;
};

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
  const [resp, setResp] = React.useState<Resp>({} as any);
  const [submitted, setSubmitted] = React.useState(false);
  const [analysis, setAnalysis] = React.useState<EmotionAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [localHistory, setLocalHistory] = React.useState<number[]>(() => loadLocalHistory());

  const { user, session } = useAuth();
  const queryClient = useQueryClient();
  const { notify } = useError();

  React.useEffect(() => {
    if (!user?.id) {
      setLocalHistory(loadLocalHistory());
    }
  }, [user?.id]);

  const { data: remoteHistory = [], isLoading: historyLoading } = useQuery({
    queryKey: ["emotion-scan-history", user?.id],
    queryFn: () => getEmotionScanHistory(user!.id, 12),
    enabled: Boolean(user?.id),
    staleTime: 60 * 1000,
    onError: (error: unknown) => {
      notify(
        {
          code: 'SERVER',
          messageKey: 'errors.emotionScanError',
          cause: error instanceof Error ? { message: error.message, stack: error.stack } : error,
          context: {
            scope: 'emotion-scan-history',
            userId: user?.id ?? 'anonymous',
          },
        },
        { route: '/app/scan', feature: 'emotion-scan-history' },
      );
    },
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
    mutationFn: (variables: EmotionScanMutationVariables) =>
      invokeEmotionScan(
        {
          text: variables.text,
          context: variables.context,
          previousEmotions: variables.previousEmotions,
        },
        { accessToken: variables.accessToken },
      ),
    onMutate: (variables) => {
      setErrorMessage(null);
      const client = Sentry.getCurrentHub().getClient();
      if (client) {
        Sentry.addBreadcrumb({
          category: "scan",
          level: "info",
          message: "scan:start",
          data: {
            balance: Number(variables.balance?.toFixed(2) ?? 0),
            pa: variables.pa,
            na: variables.na,
            authenticated: Boolean(user?.id),
          },
        });
        Sentry.configureScope(scope => {
          scope.setContext("scan:last_submission", {
            pa: variables.pa,
            na: variables.na,
            balance: variables.balance,
            hasPrevious: Boolean(variables.previousEmotions),
          });
        });
      }
    },
    onSuccess: async (result, variables) => {
      setAnalysis(result);

      const client = Sentry.getCurrentHub().getClient();
      if (client) {
        Sentry.addBreadcrumb({
          category: "scan",
          level: "info",
          message: "scan:success",
          data: {
            balance: Number(variables.balance?.toFixed(2) ?? 0),
            mood: result.dominantEmotion,
            persisted: Boolean(result.persisted),
          },
        });
        Sentry.configureScope(scope => {
          scope.setContext("scan:last_result", {
            balance: result.emotionalBalance,
            confidence: result.confidence,
            mood: result.dominantEmotion,
          });
        });
      }

      if (user?.id) {
        if (!result.persisted) {
          const summary = [
            `Émotion dominante: ${result.dominantEmotion}`,
            `Confiance: ${result.confidence}%`,
            `Équilibre émotionnel: ${result.emotionalBalance}/100`,
            `Balance I-PANAS-SF: ${variables.balance >= 0 ? "+" : ""}${variables.balance}`,
          ].join(" · ");

          try {
            await persistEmotionScanResult({
              userId: user.id,
              scanType: "self-report",
              mood: result.dominantEmotion,
              confidence: result.confidence,
              summary,
              recommendations: result.recommendations,
              insights: result.insights,
              emotions: result.emotions,
              emotionalBalance: result.emotionalBalance,
              context: variables.context,
              previousEmotions: variables.previousEmotions ?? null,
            });
          } catch (persistError) {
            logger.error("Failed to persist emotion scan result", persistError, "emotion-scan.ui");
            notify(
              {
                code: 'SERVER',
                messageKey: 'errors.emotionScanError',
                cause:
                  persistError instanceof Error
                    ? { message: persistError.message, stack: persistError.stack }
                    : persistError,
                context: {
                  scope: 'emotion-scan-persist',
                  userId: user?.id ?? 'anonymous',
                },
              },
              { route: '/app/scan', feature: 'emotion-scan-persist' },
            );
          }
        }

        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["emotion-scan-history", user.id] }),
          queryClient.invalidateQueries({ queryKey: ["recent-scans", user.id] }),
        ]);
      } else {
        setLocalHistory(prev => {
          const next = [...prev, result.emotionalBalance].slice(-12);
          saveLocalHistory(next);
          return next;
        });
      }
    },
    onError: (error: unknown) => {
      logger.error("Emotion scan analysis failed", error, "emotion-scan.ui");
      setAnalysis(null);
      const message = error instanceof Error ? error.message : "Analyse impossible pour le moment";
      setErrorMessage(message);
      const client = Sentry.getCurrentHub().getClient();
      if (client) {
        Sentry.addBreadcrumb({
          category: "scan",
          level: "error",
          message: "scan:error",
          data: {
            reason: error instanceof Error ? error.name : "unknown",
          },
        });
      }
      notify(
        {
          code: 'SERVER',
          messageKey: 'errors.emotionScanError',
          cause: error instanceof Error ? { message: error.message, stack: error.stack } : error,
          context: {
            scope: 'emotion-scan-analyze',
            userId: user?.id ?? 'anonymous',
          },
        },
        { route: '/app/scan', feature: 'emotion-scan-analysis' },
      );
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

    const positiveAnswers = POS.map(question => ({ ...question, value: resp[question.id] as number | undefined }));
    const negativeAnswers = NEG.map(question => ({ ...question, value: resp[question.id] as number | undefined }));

    const summaryText = summarizeLikertAnswers(positiveAnswers, negativeAnswers, balance);

    try {
      const result = await emotionScanMutation.mutateAsync({
        text: summaryText,
        context: "Auto-évaluation I-PANAS-SF",
        previousEmotions: latestScores,
        accessToken: session?.access_token ?? null,
        pa,
        na,
        balance,
      });

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
    <main aria-label="Emotion Scan">
      <PageHeader title="Emotion Scan" subtitle="Auto-évaluation rapide (I-PANAS-SF)" />
      <Card>
        <form onSubmit={onSubmit}>
          <fieldset>
            <legend>Émotions positives</legend>
            {POS.map(q => (
              <LikertRow key={q.id} id={q.id} label={q.label} value={resp[q.id]} onChange={(v)=>setResp(r => ({...r, [q.id]: v}))} />
            ))}
          </fieldset>

          <fieldset style={{ marginTop: 12 }}>
            <legend>Émotions négatives</legend>
            {NEG.map(q => (
              <LikertRow key={q.id} id={q.id} label={q.label} value={resp[q.id]} onChange={(v)=>setResp(r => ({...r, [q.id]: v}))} />
            ))}
          </fieldset>

          <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
            <ProgressBar value={completion * 100} max={100} />
            <Button
              type="submit"
              data-ui="primary-cta"
              aria-disabled={completion < 1 || emotionScanMutation.isPending}
              disabled={completion < 1 || emotionScanMutation.isPending}
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
              <LoadingState
                variant="section"
                text="Chargement de votre historique émotionnel..."
                skeletonCount={2}
                className="w-full"
              />
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
              <UnifiedEmptyState
                variant="minimal"
                size="sm"
                icon={History}
                title="Aucun historique pour le moment"
                description="Réalisez un scan émotionnel pour suivre votre progression."
                animated={false}
              />
            )}
          </section>
        </Card>
      )}
    </main>
  );
}

function LikertRow({ id, label, value, onChange }: { id: string; label: string; value?: Likert; onChange: (v: Likert)=>void }) {
  const opts: Likert[] = [1,2,3,4,5];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto auto auto", alignItems: "center", gap: 6, paddingBlock: 4 }}>
      <label htmlFor={`${id}-3`} style={{ whiteSpace: "nowrap" }}>{label}</label>
      {opts.map(v => (
        <label key={v} style={{ display: "grid", placeItems: "center" }} aria-label={`${label} ${v}`}>
          <input
            type="radio"
            name={id}
            id={`${id}-${v}`}
            checked={value === v}
            onChange={() => onChange(v)}
          />
          <small>{v}</small>
        </label>
      ))}
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
