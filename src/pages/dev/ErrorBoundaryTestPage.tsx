import React from 'react';
import { Button } from '@/components/ui/button';
import { useError } from '@/contexts';
import { PageErrorBoundary } from '@/components/error/PageErrorBoundary';

const Thrower: React.FC<{ onSettled: () => void }> = ({ onSettled }) => {
  React.useEffect(() => {
    const timeout = setTimeout(onSettled, 0);
    return () => clearTimeout(timeout);
  }, [onSettled]);
  throw new Error('Test boundary failure');
};

export default function ErrorBoundaryTestPage() {
  const { notify } = useError();
  const [shouldThrow, setShouldThrow] = React.useState(false);
  const [resetKey, setResetKey] = React.useState(0);

  const triggerToast = React.useCallback(() => {
    notify({ code: 'SERVER', messageKey: 'errors.internalServerError' }, { route: '/dev/error-boundary' });
  }, [notify]);

  const triggerDoubleToast = React.useCallback(() => {
    triggerToast();
    triggerToast();
  }, [triggerToast]);

  return (
    <div data-testid="page-root" className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6">
      <PageErrorBoundary
        route="/dev/error-boundary"
        feature="error-boundary-test"
        resetKeys={[resetKey]}
        onReset={() => {
          setShouldThrow(false);
          setResetKey(prev => prev + 1);
        }}
      >
        {shouldThrow ? <Thrower onSettled={() => setShouldThrow(false)} /> : null}
      </PageErrorBoundary>

      <Button data-testid="trigger-error" onClick={() => setShouldThrow(true)}>
        Provoquer une erreur
      </Button>
      <Button data-testid="trigger-toast" onClick={triggerToast}>
        Déclencher un toast
      </Button>
      <Button data-testid="trigger-toast-twice" onClick={triggerDoubleToast}>
        Déclencher deux toasts rapides
      </Button>
    </div>
  );
}
