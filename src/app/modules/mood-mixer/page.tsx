import * as DS from "@/COMPONENTS.reg";
import { recordEvent } from "@/lib/scores/events";
import { ff } from "@/lib/flags/ff";
const PageHeader = DS.PageHeader || (({ title, subtitle }: any) => (
  <header><h1>{title}</h1><p>{subtitle}</p></header>
));
const Button = DS.Button || (({ children, ...props }: any) => <button {...props}>{children}</button>);
const AudioPlayer = DS.AudioPlayer;

export default function MoodMixerPage() {
  function handleStart() {
    recordEvent({
      module: "mood-mixer",
      startedAt: new Date().toISOString(),
      endedAt: new Date().toISOString(),
    });
  }
  return (
    <main className="p-4 space-y-4">
      <PageHeader title="MoodMixer" subtitle="Experience the module" />
      <p>Bienvenue dans le module MoodMixer.</p>
      <Button onClick={handleStart}>Commencer</Button>
    </main>
  const useNew = ff?.("new-audio-engine") ?? false;

  return (
    <>
      {useNew && <link rel="preload" as="audio" href="/audio/lofi-120.mp3" />}
      <main className="p-4 space-y-4">
        <PageHeader title="MoodMixer" subtitle="Experience the module" />
        <p>Bienvenue dans le module MoodMixer.</p>
        {useNew ? (
          <AudioPlayer src="/audio/lofi-120.mp3" title="Lofi 120" loop defaultVolume={0.7} haptics />
        ) : (
          <Button>Commencer</Button>
        )}
      </main>
    </>
  );
}
