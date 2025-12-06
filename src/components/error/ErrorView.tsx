import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ErrorViewType = '401' | '403' | '404' | '500';

interface ErrorViewProps {
  type: ErrorViewType;
  onRetry?: () => void;
  actions?: React.ReactNode;
  className?: string;
}

export default function ErrorView({ type, onRetry, actions, className }: ErrorViewProps) {
  const { t } = useTranslation(['errors', 'common', 'auth']);

  const labels: Record<ErrorViewType, { title: string; description: string }> = {
    '401': {
      title: t('errors.notAuthenticated'),
      description: t('errors.sessionExpired'),
    },
    '403': {
      title: t('errors.accessDenied'),
      description: t('errors.forbidden'),
    },
    '404': {
      title: t('errors.notFound'),
      description: t('errors.somethingWentWrong'),
    },
    '500': {
      title: t('errors.internalServerError'),
      description: t('errors.contactSupport'),
    },
  };

  const content = labels[type];

  return (
    <section
      data-testid="error-view"
      role="alert"
      aria-live="polite"
      className={cn('flex min-h-[60vh] items-center justify-center bg-background px-4 py-12', className)}
    >
      <div className="mx-auto w-full max-w-xl rounded-lg border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <AlertTriangle aria-hidden className="h-8 w-8 text-primary" />
        </div>
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">{type}</p>
        <h1 className="mt-2 text-2xl font-semibold text-foreground">{content.title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{content.description}</p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          {onRetry ? (
            <Button onClick={onRetry}>{t('common:retry')}</Button>
          ) : null}
          {actions}
        </div>
      </div>
    </section>
  );
}
