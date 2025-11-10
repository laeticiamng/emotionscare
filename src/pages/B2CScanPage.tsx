import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Sentry from '@sentry/react';
import { supabase } from '@/integrations/supabase/client';
import { Link, useLocation } from 'react-router-dom';
import { usePageSEO } from '@/hooks/usePageSEO';

import PageRoot from '@/components/common/PageRoot';
import { Button } from '@/components/ui/button';
import { ClinicalOptIn } from '@/components/consent/ClinicalOptIn';
import { MedicalDisclaimerDialog, useMedicalDisclaimer } from '@/components/medical/MedicalDisclaimerDialog';
import { useFlags } from '@/core/flags';
import CameraSampler from '@/features/scan/CameraSampler';
import SamSliders from '@/features/scan/SamSliders';
import MicroGestes from '@/features/scan/MicroGestes';
import { useSamOrchestration } from '@/features/mood/useSamOrchestration';
import { ConsentGate } from '@/features/clinical-optin/ConsentGate';
import { useAssessment } from '@/hooks/useAssessment';
import { withGuard } from '@/routerV2/withGuard';
import { AssessmentWrapper } from '@/components/assess';
import { logger } from '@/lib/logger';
import { ScanHistory } from '@/components/scan/ScanHistory';
import { MultiSourceChart } from '@/components/scan/MultiSourceChart';
import { ScanOnboarding, shouldShowOnboarding } from '@/components/scan/ScanOnboarding';
import { useToast } from '@/hooks/use-toast';
import { scanAnalytics } from '@/lib/analytics/scanEvents';
import { Camera, Mic, FileText, Sliders } from 'lucide-react';

const mapToSamScale = (value: number) => {
  const normalized = Math.max(0, Math.min(100, value));
  const scaled = Math.round((normalized / 100) * 8) + 1;
  return Math.max(1, Math.min(9, scaled));
};

const B2CScanPage: React.FC = () => {
  usePageSEO({
    title: 'Scan Émotionnel - Analyse IA',
    description: 'Analysez vos émotions en temps réel avec notre IA : scan facial, vocal, image ou texte. Obtenez des insights personnalisés et recommandations musicales.',
    keywords: 'scan émotions, analyse faciale, reconnaissance vocale, IA émotionnelle'
  });

  const { has } = useFlags();
  const { toast } = useToast();
  const location = useLocation();
  const { detail, gestures } = useSamOrchestration();
  const { state: samState, submit: submitSam, grantConsent, declineConsent } = useAssessment('SAM');
  const [mode, setMode] = useState<'sliders' | 'camera'>('sliders');
  const [edgeUnavailable, setEdgeUnavailable] = useState(false);
  const [cameraDenied, setCameraDenied] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(shouldShowOnboarding());
  const lastSubmittedRef = useRef<string | null>(null);

  const {
    showDisclaimer,
    isAccepted,
    handleAccept,
    handleDecline,
  } = useMedicalDisclaimer('emotional_scan');

  const featureEnabled = has('FF_SCAN_SAM');
  
  const scanModes = [
    { 
      id: 'scanner', 
      label: 'Scanner', 
      icon: Sliders, 
      path: '/app/scan',
      description: 'Curseurs et caméra'
    },
    { 
      id: 'facial', 
      label: 'Facial', 
      icon: Camera, 
      path: '/app/scan/facial',
      description: 'Reconnaissance faciale IA'
    },
    { 
      id: 'voice', 
      label: 'Vocal', 
      icon: Mic, 
      path: '/app/scan/voice',
      description: 'Analyse de la voix'
    },
    { 
      id: 'text', 
      label: 'Texte', 
      icon: FileText, 
      path: '/app/scan/text',
      description: 'Analyse textuelle'
    },
  ];
  
  const currentMode = scanModes.find(m => m.path === location.pathname) || scanModes[0];

  useEffect(() => {
    Sentry.addBreadcrumb({ category: 'scan', level: 'info', message: 'scan:open' });
  }, []);

  useEffect(() => {
    if (!detail) {
      return;
    }

    if (!samState.hasConsent || !samState.isFlagEnabled || samState.isSubmitting) {
      return;
    }

    if (lastSubmittedRef.current === detail.ts) {
      return;
    }

    lastSubmittedRef.current = detail.ts;
    submitSam(
      {
        '1': mapToSamScale(detail.valence),
        '2': mapToSamScale(detail.arousal),
      },
      { timestamp: detail.ts },
    )
      .then(success => {
        if (success) {
          Sentry.addBreadcrumb({
            category: 'scan',
            level: 'info',
            message: 'scan:submit',
            data: { source: detail.source, summary: detail.summary },
          });
          
          scanAnalytics.scanSubmitted(
            detail.source,
            detail.valence,
            detail.arousal,
            samState.hasConsent
          );
          scanAnalytics.feedbackShown('toast', 3000);
          
          toast({
            title: 'État émotionnel enregistré',
            description: detail.summary || 'Vos données ont été sauvegardées avec succès.',
            duration: 3000,
          });
        } else {
          lastSubmittedRef.current = null;
        }
      })
      .catch(() => {
        lastSubmittedRef.current = null;
      });
  }, [detail, samState.hasConsent, samState.isFlagEnabled, samState.isSubmitting, submitSam, toast]);

  const handleCameraPermission = useCallback(
    (status: 'allowed' | 'denied') => {
      if (status === 'allowed') {
        setCameraDenied(false);
        setEdgeUnavailable(false);
        Sentry.addBreadcrumb({ category: 'scan', level: 'info', message: 'scan:camera:allowed' });
      } else {
        setCameraDenied(true);
        setMode('sliders');
        Sentry.addBreadcrumb({ category: 'scan', level: 'info', message: 'scan:camera:denied' });
      }
    },
    [],
  );

  const handleUnavailable = useCallback(
    (reason: 'edge' | 'hardware') => {
      if (reason === 'edge') {
        setEdgeUnavailable(true);
        setMode('sliders');
      }
      if (reason === 'hardware') {
        setCameraDenied(true);
        setMode('sliders');
      }
    },
    [],
  );

  const shouldPromptConsent =
    samState.canDisplay &&
    !samState.isConsentLoading &&
    !samState.isDNTEnabled &&
    !samState.hasConsent &&
    samState.consentDecision !== 'declined';

  // Pour la caméra, on veut l'émotion spécifique, pas le résumé du quadrant
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null);
  
  // Récupérer l'émotion spécifique depuis l'historique quand disponible
  useEffect(() => {
    if (detail?.source === 'scan_camera') {
      // L'émotion sera disponible dans l'historique, on l'extrait du dernier signal
      const checkEmotion = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const { data: signals } = await supabase
          .from('clinical_signals')
          .select('metadata')
          .eq('user_id', user.id)
          .eq('source_instrument', 'scan_camera')
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (signals && signals.length > 0) {
          const metadata = signals[0].metadata as any;
          if (metadata?.summary) {
            setDetectedEmotion(metadata.summary);
          }
        }
      };
      checkEmotion();
    } else if (detail?.source === 'scan_sliders') {
      // Pour les sliders, utiliser le résumé du quadrant
      setDetectedEmotion(null);
    }
  }, [detail?.source, detail?.ts]);
  
  const activeSummary = detail?.summary;
  const displayEmotion = detectedEmotion || activeSummary;

  const cameraDisabled = cameraDenied || edgeUnavailable;

  const modeLabel = useMemo(() => (mode === 'camera' ? 'Caméra active' : 'Curseurs sensoriels'), [mode]);

  if (!featureEnabled) {
    return (
      <PageRoot>
        <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-primary/10">
          <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-12">
            <h1 className="text-3xl font-semibold text-foreground">Scanner émotionnel indisponible</h1>
            <p className="text-sm text-muted-foreground">
              Cette expérience en temps réel est temporairement désactivée pour votre espace. Aucun signal n'est enregistré.
            </p>
          </div>
        </div>
      </PageRoot>
    );
  }

  return (
    <ConsentGate>
      <MedicalDisclaimerDialog
        open={showDisclaimer}
        onAccept={handleAccept}
        onDecline={handleDecline}
        feature="emotional_scan"
      />
      {isAccepted && (
        <PageRoot>
        {showOnboarding && (
          <ScanOnboarding onComplete={() => setShowOnboarding(false)} />
        )}
        <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/10">
          <div className="container mx-auto flex flex-col gap-10 px-4 py-10">
          
          {/* Navigation des modalités de scan */}
          <nav className="flex gap-2 overflow-x-auto pb-2">
            {scanModes.map((scanMode) => {
              const Icon = scanMode.icon;
              const isActive = scanMode.path === location.pathname;
              
              return (
                <Link
                  key={scanMode.id}
                  to={scanMode.path}
                  className={`flex items-center gap-3 rounded-2xl px-6 py-4 transition-all hover:scale-[1.02] flex-shrink-0 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-white/5 backdrop-blur border border-white/10 hover:bg-white/10'
                  }`}
                  onClick={() => {
                    if (scanMode.id !== 'scanner') {
                      scanAnalytics.modeChanged(mode, scanMode.id as any);
                    }
                  }}
                >
                  <Icon className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">{scanMode.label}</div>
                    <div className={`text-xs ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                      {scanMode.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>
          
          <header className="space-y-4">
            <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-4 py-1 text-xs font-medium text-primary">
              {modeLabel}
            </span>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold leading-tight text-foreground">
                Scanner émotionnel léger
              </h1>
              <p className="max-w-2xl text-base text-muted-foreground">
                Valence et activation sont captées en douceur pour colorer l'interface. Aucun chiffre n'apparaît, seules des
                nuances décrivent le ressenti.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant={mode === 'sliders' ? 'default' : 'outline'}
                onClick={() => {
                  if (mode !== 'sliders') {
                    scanAnalytics.modeChanged(mode, 'sliders');
                  }
                  setMode('sliders');
                }}
              >
                Ajuster via les curseurs
              </Button>
              <Button
                variant={mode === 'camera' ? 'default' : 'outline'}
                onClick={() => {
                  if (mode !== 'camera') {
                    scanAnalytics.modeChanged(mode, 'camera');
                  }
                  setMode('camera');
                  setEdgeUnavailable(false);
                  setCameraDenied(false);
                }}
              >
                Activer la caméra
              </Button>
            </div>
            {edgeUnavailable && (
              <p className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary">
                La captation Edge est momentanément indisponible. Les curseurs restent actifs pour partager votre état.
              </p>
            )}
            {cameraDenied && (
              <p className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary">
                L'accès caméra a été refusé. Vous pouvez ajuster les curseurs sensoriels quand vous le souhaitez.
              </p>
            )}
          </header>

          {shouldPromptConsent && (
            <ClinicalOptIn
              title="Activer l'enregistrement clinique SAM"
              description="Si vous acceptez, une trace anonyme est conservée pour enrichir vos suivis. Vous pouvez changer d'avis à tout moment."
              acceptLabel="Je partage ce ressenti"
              declineLabel="Je préfère rester local"
              onAccept={() => {
                scanAnalytics.consentAccepted('clinical');
                grantConsent();
              }}
              onDecline={() => {
                scanAnalytics.consentDeclined('clinical');
                declineConsent();
              }}
              isProcessing={samState.isConsentLoading}
              error={samState.error}
            />
          )}

          {/* Temporairement désactivé - problème avec assess-start */}
          {/* 
          <AssessmentWrapper
            instrument="SAM"
            title="Ressenti instantané"
            description="2 curseurs pour colorer l'interface selon votre état"
            context="adhoc"
            estimatedTime={1}
            onComplete={(badges) => {
              logger.info('SAM badges', { badges }, 'UI');
            }}
            className="mb-6"
          />
          */}

          <main className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div className="space-y-8">
              {mode === 'camera' && !cameraDisabled ? (
                <CameraSampler
                  summary={activeSummary}
                  onPermissionChange={handleCameraPermission}
                  onUnavailable={handleUnavailable}
                />
              ) : (
                <SamSliders detail={detail} summary={activeSummary} />
              )}
              <ScanHistory />
              <MultiSourceChart />
            </div>
            <MicroGestes 
              gestures={gestures} 
              summary={activeSummary}
              emotion={displayEmotion}
              valence={detail?.valence}
              arousal={detail?.arousal}
            />
          </main>
          </div>
        </div>
      </PageRoot>
      )}
    </ConsentGate>
  );
};

// Auth guard géré par le router via registry (guard: true, requireAuth: true)
export default B2CScanPage;
