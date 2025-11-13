import { useEffect } from 'react';
import { captureException } from '@/lib/ai-monitoring';
import { CoachView } from '@/modules/coach/CoachView';
import { ConsentGate } from '@/features/clinical-optin/ConsentGate';
import { MedicalDisclaimerDialog, useMedicalDisclaimer } from '@/components/medical/MedicalDisclaimerDialog';
import { usePageSEO } from '@/hooks/usePageSEO';

const B2CAICoachPage = () => {
  usePageSEO({
    title: 'Coach IA Émotionnel - Conseils personnalisés',
    description: 'Discutez avec votre coach émotionnel IA 24/7. Conseils bien-être, gestion du stress, développement personnel avec intelligence artificielle.',
    keywords: 'coach IA, intelligence émotionnelle, conseils bien-être, développement personnel'
  });

  const {
    showDisclaimer,
    isAccepted,
    handleAccept,
    handleDecline,
  } = useMedicalDisclaimer('ai_coach');

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
      <MedicalDisclaimerDialog
        open={showDisclaimer}
        onAccept={handleAccept}
        onDecline={handleDecline}
        feature="ai_coach"
      />
      {isAccepted && (
        <ConsentGate>
          <CoachView initialMode="b2c" />
        </ConsentGate>
      )}
    </div>
  );
};

export default B2CAICoachPage;
