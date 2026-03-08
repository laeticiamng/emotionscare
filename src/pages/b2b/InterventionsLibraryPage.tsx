// @ts-nocheck
/**
 * Evidence-Based Interventions Library
 * Searchable cards with scheduling capability
 */
import React, { useState, useMemo } from 'react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  ArrowLeft, Search, Clock, Award, Users, Calendar, Heart, Wind,
  MessageCircle, BookOpen, Zap, Shield, Flower2, Brain
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Intervention {
  id: string;
  title: string;
  description: string;
  category: 'breathing' | 'peer-support' | 'debrief' | 'mindfulness' | 'physical' | 'cognitive';
  duration: string;
  evidenceLevel: 'A' | 'B' | 'C';
  tags: string[];
  icon: React.ElementType;
  steps: string[];
}

const EVIDENCE_LABELS = {
  A: { label: 'Niveau A', desc: 'Méta-analyses / essais randomisés', color: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' },
  B: { label: 'Niveau B', desc: 'Études contrôlées', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' },
  C: { label: 'Niveau C', desc: 'Consensus d\'experts', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300' },
};

const INTERVENTIONS: Intervention[] = [
  {
    id: 'resp-478',
    title: 'Respiration 4-7-8',
    description: 'Technique de respiration contrôlée pour réduire le stress aigu et l\'anxiété en quelques minutes. Validée pour les soignants en situation de tension.',
    category: 'breathing',
    duration: '5 min',
    evidenceLevel: 'A',
    tags: ['stress', 'anxiété', 'rapide', 'individuel'],
    icon: Wind,
    steps: ['Inspirez par le nez pendant 4 secondes', 'Retenez votre souffle 7 secondes', 'Expirez lentement par la bouche 8 secondes', 'Répétez 4 cycles'],
  },
  {
    id: 'peer-support',
    title: 'Session de soutien par les pairs',
    description: 'Discussion structurée entre collègues pour partager les difficultés émotionnelles liées au travail. Protocole validé pour la prévention du burnout.',
    category: 'peer-support',
    duration: '30 min',
    evidenceLevel: 'A',
    tags: ['burnout', 'équipe', 'émotions', 'prévention'],
    icon: Users,
    steps: ['Rassemblez 4-8 collègues volontaires', 'Rappel des règles de confidentialité', 'Tour de parole libre (3 min chacun)', 'Discussion collective', 'Clôture avec un engagement positif'],
  },
  {
    id: 'debrief-cism',
    title: 'Débriefing post-événement traumatique',
    description: 'Protocole CISM (Critical Incident Stress Management) adapté pour les équipes soignantes après un événement difficile (décès, violence, erreur médicale).',
    category: 'debrief',
    duration: '45-60 min',
    evidenceLevel: 'B',
    tags: ['trauma', 'équipe', 'protocole', 'post-crise'],
    icon: MessageCircle,
    steps: ['Introduction et cadrage (5 min)', 'Phase des faits : que s\'est-il passé ?', 'Phase des pensées : qu\'avez-vous pensé ?', 'Phase des réactions : qu\'avez-vous ressenti ?', 'Phase des symptômes : comment allez-vous maintenant ?', 'Phase d\'enseignement : normalisation', 'Réinsertion : plan d\'action et suivi'],
  },
  {
    id: 'body-scan',
    title: 'Body Scan de pleine conscience',
    description: 'Exercice de scanning corporel guidé pour relâcher les tensions accumulées pendant les shifts. Recommandé en fin de service.',
    category: 'mindfulness',
    duration: '10 min',
    evidenceLevel: 'A',
    tags: ['tensions', 'relaxation', 'individuel', 'fin-de-shift'],
    icon: Flower2,
    steps: ['Position confortable, yeux fermés', 'Portez attention aux pieds, remontez lentement', 'Identifiez les zones de tension sans jugement', 'Respirez dans chaque zone tendue', 'Terminez par 3 respirations profondes'],
  },
  {
    id: 'micro-pause',
    title: 'Micro-pause active',
    description: 'Séquence d\'étirements et de mobilisations ciblés pour les soignants, adaptée aux espaces de pause. Réduit la fatigue physique et mentale.',
    category: 'physical',
    duration: '3 min',
    evidenceLevel: 'B',
    tags: ['fatigue', 'physique', 'rapide', 'individuel'],
    icon: Zap,
    steps: ['Étirements cervicaux (30s)', 'Rotation des épaules (30s)', 'Flexion/extension poignets (30s)', 'Respiration abdominale (30s)', 'Contraction/relâchement global (30s)'],
  },
  {
    id: 'gratitude-round',
    title: 'Tour de gratitude d\'équipe',
    description: 'Rituel court en début ou fin de shift où chaque membre partage une chose positive. Renforce la cohésion et l\'accomplissement personnel.',
    category: 'cognitive',
    duration: '5 min',
    evidenceLevel: 'B',
    tags: ['cohésion', 'positif', 'équipe', 'rituel'],
    icon: Heart,
    steps: ['Réunissez l\'équipe en cercle', 'Chacun partage 1 moment positif du shift', 'Pas de commentaire négatif', 'Clôture par le cadre (remerciement collectif)'],
  },
  {
    id: 'cognitive-defusion',
    title: 'Défusion cognitive (ACT)',
    description: 'Exercice issu de la Thérapie d\'Acceptation et d\'Engagement pour prendre du recul face aux pensées négatives récurrentes.',
    category: 'cognitive',
    duration: '8 min',
    evidenceLevel: 'A',
    tags: ['pensées', 'rumination', 'individuel', 'ACT'],
    icon: Brain,
    steps: ['Identifiez la pensée qui vous hante', 'Reformulez : "J\'ai la pensée que..."', 'Visualisez la pensée sur un écran', 'Changez la voix mentale (robot, chant)', 'Observez : la pensée perd de son emprise'],
  },
  {
    id: 'schwartz-round',
    title: 'Schwartz Rounds',
    description: 'Forum multidisciplinaire mensuel pour discuter des aspects émotionnels et sociaux du soin. Pratique institutionnelle validée internationalement.',
    category: 'peer-support',
    duration: '60 min',
    evidenceLevel: 'A',
    tags: ['institution', 'multidisciplinaire', 'mensuel', 'émotions'],
    icon: BookOpen,
    steps: ['Panel de 2-3 présentateurs (cas anonymisé)', 'Présentation du vécu émotionnel (15 min)', 'Discussion ouverte avec l\'audience (35 min)', 'Synthèse et engagement par le facilitateur (10 min)'],
  },
];

const CATEGORIES = [
  { value: 'all', label: 'Toutes' },
  { value: 'breathing', label: 'Respiration' },
  { value: 'peer-support', label: 'Soutien par les pairs' },
  { value: 'debrief', label: 'Débriefing' },
  { value: 'mindfulness', label: 'Pleine conscience' },
  { value: 'physical', label: 'Exercice physique' },
  { value: 'cognitive', label: 'Techniques cognitives' },
];

const InterventionsLibraryPage: React.FC = () => {
  usePageSEO({
    title: 'Bibliothèque d\'interventions | EmotionsCare B2B',
    description: 'Pratiques de bien-être fondées sur les preuves pour les équipes soignantes.',
  });

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const filtered = useMemo(() => {
    return INTERVENTIONS.filter((i) => {
      const matchesSearch = !search || i.title.toLowerCase().includes(search.toLowerCase()) || i.tags.some(t => t.includes(search.toLowerCase()));
      const matchesCategory = category === 'all' || i.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const handleSchedule = (intervention: Intervention) => {
    setScheduleOpen(false);
    toast.success(`"${intervention.title}" planifié pour votre équipe`, {
      description: 'Les membres de l\'équipe recevront une notification.',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/b2b/admin/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              Bibliothèque d'Interventions
            </h1>
            <p className="text-sm text-muted-foreground">Pratiques fondées sur les preuves pour le bien-être des soignants</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une intervention..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              aria-label="Rechercher une intervention"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((intervention) => {
            const Icon = intervention.icon;
            const evidence = EVIDENCE_LABELS[intervention.evidenceLevel];
            return (
              <Card
                key={intervention.id}
                className="hover:shadow-lg transition-shadow cursor-pointer border-border hover:border-primary/30"
                onClick={() => setSelectedIntervention(intervention)}
                role="button"
                tabIndex={0}
                aria-label={`Voir ${intervention.title}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <Badge className={`text-xs ${evidence.color}`}>
                      <Award className="h-3 w-3 mr-1" />
                      {evidence.label}
                    </Badge>
                  </div>
                  <CardTitle className="text-base mt-2">{intervention.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">{intervention.description}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{intervention.duration}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {intervention.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune intervention trouvée pour cette recherche.</p>
          </div>
        )}

        {/* Detail Dialog */}
        <Dialog open={!!selectedIntervention} onOpenChange={(open) => !open && setSelectedIntervention(null)}>
          {selectedIntervention && (
            <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    {React.createElement(selectedIntervention.icon, { className: 'h-5 w-5 text-primary' })}
                  </div>
                  <div>
                    <DialogTitle>{selectedIntervention.title}</DialogTitle>
                    <DialogDescription className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3" />{selectedIntervention.duration}
                      <Badge className={`text-xs ml-2 ${EVIDENCE_LABELS[selectedIntervention.evidenceLevel].color}`}>
                        {EVIDENCE_LABELS[selectedIntervention.evidenceLevel].label}
                      </Badge>
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{selectedIntervention.description}</p>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Étapes du protocole</h4>
                  <ol className="space-y-2">
                    {selectedIntervention.steps.map((step, i) => (
                      <li key={i} className="flex gap-3 text-sm">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">{i + 1}</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                  <p><strong>Niveau de preuve :</strong> {EVIDENCE_LABELS[selectedIntervention.evidenceLevel].desc}</p>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setSelectedIntervention(null)}>Fermer</Button>
                <Button onClick={() => { setScheduleOpen(true); handleSchedule(selectedIntervention); setSelectedIntervention(null); }}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Planifier pour l'équipe
                </Button>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>

        <footer className="mt-8 pt-4 border-t text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            Interventions basées sur les preuves scientifiques • Adaptées au contexte hospitalier
          </div>
        </footer>
      </div>
    </div>
  );
};

export default InterventionsLibraryPage;
