import type { ComponentType } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Compass, LineChart, Users, Shield, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  ROUTE_IMMERSION_ENTRIES,
  ROUTE_IMMERSION_SUMMARY,
  IMMERSION_AUDIENCE_LABELS,
  IMMERSION_AUDIENCE_ORDER,
  IMMERSION_INTENSITY_LABELS,
  getSignatureShare,
  getGlobalImmersionScore,
  type ImmersionAudience,
  type ImmersionIntensity,
} from '@/routerV2/experiencePlan'

const audienceIcons: Record<ImmersionAudience, ComponentType<{ className?: string }>> = {
  public: Sparkles,
  consumer: Compass,
  employee: Users,
  manager: LineChart,
  admin: Shield,
}

const audienceGradients: Record<ImmersionAudience, string> = {
  public: 'from-pink-500/20 to-purple-500/20',
  consumer: 'from-blue-500/20 to-cyan-500/20',
  employee: 'from-emerald-500/20 to-teal-500/20',
  manager: 'from-amber-500/20 to-orange-500/20',
  admin: 'from-slate-500/20 to-slate-800/20',
}

const intensityOrder: ImmersionIntensity[] = ['signature', 'advanced', 'core']

const intensityColor: Record<ImmersionIntensity, string> = {
  signature: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
  advanced: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white',
  core: 'bg-gradient-to-r from-slate-600 to-slate-800 text-white',
}

const formatHooks = (hooks: string[]) =>
  hooks.length ? hooks : ['Ritual intelligent', 'Guidance dynamique']

const highlightEntries = [...ROUTE_IMMERSION_ENTRIES]
  .sort((a, b) => {
    const intensityScore = (value: ImmersionIntensity) => (value === 'signature' ? 3 : value === 'advanced' ? 2 : 1)
    if (intensityScore(b.experienceLevel) !== intensityScore(a.experienceLevel)) {
      return intensityScore(b.experienceLevel) - intensityScore(a.experienceLevel)
    }
    return a.name.localeCompare(b.name)
  })
  .slice(0, 8)

export function RouteImmersionShowcase() {
  const totalRoutes = ROUTE_IMMERSION_SUMMARY.totalRoutes
  const signatureCount = ROUTE_IMMERSION_SUMMARY.byLevel.signature
  const globalScore = getGlobalImmersionScore()

  return (
    <section className="bg-slate-950 text-slate-100 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
        <header className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
            <Activity className="h-3.5 w-3.5" />
            Route immersion matrix
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold">
              Excellence appliquée à {totalRoutes}+ parcours
            </h2>
            <p className="text-slate-400 max-w-3xl mx-auto">
              Chaque route s'appuie sur un blueprint immersif combinant narration, multisensorialité et feedbacks temps réel. Ce tableau synthétise les engagements par segment.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-white/10">
            <CardHeader>
              <CardTitle className="text-lg text-slate-100">Parcours couverts</CardTitle>
              <CardDescription className="text-slate-300">Registre unifié</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-semibold text-white">{totalRoutes}</p>
              <p className="text-sm text-slate-300 mt-2">Routes monitorées via le registre central.</p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-lg text-slate-100">Intensité signature</CardTitle>
              <CardDescription className="text-slate-300">Expériences multi-sens</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-semibold text-white">{signatureCount}</p>
                <span className="text-sm text-slate-300">routes</span>
              </div>
              <Progress value={(signatureCount / totalRoutes) * 100} className="mt-4" />
              <p className="text-xs text-slate-400 mt-2">{Math.round((signatureCount / totalRoutes) * 100)}% de l'écosystème.</p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
            <CardHeader>
              <CardTitle className="text-lg text-slate-100">Score global</CardTitle>
              <CardDescription className="text-slate-300">Poids intensité</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-semibold text-white">{globalScore}%</p>
                <span className="text-sm text-slate-300">du maximum</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Basé sur une pondération signature/avancé/fondamental.</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {IMMERSION_AUDIENCE_ORDER.map((audience) => {
            const summary = ROUTE_IMMERSION_SUMMARY.byAudience[audience]
            const Icon = audienceIcons[audience]
            return (
              <Card key={audience} className="border-white/10 bg-white/5">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`rounded-xl p-2 bg-gradient-to-r ${audienceGradients[audience]}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-white">{IMMERSION_AUDIENCE_LABELS[audience]}</CardTitle>
                      <CardDescription className="text-slate-300">{summary.count} routes</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {intensityOrder.map((intensity) => (
                      <div key={intensity} className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">{IMMERSION_INTENSITY_LABELS[intensity]}</span>
                        <span className="text-slate-100 font-medium">
                          {summary.intensityBreakdown[intensity]}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Hooks dominants</p>
                    <div className="flex flex-wrap gap-2">
                      {formatHooks(summary.hooks).map((hook) => (
                        <Badge key={hook} variant="secondary" className="bg-white/10 text-slate-100 border border-white/10">
                          {hook}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Signature</p>
                    <Progress value={getSignatureShare(audience)} />
                    <p className="text-[11px] text-slate-400 mt-1">
                      {getSignatureShare(audience)}% des routes de ce segment sont déjà signature.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-slate-400 uppercase tracking-[0.3em]">Itinéraires phares</p>
              <h3 className="text-2xl font-semibold text-white">Blueprints immersifs sélectionnés</h3>
            </div>
            <Link
              to="/app/emotional-park"
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'sm' }),
                'border border-white/10 text-slate-100 hover:bg-white/10'
              )}
            >
              Voir la carte émotionnelle
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {highlightEntries.map((entry) => (
              <Card key={`${entry.name}-${entry.path}`} className="border-white/10 bg-gradient-to-br from-white/5 to-transparent">
                <CardHeader className="flex flex-row items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-xl text-white">{entry.name}</CardTitle>
                    <CardDescription className="text-slate-300">{entry.narrativeAnchor}</CardDescription>
                  </div>
                  <Badge className={cn('text-xs font-semibold', intensityColor[entry.experienceLevel])}>
                    {IMMERSION_INTENSITY_LABELS[entry.experienceLevel]}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {entry.sensoryFocus.slice(0, 3).map((focus) => (
                      <Badge key={focus} variant="outline" className="border-white/20 text-slate-100">
                        {focus}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-sm text-slate-300 space-y-1">
                    <p className="font-medium text-slate-100">Guidance</p>
                    <p>{entry.guidanceMoments.join(' • ')}</p>
                    <p className="font-medium text-slate-100 pt-2">Feedback</p>
                    <p>{entry.dataFeedback}</p>
                  </div>
                  <Link
                    to={entry.path}
                    className={cn(
                      buttonVariants({ variant: 'link', size: 'sm' }),
                      'text-indigo-300 hover:text-indigo-200 px-0'
                    )}
                  >
                    Explorer ce module →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
