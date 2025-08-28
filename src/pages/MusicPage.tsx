import React from 'react';
import { useSunoSession } from '@/hooks/useSunoSession';
import { useHumeEmotions } from '@/hooks/useHumeEmotions';
import { SessionHeader } from '@/components/music/SessionHeader';
import { MoodPresetPicker } from '@/components/music/MoodPresetPicker';
import { BlendKnob } from '@/components/music/BlendKnob';
import { SunoPlayer } from '@/components/music/SunoPlayer';
import { NowPlayingA11y } from '@/components/music/NowPlayingA11y';

export default function MusicPage() {
  const { start, next, stop, save, state } = useSunoSession();
  const { blend } = useHumeEmotions({ enabled: state.source === 'hume' });

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Musicothérapie
          </h1>
          <p className="text-muted-foreground">
            Sessions musicales adaptatives anti-stress
          </p>
        </header>

        <SessionHeader 
          cover={state.coverUrl} 
          tags={state.tags}
          preset={state.preset}
        />

        <MoodPresetPicker 
          value={state.preset} 
          onChange={(preset) => state.setPreset(preset)}
          disabled={state.playing}
        />

        {state.humeEnabled && (
          <BlendKnob 
            value={blend} 
            disabled={!state.humeEnabled || !state.playing}
            onChange={(newBlend) => state.setBlend(newBlend)}
          />
        )}

        <SunoPlayer
          src={state.trackUrl}
          loading={state.loading}
          playing={state.playing}
          onStart={() => start()}
          onNext={() => next({ blend })}
          onStop={() => stop()}
          onSave={() => save()}
          canSave={!!state.sessionId && state.trackUrl !== null}
        />

        <NowPlayingA11y 
          title={state.nowLabel} 
          playing={state.playing}
        />
      </div>
    </main>
  );
}