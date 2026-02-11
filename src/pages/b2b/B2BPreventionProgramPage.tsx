/**
 * B2BPreventionProgramPage - Programme de prévention B2B
 * Module 18 : Parcours de prévention sur mesure pour les établissements
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePageSEO } from '@/hooks/usePageSEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Shield,
  Target,
  Users,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  Heart,
  Brain,
  AlertTriangle,
  BarChart3,
  FileText,
  Play,
  Sparkles,
} from 'lucide-react';
import PageRoot from '@/components/common/PageRoot';

interface PreventionProgram {
  id: string;
  title: string;
  description: string;
  duration: string;
  targetAudience: string;
  modules: string[];
  objectives: string[];
  status: 'active' | 'draft' | 'completed';
  progress: number;
  participants: number;
}

const SAMPLE_PROGRAMS: PreventionProgram[] = [
  {
    id: 'burnout-prevention',
    title: 'Prévention de l\'épuisement professionnel',
    description: 'Programme de 12 semaines pour identifier et prévenir le burn-out chez les soignants. Exercices quotidiens, suivi d\'indicateurs et accompagnement personnalisé.',
    duration: '12 semaines',
    targetAudience: 'Soignants en première ligne',
    modules: ['Scan émotionnel hebdomadaire', 'Protocole Stop quotidien', 'Protocole Respirez', 'Coaching IA Nyvée'],
    objectives: ['Réduire le stress perçu de 30%', 'Améliorer la qualité du sommeil', 'Développer des réflexes de décompression'],
    status: 'active',
    progress: 65,
    participants: 24,
  },
  {
    id: 'onboarding-wellbeing',
    title: 'Intégration bien-être nouveaux arrivants',
    description: 'Parcours d\'accueil de 4 semaines intégrant les outils EmotionsCare dès la prise de poste. Favorise l\'adoption précoce des bonnes pratiques émotionnelles.',
    duration: '4 semaines',
    targetAudience: 'Nouveaux collaborateurs',
    modules: ['Scan émotionnel initial', 'Découverte du Parc Émotionnel', 'Musicothérapie', 'Journal de bord'],
    objectives: ['Taux d\'adoption > 80%', 'Score bien-être de référence', 'Habitudes de régulation installées'],
    status: 'draft',
    progress: 0,
    participants: 0,
  },
  {
    id: 'night-shift-support',
    title: 'Accompagnement équipes de nuit',
    description: 'Programme spécifique pour les travailleurs de nuit : gestion du rythme circadien, rituels de récupération et prévention de la fatigue chronique.',
    duration: '8 semaines',
    targetAudience: 'Personnel de nuit',
    modules: ['Protocole Night', 'Musicothérapie sommeil', 'Scan émotionnel post-garde', 'Suivi longitudinal'],
    objectives: ['Améliorer la qualité du sommeil diurne', 'Réduire la fatigue post-garde', 'Prévenir l\'isolement social'],
    status: 'active',
    progress: 40,
    participants: 12,
  },
];

const STATUS_CONFIG = {
  active: { label: 'Actif', color: 'bg-emerald-500' },
  draft: { label: 'Brouillon', color: 'bg-amber-500' },
  completed: { label: 'Terminé', color: 'bg-blue-500' },
};

export default function B2BPreventionProgramPage() {
  usePageSEO({
    title: 'Programme de prévention - EmotionsCare B2B',
    description: 'Créez et gérez des parcours de prévention sur mesure pour vos établissements. Objectifs d\'équipe, suivi de l\'adoption et indicateurs d\'impact collectif.',
    keywords: 'prévention, burn-out, bien-être travail, programme RH, soignants, établissement santé',
  });

  const [activeTab, setActiveTab] = useState('programs');

  const activePrograms = SAMPLE_PROGRAMS.filter(p => p.status === 'active');
  const totalParticipants = SAMPLE_PROGRAMS.reduce((sum, p) => sum + p.participants, 0);

  return (
    <PageRoot>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Back */}
          <Link to="/app/rh" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" />
            Retour au dashboard RH
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className="gap-1">
                <Shield className="h-3 w-3" />
                B2B
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
              <Target className="h-8 w-8 text-primary" />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Programme de prévention
              </span>
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Créez et déployez des parcours de prévention sur mesure pour vos équipes. Suivez l'adoption, mesurez l'impact et ajustez en continu.
            </p>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{SAMPLE_PROGRAMS.length}</div>
                  <div className="text-xs text-muted-foreground">Programmes créés</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Play className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{activePrograms.length}</div>
                  <div className="text-xs text-muted-foreground">Programmes actifs</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalParticipants}</div>
                  <div className="text-xs text-muted-foreground">Participants actifs</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">+23%</div>
                  <div className="text-xs text-muted-foreground">Bien-être moyen</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="programs">Programmes</TabsTrigger>
              <TabsTrigger value="create">Créer</TabsTrigger>
              <TabsTrigger value="analytics">Impact</TabsTrigger>
            </TabsList>

            {/* Programs List */}
            <TabsContent value="programs" className="space-y-4">
              {SAMPLE_PROGRAMS.map((program) => (
                <Card key={program.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg">{program.title}</CardTitle>
                          <Badge className={STATUS_CONFIG[program.status].color}>
                            {STATUS_CONFIG[program.status].label}
                          </Badge>
                        </div>
                        <CardDescription>{program.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{program.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{program.participants} participants</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Target className="h-4 w-4" />
                        <span>{program.targetAudience}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Brain className="h-4 w-4" />
                        <span>{program.modules.length} modules</span>
                      </div>
                    </div>

                    {program.status === 'active' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progression globale</span>
                          <span className="font-medium">{program.progress}%</span>
                        </div>
                        <Progress value={program.progress} className="h-2" />
                      </div>
                    )}

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Modules intégrés :</p>
                      <div className="flex flex-wrap gap-2">
                        {program.modules.map((mod, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{mod}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Objectifs :</p>
                      <div className="space-y-1">
                        {program.objectives.map((obj, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                            <span>{obj}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Create Tab */}
            <TabsContent value="create">
              <Card className="border-dashed border-2">
                <CardContent className="p-12 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Créer un nouveau programme</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Construisez un parcours de prévention en sélectionnant les modules EmotionsCare adaptés à votre contexte, définissez les objectifs et déployez auprès de vos équipes.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 pt-4">
                    <Button>
                      <Play className="h-4 w-4 mr-2" />
                      Démarrer la création
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/contact">
                        <Heart className="h-4 w-4 mr-2" />
                        Demander un accompagnement
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Adoption par programme
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {activePrograms.map((program) => (
                      <div key={program.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="truncate">{program.title}</span>
                          <span className="font-medium text-muted-foreground">{program.participants} pers.</span>
                        </div>
                        <Progress value={program.progress} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <TrendingUp className="h-5 w-5 text-emerald-500" />
                      Indicateurs d'impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { label: 'Stress perçu moyen', value: '-28%', trend: 'down', good: true },
                      { label: 'Qualité du sommeil', value: '+19%', trend: 'up', good: true },
                      { label: 'Engagement plateforme', value: '73%', trend: 'up', good: true },
                      { label: 'Taux de complétion', value: '58%', trend: 'up', good: true },
                    ].map((indicator, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{indicator.label}</span>
                        <Badge variant={indicator.good ? 'default' : 'destructive'} className="font-mono">
                          {indicator.value}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="p-6 text-center">
                  <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Les données affichées sont des indicateurs agrégés et anonymisés conformément au RGPD. Aucune donnée individuelle n'est accessible aux managers.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageRoot>
  );
}
