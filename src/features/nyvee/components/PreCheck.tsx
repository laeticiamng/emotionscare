// @ts-nocheck
import type { FC } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { captureException } from '@/lib/ai-monitoring';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FocusTrap } from '@/components/ui/AccessibilityOptimized';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/logger';

interface PreCheckProps {
  visible: boolean;
  summaryLabel: string;
  onStart: () => Promise<void>;
  prefersReducedMotion?: boolean;
}

export const PreCheck: FC<PreCheckProps> = ({
  visible,
  summaryLabel,
  onStart,
  prefersReducedMotion = false,
}) => {
  const [dismissed, setDismissed] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (visible && !dismissed) {
      Sentry.addBreadcrumb({ category: 'stai6', level: 'info', message: 'stai6:pre:shown' });
      setAnnouncement('Invitation disponible pour ressentir le niveau de tension.');
    }
  }, [visible, dismissed]);

  useEffect(() => {
    if (!visible) {
      setDismissed(false);
      setIsStarting(false);
    }
  }, [visible]);

  const handleStart = useCallback(async () => {
    setIsStarting(true);
    try {
      await onStart();
      setDismissed(true);
    } catch (error) {
      logger.error('[PreCheck] unable to launch STAI-6 pre-check', error as Error, 'SYSTEM');
    } finally {
      setIsStarting(false);
    }
  }, [onStart]);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
  }, []);

  const shouldRender = visible && !dismissed;
  const motionClass = prefersReducedMotion ? 'transition-none' : 'animate-in fade-in slide-in-from-bottom-2';

  const statusId = useMemo(() => `pre-check-status-${Math.random().toString(36).slice(2, 8)}`, []);

  if (!shouldRender) {
    return null;
  }

  return (
    <FocusTrap active>
      <section
        aria-live="polite"
        aria-describedby={statusId}
        className={cn(
          'mx-auto mt-6 max-w-3xl rounded-2xl border border-indigo-400/30 bg-indigo-950/60 p-4 shadow-lg backdrop-blur',
          motionClass,
        )}
      >
        <Card className="border-none bg-transparent shadow-none">
          <CardContent className="p-0">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p id={statusId} className="text-sm font-medium text-indigo-100">
                  {announcement || 'Préparer un ancrage doux avant de plonger dans Nyvée.'}
                </p>
                <p className="mt-1 text-sm text-indigo-200/80">
                  Ton ressenti actuel guidera la scène : {summaryLabel}.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="secondary"
                  className="bg-white/90 text-indigo-900 hover:bg-white"
                  disabled={isStarting}
                  onClick={handleStart}
                >
                  Commencer en douceur
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-indigo-100 hover:bg-indigo-900/40"
                  onClick={handleDismiss}
                >
                  Plus tard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </FocusTrap>
  );
};

export default PreCheck;
