import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, Compass } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RouteImmersionShowcase } from '@/components/immersion/RouteImmersionShowcase'
import { ROUTE_IMMERSION_SUMMARY } from '@/routerV2/experiencePlan'

/**
 * NavigationPage - Hub immersif vers le Parc Émotionnel
 * Offre un aperçu des expériences signature avant d'entrer
 */
export default function NavigationPage() {
  const totalRoutes = ROUTE_IMMERSION_SUMMARY.totalRoutes

  return (
    <div className="bg-slate-950 text-white min-h-screen">
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-indigo-500/20 to-transparent blur-3xl" />
        <div className="relative max-w-5xl mx-auto px-6 py-16 space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">
            <Compass className="h-3.5 w-3.5" />
            Navigation sensorielle
          </div>
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Votre entrée vers le Parc Émotionnel et ses {totalRoutes}+ routes immersives
            </h1>
            <p className="text-lg text-slate-300 max-w-3xl">
              Plutôt qu'une redirection brute, ce hub dévoile les rituels clés, les gradients sensoriels et les niveaux d'intensité pour chaque parcours. Choisissez votre porte d'entrée puis plongez.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" variant="hero" className="text-base">
              <Link to="/app/emotional-park">
                <Sparkles className="h-5 w-5 mr-2" />
                Entrer dans le Parc
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base border-white/30 text-white hover:bg-white/10">
              <Link to="/app/consumer/home">Accéder à mon espace</Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="text-base text-slate-200 hover:text-white">
              <Link to="/demo">Voir une démo guidée</Link>
            </Button>
          </div>
        </div>
      </section>

      <RouteImmersionShowcase />
    </div>
  )
}
