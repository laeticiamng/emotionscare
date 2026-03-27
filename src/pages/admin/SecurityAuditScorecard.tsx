// @ts-nocheck
import React, { memo } from 'react';
import {
  Shield, Lock, Database, Eye, Key, Globe, Server,
  CheckCircle2, AlertTriangle, ArrowUpRight, TrendingUp,
  FileCheck, Bug, ShieldCheck, UserCheck, FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

/* ─── Static audit data ─── */

interface CategoryMetric {
  name: string;
  icon: React.FC<{ className?: string }>;
  before: number;
  after: number;
  items: { label: string; status: 'done' | 'partial' | 'pending'; detail?: string }[];
}

const AUDIT_DATE_START = '15 Déc 2025';
const AUDIT_DATE_END = '28 Fév 2026';
const SCORE_BEFORE = 6.2;
const SCORE_AFTER = 8.5;

const categories: CategoryMetric[] = [
  {
    name: 'Authentification & Accès',
    icon: Key,
    before: 5.5,
    after: 9.0,
    items: [
      { label: 'JWT stocké en sessionStorage (pas localStorage)', status: 'done' },
      { label: 'Rate limiting login (5 tentatives / 5 min)', status: 'done' },
      { label: 'RoleGuard sur toutes les routes admin', status: 'done' },
      { label: 'AuthContext listener-first pattern', status: 'done' },
      { label: 'Erreurs auth traduites via authErrorService', status: 'done' },
      { label: 'MFA / 2FA optionnel', status: 'pending', detail: 'Roadmap Q2 2026' },
    ],
  },
  {
    name: 'Row Level Security (RLS)',
    icon: Database,
    before: 4.0,
    after: 9.5,
    items: [
      { label: 'RLS activé sur toutes les tables publiques', status: 'done' },
      { label: 'auth.uid() enforced sur SELECT/INSERT/UPDATE', status: 'done' },
      { label: 'Tests E2E cross-user isolation (Alice/Bob)', status: 'done' },
      { label: 'CI pipeline rls_check.sql', status: 'done' },
      { label: 'Policies USING(true) limitées à service_role', status: 'done' },
      { label: 'search_path = public sur toutes les fonctions', status: 'done' },
    ],
  },
  {
    name: 'Protection XSS & Injection',
    icon: ShieldCheck,
    before: 5.0,
    after: 9.0,
    items: [
      { label: 'ESLint rule ec/no-raw-innerhtml', status: 'done' },
      { label: 'Composant <SafeHtml> obligatoire', status: 'done' },
      { label: 'DOMPurify.sanitize() sur tout HTML dynamique', status: 'done' },
      { label: 'Trigger DB sanitize_text_input', status: 'done' },
      { label: 'CSP strict (no unsafe-inline)', status: 'done' },
      { label: 'SRI sur scripts externes', status: 'partial', detail: 'En cours' },
    ],
  },
  {
    name: 'Secrets & Variables',
    icon: Lock,
    before: 7.0,
    after: 9.5,
    items: [
      { label: 'Aucune clé privée dans le bundle (CI test)', status: 'done' },
      { label: 'no-secrets-in-bundle.test.ts actif', status: 'done' },
      { label: 'Gitleaks scan en CI', status: 'done' },
      { label: '.env.local non commitée', status: 'done' },
      { label: 'service_role jamais côté front', status: 'done' },
    ],
  },
  {
    name: 'RGPD & Vie Privée',
    icon: Eye,
    before: 6.0,
    after: 8.0,
    items: [
      { label: 'Suppression de compte (Edge Function)', status: 'done' },
      { label: 'Export données personnelles', status: 'done' },
      { label: 'Gestion des consentements', status: 'done' },
      { label: 'privacy_prefs table', status: 'done' },
      { label: 'Documentation conformité dans docs/compliance/', status: 'done' },
      { label: 'Registre de traitements complet', status: 'partial', detail: 'En cours' },
    ],
  },
  {
    name: 'Tests & Couverture',
    icon: Bug,
    before: 3.0,
    after: 7.5,
    items: [
      { label: '~100 tests unitaires implémentés', status: 'done' },
      { label: '40% couverture sur chemins critiques', status: 'done' },
      { label: '3 scénarios E2E Playwright (auth, RGPD, scan)', status: 'done' },
      { label: 'CodeQL analyse statique en CI', status: 'done' },
      { label: 'Couverture ≥ 90% sur Auth/GDPR/SAM', status: 'partial', detail: 'En progression' },
    ],
  },
  {
    name: 'Réseau & Headers',
    icon: Globe,
    before: 6.5,
    after: 8.5,
    items: [
      { label: 'CORS liste blanche stricte (Edge Functions)', status: 'done' },
      { label: 'HSTS max-age=63072000', status: 'done' },
      { label: 'X-Content-Type-Options: nosniff', status: 'done' },
      { label: 'X-Frame-Options: DENY', status: 'done' },
      { label: 'Referrer-Policy: strict-origin', status: 'done' },
      { label: 'CORS appliqué à toutes les ~150 fonctions', status: 'partial', detail: 'Batch restant' },
    ],
  },
  {
    name: 'Observabilité',
    icon: Server,
    before: 4.5,
    after: 8.0,
    items: [
      { label: 'Logger structuré (auth, supabase, UI)', status: 'done' },
      { label: 'Écran Diagnostics dev-only', status: 'done' },
      { label: 'Dashboard monitoring APIs (coûts)', status: 'done' },
      { label: 'Sentry intégré (erreurs + replay)', status: 'done' },
      { label: 'Alertes automatiques coûts >$10', status: 'partial', detail: 'Config email restante' },
    ],
  },
];

const TIMELINE = [
  { date: '15 Déc 2025', event: 'Audit initial — Score 6.2/10', type: 'start' as const },
  { date: '20 Déc 2025', event: 'Suppression secrets hardcodés', type: 'fix' as const },
  { date: '5 Jan 2026', event: 'RLS hardening + CI pipeline', type: 'fix' as const },
  { date: '15 Jan 2026', event: 'XSS protection (SafeHtml + ESLint)', type: 'fix' as const },
  { date: '1 Fév 2026', event: 'JWT migration sessionStorage', type: 'fix' as const },
  { date: '10 Fév 2026', event: '~100 tests unitaires ajoutés', type: 'fix' as const },
  { date: '20 Fév 2026', event: 'E2E Playwright + couverture 40%', type: 'fix' as const },
  { date: '28 Fév 2026', event: 'Audit final — Score 8.5/10', type: 'current' as const },
];

/* ─── Sub-components ─── */

const ScoreGauge = memo<{ score: number; label: string; size?: 'sm' | 'lg' }>(
  ({ score, label, size = 'sm' }) => {
    const radius = size === 'lg' ? 70 : 40;
    const stroke = size === 'lg' ? 8 : 5;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 10) * circumference;
    const viewBox = size === 'lg' ? 160 : 100;
    const center = viewBox / 2;

    const color =
      score >= 8 ? 'hsl(var(--chart-2))' :
      score >= 6 ? 'hsl(var(--chart-4))' :
      'hsl(var(--destructive))';

    return (
      <div className="flex flex-col items-center gap-1">
        <svg width={viewBox} height={viewBox} className="-rotate-90">
          <circle cx={center} cy={center} r={radius} fill="none"
            stroke="hsl(var(--muted))" strokeWidth={stroke} />
          <circle cx={center} cy={center} r={radius} fill="none"
            stroke={color} strokeWidth={stroke}
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" className="transition-all duration-1000" />
        </svg>
        <div className="absolute flex flex-col items-center justify-center"
          style={{ width: viewBox, height: viewBox }}>
          <span className={`font-bold ${size === 'lg' ? 'text-3xl' : 'text-lg'}`}
            style={{ color }}>
            {score.toFixed(1)}
          </span>
          <span className="text-[10px] text-muted-foreground">/10</span>
        </div>
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
      </div>
    );
  }
);
ScoreGauge.displayName = 'ScoreGauge';

const StatusBadge = memo<{ status: 'done' | 'partial' | 'pending' }>(({ status }) => {
  const map = {
    done: { label: 'Résolu', variant: 'default' as const, cls: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30' },
    partial: { label: 'En cours', variant: 'secondary' as const, cls: 'bg-amber-500/15 text-amber-700 border-amber-500/30' },
    pending: { label: 'Planifié', variant: 'outline' as const, cls: 'bg-muted text-muted-foreground' },
  };
  const m = map[status];
  return <Badge variant={m.variant} className={`text-[10px] px-1.5 py-0 ${m.cls}`}>{m.label}</Badge>;
});
StatusBadge.displayName = 'StatusBadge';

/* ─── Main Page ─── */

const SecurityAuditScorecard: React.FC = () => {
  const totalDone = categories.flatMap(c => c.items).filter(i => i.status === 'done').length;
  const totalItems = categories.flatMap(c => c.items).length;
  const completionPct = Math.round((totalDone / totalItems) * 100);

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Shield className="h-4 w-4" />
          Audit de Sécurité Plateforme
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Security Scorecard
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Progression de l'audit sécurité du {AUDIT_DATE_START} au {AUDIT_DATE_END}.
          8 catégories analysées, {totalItems} contrôles évalués.
        </p>
      </div>

      {/* Score Hero */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <CardContent className="py-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <div className="relative">
              <ScoreGauge score={SCORE_BEFORE} label="Avant" size="lg" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <ArrowUpRight className="h-8 w-8 text-emerald-500" />
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  +{(SCORE_AFTER - SCORE_BEFORE).toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">points gagnés</div>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                <TrendingUp className="h-4 w-4" />
                +{Math.round(((SCORE_AFTER - SCORE_BEFORE) / SCORE_BEFORE) * 100)}%
              </div>
            </div>
            <div className="relative">
              <ScoreGauge score={SCORE_AFTER} label="Actuel" size="lg" />
            </div>
          </div>

          {/* Summary bar */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Contrôles résolus</span>
              <span className="font-semibold text-foreground">{totalDone}/{totalItems} ({completionPct}%)</span>
            </div>
            <Progress value={completionPct} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const done = cat.items.filter(i => i.status === 'done').length;
          const delta = cat.after - cat.before;
          const Icon = cat.icon;
          return (
            <Card key={cat.name} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold">{cat.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {done}/{cat.items.length} contrôles résolus
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground line-through">{cat.before}</span>
                      <span className="text-lg font-bold text-foreground">{cat.after}</span>
                      <span className="text-[10px] text-muted-foreground">/10</span>
                    </div>
                    <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-700 border-emerald-500/20">
                      +{delta.toFixed(1)}
                    </Badge>
                  </div>
                </div>
                <Progress value={(cat.after / 10) * 100} className="h-1.5 mt-2" />
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-1.5">
                  {cat.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs">
                      {item.status === 'done' ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      ) : item.status === 'partial' ? (
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                      ) : (
                        <FileCheck className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                      )}
                      <span className="flex-1 text-foreground/80">{item.label}</span>
                      <StatusBadge status={item.status} />
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Chronologie des améliorations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-4">
              {TIMELINE.map((entry, i) => (
                <div key={i} className="relative flex items-start gap-4 pl-10">
                  <div className={`absolute left-2.5 top-1.5 h-3 w-3 rounded-full border-2 ${
                    entry.type === 'start' ? 'bg-destructive border-destructive' :
                    entry.type === 'current' ? 'bg-primary border-primary' :
                    'bg-emerald-500 border-emerald-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono text-muted-foreground">{entry.date}</span>
                      <Separator orientation="vertical" className="h-3" />
                      <span className="text-sm text-foreground">{entry.event}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4 text-center space-y-1">
            <Lock className="h-5 w-5 mx-auto text-primary/70" />
            <div className="text-xs text-muted-foreground">Secrets exposés</div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-destructive/70 line-through">3</span>
              <ArrowUpRight className="h-3 w-3 text-emerald-500" />
              <span className="text-lg font-bold text-foreground">0</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center space-y-1">
            <Database className="h-5 w-5 mx-auto text-primary/70" />
            <div className="text-xs text-muted-foreground">Tables sans RLS</div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-destructive/70 line-through">12</span>
              <ArrowUpRight className="h-3 w-3 text-emerald-500" />
              <span className="text-lg font-bold text-foreground">0</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center space-y-1">
            <Bug className="h-5 w-5 mx-auto text-primary/70" />
            <div className="text-xs text-muted-foreground">Tests unitaires</div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-destructive/70 line-through">~10</span>
              <ArrowUpRight className="h-3 w-3 text-emerald-500" />
              <span className="text-lg font-bold text-foreground">~100</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center space-y-1">
            <FileCheck className="h-5 w-5 mx-auto text-primary/70" />
            <div className="text-xs text-muted-foreground">Couverture code</div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-destructive/70 line-through">~8%</span>
              <ArrowUpRight className="h-3 w-3 text-emerald-500" />
              <span className="text-lg font-bold text-foreground">~40%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecurityAuditScorecard;
