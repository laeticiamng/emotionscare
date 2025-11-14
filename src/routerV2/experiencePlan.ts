import type { RouteMeta, Segment } from './schema'
import { ROUTES_REGISTRY } from './registry'

export type ImmersionIntensity = 'signature' | 'advanced' | 'core'
export type ImmersionAudience = Segment | 'admin'

export interface RouteExperienceBlueprint {
  name: string
  path: string
  audience: ImmersionAudience
  experienceLevel: ImmersionIntensity
  sensoryFocus: string[]
  immersionHooks: string[]
  guidanceMoments: string[]
  dataFeedback: string
  accessibility: string[]
  narrativeAnchor: string
}

const AUDIENCE_BASELINES: Record<ImmersionAudience, Omit<RouteExperienceBlueprint, 'name' | 'path' | 'audience'>> = {
  public: {
    experienceLevel: 'advanced',
    sensoryFocus: ['visual storytelling', 'subtle soundscapes'],
    immersionHooks: ['interactive hero', 'contextual CTA', 'live social proof'],
    guidanceMoments: ['soft onboarding', 'progressive disclosure'],
    dataFeedback: 'Marketing experience instrumentation with heatmaps & conversion funnels',
    accessibility: ['WCAG 2.1 AA copy hierarchy', 'keyboard-first CTAs', 'high-contrast gradients'],
    narrativeAnchor: 'Landing narratives bridge inspiration with the in-app emotional park',
  },
  consumer: {
    experienceLevel: 'signature',
    sensoryFocus: ['multi-sensory UI', 'haptic-ready feedback', 'dynamic lighting'],
    immersionHooks: ['emotional park map', 'AI-guided rituals', 'collectible progress artifacts'],
    guidanceMoments: ['coach narration', 'ritual timers', 'mood-based tips'],
    dataFeedback: 'Real-time biofeedback loop with adaptive goals & weekly reflections',
    accessibility: ['voice-first controls', 'contrast-aware palettes', 'calm motion defaults'],
    narrativeAnchor: 'Immersive rituals evolving from mood scans to social celebration',
  },
  employee: {
    experienceLevel: 'advanced',
    sensoryFocus: ['team resonance cues', 'ambient focus loops'],
    immersionHooks: ['mission control dashboard', 'team rituals', 'pulse indicators'],
    guidanceMoments: ['micro-coaching cards', 'ritual reminders'],
    dataFeedback: 'Team mood telemetry + anonymized squad benchmarks',
    accessibility: ['structured data tables', 'screen-reader optimized KPIs'],
    narrativeAnchor: 'Empowers squads to weave emotional intelligence inside sprints',
  },
  manager: {
    experienceLevel: 'advanced',
    sensoryFocus: ['command-center lighting', 'calm analytics sound cues'],
    immersionHooks: ['predictive boards', 'risk heatmaps', 'executive rituals'],
    guidanceMoments: ['escalation playbooks', 'weekly synthesis'],
    dataFeedback: 'Predictive analytics stream + compliance evidence vault',
    accessibility: ['print-safe dashboards', 'summaries for screen readers'],
    narrativeAnchor: 'Transforms reporting into living strategy rooms',
  },
  admin: {
    experienceLevel: 'advanced',
    sensoryFocus: ['system telemetry visuals', 'alert sonification'],
    immersionHooks: ['live observability grid', 'runbook shortcuts', 'auto-healing suggestions'],
    guidanceMoments: ['alert narratives', 'post-mortem checklist'],
    dataFeedback: 'Full-fidelity audit trails & observability metrics',
    accessibility: ['code-friendly themes', 'high-density keyboard nav'],
    narrativeAnchor: 'Keeps the platform resilient with cinematic SRE tooling',
  },
}

const intensityWeight: Record<ImmersionIntensity, number> = {
  signature: 3,
  advanced: 2,
  core: 1,
}

const matches = (route: RouteMeta, tokens: (string | RegExp)[]) =>
  tokens.some((token) =>
    typeof token === 'string' ? route.path.includes(token) || route.name.includes(token) : token.test(route.path)
  )

interface OverrideRule {
  matches: (route: RouteMeta) => boolean
  data: Partial<RouteExperienceBlueprint>
}

const OVERRIDES: OverrideRule[] = [
  {
    matches: (route) => matches(route, ['/music', 'music', 'sound']),
    data: {
      experienceLevel: 'signature',
      sensoryFocus: ['spatial audio', 'bio-responsive waveform'],
      immersionHooks: ['synesthetic forests', 'AI-composed playlists'],
      narrativeAnchor: 'Every soundscape grows the Forêt Sonore and unlocks melodic artifacts',
      dataFeedback: 'Tempo, HRV, and emotion deltas synchronized with playlist DNA',
    },
  },
  {
    matches: (route) => matches(route, ['/scan', '/voice', '/text']) && !matches(route, ['/settings']),
    data: {
      experienceLevel: 'signature',
      sensoryFocus: ['camera sensing', 'voice resonance', 'textual tone mapping'],
      immersionHooks: ['mask gallery', 'live aura projection'],
      narrativeAnchor: 'Scans craft living masks and aura ribbons that guide the session',
      guidanceMoments: ['breathing cues', 'AI narrations based on detected mood'],
    },
  },
  {
    matches: (route) => matches(route, ['/coach', '/programs', '/sessions']),
    data: {
      immersionHooks: ['micro-ritual quests', 'AI mirror prompts'],
      guidanceMoments: ['coach dialogues', 'session chapters'],
      narrativeAnchor: 'The garden of thoughts adapts per conversation arc',
    },
  },
  {
    matches: (route) => matches(route, ['/journal']),
    data: {
      sensoryFocus: ['voice journaling', 'ink animations'],
      immersionHooks: ['living library shelves', 'weekly anthology ceremonies'],
      dataFeedback: 'Semantic sentiment reflections + timeline of archetypes',
    },
  },
  {
    matches: (route) => matches(route, ['/vr', '/ar', 'nyvee', 'flash-glow', 'bubble', 'mood-mixer']),
    data: {
      experienceLevel: 'signature',
      sensoryFocus: ['XR immersion', 'breath-reactive particles', 'ambient vibrations'],
      immersionHooks: ['galaxy traversal', 'breath temples', 'fun-first arcades'],
      narrativeAnchor: 'Immersive park rides that unlock relics & constellations',
    },
  },
  {
    matches: (route) => matches(route, ['/community', '/social', '/friends', '/groups', '/guilds']),
    data: {
      sensoryFocus: ['ambient social cues', 'collective rituals'],
      immersionHooks: ['shared cocons', 'guild expeditions'],
      narrativeAnchor: 'Community cocons blend shared breathing, stories, and seasonal guild goals',
    },
  },
  {
    matches: (route) => matches(route, ['/analytics', '/reports', '/scores', '/leaderboard', '/activity', '/insights']),
    data: {
      sensoryFocus: ['data sculptures', 'temporal ribbons'],
      immersionHooks: ['living dashboards', 'insight reels'],
      narrativeAnchor: 'Analytics surfaces play like interactive observatories',
      dataFeedback: 'Predictive loops + export-ready storytelling snapshots',
    },
  },
  {
    matches: (route) => matches(route, ['/settings', '/profile', '/privacy', '/notifications']),
    data: {
      experienceLevel: 'advanced',
      sensoryFocus: ['calm surfaces', 'contextual haptics'],
      immersionHooks: ['ritual builders', 'preference orbs'],
      narrativeAnchor: 'Settings act as an atelier for shaping the emotional OS',
    },
  },
  {
    matches: (route) => matches(route, ['/legal', '/privacy', '/terms', '/faq', '/support']),
    data: {
      experienceLevel: 'core',
      immersionHooks: ['trust beacons', 'legal clarity overlays'],
      narrativeAnchor: 'Trust center translates compliance into human stories',
    },
  },
  {
    matches: (route) => matches(route, ['/admin', '/system-health', '/cron', '/api-monitoring', '/alerts']),
    data: {
      audience: 'admin',
      sensoryFocus: ['status pulses', 'observability sparks'],
      immersionHooks: ['alert holograms', 'resilience rituals'],
      narrativeAnchor: 'Operations cockpit keeps the constellation alive 24/7',
    },
  },
]

const resolveAudience = (route: RouteMeta): ImmersionAudience => {
  if (route.allowedRoles?.includes('admin') || route.role === 'admin') {
    return 'admin'
  }

  return route.segment
}

const mergeArrays = (base: string[], extra?: string[]) =>
  extra ? Array.from(new Set([...base, ...extra])) : base

const mergeBlueprint = (base: RouteExperienceBlueprint, patch: Partial<RouteExperienceBlueprint>): RouteExperienceBlueprint => ({
  ...base,
  experienceLevel: patch.experienceLevel ?? base.experienceLevel,
  audience: patch.audience ?? base.audience,
  sensoryFocus: mergeArrays(base.sensoryFocus, patch.sensoryFocus),
  immersionHooks: mergeArrays(base.immersionHooks, patch.immersionHooks),
  guidanceMoments: mergeArrays(base.guidanceMoments, patch.guidanceMoments),
  accessibility: mergeArrays(base.accessibility, patch.accessibility),
  dataFeedback: patch.dataFeedback ?? base.dataFeedback,
  narrativeAnchor: patch.narrativeAnchor ?? base.narrativeAnchor,
})

const buildBlueprint = (route: RouteMeta): RouteExperienceBlueprint => {
  const audience = resolveAudience(route)
  let blueprint: RouteExperienceBlueprint = {
    name: route.name,
    path: route.path,
    audience,
    ...AUDIENCE_BASELINES[audience],
    sensoryFocus: [...AUDIENCE_BASELINES[audience].sensoryFocus],
    immersionHooks: [...AUDIENCE_BASELINES[audience].immersionHooks],
    guidanceMoments: [...AUDIENCE_BASELINES[audience].guidanceMoments],
    accessibility: [...AUDIENCE_BASELINES[audience].accessibility],
  }

  for (const rule of OVERRIDES) {
    if (rule.matches(route)) {
      blueprint = mergeBlueprint(blueprint, rule.data)
    }
  }

  return blueprint
}

export const ROUTE_IMMERSION_ENTRIES = ROUTES_REGISTRY.map((route) => buildBlueprint(route))

export const ROUTE_IMMERSION_MAP = ROUTE_IMMERSION_ENTRIES.reduce<Record<string, RouteExperienceBlueprint>>((acc, entry) => {
  acc[entry.name] = entry
  return acc
}, {})

const ROUTE_IMMERSION_BY_PATH = ROUTE_IMMERSION_ENTRIES.reduce<Record<string, RouteExperienceBlueprint>>((acc, entry) => {
  acc[entry.path] = entry
  return acc
}, {})

interface AudienceSummary {
  count: number
  intensityBreakdown: Record<ImmersionIntensity, number>
  hooks: string[]
}

export interface ImmersionSummary {
  totalRoutes: number
  byAudience: Record<ImmersionAudience, AudienceSummary>
  byLevel: Record<ImmersionIntensity, number>
}

const audienceOrder: ImmersionAudience[] = ['public', 'consumer', 'employee', 'manager', 'admin']

const hookTrackers: Record<ImmersionAudience, Map<string, number>> = {
  public: new Map(),
  consumer: new Map(),
  employee: new Map(),
  manager: new Map(),
  admin: new Map(),
}

const emptySummary = (): AudienceSummary => ({
  count: 0,
  intensityBreakdown: { signature: 0, advanced: 0, core: 0 },
  hooks: [],
})

const draftSummary: ImmersionSummary = {
  totalRoutes: ROUTE_IMMERSION_ENTRIES.length,
  byAudience: {
    public: emptySummary(),
    consumer: emptySummary(),
    employee: emptySummary(),
    manager: emptySummary(),
    admin: emptySummary(),
  },
  byLevel: { signature: 0, advanced: 0, core: 0 },
}

audienceOrder.forEach((audience) => {
  draftSummary.byAudience[audience] = emptySummary()
})

ROUTE_IMMERSION_ENTRIES.forEach((entry) => {
  const audienceSummary = draftSummary.byAudience[entry.audience]
  audienceSummary.count += 1
  audienceSummary.intensityBreakdown[entry.experienceLevel] += 1
  draftSummary.byLevel[entry.experienceLevel] += 1

  const hookTracker = hookTrackers[entry.audience]
  entry.immersionHooks.forEach((hook) => {
    hookTracker.set(hook, (hookTracker.get(hook) ?? 0) + 1)
  })
})

audienceOrder.forEach((audience) => {
  const hooks = hookTrackers[audience]
  const topHooks = Array.from(hooks.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([hook]) => hook)
  draftSummary.byAudience[audience].hooks = topHooks
})

export const ROUTE_IMMERSION_SUMMARY = draftSummary

export const IMMERSION_AUDIENCE_LABELS: Record<ImmersionAudience, string> = {
  public: 'Parcours publics',
  consumer: 'Expériences B2C',
  employee: 'Espaces employés',
  manager: 'Command centers managers',
  admin: 'Cockpits administrateurs',
}

export const IMMERSION_INTENSITY_LABELS: Record<ImmersionIntensity, string> = {
  signature: 'Signature',
  advanced: 'Avancé',
  core: 'Fondamental',
}

export const IMMERSION_AUDIENCE_ORDER = audienceOrder

export const getRouteImmersionPlan = (identifier: string) =>
  ROUTE_IMMERSION_MAP[identifier] ?? ROUTE_IMMERSION_BY_PATH[identifier] ?? null

export const getSignatureShare = (audience: ImmersionAudience) => {
  const audienceSummary = ROUTE_IMMERSION_SUMMARY.byAudience[audience]
  if (!audienceSummary.count) {
    return 0
  }
  return Math.round((audienceSummary.intensityBreakdown.signature / audienceSummary.count) * 100)
}

export const getGlobalImmersionScore = () => {
  const { totalRoutes, byLevel } = ROUTE_IMMERSION_SUMMARY
  if (!totalRoutes) {
    return 0
  }

  const weighted =
    byLevel.signature * intensityWeight.signature +
    byLevel.advanced * intensityWeight.advanced +
    byLevel.core * intensityWeight.core

  const maxScore = totalRoutes * intensityWeight.signature
  return Math.round((weighted / maxScore) * 100)
}
