// @ts-nocheck
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DURATION, EASE } from '@/lib/motion';

interface PageErrorFallbackProps {
  error: Error;
  resetError: () => void;
  className?: string;
}

const PageErrorFallback: React.FC<PageErrorFallbackProps> = ({
  error,
  resetError,
  className,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'flex min-h-[60vh] items-center justify-center px-4 py-10',
        className,
      )}
      style={{
        background: `
          radial-gradient(ellipse at 50% 30%, hsl(var(--destructive) / 0.04) 0%, transparent 50%),
          hsl(var(--background))
        `,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: DURATION.slow, ease: EASE.cinema }}
        className="w-full max-w-lg"
      >
        <Card className="shadow-lg border-border/50">
          <CardHeader className="text-center space-y-4 pb-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: DURATION.normal, delay: 0.2, ease: EASE.smooth }}
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10"
            >
              <AlertTriangle className="h-7 w-7 text-destructive" aria-hidden="true" />
            </motion.div>
            <CardTitle className="text-xl font-semibold tracking-tight">
              Un problème est survenu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-center text-sm text-muted-foreground leading-relaxed">
              Nous travaillons dessus. Vous pouvez réessayer ou revenir plus tard.
            </p>

            <Button onClick={resetError} className="w-full transition-all duration-200 hover:scale-[1.01]" variant="default">
              <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
              Réessayer
            </Button>

            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center justify-center gap-1 w-full text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              Détails techniques
              <ChevronDown className={cn('h-3 w-3 transition-transform', showDetails && 'rotate-180')} />
            </button>

            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: DURATION.fast }}
                className="rounded-md bg-muted/30 p-3"
              >
                <pre className="max-h-32 overflow-auto text-xs text-muted-foreground/70 whitespace-pre-wrap">
                  {error.message}
                </pre>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PageErrorFallback;
