import { useState, useEffect, lazy, Suspense } from 'react';
import PageRoot from '@/components/common/PageRoot'
import JournalView from '@/pages/journal/JournalView'
import { Sparkles, Mic, PenLine } from 'lucide-react'
import { useFlags } from '@/core/flags'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { JournalSettingsLink } from '@/components/journal/JournalSettingsLink'
import { JournalOnboarding } from '@/components/journal/JournalOnboarding'
import { JournalQuickTips } from '@/components/journal/JournalQuickTips'
import { MedicalDisclaimerDialog, useMedicalDisclaimer } from '@/components/medical/MedicalDisclaimerDialog'
import { usePageSEO } from '@/hooks/usePageSEO';

// Lazy load le composant vocal pour performance
const VoiceJournalEntry = lazy(() => import('@/components/journal/VoiceJournalEntry'));

const ONBOARDING_KEY = 'journal-onboarding-completed';

export default function B2CJournalPage() {
  const [activeTab, setActiveTab] = useState<'write' | 'voice'>('write');
  usePageSEO({
    title: 'Journal Émotionnel - Suivi quotidien',
    description: 'Tenez votre journal émotionnel quotidien avec analyse IA. Texte, vocal ou image. Suivez votre évolution et insights personnalisés.',
    keywords: 'journal émotionnel, diary, suivi humeur, analyse émotions, développement personnel'
  });

  const { has } = useFlags()
  const journalEnabled = has('FF_JOURNAL')
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const { showDisclaimer, handleAccept, handleDecline } = useMedicalDisclaimer('journal');

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà vu l'onboarding
    const hasSeenOnboarding = localStorage.getItem(ONBOARDING_KEY);
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    } else {
      // Afficher les conseils pour les utilisateurs qui reviennent
      setShowTips(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setShowOnboarding(false);
    setShowTips(true);
  };

  const handleOnboardingDismiss = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setShowOnboarding(false);
  };

  return (
    <PageRoot>
      <section className="container mx-auto px-4 py-10 space-y-8" aria-labelledby="journal-heading">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-7 w-7 text-primary" aria-hidden="true" />
            <div>
              <h1 id="journal-heading" className="text-3xl font-semibold">
                Journal émotionnel
              </h1>
              <p className="text-sm text-muted-foreground">
                Consignez vos pensées, ajoutez des tags et partagez-les en toute sécurité avec votre coach.
              </p>
            </div>
          </div>
          <JournalSettingsLink variant="outline" size="sm" />
        </header>
        {journalEnabled ? (
          <>
            {showTips && <JournalQuickTips className="mb-6" />}
            
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'write' | 'voice')} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="write" className="gap-2">
                  <PenLine className="h-4 w-4" />
                  Écrire
                </TabsTrigger>
                <TabsTrigger value="voice" className="gap-2">
                  <Mic className="h-4 w-4" />
                  Dictée vocale
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="write">
                <JournalView />
              </TabsContent>
              
              <TabsContent value="voice">
                <Suspense fallback={
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
                  </div>
                }>
                  <VoiceJournalEntry />
                </Suspense>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <Alert role="status" variant="default" className="border-primary/40 bg-primary/5">
            <AlertDescription>
              Le journal est momentanément désactivé pour ton espace. Reviens très vite&nbsp;: toutes tes notes existantes
              restent chiffrées et protégées.
            </AlertDescription>
          </Alert>
        )}
      </section>
      
      {showOnboarding && (
        <JournalOnboarding
          onComplete={handleOnboardingComplete}
          onDismiss={handleOnboardingDismiss}
        />
      )}
      
      <MedicalDisclaimerDialog 
        feature="journal"
        open={showDisclaimer}
        onAccept={handleAccept}
        onDecline={handleDecline}
      />
    </PageRoot>
  )
}
