import PageRoot from '@/components/common/PageRoot'
import JournalView from './journal/JournalView'
import { Sparkles } from 'lucide-react'
import { useFlags } from '@/core/flags'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function B2CJournalPage() {
  const { has } = useFlags()
  const journalEnabled = has('FF_JOURNAL')

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
        </header>
        {journalEnabled ? (
          <JournalView />
        ) : (
          <Alert role="status" variant="default" className="border-primary/40 bg-primary/5">
            <AlertDescription>
              Le journal est momentanément désactivé pour ton espace. Reviens très vite&nbsp;: toutes tes notes existantes
              restent chiffrées et protégées.
            </AlertDescription>
          </Alert>
        )}
      </section>
    </PageRoot>
  )
}
