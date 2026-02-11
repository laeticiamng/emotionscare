/**
 * B2BVisioPage - Module de visioconférence bien-être
 * Module 31 : Sessions de soutien en visioconférence avec consentement renforcé
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePageSEO } from '@/hooks/usePageSEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  ArrowLeft,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Shield,
  Users,
  Calendar,
  Clock,
  Lock,
  CheckCircle,
  AlertTriangle,
  Heart,
  Phone,
} from 'lucide-react';
import PageRoot from '@/components/common/PageRoot';

interface VisioSession {
  id: string;
  title: string;
  type: 'individual' | 'group';
  date: string;
  time: string;
  duration: string;
  host: string;
  participants: number;
  maxParticipants: number;
  status: 'scheduled' | 'live' | 'completed';
}

const UPCOMING_SESSIONS: VisioSession[] = [
  {
    id: '1',
    title: 'Cercle de parole - Gestion du stress post-garde',
    type: 'group',
    date: '2026-02-14',
    time: '14:00',
    duration: '45 min',
    host: 'Psychologue du travail',
    participants: 6,
    maxParticipants: 10,
    status: 'scheduled',
  },
  {
    id: '2',
    title: 'Atelier respiration et cohérence cardiaque',
    type: 'group',
    date: '2026-02-16',
    time: '12:30',
    duration: '30 min',
    host: 'Sophrologue',
    participants: 8,
    maxParticipants: 15,
    status: 'scheduled',
  },
  {
    id: '3',
    title: 'Accompagnement individuel bien-être',
    type: 'individual',
    date: '2026-02-18',
    time: '10:00',
    duration: '30 min',
    host: 'Coach certifié',
    participants: 1,
    maxParticipants: 1,
    status: 'scheduled',
  },
];

export default function B2BVisioPage() {
  usePageSEO({
    title: 'Visioconférence bien-être - EmotionsCare',
    description: 'Sessions de soutien en visioconférence avec consentement renforcé. Cercles de parole, ateliers et accompagnement individuel pour les professionnels de santé.',
    keywords: 'visioconférence, bien-être, téléconsultation, cercle de parole, soutien soignants',
  });

  const [consentCamera, setConsentCamera] = useState(false);
  const [consentMic, setConsentMic] = useState(false);
  const [consentRecording, setConsentRecording] = useState(false);

  return (
    <PageRoot>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          {/* Back */}
          <Link to="/app/home" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-3">
              <Video className="h-8 w-8 text-primary" />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Visioconférence bien-être
              </span>
            </h1>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Participez à des sessions de soutien en visio : cercles de parole, ateliers de respiration et accompagnement individuel, dans un cadre sécurisé et confidentiel.
            </p>
          </div>

          {/* Consent Gate */}
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-primary" />
                Consentement renforcé
              </CardTitle>
              <CardDescription>
                Avant de rejoindre une session, veuillez configurer vos préférences de confidentialité. Vous pouvez les modifier à tout moment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {consentCamera ? <Video className="h-4 w-4 text-primary" /> : <VideoOff className="h-4 w-4 text-muted-foreground" />}
                  <div>
                    <p className="text-sm font-medium">Caméra</p>
                    <p className="text-xs text-muted-foreground">Activer votre caméra pendant les sessions</p>
                  </div>
                </div>
                <Switch checked={consentCamera} onCheckedChange={setConsentCamera} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {consentMic ? <Mic className="h-4 w-4 text-primary" /> : <MicOff className="h-4 w-4 text-muted-foreground" />}
                  <div>
                    <p className="text-sm font-medium">Microphone</p>
                    <p className="text-xs text-muted-foreground">Activer votre microphone pendant les sessions</p>
                  </div>
                </div>
                <Switch checked={consentMic} onCheckedChange={setConsentMic} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Enregistrement</p>
                    <p className="text-xs text-muted-foreground">Autoriser l'enregistrement de la session (anonymisé)</p>
                  </div>
                </div>
                <Switch checked={consentRecording} onCheckedChange={setConsentRecording} />
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                <span>Toutes les sessions sont chiffrées de bout en bout. Aucune donnée n'est conservée sans votre consentement explicite.</span>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Sessions */}
          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Sessions à venir
            </h2>

            {UPCOMING_SESSIONS.map((session) => (
              <Card key={session.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{session.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {session.type === 'group' ? 'Groupe' : 'Individuel'}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(session.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {session.time} · {session.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3.5 w-3.5" />
                          {session.host}
                        </span>
                        {session.type === 'group' && (
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            {session.participants}/{session.maxParticipants} places
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        Rappel
                      </Button>
                      <Button size="sm" disabled={!consentMic}>
                        <Phone className="h-4 w-4 mr-1" />
                        Rejoindre
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Info Banner */}
          <Card className="bg-muted/50">
            <CardContent className="p-6 flex items-start gap-4">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-medium">Module en cours de déploiement</p>
                <p className="text-sm text-muted-foreground">
                  La visioconférence EmotionsCare utilise le chiffrement de bout en bout et respecte les normes HDS pour la protection des données de santé.
                  Les sessions de groupe sont animées par des professionnels certifiés. Pour toute question, contactez-nous.
                </p>
                <Button variant="link" className="p-0 h-auto text-sm" asChild>
                  <Link to="/contact">Nous contacter pour en savoir plus</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageRoot>
  );
}
