// @ts-nocheck
import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ClinicalOptInProps {
  title: string;
  description: string;
  acceptLabel?: string;
  declineLabel?: string;
  privacyLabel?: string;
  privacyHref?: string;
  onAccept: () => Promise<void> | void;
  onDecline: () => Promise<void> | void;
  isProcessing?: boolean;
  error?: string | null;
  className?: string;
}

export const ClinicalOptIn: React.FC<ClinicalOptInProps> = ({
  title,
  description,
  acceptLabel = 'Oui, activer',
  declineLabel = 'Plus tard',
  privacyLabel = 'Politique de confidentialité',
  privacyHref = '/legal/privacy',
  onAccept,
  onDecline,
  isProcessing = false,
  error,
  className
}) => {
  const handleAccept = useCallback(async () => {
    await onAccept();
  }, [onAccept]);

  const handleDecline = useCallback(async () => {
    await onDecline();
  }, [onDecline]);

  return (
    <Card className={cn('border-dashed border-primary/30 bg-primary/5', className)}>
      <CardContent className="flex flex-col gap-4 p-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {description}
          </p>
        </div>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={handleAccept} disabled={isProcessing}>
            {acceptLabel}
          </Button>
          <Button onClick={handleDecline} variant="ghost" disabled={isProcessing}>
            {declineLabel}
          </Button>
          <Link
            to={privacyHref}
            className="text-sm underline text-muted-foreground hover:text-foreground"
          >
            {privacyLabel}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClinicalOptIn;
