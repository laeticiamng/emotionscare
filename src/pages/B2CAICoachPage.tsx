// @ts-nocheck
import { useEffect } from 'react';
import * as Sentry from '@sentry/react';
import { CoachView } from '@/modules/coach/CoachView';
import { ConsentGate } from '@/features/clinical-optin/ConsentGate';

const B2CAICoachPage = () => {
  useEffect(() => {
    const client = Sentry.getCurrentHub().getClient();
    if (client) {
      Sentry.configureScope(scope => {
        scope.setTag('coach_entry', 'b2c');
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950" data-testid="page-root">
      <ConsentGate>
        <CoachView initialMode="b2c" />
      </ConsentGate>
    </div>
  );
};

export default B2CAICoachPage;
