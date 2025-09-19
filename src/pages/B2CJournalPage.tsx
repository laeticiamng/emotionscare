import PageRoot from '@/components/common/PageRoot'
import JournalView from './journal/JournalView'
import { Sparkles } from 'lucide-react'

export default function B2CJournalPage() {
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

        <JournalView />
      </section>
    </PageRoot>
  )
}
