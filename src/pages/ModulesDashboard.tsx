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
  { id: 5, title: 'Protocole Reset', category: 'Bien-être émotionnel', status: 'partial', route: '/app/flash-glow', description: 'Micro-session de récupération en 2 à 10 minutes avec suivi de score et streaks.', nextStep: 'Structurer protocole en 3 minutes standardisées.' },
  { id: 6, title: 'Parc émotionnel', category: 'Bien-être émotionnel', status: 'partial', route: '/app/emotional-park', description: 'Espace interactif immersif avec zones thématiques, parcours guidés, quêtes et badges.', nextStep: 'Relier parcours à score scan et plan personnalisé.' },
  { id: 7, title: 'Méditation', category: 'Bien-être émotionnel', status: 'partial', route: '/app/meditation', description: 'Sessions de méditation guidée avec statistiques de pratique.', nextStep: 'Créer bibliothèque de méditations guidées audio.' },
  { id: 8, title: 'Évaluations cliniques', category: 'Bien-être émotionnel', status: 'complete', route: '/dashboard/assessments', description: 'Tests psychométriques validés : PSS-10 (stress), MBI-HSS (burnout), PHQ-9 (dépression). Scoring automatique, sauvegarde et recommandations.', nextStep: '' },

  // ── Musicothérapie (3 modules) ────────────────────────────────
  { id: 9, title: 'Musicothérapie (Hub)', category: 'Musicothérapie', status: 'partial', route: '/app/music-hub', description: 'Hub musical unifié : Bibliothèque, Mixer d\'ambiances et Journal Vocal.', nextStep: 'Finaliser génération Suno et post-traitement clinique.' },
  { id: 10, title: 'Écoute thérapeutique', category: 'Musicothérapie', status: 'partial', route: '/app/music', description: 'Collection de vinyles thématiques et playlists adaptées.', nextStep: 'Créer mode auto-play selon horaire/poste.' },
  { id: 11, title: 'Récits Thérapeutiques', category: 'Musicothérapie', status: 'partial', route: '/app/story-synth', description: 'Bibliothèque de récits guidés IA pour la relaxation.', nextStep: 'Créer bibliothèque de récits avec IA générative.' },

  // ── Gamification (1 hub unifié) ───────────────────────────────
  { id: 12, title: 'Gamification (Hub)', category: 'Gamification', status: 'complete', route: '/app/gamification', description: 'Hub unifié : XP & niveaux, défis quotidiens, badges, classement anonymisé et défis de résilience. Vue d\'ensemble avec objectifs du jour.', nextStep: '' },

  // ── B2B / RH (4 modules) ─────────────────────────────────────
  { id: 13, title: 'Dashboard B2B RH', category: 'B2B / RH', status: 'partial', route: '/app/rh', description: 'Tableau de bord manager : bien-être anonymisé des équipes.', nextStep: 'Structurer KPIs cibles (charge, tension, récupération).' },
  { id: 14, title: 'Rapports anonymisés', category: 'B2B / RH', status: 'partial', route: '/app/reports', description: 'Synthèses mensuelles pour managers avec conformité RGPD.', nextStep: 'Templates hebdo/mensuels exportables RGPD.' },
  { id: 15, title: 'Alertes RH', category: 'B2B / RH', status: 'partial', route: '/b2b/alerts', description: 'Centre d\'alertes bien-être anonymisées par sévérité.', nextStep: 'Paramétrage seuils + priorisation par établissement.' },
  { id: 16, title: 'Programme de prévention', category: 'B2B / RH', status: 'complete', route: '/b2b/prevention', description: 'Parcours de prévention sur mesure avec suivi d\'adoption.', nextStep: '' },

  // ── Communauté (1 hub unifié) ─────────────────────────────────
  { id: 17, title: 'Communauté (Hub)', category: 'Communauté', status: 'complete', route: '/app/community', description: 'Hub social unifié : Entraide soignants, Buddies (binômes), Sessions de groupe et Cercles thématiques. Modération et anonymisation.', nextStep: '' },
  { id: 18, title: 'Visioconférence', category: 'Communauté', status: 'complete', route: '/app/visio', description: 'Sessions de soutien en visio avec consentement renforcé.', nextStep: '' },
  { id: 19, title: 'FAQ interactive', category: 'Communauté', status: 'partial', route: '/faq', description: 'Questions fréquentes en 5 catégories avec recherche.', nextStep: 'Ajouter FAQ dynamique contextuelle.' },

  // ── Fonctionnalités avancées (7 modules) ─────────────────────
  { id: 20, title: 'Journal de bord', category: 'Fonctionnalités avancées', status: 'complete', route: '/app/journal', description: 'Journal émotionnel avec écriture libre, filtres, export RGPD, suivi longitudinal (graphe tendances) et statistiques.', nextStep: '' },
  { id: 21, title: 'VR thérapeutique', category: 'Fonctionnalités avancées', status: 'partial', route: '/app/vr', description: 'Immersion VR : galaxie, nébuleuse, respiration 3D.', nextStep: 'Unifier expérience VR avec indicateurs de tolérance.' },
  { id: 22, title: 'Export RGPD', category: 'Fonctionnalités avancées', status: 'partial', route: '/app/data-export', description: 'Export complet : PDF, JSON ou CSV.', nextStep: 'Centraliser exports dans un parcours unique.' },
  { id: 23, title: 'Wearables', category: 'Fonctionnalités avancées', status: 'partial', route: '/app/wearables', description: 'Connexion montres connectées pour suivi biométrique.', nextStep: 'Intégrer Apple Health, Google Fit, Garmin.' },
  { id: 24, title: 'Mode hors ligne (PWA)', category: 'Fonctionnalités avancées', status: 'partial', route: '/install', description: 'Application installable, fonctionnement offline.', nextStep: 'Rendre scan/protocoles essentiels offline-first.' },
  { id: 25, title: 'Support multilingue', category: 'Fonctionnalités avancées', status: 'partial', route: '/settings/language', description: 'FR + EN disponibles, DE/ES en cours.', nextStep: 'Ajouter support ES/DE complet.' },
  { id: 26, title: 'Accessibilité WCAG 2.1 AA', category: 'Fonctionnalités avancées', status: 'partial', route: '/settings/accessibility', description: 'Contraste, daltonien, taille texte, clavier.', nextStep: 'Audit complet contrastes et lecteurs écran.' },
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
