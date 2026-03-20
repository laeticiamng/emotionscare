'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { FocusTrap, useReducedMotion } from '@/components/ui/AccessibilityOptimized';

interface ListenTwoMinutesBannerProps {
  open: boolean;
  onAccept: () => void;
  onLater: () => void;
}

export default function ListenTwoMinutesBanner({
  open,
  onAccept,
  onLater,
}: ListenTwoMinutesBannerProps): JSX.Element | null {
  const [isOpen, setIsOpen] = useState(open);
  const prefersReducedMotion = useReducedMotion();
  const bannerRef = useRef<HTMLDivElement | null>(null);
  const primaryRef = useRef<HTMLButtonElement | null>(null);

  const handleAccept = useCallback(() => {
    onAccept();
    setIsOpen(false);
  }, [onAccept]);

  const handleLater = useCallback(() => {
    onLater();
    setIsOpen(false);
  }, [onLater]);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const node = bannerRef.current;

    if (node) {
      requestAnimationFrame(() => {
        primaryRef.current?.focus({ preventScroll: true });
      });
    }

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleLater();
      }
    };

    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('keydown', handleKey);
      previouslyFocused?.focus?.();
    };
  }, [handleLater, isOpen]);

  if (!isOpen) {
    return null;
  }

  const motionClass = prefersReducedMotion
    ? 'transition-none'
    : 'transition-all duration-150 ease-out';

  return (
    <div
      ref={bannerRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby="listen-banner-title"
      aria-describedby="listen-banner-description"
      aria-live="polite"
      className={`rounded-2xl border border-emerald-100 bg-white p-6 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ${motionClass}`}
    >
      <FocusTrap active>
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-wide text-emerald-600" id="listen-banner-title">
            Écoute deux minutes ?
          </p>
          <p className="text-base text-emerald-900" id="listen-banner-description">
            On peut simplement rester côte à côte, en silence ou avec un souffle doux. Tu choisis le rythme.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              ref={primaryRef}
              type="button"
              className="bg-emerald-900 text-emerald-50 hover:bg-emerald-800"
              onClick={handleAccept}
            >
              Oui
            </Button>
            <Button type="button" variant="ghost" className="text-emerald-800 hover:bg-emerald-100" onClick={handleLater}>
              Plus tard
            </Button>
          </div>
        </div>
      </FocusTrap>
    </div>
  );
}
