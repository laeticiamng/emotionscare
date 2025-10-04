interface BreathProgressProps {
  stepLabel: string;
  stepProgress: number;
  sessionProgress: number;
}

const clamp = (value: number) => Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));

export function BreathProgress({ stepLabel, stepProgress, sessionProgress }: BreathProgressProps) {
  const stepWidth = `${Math.round(clamp(stepProgress) * 100)}%`;
  const sessionWidth = `${Math.round(clamp(sessionProgress) * 100)}%`;

  return (
    <div className="w-full space-y-4" aria-hidden="true">
      <div className="rounded-lg border border-sky-100 bg-sky-50/70 p-4">
        <p className="text-sm font-medium text-sky-900">{stepLabel}</p>
        <div className="mt-2 h-2 w-full rounded-full bg-sky-100">
          <div
            className="h-2 rounded-full bg-sky-500 transition-[width] duration-300 ease-out motion-reduce:transition-none"
            style={{ width: stepWidth }}
          />
        </div>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white/80 p-4">
        <p className="text-sm font-medium text-slate-700">Session globale</p>
        <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
          <div
            className="h-2 rounded-full bg-slate-600 transition-[width] duration-500 ease-out motion-reduce:transition-none"
            style={{ width: sessionWidth }}
          />
        </div>
      </div>
    </div>
  );
}
