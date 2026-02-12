import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { captureException } from '@/lib/ai-monitoring';
import { Sentry } from '@/lib/errors/sentry-compat';
import { CoachView } from '@/modules/coach/CoachView';
import { ConsentGate } from '@/features/clinical-optin/ConsentGate';
import { MedicalDisclaimerDialog, useMedicalDisclaimer } from '@/components/medical/MedicalDisclaimerDialog';
import { usePageSEO } from '@/hooks/usePageSEO';
import { useOptimizedPage } from '@/hooks/useOptimizedPage';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Target } from 'lucide-react';

const B2CAICoachPage = () => {
  useOptimizedPage('B2CAICoachPage');
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
      Sentry.configureScope((scope: any) => {
        scope.setTag('coach_entry', 'b2c');
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background" data-testid="page-root">
      <MedicalDisclaimerDialog
        open={showDisclaimer}
        onAccept={handleAccept}
        onDecline={handleDecline}
        feature="ai_coach"
      />
      {isAccepted && (
        <ConsentGate>
          {/* Quick Actions Bar */}
          <div className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-10">
            <div className="container mx-auto px-4 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/app/home">
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Retour
                    </Link>
                  </Button>
                  <span className="text-sm font-medium text-muted-foreground">Coach IA Nyvée - Votre accompagnement émotionnel 24/7</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/dashboard/settings">
                      <Target className="h-4 w-4 mr-1" />
                      Paramètres
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <CoachView initialMode="b2c" />
        </ConsentGate>
      )}
    </div>
  );
};

export default B2CAICoachPage;
