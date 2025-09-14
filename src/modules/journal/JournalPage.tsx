"use client";
import React from "react";
import { PageHeader, Card, Button, useDebounce, Input, Textarea } from "@/COMPONENTS.reg";
import { recordEvent } from "@/lib/scores/events";
import { loadEntries, upsertEntry, softDelete, searchEntries, JournalEntryRec } from "@/lib/journal/store";

export default function JournalPage() {
  const [content, setContent] = React.useState("");
  const [tagsInput, setTagsInput] = React.useState("");
  const [mood, setMood] = React.useState("calme");
  const [query, setQuery] = React.useState("");
  const [tagFilter, setTagFilter] = React.useState<string|undefined>(undefined);
  const [list, setList] = React.useState<JournalEntryRec[]>([]);
  const debouncedSearch = (useDebounce?.((q: string) => {
    setList(searchEntries(q, tagFilter));
  }, 150)) ?? ((q: string) => setList(searchEntries(q, tagFilter)));

  React.useEffect(() => { setList(searchEntries("", undefined)); }, []);
  React.useEffect(() => { debouncedSearch(query); /* eslint-disable-next-line */ }, [query, tagFilter]);

  function tagsFromInput(s: string) {
    return s.split(",").map(t => t.trim()).filter(Boolean);
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    const tags = tagsFromInput(tagsInput);
    if (!content.trim()) return;
    const rec: JournalEntryRec = {
      id: crypto.randomUUID?.() || String(Date.now()),
      createdAt: new Date().toISOString(),
      content: content.trim(),
      tags,
      mood
    };
    upsertEntry(rec);
    setContent(""); setTagsInput("");
    setList(searchEntries(query, tagFilter));

    // Event Scores V2 (si dispo)
    try {
      recordEvent?.({
        module: "journal",
        startedAt: rec.createdAt,
        endedAt: new Date().toISOString(),
        durationSec: Math.min(600, Math.max(30, Math.round(rec.content.length / 10))),
        score: Math.min(10, Math.round(rec.content.length / 80)), // proxy simple
        mood,
        meta: { tags }
      });
    } catch {}
  }

  function onDelete(id: string) {
    softDelete(id);
    setList(searchEntries(query, tagFilter));
  }

  const allTags = Array.from(new Set(loadEntries().flatMap(e => e.tags || []))).sort();

  return (
    <main aria-label="Journal">
      <PageHeader title="Journal" subtitle="Note tes pensées, ajoute des tags et retrouve-les" />
      <Card>
        <form onSubmit={onCreate} style={{ display:"grid", gap: 10 }}>
          <label>
            Humeur
            <select value={mood} onChange={(e)=>setMood(e.target.value)}>
              <option value="calme">Calme</option>
              <option value="focus">Focus</option>
              <option value="joyeux">Joyeux</option>
              <option value="nostalgique">Nostalgique</option>
              <option value="tendu">Tendu</option>
            </select>
          </label>

          <label>
            Contenu
            <Textarea
              rows={5}
              value={content}
              onChange={(e)=>setContent(e.target.value)}
              placeholder="Écris librement…"
            />
          </label>

          <label>
            Tags (séparés par des virgules)
            <Input
              type="text"
              value={tagsInput}
              onChange={(e)=>setTagsInput(e.target.value)}
              placeholder="ex: travail, sommeil, gratitude"
            />
          </label>

          <div style={{ display:"flex", gap:8 }}>
            <Button type="submit" data-ui="primary-cta">Ajouter</Button>
            <Button type="button" onClick={() => { setContent(""); setTagsInput(""); }}>Vider</Button>
          </div>
        </form>
      </Card>

      <Card style={{ marginTop: 12 }}>
        <section style={{ display:"grid", gap: 8 }}>
          <label>
            Recherche
            <Input type="search" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Texte ou #tag" />
          </label>

          <div style={{ display:"flex", flexWrap:"wrap", gap: 6 }}>
            <button
              aria-pressed={!tagFilter}
              onClick={() => setTagFilter(undefined)}
              style={{ padding:"4px 8px", borderRadius: 999 }}
            >Tous</button>
            {allTags.map(t => (
              <button key={t}
                aria-pressed={tagFilter === t}
                onClick={() => setTagFilter(t)}
                style={{ padding:"4px 8px", borderRadius: 999 }}
              >#{t}</button>
            ))}
          </div>

          <ul style={{ listStyle:"none", padding:0, display:"grid", gap: 8 }}>
            {list.map(e => (
              <li key={e.id} style={{ border:"1px solid var(--card)", borderRadius: 12, padding: 10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", gap:8 }}>
                  <small>{new Date(e.createdAt).toLocaleString()}</small>
                  <div style={{ display:"flex", gap: 6 }}>
                    {(e.tags || []).map(t => <span key={t} style={{ opacity: .8 }}>#{t}</span>)}
                  </div>
                </div>
                <p style={{ whiteSpace:"pre-wrap", marginTop: 6 }}>{e.content}</p>
                <div style={{ display:"flex", gap:8 }}>
                  <Button onClick={() => onDelete(e.id)}>Supprimer</Button>
                </div>
              </li>
            ))}
            {!list.length && <em>Aucune entrée pour l’instant.</em>}
          </ul>
        </section>
      </Card>
    </main>
  );
}
