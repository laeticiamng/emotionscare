// @ts-nocheck
import React from 'react';
import { cn } from '@/lib/utils';

export type AuthBackdropVariant = 'consumer' | 'business' | 'admin';

interface AuthBackdropProps {
  imageUrl?: string;
  variant?: AuthBackdropVariant;
}

const palette: Record<AuthBackdropVariant, {
  gradient: string;
  primaryBlob: string;
  secondaryBlob: string;
}> = {
  consumer: {
    gradient:
      'bg-gradient-to-br from-sky-300/40 via-transparent to-purple-300/30 dark:from-slate-950 dark:via-indigo-950/80 dark:to-slate-950',
    primaryBlob: 'bg-sky-400/25 dark:bg-sky-600/25',
    secondaryBlob: 'bg-purple-400/20 dark:bg-purple-700/20',
  },
  business: {
    gradient:
      'bg-gradient-to-br from-emerald-200/45 via-transparent to-sky-200/35 dark:from-slate-950 dark:via-emerald-950/70 dark:to-slate-950',
    primaryBlob: 'bg-emerald-400/25 dark:bg-emerald-600/25',
    secondaryBlob: 'bg-sky-400/20 dark:bg-sky-700/25',
  },
  admin: {
    gradient:
      'bg-gradient-to-br from-purple-200/45 via-transparent to-indigo-200/35 dark:from-slate-950 dark:via-purple-950/70 dark:to-slate-950',
    primaryBlob: 'bg-purple-400/25 dark:bg-purple-700/25',
    secondaryBlob: 'bg-indigo-400/20 dark:bg-indigo-700/25',
  },
};

const FALLBACK_OVERLAY = 'radial-gradient(circle at 20% 20%, rgba(59,130,246,0.35), transparent 55%), radial-gradient(circle at 80% 0%, rgba(168,85,247,0.3), transparent 45%), linear-gradient(135deg, rgba(15,23,42,0.75) 0%, rgba(30,64,175,0.45) 100%)';

export const AuthBackdrop: React.FC<AuthBackdropProps> = ({ imageUrl, variant = 'consumer' }) => {
  if (imageUrl) {
    return (
      <div className="absolute inset-0" aria-hidden="true">
        <picture>
          <img
            src={imageUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
            draggable={false}
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent dark:from-black/60" />
      </div>
    );
  }

  const colors = palette[variant];

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <div className={cn('absolute inset-0 transition-colors duration-700', colors.gradient)} />
      <div className={cn('absolute -top-24 -left-32 h-[60%] w-[80%] rounded-full blur-3xl', colors.primaryBlob)} />
      <div className={cn('absolute bottom-[-18%] right-[-20%] h-[55%] w-[75%] rounded-full blur-3xl', colors.secondaryBlob)} />
      <div
        className="absolute inset-0 opacity-70 mix-blend-lighten dark:mix-blend-screen"
        style={{ backgroundImage: FALLBACK_OVERLAY }}
      />
    </div>
  );
};

export default AuthBackdrop;
