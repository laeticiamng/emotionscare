"use client";
import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AudioPlayer } from "@/ui/AudioPlayer"; // AudioPlayer (P5) si dispo
import { synthParagraphs } from "@/lib/story-synth/templates";
import { addStory, loadStories } from "@/lib/story-synth/store";
import { downloadText } from "@/lib/story-synth/export";
import { ff } from "@/lib/flags/ff";
import { recordEvent } from "@/lib/scores/events"; // P6 (toléré si absent)

type Genre = "calme"|"aventure"|"poetique"|"mysterieux"|"romance";
type Pov = "je"|"il"|"elle"|"nous";
type Style = "sobre"|"lyrique"|"journal"|"dialogue";

const AMBIENTS: Record<string, string> = {
  doux: "/audio/lofi-120.mp3",
  pluie: "/audio/rain-soft.mp3"
};

export default function StorySynthPage() {
  const [genre, setGenre] = React.useState<Genre>("calme");
  const [pov, setPov] = React.useState<Pov>("je");
  const [hero, setHero] = React.useState("Alex");
  const [place, setPlace] = React.useState("la ville");
  const [length, setLength] = React.useState(4);
  const [style, setStyle] = React.useState<Style>("sobre");
  const [seed, setSeed] = React.useState("");
  const [ambient, setAmbient] = React.useState<keyof typeof AMBIENTS | "aucun">("aucun");

  const [title, setTitle] = React.useState("Petite histoire");
  const [story, setStory] = React.useState<string[]>([]);
  const [lib, setLib] = React.useState(() => loadStories());

  const newAudio = ff?.("new-audio-engine") ?? false;

  function onGenerate() {
    const paragraphs = synthParagraphs({ genre, pov, hero, place, length, style, seed });
    setStory(paragraphs);
    try {
      recordEvent?.({
        module: "story-synth",
        startedAt: new Date().toISOString(),
        endedAt: new Date().toISOString(),
        durationSec: 10 + length * 3,
        score: Math.min(10, 2 + length),
        meta: { genre, pov, style }
      });
    } catch {}
  }

  function onContinue() {
    const more = synthParagraphs({ genre, pov, hero, place, length: Math.min(2, 2), style, seed: seed || String(Date.now()) });
    setStory(s => [...s, ...more.slice(0, 2)]);
  }

  function onSave() {
    if (!story.length) return;
    const rec = {
      id: crypto.randomUUID?.() || String(Date.now()),
      createdAt: new Date().toISOString(),
      title: title.trim() || "Histoire",
      content: story,
      tags: [genre, style],
      mood: genre
    };
    addStory(rec);
    setLib(loadStories());
    try {
      recordEvent?.({
        module: "story-synth",
        startedAt: rec.createdAt,
        endedAt: new Date().toISOString(),
        durationSec: Math.max(15, story.join(" ").length / 20),
        score: Math.min(10, Math.round(story.length / 2)),
        meta: { saved: true }
      });
    } catch {}
  }

  function onExport() {
    if (!story.length) return;
    downloadText(`${(title || "histoire").replace(/\s+/g,"-").toLowerCase()}.txt`, story);
  }

  return (
    <main aria-label="Story Synth">
      <PageHeader title="Story Synth" subtitle="Génère une courte histoire à partir d’un brief" />
      <Card>
        <section style={{ display:"grid", gap: 10 }}>
          <div style={{ display:"grid", gap: 8 }}>
            <label>Genre
              <select value={genre} onChange={(e)=>setGenre(e.target.value as Genre)}>
                <option value="calme">Calme</option>
                <option value="aventure">Aventure</option>
                <option value="poetique">Poétique</option>
                <option value="mysterieux">Mystérieux</option>
                <option value="romance">Romance</option>
              </select>
            </label>

            <label>Point de vue
              <select value={pov} onChange={(e)=>setPov(e.target.value as Pov)}>
                <option value="je">Je</option>
                <option value="il">Il</option>
                <option value="elle">Elle</option>
                <option value="nous">Nous</option>
              </select>
            </label>

            <label>Protagoniste
              <input type="text" value={hero} onChange={(e)=>setHero(e.target.value)} />
            </label>

            <label>Lieu
              <input type="text" value={place} onChange={(e)=>setPlace(e.target.value)} />
            </label>

            <label>Longueur : {length} §
              <input type="range" min={3} max={7} value={length} onChange={(e)=>setLength(parseInt(e.target.value,10))} />
            </label>

            <label>Style
              <select value={style} onChange={(e)=>setStyle(e.target.value as Style)}>
                <option value="sobre">Sobre</option>
                <option value="lyrique">Lyrique</option>
                <option value="journal">Journal</option>
                <option value="dialogue">Dialogue</option>
              </select>
            </label>

            <label>Seed (optionnel)
              <input type="text" value={seed} onChange={(e)=>setSeed(e.target.value)} placeholder="Reproductible si renseigné"/>
            </label>

            <label>Ambiance sonore
              <select value={ambient} onChange={(e)=>setAmbient(e.target.value as any)}>
                <option value="aucun">Aucun</option>
                <option value="doux">Lofi doux</option>
                <option value="pluie">Pluie</option>
              </select>
            </label>

            {newAudio && ambient !== "aucun" && (
              <AudioPlayer
                src={AMBIENTS[ambient]}
                trackId={`story-ambient-${ambient}`}
                title={`Ambiance ${ambient}`}
                loop
                defaultVolume={0.5}
              />
            )}
          </div>

          <div style={{ display:"flex", gap: 8, flexWrap:"wrap" }}>
            <Button onClick={onGenerate} data-ui="primary-cta">Générer</Button>
            <Button onClick={onContinue}>Continuer (+)</Button>
            <Button onClick={onSave}>Enregistrer</Button>
            <Button onClick={onExport}>Exporter .txt</Button>
          </div>

          <label>Titre
            <input type="text" value={title} onChange={(e)=>setTitle(e.target.value)} />
          </label>

          {!!story.length && (
            <article style={{ display:"grid", gap: 10 }}>
              {story.map((p, i) => <p key={i} style={{ whiteSpace: "pre-wrap" }}>{p}</p>)}
            </article>
          )}
        </section>
      </Card>

      <Card style={{ marginTop: 12 }}>
        <h2>Bibliothèque (local)</h2>
        <ul style={{ listStyle:"none", padding:0, display:"grid", gap:8 }}>
          {lib.map(s => (
            <li key={s.id} style={{ border:"1px solid var(--card)", borderRadius:12, padding:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", gap:8 }}>
                <strong>{s.title}</strong>
                <small>{new Date(s.createdAt).toLocaleString()}</small>
              </div>
              <p style={{ marginTop:6, opacity:.85 }}>{(s.content[0] || "").slice(0,120)}…</p>
            </li>
          ))}
          {!lib.length && <em>Aucune histoire enregistrée pour l’instant.</em>}
        </ul>
      </Card>
    </main>
  );
}
