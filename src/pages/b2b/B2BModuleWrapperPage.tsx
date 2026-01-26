/**
 * B2BModuleWrapperPage - Wrapper pour accès aux modules en contexte B2B
 * Permet l'accès anonyme aux modules wellness pour les employés B2B
 */

import React, { useEffect, useState, Suspense, lazy } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoadingAnimation from '@/components/ui/loading-animation';

// Lazy load des modules
const B2CScanPage = lazy(() => import('@/pages/B2CScanPage'));
const B2CMusicEnhancedPage = lazy(() => import('@/pages/B2CMusicEnhanced'));
const BreathPage = lazy(() => import('@/pages/B2CBreathworkPage'));
const MeditationPage = lazy(() => import('@/pages/MeditationPage'));
const FlashGlowPage = lazy(() => import('@/pages/B2CFlashGlowPage'));
const MoodMixerPage = lazy(() => import('@/pages/B2CMoodMixerPage'));
const JournalPage = lazy(() => import('@/pages/B2CJournalPage'));
const VRPage = lazy(() => import('@/pages/B2CVRGalaxyPage'));
const QuickSessionPage = lazy(() => import('@/pages/B2CBreathworkPage'));

interface SessionInfo {
  org_id: string;
  org_name: string;
  accessed_at: string;
}

 
const moduleComponents: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  'scan': B2CScanPage,
  'music': B2CMusicEnhancedPage,
  'breath': BreathPage,
  'meditation': MeditationPage,
  'flash-glow': FlashGlowPage,
  'mood-mixer': MoodMixerPage,
  'journal': JournalPage,
  'vr': VRPage,
  'quick-session': QuickSessionPage,
};

const moduleNames: Record<string, string> = {
  'scan': 'Scan Émotionnel',
  'music': 'Musique Adaptative',
  'breath': 'Respiration Guidée',
  'meditation': 'Méditation',
  'flash-glow': 'Flash Glow',
  'mood-mixer': 'Mood Mixer',
  'journal': 'Journal',
  'vr': 'Expériences VR',
  'quick-session': 'Session Rapide',
};

export default function B2BModuleWrapperPage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    // Vérifier l'accès B2B via session storage
    const stored = sessionStorage.getItem('b2b_access');
    if (stored) {
      try {
        const info = JSON.parse(stored);
        setSessionInfo(info);
        setHasAccess(true);
      } catch {
        setHasAccess(false);
      }
    } else {
      setHasAccess(false);
    }
  }, []);

  // Chargement
  if (hasAccess === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingAnimation text="Vérification de l'accès..." />
      </div>
    );
  }

  // Pas d'accès -> Rediriger vers la page d'accès
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md text-center space-y-4">
          <div className="p-4 rounded-full bg-destructive/10 w-fit mx-auto">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold">Accès requis</h1>
          <p className="text-muted-foreground">
            Veuillez d'abord entrer votre code d'accès entreprise pour accéder à ce module.
          </p>
          <Button asChild>
            <Link to="/b2b/access">
              <Lock className="h-4 w-4 mr-2" />
              Entrer le code d'accès
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Module non trouvé
  if (!moduleId || !moduleComponents[moduleId]) {
    return <Navigate to="/b2b/wellness" replace />;
  }

  const ModuleComponent = moduleComponents[moduleId];
  const moduleName = moduleNames[moduleId] || 'Module';

  return (
    <div className="min-h-screen bg-background">
      {/* Header B2B avec retour */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/b2b/wellness">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'espace bien-être
            </Link>
          </Button>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-3 w-3" />
            <span>Session sécurisée • {sessionInfo?.org_name}</span>
          </div>
        </div>
      </header>

      {/* Contenu du module */}
      <Suspense
        fallback={
          <div className="min-h-[80vh] flex items-center justify-center">
            <LoadingAnimation text={`Chargement de ${moduleName}...`} />
          </div>
        }
      >
        <ModuleComponent />
      </Suspense>

      {/* Footer anonymat */}
      <footer className="border-t py-4 mt-8">
        <div className="container">
          <Alert className="border-muted">
            <Lock className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Cette session est entièrement anonyme. Aucune donnée personnelle n'est partagée avec votre employeur.
            </AlertDescription>
          </Alert>
        </div>
      </footer>
    </div>
  );
}
