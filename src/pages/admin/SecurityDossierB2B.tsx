// @ts-nocheck
import React, { memo } from 'react';
import {
  Shield, Lock, Database, Eye, Server, FileText, CheckCircle2,
  AlertTriangle, Clock, Building2, HeartPulse, Scale, Fingerprint,
  HardDrive, Globe, UserCheck, ShieldCheck, BadgeCheck, Award,
  BookOpen, ArrowRight, ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/* ─── Data ─── */

const DOSSIER_VERSION = '2.1';
const DOSSIER_DATE = '28 Février 2026';
const SECURITY_SCORE = 8.5;

interface ComplianceItem {
  label: string;
  status: 'compliant' | 'in_progress' | 'planned';
  detail?: string;
}

interface ComplianceSection {
  title: string;
  icon: React.FC<{ className?: string }>;
  score: number;
  items: ComplianceItem[];
}

const rgpdSection: ComplianceSection = {
  title: 'RGPD / GDPR',
  icon: Eye,
  score: 92,
  items: [
    { label: 'Registre des traitements documenté', status: 'compliant' },
    { label: 'Bases légales identifiées (consentement, intérêt légitime)', status: 'compliant' },
    { label: 'Politique de confidentialité conforme Art. 13-14', status: 'compliant' },
    { label: 'Droit d\'accès (Art. 15) — Export JSON/CSV', status: 'compliant' },
    { label: 'Droit à l\'effacement (Art. 17) — Suppression complète', status: 'compliant' },
    { label: 'Droit à la portabilité (Art. 20)', status: 'compliant' },
    { label: 'Gestion des consentements granulaires', status: 'compliant' },
    { label: 'DPO désigné et joignable', status: 'in_progress', detail: 'Nomination Q2 2026' },
    { label: 'Registre de sous-traitants (Art. 28)', status: 'compliant' },
    { label: 'PIA / AIPD pour traitements sensibles', status: 'in_progress', detail: 'En cours sur données émotionnelles' },
    { label: 'Procédure de notification de violation (72h)', status: 'compliant' },
    { label: 'Durée de rétention configurable par l\'utilisateur', status: 'compliant' },
  ],
};

const hdsSection: ComplianceSection = {
  title: 'Sécurité des données de santé (en préparation — non certifié HDS)',
  icon: HeartPulse,
  score: 68,
  items: [
    { label: 'Architecture sécurisée (isolation des données)', status: 'compliant' },
    { label: 'Chiffrement au repos AES-256 (Supabase)', status: 'compliant' },
    { label: 'Chiffrement en transit TLS 1.3', status: 'compliant' },
    { label: 'Localisation des données — UE (AWS eu-west)', status: 'compliant' },
    { label: 'Journalisation des accès (audit logs)', status: 'compliant' },
    { label: 'Pseudonymisation des identifiants utilisateur', status: 'compliant' },
    { label: 'Hébergement sécurisé en UE', status: 'compliant' },
    { label: 'Certification ISO 27001', status: 'planned', detail: 'Objectif Q4 2026' },
    { label: 'Certification SOC 2 Type II', status: 'planned', detail: 'Objectif 2027' },
    { label: 'PAS (Plan d\'Assurance Sécurité)', status: 'in_progress', detail: 'Rédaction en cours' },
  ],
};

const securityPosture: ComplianceSection = {
  title: 'Posture de Sécurité',
  icon: ShieldCheck,
  score: 88,
  items: [
    { label: 'Row Level Security (RLS) sur 100% des tables', status: 'compliant' },
    { label: 'Aucun secret dans le bundle client (CI/CD vérifié)', status: 'compliant' },
    { label: 'JWT stocké en sessionStorage (pas localStorage)', status: 'compliant' },
    { label: 'Protection XSS — DOMPurify + SafeHtml + ESLint', status: 'compliant' },
    { label: 'CSP strict (Content Security Policy)', status: 'compliant' },
    { label: 'CORS liste blanche (Edge Functions)', status: 'compliant' },
    { label: 'Rate limiting sur endpoints sensibles', status: 'compliant' },
    { label: 'Sanitisation DB trigger (XSS défense en profondeur)', status: 'compliant' },
    { label: 'CodeQL analyse statique en CI', status: 'compliant' },
    { label: 'Gitleaks scan automatique (secrets)', status: 'compliant' },
    { label: 'HSTS + X-Frame-Options + Referrer-Policy', status: 'compliant' },
    { label: 'MFA / Authentification à deux facteurs', status: 'planned', detail: 'Roadmap Q2 2026' },
  ],
};

const complianceDocs: ComplianceSection = {
  title: 'Documentation Conformité',
  icon: BookOpen,
  score: 85,
  items: [
    { label: 'docs/compliance/ — Documentation HDS formalisée', status: 'compliant' },
    { label: 'docs/roadmap-security-30days.md — Plan maintenance', status: 'compliant' },
    { label: 'reports/ — Rapports d\'audit sécurité', status: 'compliant' },
    { label: 'Politique de sécurité des données publiée', status: 'compliant' },
    { label: 'Conditions Générales d\'Utilisation (CGU)', status: 'compliant' },
    { label: 'Politique de cookies conforme ePrivacy', status: 'compliant' },
    { label: 'Guide d\'intégration B2B sécurisé', status: 'in_progress', detail: 'Rédaction Q1 2026' },
    { label: 'SLA documenté (99.9% uptime cible)', status: 'in_progress', detail: 'Finalisation en cours' },
  ],
};

const ALL_SECTIONS = [rgpdSection, hdsSection, securityPosture, complianceDocs];

const ARCHITECTURE_HIGHLIGHTS = [
  { icon: Database, title: 'Base de données', desc: 'PostgreSQL (Supabase) avec RLS, chiffrement AES-256 au repos, backups automatiques' },
  { icon: Server, title: 'Backend', desc: 'Edge Functions (Deno) — isolation par requête, pas de serveur persistant, scaling automatique' },
  { icon: Lock, title: 'Authentification', desc: 'Supabase Auth (JWT), session sécurisée, rate limiting, erreurs traduites' },
  { icon: Globe, title: 'Réseau', desc: 'TLS 1.3, CDN global, CORS strict, headers de sécurité complets' },
  { icon: HardDrive, title: 'Stockage', desc: 'Données UE (AWS eu-west), rétention configurable, suppression RGPD complète' },
  { icon: Fingerprint, title: 'Confidentialité', desc: 'Pseudonymisation SHA-256, seuil k-anonymat (k=5), consentements granulaires' },
];

const B2B_GUARANTEES = [
  { title: 'Isolation des données', desc: 'Chaque organisation dispose d\'un espace isolé. Les données ne sont jamais croisées entre organisations.' },
  { title: 'Seuil de confidentialité', desc: 'Les rapports agrégés imposent un minimum de 5 répondants pour protéger l\'anonymat individuel.' },
  { title: 'Contrôle administrateur', desc: 'Les admins d\'organisation n\'accèdent qu\'aux données agrégées, jamais aux données individuelles détaillées.' },
  { title: 'Suppression contractuelle', desc: 'En fin de contrat, toutes les données de l\'organisation sont supprimées sous 30 jours.' },
];

/* ─── Sub-components ─── */

const StatusIcon = memo<{ status: 'compliant' | 'in_progress' | 'planned' }>(({ status }) => {
  if (status === 'compliant') return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />;
  if (status === 'in_progress') return <Clock className="h-4 w-4 text-amber-500 shrink-0" />;
  return <AlertTriangle className="h-4 w-4 text-muted-foreground shrink-0" />;
});
StatusIcon.displayName = 'StatusIcon';

const StatusLabel = memo<{ status: 'compliant' | 'in_progress' | 'planned' }>(({ status }) => {
  const map = {
    compliant: { label: 'Conforme', cls: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' },
    in_progress: { label: 'En cours', cls: 'bg-amber-500/10 text-amber-700 border-amber-500/20' },
    planned: { label: 'Planifié', cls: 'bg-muted text-muted-foreground border-border' },
  };
  const m = map[status];
  return <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${m.cls}`}>{m.label}</Badge>;
});
StatusLabel.displayName = 'StatusLabel';

const ScoreRing = memo<{ score: number; size?: number }>(({ score, size = 56 }) => {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const center = size / 2;
  const color = score >= 85 ? 'hsl(var(--chart-2))' : score >= 60 ? 'hsl(var(--chart-4))' : 'hsl(var(--destructive))';

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={center} cy={center} r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth={4} />
      <circle cx={center} cy={center} r={r} fill="none" stroke={color} strokeWidth={4}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        className="transition-all duration-700" />
      <text x={center} y={center} textAnchor="middle" dominantBaseline="central"
        className="rotate-90 origin-center fill-foreground text-sm font-bold"
        style={{ transformBox: 'fill-box' }}>
        {score}%
      </text>
    </svg>
  );
});
ScoreRing.displayName = 'ScoreRing';

const SectionCard = memo<{ section: ComplianceSection }>(({ section }) => {
  const Icon = section.icon;
  const compliant = section.items.filter(i => i.status === 'compliant').length;
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">{section.title}</CardTitle>
              <CardDescription className="text-xs">
                {compliant}/{section.items.length} contrôles conformes
              </CardDescription>
            </div>
          </div>
          <ScoreRing score={section.score} />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {section.items.map((item, i) => (
          <div key={i} className="flex items-start gap-2.5 text-sm">
            <StatusIcon status={item.status} />
            <div className="flex-1 min-w-0">
              <span className="text-foreground/85">{item.label}</span>
              {item.detail && (
                <span className="text-xs text-muted-foreground ml-1">— {item.detail}</span>
              )}
            </div>
            <StatusLabel status={item.status} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
});
SectionCard.displayName = 'SectionCard';

/* ─── Main Page ─── */

const SecurityDossierB2B: React.FC = () => {
  const totalItems = ALL_SECTIONS.flatMap(s => s.items).length;
  const totalCompliant = ALL_SECTIONS.flatMap(s => s.items).filter(i => i.status === 'compliant').length;
  const totalInProgress = ALL_SECTIONS.flatMap(s => s.items).filter(i => i.status === 'in_progress').length;
  const globalPct = Math.round((totalCompliant / totalItems) * 100);

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl space-y-10">
      {/* ─── Header ─── */}
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
          <Shield className="h-4 w-4" />
          Dossier Sécurité &amp; Conformité — Secteur Santé
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          EmotionsCare — Security Dossier
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm leading-relaxed">
          Document à destination des décideurs B2B, DSI, RSSI et DPO du secteur santé.
          Couvre la conformité RGPD, la préparation HDS, la posture de sécurité et la documentation réglementaire.
        </p>
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span>Version {DOSSIER_VERSION}</span>
          <Separator orientation="vertical" className="h-3" />
          <span>{DOSSIER_DATE}</span>
          <Separator orientation="vertical" className="h-3" />
          <Badge variant="outline" className="text-[10px]">Confidentiel</Badge>
        </div>
      </header>

      {/* ─── Executive Summary ─── */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <CardContent className="py-8">
          <h2 className="text-lg font-semibold text-foreground mb-6 text-center">Synthèse Exécutive</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-3xl font-bold text-foreground">{SECURITY_SCORE}/10</div>
              <div className="text-xs text-muted-foreground">Score sécurité global</div>
              <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 text-[10px]">+37% vs Q4 2025</Badge>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-foreground">{totalCompliant}</div>
              <div className="text-xs text-muted-foreground">Contrôles conformes</div>
              <Badge variant="secondary" className="text-[10px]">sur {totalItems} total</Badge>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-foreground">{globalPct}%</div>
              <div className="text-xs text-muted-foreground">Taux de conformité</div>
              <Progress value={globalPct} className="h-1.5 mt-1" />
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-foreground">{totalInProgress}</div>
              <div className="text-xs text-muted-foreground">Chantiers en cours</div>
              <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-500/20 text-[10px]">Actifs</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─── Tabs: 4 sections ─── */}
      <Tabs defaultValue="rgpd" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="rgpd" className="text-xs">RGPD</TabsTrigger>
          <TabsTrigger value="hds" className="text-xs">HDS</TabsTrigger>
          <TabsTrigger value="security" className="text-xs">Sécurité</TabsTrigger>
          <TabsTrigger value="docs" className="text-xs">Documentation</TabsTrigger>
        </TabsList>
        <TabsContent value="rgpd"><SectionCard section={rgpdSection} /></TabsContent>
        <TabsContent value="hds"><SectionCard section={hdsSection} /></TabsContent>
        <TabsContent value="security"><SectionCard section={securityPosture} /></TabsContent>
        <TabsContent value="docs"><SectionCard section={complianceDocs} /></TabsContent>
      </Tabs>

      {/* ─── Architecture Sécurité ─── */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Server className="h-5 w-5 text-primary" />
          Architecture de Sécurité
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ARCHITECTURE_HIGHLIGHTS.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="bg-card/80">
                <CardContent className="pt-4 pb-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary/70" />
                    <span className="text-sm font-semibold text-foreground">{item.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ─── Garanties B2B ─── */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          Garanties B2B Santé
        </h2>
        <Card>
          <CardContent className="py-6 space-y-4">
            {B2B_GUARANTEES.map((g, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-1 p-1 rounded-full bg-emerald-500/10">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{g.title}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">{g.desc}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* ─── Roadmap Conformité ─── */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Scale className="h-5 w-5 text-primary" />
          Roadmap Conformité
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { quarter: 'Q1 2026', label: 'En cours', items: ['PIA données émotionnelles', 'PAS (Plan Assurance Sécurité)', 'Guide intégration B2B', 'SLA 99.9%'], color: 'text-amber-600' },
            { quarter: 'Q2–Q3 2026', label: 'Planifié', items: ['Nomination DPO', 'MFA / 2FA', 'Migration hébergeur HDS', 'Pentest externe'], color: 'text-primary' },
            { quarter: 'Q4 2026+', label: 'Objectif', items: ['Certification ISO 27001', 'Certification HDS complète', 'SOC 2 Type II (2027)', 'Audit ANSSI'], color: 'text-muted-foreground' },
          ].map((phase) => (
            <Card key={phase.quarter}>
              <CardContent className="pt-4 pb-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">{phase.quarter}</span>
                  <Badge variant="outline" className={`text-[10px] ${phase.color}`}>{phase.label}</Badge>
                </div>
                <ul className="space-y-1.5">
                  {phase.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <ArrowRight className="h-3 w-3 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ─── Références documentaires ─── */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Références Documentaires
        </h2>
        <Card>
          <CardContent className="py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { doc: 'Politique de confidentialité', path: '/privacy' },
                { doc: 'Conditions Générales d\'Utilisation', path: '/terms' },
                { doc: 'Scorecard Sécurité détaillé', path: '/admin/security-scorecard' },
                { doc: 'docs/compliance/ — Documentation HDS', path: '#' },
                { doc: 'docs/roadmap-security-30days.md', path: '#' },
                { doc: 'reports/CORS_SECURISE_ET_DASHBOARD_MONITORING.md', path: '#' },
              ].map((ref) => (
                <div key={ref.doc} className="flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition-colors">
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span>{ref.doc}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ─── Footer ─── */}
      <footer className="text-center text-xs text-muted-foreground space-y-1 pt-4 pb-8">
        <p>EmotionsCare — Dossier Sécurité &amp; Conformité B2B Santé</p>
        <p>Version {DOSSIER_VERSION} — {DOSSIER_DATE} — Document confidentiel</p>
        <p className="italic">« Prendre soin de celles et ceux qui prennent soin »</p>
      </footer>
    </div>
  );
};

export default SecurityDossierB2B;
