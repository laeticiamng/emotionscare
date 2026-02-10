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
  AlertTriangle,
  BarChart3,
  Brain,
  CheckCircle2,
  Clock,
  Filter,
  Gamepad2,
  Heart,
  Languages,
  Lock,
  Music,
  Search,
  Shield,
  Sparkles,
  Users,
  Video,
  Zap,
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
  { id: 1, title: 'Scan émotionnel IA', category: 'Bien-être émotionnel', status: 'partial', route: '/dashboard/scanner', description: 'Questionnaire émotionnel et score visuel.', nextStep: 'Connecter scoring IA + recommandations contextuelles dynamiques.' },
  { id: 2, title: 'Coach IA Nyvée', category: 'Bien-être émotionnel', status: 'partial', route: '/app/coach', description: 'Interface conversationnelle bienveillante.', nextStep: 'Renforcer prompts soignants + garde-fous cliniques + fallback crise.' },
  { id: 3, title: 'Parc émotionnel', category: 'Bien-être émotionnel', status: 'partial', route: '/app/emotional-park', description: 'Espace immersif de décompression.', nextStep: 'Relier parcours à score scan et plan personnalisé.' },
  { id: 4, title: 'Protocole Stop', category: 'Bien-être émotionnel', status: 'partial', route: '/app/screen-silk', description: 'Rupture rapide surcharge/stress.', nextStep: 'Ajouter timer guidé + ancrage audio d’urgence.' },
  { id: 5, title: 'Protocole Reset', category: 'Bien-être émotionnel', status: 'partial', route: '/app/flash-glow', description: 'Micro-session de récupération.', nextStep: 'Structurer protocole en 3 minutes standardisées.' },
  { id: 6, title: 'Protocole Night', category: 'Bien-être émotionnel', status: 'partial', route: '/app/nyvee', description: 'Sas d’apaisement avant sommeil.', nextStep: 'Créer routine nocturne guidée + mode lumière réduite.' },
  { id: 7, title: 'Protocole Respirez', category: 'Bien-être émotionnel', status: 'partial', route: '/dashboard/breathing', description: 'Respiration guidée.', nextStep: 'Ajouter protocoles 4-7-8, box breathing et cohérence cardiaque.' },

  { id: 8, title: 'Musicothérapie Suno', category: 'Musicothérapie', status: 'partial', route: '/app/music', description: 'Module musique thérapeutique existant.', nextStep: 'Finaliser génération Suno et post-traitement clinique.' },
  { id: 9, title: 'Écoute passive', category: 'Musicothérapie', status: 'partial', route: '/app/music', description: 'Playlists d’ambiance accessibles.', nextStep: 'Créer mode auto-play selon horaire/poste.' },
  { id: 10, title: 'Playlists personnalisées', category: 'Musicothérapie', status: 'partial', route: '/app/music', description: 'Recommandations musicales émotionnelles.', nextStep: 'Brancher détection émotionnelle continue + feedback loop.' },

  { id: 11, title: 'Système XP', category: 'Gamification', status: 'partial', route: '/app/activity', description: 'Progression utilisateur disponible.', nextStep: 'Afficher XP unifié sur profil + modules.' },
  { id: 12, title: 'Niveaux et badges', category: 'Gamification', status: 'partial', route: '/app/achievements', description: 'Badges et succès déjà présents.', nextStep: 'Unifier règles de déblocage et lisibilité progression.' },
  { id: 13, title: 'Défis quotidiens', category: 'Gamification', status: 'partial', route: '/app/challenges/history', description: 'Historique de défis existant.', nextStep: 'Ajouter génération quotidienne auto + relances personnalisées.' },
  { id: 14, title: 'Classement anonymisé', category: 'Gamification', status: 'partial', route: '/app/leaderboard', description: 'Leaderboard existant.', nextStep: 'Forcer anonymisation par défaut et opt-in explicite.' },

  { id: 15, title: 'Dashboard B2B RH', category: 'B2B / RH', status: 'partial', route: '/app/rh', description: 'Espace RH disponible.', nextStep: 'Structurer KPIs cibles (charge, tension, récupération).' },
  { id: 16, title: 'Rapports anonymisés', category: 'B2B / RH', status: 'partial', route: '/app/reports', description: 'Rapports RH existants.', nextStep: 'Templates hebdo/mensuels exportables RGPD.' },
  { id: 17, title: 'Alertes RH', category: 'B2B / RH', status: 'partial', route: '/app/alerts', description: 'Centre d’alertes existant.', nextStep: 'Paramétrage seuils + priorisation par établissement.' },
  { id: 18, title: 'Programme de prévention', category: 'B2B / RH', status: 'missing', route: '/contact', description: 'Parcours établissement à construire.', nextStep: 'Créer builder parcours + objectifs + suivi adoption.' },

  { id: 19, title: 'Forum communautaire', category: 'Communauté & Contenu', status: 'partial', route: '/app/entraide', description: 'Espace entraide actif.', nextStep: 'Ajouter modération, signalement, tags cliniques.' },
  { id: 20, title: 'Bibliothèque de ressources', category: 'Communauté & Contenu', status: 'partial', route: '/help', description: 'Base aide publique existante.', nextStep: 'Créer hub contenu (articles/vidéos/podcasts) filtrable.' },
  { id: 21, title: 'Témoignages', category: 'Communauté & Contenu', status: 'missing', route: '/about', description: 'Section dédiée non structurée.', nextStep: 'Ajouter témoignages anonymisés validés éditorialement.' },
  { id: 22, title: 'FAQ interactive', category: 'Communauté & Contenu', status: 'partial', route: '/faq', description: 'FAQ publique déjà en place.', nextStep: 'Ajouter FAQ dynamique contextuelle par segment.' },

  { id: 23, title: 'Réalité virtuelle', category: 'Fonctionnalités avancées', status: 'partial', route: '/app/vr', description: 'Modules VR présents.', nextStep: 'Unifier expérience VR avec indicateurs de tolérance.' },
  { id: 24, title: 'Journal de bord', category: 'Fonctionnalités avancées', status: 'partial', route: '/app/journal', description: 'Journal disponible.', nextStep: 'Ajouter suivi longitudinal multi-signaux.' },
  { id: 25, title: 'Rappels personnalisés', category: 'Fonctionnalités avancées', status: 'partial', route: '/settings/notifications', description: 'Paramètres notifications disponibles.', nextStep: 'Scénarios intelligents selon charge émotionnelle.' },
  { id: 26, title: 'Suivi longitudinal', category: 'Fonctionnalités avancées', status: 'partial', route: '/app/trends', description: 'Visualisations de tendance existantes.', nextStep: 'Corrélation multi-modules + alertes dérive.' },
  { id: 27, title: 'Export RGPD', category: 'Fonctionnalités avancées', status: 'partial', route: '/app/data-export', description: 'Exports existants.', nextStep: 'Centraliser exports dans un parcours unique.' },
  { id: 28, title: 'Notifications push', category: 'Fonctionnalités avancées', status: 'partial', route: '/settings/notifications', description: 'Infrastructure notification existante.', nextStep: 'Ajouter push mobile ciblées par protocole.' },
  { id: 29, title: 'Mode hors ligne', category: 'Fonctionnalités avancées', status: 'partial', route: '/install', description: 'PWA partielle.', nextStep: 'Rendre scan/protocoles essentiels offline-first.' },
  { id: 30, title: 'Intégration calendrier', category: 'Fonctionnalités avancées', status: 'partial', route: '/app/calendar', description: 'Agenda existant.', nextStep: 'Créer rendez-vous bien-être automatiques.' },
  { id: 31, title: 'Visioconférence', category: 'Fonctionnalités avancées', status: 'missing', route: '/contact', description: 'Module visio non livré.', nextStep: 'Intégrer WebRTC + consentement renforcé.' },
  { id: 32, title: 'Tableau de bord personnel', category: 'Fonctionnalités avancées', status: 'partial', route: '/app/consumer/home', description: 'Dashboard utilisateur existant.', nextStep: 'Fusionner KPIs, objectifs et recommandations IA.' },
  { id: 33, title: 'Paramètres confidentialité', category: 'Fonctionnalités avancées', status: 'partial', route: '/settings/privacy', description: 'Réglages confidentialité présents.', nextStep: 'Ajouter centre consentements granulaire.' },
  { id: 34, title: 'Support multilingue', category: 'Fonctionnalités avancées', status: 'missing', route: '/contact', description: 'I18n insuffisant.', nextStep: 'Industrialiser FR/EN/ES + fallback UX soignants.' },
  { id: 35, title: 'Accessibilité WCAG 2.1 AA', category: 'Fonctionnalités avancées', status: 'partial', route: '/app/accessibility', description: 'Base accessibilité en place.', nextStep: 'Audit complet contrastes, clavier, lecteurs écran.' },
  { id: 36, title: 'Analytics produit', category: 'Fonctionnalités avancées', status: 'partial', route: '/app/analytics', description: 'Analytics techniques présents.', nextStep: 'Ajouter analytics parcours émotionnels orientés impact.' },
  { id: 37, title: 'Conformité HDS opérationnelle', category: 'Fonctionnalités avancées', status: 'missing', route: '/contact', description: 'Conformité partielle à formaliser.', nextStep: 'Plan HDS (hébergement, procédures, preuves, audits).' },
];

const STATUS_LABELS = {
  complete: 'Complet',
  partial: 'Partiel',
  missing: 'À construire',
};

const STATUS_COLORS = {
  complete: 'bg-emerald-500',
  partial: 'bg-amber-500',
  missing: 'bg-rose-500',
};

const PRIORITY_SPRINT = [1, 2, 4, 5, 6, 15];

function statusIcon(status: ModuleStatus) {
  if (status === 'complete') return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
  if (status === 'partial') return <Clock className="h-4 w-4 text-amber-500" />;
  return <AlertTriangle className="h-4 w-4 text-rose-500" />;
}

export default function ModulesDashboard() {
  usePageSEO({
    title: 'État de complétude plateforme - EmotionsCare',
    description: 'Audit module par module des 37 fonctionnalités EmotionsCare avec plan d’exécution adapté à lovable.dev.',
    keywords: 'audit plateforme, roadmap lovable, modules EmotionsCare, complétude produit',
  });

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | Category>('all');
  const [status, setStatus] = useState<'all' | ModuleStatus>('all');

  const stats = useMemo(() => {
    const complete = MODULES.filter((m) => m.status === 'complete').length;
    const partial = MODULES.filter((m) => m.status === 'partial').length;
    const missing = MODULES.filter((m) => m.status === 'missing').length;
    const score = Math.round(((complete + partial * 0.5) / MODULES.length) * 100);
    return { complete, partial, missing, score };
  }, []);

  const filtered = useMemo(
    () =>
      MODULES.filter((module) => {
        const matchesQuery =
          module.title.toLowerCase().includes(query.toLowerCase()) ||
          module.description.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = category === 'all' || module.category === category;
        const matchesStatus = status === 'all' || module.status === status;
        return matchesQuery && matchesCategory && matchesStatus;
      }),
    [query, category, status],
  );

  const sprintModules = MODULES.filter((module) => PRIORITY_SPRINT.includes(module.id));

  return (
    <div className="container mx-auto max-w-7xl space-y-8 px-4 py-8">
      <section className="space-y-4">
        <Badge variant="outline" className="gap-2">
          <Sparkles className="h-3.5 w-3.5" /> Audit complet (37/37)
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">Analyse de complétude EmotionsCare</h1>
        <p className="text-muted-foreground">
          Vérification module par module + plan d’exécution réaliste pour l’environnement lovable.dev.
        </p>

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
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un module" className="pl-9" />
        </div>

        <Select value={category} onValueChange={(value) => setCategory(value as any)}>
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

        <Select value={status} onValueChange={(value) => setStatus(value as any)}>
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
        {filtered.map((module) => (
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
                <span>Prochaine étape : {module.nextStep}</span>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm"><Link to={module.route}>Ouvrir le module</Link></Button>
                {module.status !== 'complete' && (
                  <Button asChild size="sm"><Link to="/contact">Prioriser dans le prochain sprint</Link></Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Plan complet d’exécution (adapté lovable.dev)</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Heart className="h-5 w-5" /> Sprint 1 · Stabilisation clinique</CardTitle>
              <CardDescription>Objectif: sécuriser le cœur de valeur B2C.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              {sprintModules.map((m) => <p key={m.id}>• #{m.id} {m.title}</p>)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Sprint 2 · Gamification + RH</CardTitle>
              <CardDescription>Objectif: engagement utilisateur et impact organisationnel.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Unifier XP / badges / défis / ranking anonymisé.</p>
              <p>• Industrialiser dashboards RH et rapports hebdo.</p>
              <p>• Mettre en place alertes seuil + parcours prévention.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Sprint 3 · Conformité et scale</CardTitle>
              <CardDescription>Objectif: passage échelle nationale.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• WCAG 2.1 AA complet + outillage QA accessibilité.</p>
              <p>• i18n FR/EN/ES, offline-first, push intelligents.</p>
              <p>• HDS + gouvernance RGPD opérationnelle.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="pt-6 text-sm text-muted-foreground flex items-center gap-2"><Brain className="h-4 w-4" /> IA thérapeutique sécurisée</CardContent></Card>
        <Card><CardContent className="pt-6 text-sm text-muted-foreground flex items-center gap-2"><Music className="h-4 w-4" /> Musicothérapie personnalisée</CardContent></Card>
        <Card><CardContent className="pt-6 text-sm text-muted-foreground flex items-center gap-2"><Users className="h-4 w-4" /> Impact B2B mesurable</CardContent></Card>
        <Card><CardContent className="pt-6 text-sm text-muted-foreground flex items-center gap-2"><Lock className="h-4 w-4" /> RGPD/HDS by design</CardContent></Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-6 text-sm text-muted-foreground flex items-center gap-2"><Zap className="h-4 w-4" /> Performance cible: &lt; 3s</CardContent></Card>
        <Card><CardContent className="pt-6 text-sm text-muted-foreground flex items-center gap-2"><Languages className="h-4 w-4" /> Français natif + i18n</CardContent></Card>
        <Card><CardContent className="pt-6 text-sm text-muted-foreground flex items-center gap-2"><Video className="h-4 w-4" /> Feuille de route visio/VR</CardContent></Card>
      </section>
    </div>
  );
}
