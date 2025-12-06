import type { MicroGesture } from '@/features/mood/useSamOrchestration';

interface MicroGestesProps {
  gestures: MicroGesture[];
  summary?: string;
}

const icons: Record<MicroGesture['id'], string> = {
  long_exhale: '🌬️',
  drop_shoulders: '🫱',
  soft_movement: '🌀',
  gratitude_prompt: '💛',
};

const MicroGestes: React.FC<MicroGestesProps> = ({ gestures, summary }) => {
  const hasGestures = gestures.length > 0;

  return (
    <section className="rounded-3xl border border-transparent bg-white/5 p-6 shadow-lg backdrop-blur mood-surface dark:bg-slate-800/40">
      <header className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">Micro-gestes suggérés</h2>
        <p className="text-sm text-muted-foreground">
          Des invitations corporelles légères pour accompagner l’état perçu.
        </p>
        {summary && (
          <p className="mt-2 rounded-2xl bg-background/60 px-4 py-3 text-sm font-medium text-foreground shadow-inner" aria-live="polite">
            {summary}
          </p>
        )}
      </header>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {hasGestures ? (
          gestures.map(gesture => (
            <div
              key={gesture.id}
              className="flex items-center gap-4 rounded-2xl border border-primary/20 bg-background/60 p-4 shadow-sm transition-colors hover:border-primary/40"
            >
              <span className="text-2xl" aria-hidden>
                {icons[gesture.id] ?? '✨'}
              </span>
              <p className="text-sm font-medium text-foreground">{gesture.label}</p>
            </div>
          ))
        ) : (
          <p className="rounded-2xl border border-dashed border-primary/30 bg-background/50 p-4 text-sm text-muted-foreground">
            Ajustez les curseurs ou laissez la caméra capturer un instant pour débloquer des propositions.
          </p>
        )}
      </div>
    </section>
  );
};

export default MicroGestes;
