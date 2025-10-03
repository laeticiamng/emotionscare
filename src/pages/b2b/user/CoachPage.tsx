import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  AlertTriangle,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  MessageSquare,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
  Users,
} from 'lucide-react';

interface ConversationMessage {
  author: 'coach' | 'manager';
  content: string;
  timestamp: string;
  highlights?: string[];
  actions?: string[];
  tone?: 'positive' | 'alert';
}

interface FocusArea {
  id: string;
  title: string;
  description: string;
  trend: string;
  metricHighlights: string[];
  quickPrompts: string[];
  conversation: Array<Omit<ConversationMessage, 'timestamp'> & { timestamp?: string }>;
  followUp: {
    template: string;
    actions: string[];
  };
  recommendations: string[];
  alerts: string[];
  rituals: Array<{
    title: string;
    duration: string;
    impact: string;
  }>;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  mood: number;
  trend: string;
  status: string;
  focus: string;
}

const focusAreas: FocusArea[] = [
  {
    id: 'motivation',
    title: 'Motivation collective',
    description: 'Réactiver l\'enthousiasme et la projection positive de l\'équipe.',
    trend: '+5 % d\'engagement',
    metricHighlights: [
      '72 % d\'engagement moyen sur la semaine',
      '3 collaborateurs citent un manque de reconnaissance',
      'Hausse de 8 % de l\'énergie déclarée depuis 2 semaines',
    ],
    quickPrompts: [
      'Préparer un message de reconnaissance ciblé',
      'Planifier un point "victoires" vendredi',
      'Inviter un client à partager un feedback positif',
    ],
    conversation: [
      {
        author: 'coach',
        content:
          'Synthèse émotionnelle : l\'équipe retrouve de l\'élan mais recherche des signes tangibles de reconnaissance.',
        highlights: [
          'Engagement moyen : 72 % (+5 vs semaine précédente)',
          'Sentiment dominant : besoin de célébrer les victoires',
        ],
        actions: [
          'Célébrer 3 réussites concrètes liées à la roadmap',
          'Identifier un duo moteur pour diffuser l\'énergie positive',
        ],
        tone: 'positive',
      },
    ],
    followUp: {
      template:
        'Je propose de co-construire avec {target} un rituel de reconnaissance hebdomadaire. Souhaitez-vous ajouter un message personnalisé ?',
      actions: [
        'Définir un canal de partages positifs',
        'Programmer un point court "victoire de la semaine"',
      ],
    },
    recommendations: [
      'Partager les impacts clients lors du prochain point équipe',
      'Nommer un binôme "énergie" pour animer les célébrations',
      'Inclure une séquence reconnaissance dans le rituel du lundi',
    ],
    alerts: [
      'Le design signale un besoin de feedback valorisant',
      '2 personnes mentionnent un manque de visibilité sur l\'impact',
    ],
    rituals: [
      {
        title: 'Pulse motivation 8 minutes',
        duration: 'Hebdomadaire',
        impact: 'Crée un momentum collectif positif',
      },
      {
        title: 'Spotlight réussite client',
        duration: '10 minutes',
        impact: 'Relie l\'équipe à la valeur livrée',
      },
    ],
  },
  {
    id: 'stress',
    title: 'Gestion du stress & charge mentale',
    description: 'Stabiliser la charge émotionnelle et éviter l\'effet tunnel.',
    trend: '-6 % de stress perçu',
    metricHighlights: [
      '38 % de stress moyen (-6 vs semaine précédente)',
      '2 collaborateurs déclarent une charge cognitive élevée',
      'Le volume de messages nocturnes a baissé de 12 %',
    ],
    quickPrompts: [
      'Mettre en pause les réunions après 18h',
      'Programmer un check-in respiration guidée',
      'Clarifier les priorités critiques de la semaine',
    ],
    conversation: [
      {
        author: 'coach',
        content:
          'Analyse : la pression reste présente mais les efforts de régulation portent leurs fruits. Les designers restent sous tension.',
        highlights: [
          'Stress perçu : 38 % (-6)',
          'Charge mentale élevée chez 2 personnes sur le pôle design',
        ],
        actions: [
          'Bloquer un temps "focus" sans réunions mercredi',
          'Proposer un protocole respiration en début de daily',
        ],
        tone: 'alert',
      },
    ],
    followUp: {
      template:
        'Je peux préparer pour {target} un plan de délestage sur 48 h avec des micro-pauses guidées. Un créneau particulier à privilégier ?',
      actions: [
        'Identifier les tâches délégables immédiatement',
        'Lancer une alerte charge mentale si un pic survient',
      ],
    },
    recommendations: [
      'Communiquer le protocole anti-surcharge en équipe',
      'Encourager un point 1:1 respiration de 10 minutes',
      'Cartographier les tâches énergivores à déléguer',
    ],
    alerts: [
      'Lea exprime une fatigue créative récurrente',
      'Suivi des heures tardives conseillé pour le pôle produit',
    ],
    rituals: [
      {
        title: 'Respiration cohérente guidée',
        duration: '5 minutes',
        impact: 'Réduit la charge mentale instantanément',
      },
      {
        title: 'Focus sans notification',
        duration: '2 x 45 minutes',
        impact: 'Sécurise la capacité à traiter les priorités',
      },
    ],
  },
  {
    id: 'alignment',
    title: 'Alignement & clarté',
    description: 'Recréer un cap partagé autour des priorités produit.',
    trend: '+12 % de clarté déclarée',
    metricHighlights: [
      '68 % des collaborateurs se sentent alignés (+12)',
      'Les nouveaux arrivants demandent un parcours d\'onboarding renforcé',
      'Hausse des questions stratégiques lors des stand-ups',
    ],
    quickPrompts: [
      'Construire un plan de communication claire pour le trimestre',
      'Partager la carte d\'impact produit mise à jour',
      'Préparer un support d\'onboarding émotionnel',
    ],
    conversation: [
      {
        author: 'coach',
        content:
          'Observation : le besoin de clarté recule mais les nouveaux talents ont besoin d\'ancrage rapide sur la vision produit.',
        highlights: [
          'Clarté déclarée : 68 % (+12)',
          'Nouveaux talents : besoin d\'un rituel d\'intégration émotionnelle',
        ],
        actions: [
          'Structurer une session alignement vision produit 30 min',
          'Mettre à jour le guide onboarding émotionnel',
        ],
        tone: 'positive',
      },
    ],
    followUp: {
      template:
        'Je prépare un kit de clarté à partager avec {target}. Voulez-vous intégrer un rappel sur les comportements attendus ?',
      actions: [
        'Ajouter une capsule vidéo vision produit',
        'Planifier un temps de questions ouvertes avec le leadership',
      ],
    },
    recommendations: [
      'Programmer une revue de roadmap orientée sens',
      'Créer un canal Q&R ouvert avec réponse sous 24 h',
      'Inclure un buddy émotionnel pour chaque onboarding',
    ],
    alerts: [
      'Les nouveaux talents expriment un besoin d\'ancrage rapide',
      'Le pôle tech demande des clarifications sur les priorités Q2',
    ],
    rituals: [
      {
        title: 'Alignement vision 30 minutes',
        duration: 'Mensuel',
        impact: 'Fige un cap partagé et rassurant',
      },
      {
        title: 'Buddy émotionnel onboarding',
        duration: 'Sur 3 semaines',
        impact: 'Accélère la cohésion et la sécurité psychologique',
      },
    ],
  },
];

const teamMembers: TeamMember[] = [
  {
    id: 'team',
    name: 'Équipe Produit',
    role: 'Collectif',
    mood: 68,
    trend: '+3',
    status: 'Stable',
    focus: 'Motivation & clarté',
  },
  {
    id: 'lea',
    name: 'Léa Martin',
    role: 'Product Designer',
    mood: 52,
    trend: '-6',
    status: 'Sous tension',
    focus: 'Charge créative à alléger',
  },
  {
    id: 'mohamed',
    name: 'Mohamed Benali',
    role: 'Lead Développeur',
    mood: 61,
    trend: '+2',
    status: 'Vigilance',
    focus: 'Clarifier les priorités techniques',
  },
  {
    id: 'claire',
    name: 'Claire Dubois',
    role: 'Product Manager',
    mood: 74,
    trend: '+5',
    status: 'Relais positif',
    focus: 'Soutien motivation & animation rituels',
  },
];

const pulseMetrics = [
  {
    label: 'Engagement',
    value: 72,
    delta: '+4',
    description: 'Hausse depuis la campagne reconnaissance',
    variant: 'positive' as const,
  },
  {
    label: 'Stress perçu',
    value: 38,
    delta: '-6',
    description: 'Baisse suite aux focus temps calme',
    variant: 'positive' as const,
  },
  {
    label: 'Charge mentale',
    value: 62,
    delta: '+9',
    description: 'Vigilance design & priorisation',
    variant: 'warning' as const,
  },
];

const buildConversation = (focus: FocusArea): ConversationMessage[] =>
  focus.conversation.map((message, index) => ({
    ...message,
    timestamp:
      message.timestamp ??
      new Date(Date.now() - index * 60_000).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
  }));

const B2BCoachPage: React.FC = () => {
  const [selectedFocusId, setSelectedFocusId] = useState<string>(focusAreas[0].id);
  const [selectedMemberId, setSelectedMemberId] = useState<string>(teamMembers[0].id);
  const [managerMessage, setManagerMessage] = useState('');
  const [messages, setMessages] = useState<ConversationMessage[]>(() =>
    buildConversation(focusAreas[0])
  );

  const selectedFocus = useMemo(
    () => focusAreas.find((focus) => focus.id === selectedFocusId) ?? focusAreas[0],
    [selectedFocusId]
  );

  const selectedMember = useMemo(
    () => teamMembers.find((member) => member.id === selectedMemberId) ?? teamMembers[0],
    [selectedMemberId]
  );

  useEffect(() => {
    setMessages(buildConversation(selectedFocus));
  }, [selectedFocus]);

  const getTargetLabel = () =>
    selectedMember.id === 'team' ? "l'équipe produit" : selectedMember.name;

  const handleSendMessage = (content?: string) => {
    const trimmed = (content ?? managerMessage).trim();
    if (!trimmed) {
      return;
    }

    const managerEntry: ConversationMessage = {
      author: 'manager',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((previous) => [...previous, managerEntry]);
    setManagerMessage('');

    const followUpContent = selectedFocus.followUp.template.replace('{target}', getTargetLabel());

    setTimeout(() => {
      setMessages((previous) => [
        ...previous,
        {
          author: 'coach',
          content: followUpContent,
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          actions: selectedFocus.followUp.actions,
          tone: 'positive',
        },
      ]);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Coach IA d'équipe</h1>
              <p className="text-sm text-slate-300">
                Priorisez les actions à fort impact émotionnel pour vos collaborateurs.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/15 text-emerald-200 border-emerald-400/40">Mode B2B</Badge>
            <Badge variant="outline" className="border-white/10 text-slate-200">
              Focus actuel : {selectedFocus.title}
            </Badge>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)_320px]">
          <aside className="space-y-4">
            <Card className="bg-slate-900/70 border-white/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-slate-200 flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-300" />
                  Focales d'accompagnement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {focusAreas.map((focus) => {
                  const isSelected = focus.id === selectedFocusId;
                  return (
                    <button
                      key={focus.id}
                      onClick={() => setSelectedFocusId(focus.id)}
                      className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                        isSelected
                          ? 'border-emerald-400/60 bg-emerald-500/10 text-emerald-100 shadow-lg shadow-emerald-900/30'
                          : 'border-white/10 bg-slate-950/40 text-slate-300 hover:border-emerald-400/30 hover:text-emerald-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{focus.title}</span>
                        <Badge className="bg-white/10 text-xs text-emerald-100 border-white/10">{focus.trend}</Badge>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-slate-300">
                        {focus.description}
                      </p>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="bg-slate-900/70 border-white/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-slate-200 flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-300" />
                  Collaborateurs suivis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {teamMembers.map((member) => {
                  const isActive = member.id === selectedMemberId;
                  return (
                    <button
                      key={member.id}
                      onClick={() => setSelectedMemberId(member.id)}
                      className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                        isActive
                          ? 'border-cyan-400/70 bg-cyan-500/10 text-cyan-50 shadow-lg shadow-cyan-900/30'
                          : 'border-white/10 bg-slate-950/40 text-slate-300 hover:border-cyan-400/30 hover:text-cyan-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-xs text-slate-400">{member.role}</div>
                        </div>
                        <Badge variant="outline" className="border-white/15 text-xs text-slate-200">
                          {member.mood} %
                        </Badge>
                      </div>
                      <div className="mt-2 text-xs text-slate-300">{member.focus}</div>
                      <div className="mt-2 flex items-center gap-2 text-xs">
                        <TrendingUp className="w-3 h-3 text-emerald-300" />
                        <span className={member.trend.includes('-') ? 'text-rose-300' : 'text-emerald-300'}>
                          {member.trend}
                        </span>
                        <span className="text-slate-400">• {member.status}</span>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="bg-slate-900/70 border-white/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-slate-200 flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-violet-300" />
                  Rituels conseillés
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedFocus.rituals.map((ritual) => (
                  <div key={ritual.title} className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center justify-between text-sm text-slate-200">
                      <span className="font-medium">{ritual.title}</span>
                      <Badge variant="outline" className="border-white/10 text-xs text-slate-200">
                        {ritual.duration}
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs text-slate-300">{ritual.impact}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>

          <main className="space-y-4">
            <Card className="bg-slate-900/80 border-white/5 backdrop-blur">
              <CardHeader className="border-b border-white/5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-slate-100 text-xl">
                      <Sparkles className="w-5 h-5 text-emerald-300" />
                      Session coach IA
                    </CardTitle>
                    <p className="mt-1 text-sm text-slate-300">
                      {selectedFocus.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className="bg-emerald-500/15 text-emerald-200 border-emerald-400/30">
                      Cible : {selectedMember.name}
                    </Badge>
                    <Badge variant="outline" className="border-white/10 text-xs text-slate-300">
                      {getTargetLabel() === "l'équipe produit" ? 'Approche collective' : 'Coaching individuel'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="border-b border-white/5 bg-white/5 px-6 py-4">
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {selectedFocus.metricHighlights.map((highlight) => (
                      <div key={highlight} className="flex items-start gap-2 text-xs text-slate-200">
                        <CheckCircle2 className="mt-0.5 w-4 h-4 text-emerald-300" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <ScrollArea className="h-[360px] px-6 py-6">
                  <div className="space-y-6">
                    {messages.map((message, index) => {
                      const isCoach = message.author === 'coach';
                      return (
                        <div
                          key={`${message.author}-${index}-${message.timestamp}`}
                          className={`flex ${isCoach ? 'justify-start' : 'justify-end'}`}
                        >
                          <div
                            className={`max-w-[75%] rounded-2xl border p-4 shadow transition ${
                              isCoach
                                ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-50'
                                : 'border-cyan-400/30 bg-cyan-500/10 text-cyan-50'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs text-slate-200">
                              <div className="flex items-center gap-2">
                                {isCoach ? (
                                  <Sparkles className="w-4 h-4" />
                                ) : (
                                  <Users className="w-4 h-4" />
                                )}
                                <span className="uppercase tracking-wide">
                                  {isCoach ? 'Coach IA EmotionsCare' : 'Manager'}
                                </span>
                              </div>
                              <span className="text-slate-300">{message.timestamp}</span>
                            </div>
                            <p className="mt-3 text-sm leading-relaxed text-slate-100">{message.content}</p>

                            {message.highlights && message.highlights.length > 0 && (
                              <div className="mt-4 space-y-2 rounded-lg border border-white/10 bg-white/5 p-3">
                                <div className="text-xs font-semibold uppercase tracking-wide text-slate-200">
                                  Points clés
                                </div>
                                <ul className="space-y-1 text-sm text-slate-100">
                                  {message.highlights.map((highlight) => (
                                    <li key={highlight} className="flex gap-2">
                                      <BarChart3 className="w-3.5 h-3.5 text-emerald-300" />
                                      <span>{highlight}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {message.actions && message.actions.length > 0 && (
                              <div className="mt-4 space-y-2 rounded-lg border border-white/10 bg-white/5 p-3">
                                <div className="text-xs font-semibold uppercase tracking-wide text-slate-200">
                                  Actions proposées
                                </div>
                                <ul className="space-y-2 text-sm text-slate-100">
                                  {message.actions.map((action) => (
                                    <li key={action} className="flex items-start gap-2">
                                      <CheckCircle2 className="mt-0.5 w-4 h-4 text-emerald-300" />
                                      <span>{action}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>

                <div className="border-t border-white/5 px-6 py-4 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedFocus.quickPrompts.map((prompt) => (
                      <Button
                        key={prompt}
                        variant="outline"
                        onClick={() => handleSendMessage(prompt)}
                        className="border-white/10 bg-white/5 text-xs text-slate-200 hover:border-emerald-400/40 hover:text-emerald-100"
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Textarea
                      value={managerMessage}
                      onChange={(event) => setManagerMessage(event.target.value)}
                      placeholder="Partagez une intention, une consigne ou une attention pour l'équipe..."
                      className="min-h-[90px] resize-none border-white/10 bg-slate-950/60 text-slate-100 placeholder:text-slate-400"
                    />
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Réponse coach en moins de 30 secondes</span>
                      <Button
                        size="sm"
                        onClick={() => handleSendMessage()}
                        disabled={!managerMessage.trim()}
                        className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 hover:from-emerald-400 hover:to-cyan-400"
                      >
                        Envoyer au coach
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>

          <aside className="space-y-4">
            <Card className="bg-slate-900/70 border-white/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-slate-200 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-300" />
                  Pulse émotionnel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pulseMetrics.map((metric) => {
                  const deltaClass =
                    metric.variant === 'warning'
                      ? 'text-amber-300'
                      : metric.delta.includes('-')
                        ? 'text-emerald-300'
                        : 'text-emerald-200';

                  return (
                    <div key={metric.label} className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-300">
                        <span>{metric.label}</span>
                        <span className={deltaClass}>{metric.delta}</span>
                      </div>
                      <Progress value={metric.value} className="h-2 bg-white/10" />
                      <p className="text-xs text-slate-400">{metric.description}</p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="bg-slate-900/70 border-white/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-slate-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-300" />
                  Alertes & signaux faibles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedFocus.alerts.map((alert) => (
                  <div key={alert} className="rounded-lg border border-amber-400/20 bg-amber-500/10 p-3 text-sm text-amber-100">
                    {alert}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-slate-900/70 border-white/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-slate-200 flex items-center gap-2">
                  <Target className="w-4 h-4 text-cyan-300" />
                  Actions prioritaires 48 h
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedFocus.recommendations.map((recommendation) => (
                  <div
                    key={recommendation}
                    className="flex items-start justify-between gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-slate-200"
                  >
                    <span>{recommendation}</span>
                    <Button variant="ghost" size="sm" className="text-emerald-200 hover:text-emerald-100">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-slate-900/70 border-white/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-slate-200 flex items-center gap-2">
                  <Timer className="w-4 h-4 text-violet-300" />
                  Prochaines étapes coach
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-300">
                <p>
                  • Synthèse personnalisée envoyée à {getTargetLabel()} après validation
                </p>
                <p>
                  • Tracking des signaux faibles renforcé sur 72 heures
                </p>
                <p>
                  • Point d\'étape automatique proposé si la charge mentale remonte
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default B2BCoachPage;
