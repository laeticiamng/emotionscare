// @ts-nocheck
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePageSEO } from '@/hooks/usePageSEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertTriangle, BarChart3, Brain, CheckCircle2, Clock, Filter,
  Gamepad2, Heart, Lock, Music, Search, Shield, Sparkles, Users, Zap,
  Wind, BookOpen, Eye, Trophy, Star, Target, RefreshCw, Wand2,
  Film, ArrowLeft, Mic,
} from 'lucide-react';

type ModuleStatus = 'complete' | 'partial' | 'missing';
type Category = 'Bien-être émotionnel' | 'Musicothérapie' | 'Gamification' | 'B2B / RH' | 'Communauté & Contenu' | 'Fonctionnalités avancées';

interface PlatformModule {
  id: number;
  title: string;
  category: Category;
  status: ModuleStatus;
  route: string;
  description: string;
  nextStep: string;
}

const MODULES: PlatformModule[] = [
  // ── Bien-être émotionnel (8 modules) ──────────────────────────
  { id: 1, title: 'Scanner émotionnel IA', category: 'Bien-être émotionnel', status: 'complete', route: '/app/scan', description: 'Questionnaire 5 dimensions (humeur, énergie, stress, sommeil, charge mentale) avec radar chart, recommandations contextuelles et sauvegarde Supabase.', nextStep: '' },
  { id: 2, title: 'Coach IA', category: 'Bien-être émotionnel', status: 'complete', route: '/app/coach', description: 'Coach émotionnel IA 24/7 avec chat, consentement, personnalités, historique sessions, détection de crise et suggestions.', nextStep: '' },
  { id: 3, title: 'Respiration Guidée (Hub)', category: 'Bien-être émotionnel', status: 'complete', route: '/app/breath-hub', description: 'Hub unifié avec 4 modes (Classique, Gamifié, Immersif, Nuit), 6 protocoles, recommandations post-scan et statistiques.', nextStep: '' },
  { id: 4, title: 'Protocole Stop (20-20-20)', category: 'Bien-être émotionnel', status: 'complete', route: '/app/screen-silk', description: 'Timer 20-20-20 guidé avec ancrage audio, compteur de cycles, statistiques de pauses et phases respiration/regard.', nextStep: '' },
  { id: 5, title: 'Protocole Reset', category: 'Bien-être émotionnel', status: 'complete', route: '/app/flash-glow', description: 'Protocole Reset Express 3 min (4-4-6 × 12 cycles) avec guide respiratoire intégré, luminothérapie et suivi de score.', nextStep: '' },
  { id: 6, title: 'Parc émotionnel', category: 'Bien-être émotionnel', status: 'complete', route: '/app/emotional-park', description: 'Espace interactif immersif avec zones thématiques, parcours guidés, quêtes, badges et recommandations basées sur le scan.', nextStep: '' },
  { id: 7, title: 'Méditation', category: 'Bien-être émotionnel', status: 'complete', route: '/app/meditation', description: '8 techniques de méditation guidée (Pause Soignant, Pleine conscience, Body scan, etc.) avec timer, statistiques et sons ambiants.', nextStep: '' },
  { id: 8, title: 'Évaluations cliniques', category: 'Bien-être émotionnel', status: 'complete', route: '/dashboard/assessments', description: 'Tests psychométriques validés : PSS-10 (stress), MBI-HSS (burnout), PHQ-9 (dépression). Scoring automatique, sauvegarde et recommandations.', nextStep: '' },

  // ── Musicothérapie (3 modules) ────────────────────────────────
  { id: 9, title: 'Musicothérapie (Hub)', category: 'Musicothérapie', status: 'complete', route: '/app/music-hub', description: 'Hub musical unifié avec audio réel : Bibliothèque (5 pistes streamables), Mixer d\'ambiances (6 couches) et Journal Vocal (enregistrement MediaRecorder).', nextStep: '' },
  { id: 10, title: 'Écoute thérapeutique', category: 'Musicothérapie', status: 'complete', route: '/app/music', description: 'Collection de vinyles thématiques et playlists adaptées avec mode auto-play selon scan émotionnel.', nextStep: '' },
  { id: 11, title: 'Récits Thérapeutiques', category: 'Musicothérapie', status: 'complete', route: '/app/story-synth', description: 'Bibliothèque de récits guidés IA avec génération personnalisée, favoris et lecture avec timer.', nextStep: '' },

  // ── Gamification (1 hub unifié) ───────────────────────────────
  { id: 12, title: 'Gamification (Hub)', category: 'Gamification', status: 'complete', route: '/app/gamification', description: 'Hub unifié : XP & niveaux, défis quotidiens, badges, classement anonymisé et défis de résilience.', nextStep: '' },

  // ── B2B / RH (4 modules) ─────────────────────────────────────
  { id: 13, title: 'Dashboard B2B RH', category: 'B2B / RH', status: 'complete', route: '/app/rh', description: 'Tableau de bord manager avec 5 KPIs (bien-être, membres actifs, engagement, alertes, récupération).', nextStep: '' },
  { id: 14, title: 'Rapports anonymisés', category: 'B2B / RH', status: 'complete', route: '/app/reports', description: 'Synthèses mensuelles narratives avec conformité RGPD et seuil de 5 répondants.', nextStep: '' },
  { id: 15, title: 'Alertes RH', category: 'B2B / RH', status: 'complete', route: '/b2b/alerts', description: 'Centre d\'alertes bien-être avec seuils configurables (stress, sommeil, charge, humeur).', nextStep: '' },
  { id: 16, title: 'Programme de prévention', category: 'B2B / RH', status: 'complete', route: '/b2b/prevention', description: 'Parcours de prévention sur mesure avec suivi d\'adoption.', nextStep: '' },

  // ── Communauté (1 hub unifié) ─────────────────────────────────
  { id: 17, title: 'Communauté (Hub)', category: 'Communauté', status: 'complete', route: '/app/community', description: 'Hub social unifié : Entraide, Buddies, Sessions de groupe et Cercles thématiques.', nextStep: '' },
  { id: 18, title: 'Visioconférence', category: 'Communauté', status: 'complete', route: '/app/visio', description: 'Sessions de soutien en visio avec consentement renforcé.', nextStep: '' },
  { id: 19, title: 'FAQ interactive', category: 'Communauté', status: 'complete', route: '/faq', description: 'Questions fréquentes en 7 catégories avec recherche full-text et filtrage dynamique.', nextStep: '' },

  // ── Fonctionnalités avancées (7 modules) ─────────────────────
  { id: 20, title: 'Journal de bord', category: 'Fonctionnalités avancées', status: 'complete', route: '/app/journal', description: 'Journal émotionnel avec écriture libre, filtres, export RGPD, suivi longitudinal et statistiques.', nextStep: '' },
  { id: 21, title: 'VR thérapeutique', category: 'Fonctionnalités avancées', status: 'complete', route: '/app/vr', description: 'Hub VR unifié avec 3 scènes (Galaxy, Breath, Nébuleuse), timer de tolérance et statistiques.', nextStep: '' },
  { id: 22, title: 'Export RGPD', category: 'Fonctionnalités avancées', status: 'complete', route: '/app/data-export', description: 'Export complet : PDF, JSON, CSV avec sélection par catégorie et historique.', nextStep: '' },
  { id: 23, title: 'Wearables', category: 'Fonctionnalités avancées', status: 'complete', route: '/app/wearables', description: 'Interface de connexion montres connectées avec Web Bluetooth API pour capteurs HR.', nextStep: '' },
  { id: 24, title: 'Mode hors ligne (PWA)', category: 'Fonctionnalités avancées', status: 'complete', route: '/install', description: 'Application installable avec service worker, cache offline pour protocoles essentiels.', nextStep: '' },
  { id: 25, title: 'Support multilingue', category: 'Fonctionnalités avancées', status: 'complete', route: '/settings/language', description: 'FR + EN complets (100+ clés chacun), DE/ES en chargement dynamique.', nextStep: '' },
  { id: 26, title: 'Accessibilité WCAG 2.1 AA', category: 'Fonctionnalités avancées', status: 'complete', route: '/settings/accessibility', description: 'Contraste, daltonien, taille texte, clavier, aria-labels sur tous les hubs. Score 95/100.', nextStep: '' },
];

const STATUS_LABELS = { complete: 'Complet', partial: 'Partiel', missing: 'À construire' };
const STATUS_COLORS = { complete: 'bg-emerald-500', partial: 'bg-amber-500', missing: 'bg-rose-500' };

function statusIcon(status: ModuleStatus) {
  if (status === 'complete') return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
  if (status === 'partial') return <Clock className="h-4 w-4 text-amber-500" />;
  return <AlertTriangle className="h-4 w-4 text-rose-500" />;
}

export default function ModulesDashboard() {
  usePageSEO({
    title: 'Modules EmotionsCare - Complétude plateforme',
    description: 'Audit des 30 modules EmotionsCare avec plan d\'exécution.',
  });

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | Category>('all');
  const [status, setStatus] = useState<'all' | ModuleStatus>('all');

  const stats = useMemo(() => {
    const complete = MODULES.filter(m => m.status === 'complete').length;
    const partial = MODULES.filter(m => m.status === 'partial').length;
    const missing = MODULES.filter(m => m.status === 'missing').length;
    const score = Math.round(((complete + partial * 0.5) / MODULES.length) * 100);
    return { complete, partial, missing, score };
  }, []);

  const filtered = useMemo(() =>
    MODULES.filter(m => {
      const matchQ = m.title.toLowerCase().includes(query.toLowerCase()) || m.description.toLowerCase().includes(query.toLowerCase());
      const matchC = category === 'all' || m.category === category;
      const matchS = status === 'all' || m.status === status;
      return matchQ && matchC && matchS;
    }), [query, category, status]);

  return (
    <div className="container mx-auto max-w-7xl space-y-8 px-4 py-8">
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Link to="/app/home">
            <Button variant="ghost" size="icon" aria-label="Retour">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <Badge variant="outline" className="gap-2 mb-2">
              <Sparkles className="h-3.5 w-3.5" /> Audit consolidé ({MODULES.length} modules)
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight">Modules EmotionsCare</h1>
            <p className="text-muted-foreground">
              Plateforme consolidée · {stats.complete} complets · {stats.partial} en cours
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2"><CardDescription>Score global</CardDescription><CardTitle>{stats.score}%</CardTitle></CardHeader>
            <CardContent><Progress value={stats.score} className="h-2" /></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardDescription>Complets</CardDescription><CardTitle>{stats.complete}</CardTitle></CardHeader>
            <CardContent><Badge className="bg-emerald-500">Prêts prod</Badge></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardDescription>Partiels</CardDescription><CardTitle>{stats.partial}</CardTitle></CardHeader>
            <CardContent><Badge className="bg-amber-500">À finaliser</Badge></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardDescription>Manquants</CardDescription><CardTitle>{stats.missing}</CardTitle></CardHeader>
            <CardContent><Badge className="bg-rose-500">À créer</Badge></CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="relative md:col-span-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Rechercher un module" className="pl-9" />
        </div>
        <Select value={category} onValueChange={v => setCategory(v as any)}>
          <SelectTrigger><Filter className="mr-2 h-4 w-4" /><SelectValue placeholder="Catégorie" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            <SelectItem value="Bien-être émotionnel">Bien-être émotionnel</SelectItem>
            <SelectItem value="Musicothérapie">Musicothérapie</SelectItem>
            <SelectItem value="Gamification">Gamification</SelectItem>
            <SelectItem value="B2B / RH">B2B / RH</SelectItem>
            <SelectItem value="Communauté & Contenu">Communauté & Contenu</SelectItem>
            <SelectItem value="Fonctionnalités avancées">Fonctionnalités avancées</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={v => setStatus(v as any)}>
          <SelectTrigger><SelectValue placeholder="Statut" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="complete">Complet</SelectItem>
            <SelectItem value="partial">Partiel</SelectItem>
            <SelectItem value="missing">À construire</SelectItem>
          </SelectContent>
        </Select>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {filtered.map(module => (
          <Card key={module.id} className="border-border/70">
            <CardHeader className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-lg leading-tight">#{module.id} · {module.title}</CardTitle>
                <Badge className={STATUS_COLORS[module.status]}>{STATUS_LABELS[module.status]}</Badge>
              </div>
              <CardDescription>{module.category}</CardDescription>
              <p className="text-sm text-muted-foreground">{module.description}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {statusIcon(module.status)}
                <span>{module.status === 'complete' ? 'Module opérationnel' : `Prochaine étape : ${module.nextStep}`}</span>
              </div>
              <Button asChild variant="outline" size="sm"><Link to={module.route}>Ouvrir le module</Link></Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
