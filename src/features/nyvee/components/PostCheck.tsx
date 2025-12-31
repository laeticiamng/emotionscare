/**
 * PostCheck - Composant de post-vérification après session Nyvee
 */

import type { FC } from 'react';
import { useCallback, useEffect, useMemo, useState, memo } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FocusTrap } from '@/components/ui/AccessibilityOptimized';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/logger';

interface PostCheckProps {
  visible: boolean;
  summaryLabel: string;
  onStart: () => Promise<void>;
  prefersReducedMotion?: boolean;
}

export const PostCheck: FC<PostCheckProps> = memo(({
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
      logger.info('stai6:post:shown', undefined, 'STAI6');
      setAnnouncement('Préparer un retour doux sur le ressenti après Nyvée.');
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
      logger.error('[PostCheck] unable to launch STAI-6 post-check', error as Error, 'SYSTEM');
    } finally {
      setIsStarting(false);
    }
  }, [onStart]);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
  }, []);

  const shouldRender = visible && !dismissed;
  const motionClass = prefersReducedMotion ? 'transition-none' : 'animate-in fade-in slide-in-from-bottom-2';
  const statusId = useMemo(() => `post-check-status-${Math.random().toString(36).slice(2, 8)}`, []);

  if (!shouldRender) {
    return null;
  }

  return (
    <FocusTrap active>
      <section
        aria-live="polite"
        aria-describedby={statusId}
        role="dialog"
        aria-label="Retour post-session"
        className={cn(
          'mx-auto mt-6 max-w-3xl rounded-2xl border border-accent/30 bg-accent/10 p-4 shadow-lg backdrop-blur',
          motionClass,
        )}
      >
        <Card className="border-none bg-transparent shadow-none">
          <CardContent className="p-0">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p id={statusId} className="text-sm font-medium text-foreground">
                  {announcement || 'Partage comment ton corps se sent après le cocon.'}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Dernier repère ressenti : {summaryLabel}.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="secondary"
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  disabled={isStarting}
                  onClick={handleStart}
                  aria-busy={isStarting}
                >
                  {isStarting ? 'Chargement...' : 'Ajouter mon ressenti'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  onClick={handleDismiss}
                >
                  Pas maintenant
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </FocusTrap>
  );
});

PostCheck.displayName = 'PostCheck';

export default PostCheck;
