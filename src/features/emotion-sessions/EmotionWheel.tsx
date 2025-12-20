import { useMemo } from 'react';
import {
  Heart,
  Smile,
  ShieldAlert,
  Sparkles,
  Frown,
  Skull,
  Flame,
  Rocket,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type EmotionWheelValue =
  | 'joy'
  | 'trust'
  | 'fear'
  | 'surprise'
  | 'sadness'
  | 'disgust'
  | 'anger'
  | 'anticipation';

const EMOTION_OPTIONS: Array<{
  value: EmotionWheelValue;
  label: string;
  icon: typeof Smile;
  color: string;
}> = [
  { value: 'joy', label: 'Joie', icon: Smile, color: 'text-yellow-500' },
  { value: 'trust', label: 'Confiance', icon: Heart, color: 'text-emerald-500' },
  { value: 'fear', label: 'Peur', icon: ShieldAlert, color: 'text-blue-500' },
  { value: 'surprise', label: 'Surprise', icon: Sparkles, color: 'text-violet-500' },
  { value: 'sadness', label: 'Tristesse', icon: Frown, color: 'text-indigo-500' },
  { value: 'disgust', label: 'Dégoût', icon: Skull, color: 'text-rose-500' },
  { value: 'anger', label: 'Colère', icon: Flame, color: 'text-red-500' },
  { value: 'anticipation', label: 'Anticipation', icon: Rocket, color: 'text-amber-500' },
];

interface EmotionWheelProps {
  value: EmotionWheelValue | null;
  onChange: (value: EmotionWheelValue) => void;
}

const POSITIONS = [
  { angle: -90 },
  { angle: -45 },
  { angle: 0 },
  { angle: 45 },
  { angle: 90 },
  { angle: 135 },
  { angle: 180 },
  { angle: 225 },
];

export function EmotionWheel({ value, onChange }: EmotionWheelProps) {
  const items = useMemo(
    () =>
      EMOTION_OPTIONS.map((emotion, index) => ({
        ...emotion,
        position: POSITIONS[index % POSITIONS.length],
      })),
    [],
  );

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative h-64 w-64">
        <div className="absolute inset-6 rounded-full border border-dashed border-muted-foreground/40" />
        <div className="absolute inset-0 rounded-full border border-muted-foreground/20" />
        {items.map(({ value: emotionValue, label, icon: Icon, color, position }) => {
          const radians = (position.angle * Math.PI) / 180;
          const radius = 110;
          const x = Math.cos(radians) * radius;
          const y = Math.sin(radians) * radius;
          const isSelected = value === emotionValue;

          return (
            <button
              key={emotionValue}
              type="button"
              onClick={() => onChange(emotionValue)}
              className={cn(
                'absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-background shadow-sm transition',
                isSelected
                  ? 'border-primary ring-2 ring-primary/40'
                  : 'border-muted hover:border-primary/60',
              )}
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
              aria-label={`Sélectionner ${label}`}
            >
              <Icon className={cn('h-6 w-6', color)} />
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        {EMOTION_OPTIONS.map(({ value: emotionValue, label }) => (
          <div
            key={emotionValue}
            className={cn(
              'rounded-full border px-2 py-1 text-center',
              value === emotionValue
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-muted',
            )}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

export const emotionWheelOptions = EMOTION_OPTIONS;
