"use client";
import React from "react";
import * as Sentry from "@sentry/react";
import { PageHeader, Card, Button, Input, Textarea, LoadingSpinner } from "@/COMPONENTS.reg";
import { useJournalFeed } from "@/hooks/useJournalFeed";
import { recordEvent } from "@/lib/scores/events";

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};

const formatTag = (tag: string) => `#${tag}`;

const moodLabel: Record<"positive" | "neutral" | "negative", string> = {
  positive: "Positif",
  neutral: "Neutre",
  negative: "Négatif",
};

const parseTags = (raw: string): string[] =>
  raw
    .split(/[,\s]+/)
    .map(tag => tag.replace(/^#/, "").trim())
    .filter(Boolean);

export default function JournalPage() {
  const [content, setContent] = React.useState("");
  const [tagsInput, setTagsInput] = React.useState("");
  const {
    entries,
    tags,
    search,
    setSearch,
    tagFilter,
    setTagFilter,
    isLoading,
    isError,
    error,
    createEntry,
    isCreating,
    creationError,
  } = useJournalFeed();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!content.trim()) return;
    const parsedTags = parseTags(tagsInput);

    try {
      const client = Sentry.getCurrentHub().getClient();
      if (client) {
        Sentry.addBreadcrumb({
          category: "journal",
          level: "info",
          message: "journal:insert:start",
          data: { contentLength: content.length, tagCount: parsedTags.length },
        });
        Sentry.configureScope(scope => {
          scope.setContext("journal:last_attempt", {
            contentLength: content.length,
            tagCount: parsedTags.length,
          });
        });
      }

      await createEntry({ content, tags: parsedTags });

      if (client) {
        Sentry.addBreadcrumb({
          category: "journal",
          level: "info",
          message: "journal:insert:success",
          data: { tagCount: parsedTags.length },
        });
      }

      try {
        recordEvent?.({
          module: "journal",
          startedAt: new Date().toISOString(),
          endedAt: new Date().toISOString(),
          durationSec: Math.min(900, Math.max(30, Math.round(content.length / 5))),
          score: Math.min(10, Math.round(content.length / 80)),
          mood: parsedTags[0] ?? undefined,
          meta: { tags: parsedTags },
        });
      } catch {
        // analytics optional
      }

      setContent("");
      setTagsInput("");
    } catch (err) {
      console.error("journal entry creation failed", err);
      const client = Sentry.getCurrentHub().getClient();
      if (client) {
        Sentry.addBreadcrumb({
          category: "journal",
          level: "error",
          message: "journal:insert:error",
          data: { reason: err instanceof Error ? err.name : "unknown" },
        });
      }
    }
  };

  const creationMessage = creationError ? creationError.message : null;

  return (
    <main aria-label="Journal" className="space-y-6">
      <PageHeader title="Journal" subtitle="Consigne tes pensées et retrouve-les grâce aux tags et à la recherche" />

      <Card>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="font-medium" htmlFor="journal-content">
              Contenu
            </label>
            <Textarea
              id="journal-content"
              data-testid="journal-input"
              rows={6}
              value={content}
              placeholder="Écris librement, les tags seront ajoutés automatiquement (#travail, gratitude…)"
              onChange={(event) => setContent(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="font-medium" htmlFor="journal-tags">
              Tags
            </label>
            <Input
              id="journal-tags"
              type="text"
              value={tagsInput}
              placeholder="Exemples : travail, sommeil, gratitude"
              onChange={(event) => setTagsInput(event.target.value)}
            />
          </div>

          {creationMessage && (
            <p role="alert" className="text-sm text-destructive">
              {creationMessage}
            </p>
          )}

          <div className="flex items-center gap-3">
            <Button type="submit" data-ui="primary-cta" disabled={isCreating}>
              {isCreating ? "Enregistrement…" : "Enregistrer"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => { setContent(""); setTagsInput(""); }}>
              Effacer
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <section className="space-y-4">
          <div className="space-y-2">
            <label className="font-medium" htmlFor="journal-search">
              Recherche
            </label>
            <Input
              id="journal-search"
              type="search"
              value={search}
              placeholder="Rechercher un mot-clé ou un #tag"
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          {Boolean(tags.length) && (
            <div className="flex flex-wrap gap-2" aria-label="Filtrer par tag">
              <Button
                type="button"
                variant={tagFilter ? "outline" : "default"}
                onClick={() => setTagFilter(null)}
              >
                Tous
              </Button>
              {tags.map(tag => (
                <Button
                  key={tag}
                  type="button"
                  variant={tagFilter === tag ? "default" : "outline"}
                  onClick={() => setTagFilter(tag)}
                >
                  {formatTag(tag)}
                </Button>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <LoadingSpinner />
              <span>Chargement du journal…</span>
            </div>
          ) : (
            <ul className="space-y-3" role="list">
              {entries.map(entry => (
                <li key={entry.id} className="rounded-lg border p-4" role="listitem">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
                    <span>{formatDate(entry.timestamp)}</span>
                    {entry.mood && <span>{moodLabel[entry.mood]}</span>}
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                    {entry.type === "voice" && entry.summary ? entry.summary : entry.text}
                  </p>
                  {entry.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                      {entry.tags.map(tag => (
                        <span key={tag}>{formatTag(tag)}</span>
                      ))}
                    </div>
                  )}
                </li>
              ))}
              {!entries.length && (
                <li className="text-sm text-muted-foreground">Aucune entrée pour le moment.</li>
              )}
            </ul>
          )}

          {isError && !isLoading && !entries.length && (
            <p role="alert" className="text-sm text-destructive">
              {(error as Error)?.message || "Impossible de charger le journal"}
            </p>
          )}
        </section>
      </Card>
    </main>
  );
}

