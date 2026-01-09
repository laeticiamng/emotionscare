/**
 * WellnessHubPage - Hub bien-être B2B
 * Même expérience que B2C mais dans un contexte institutionnel
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Music,
  Brain,
  Wind,
  Heart,
  Sparkles,
  Lock,
  ArrowRight,
  Headphones,
  Timer,
  Zap,
  Eye,
  Palette,
  BookOpen,
  Activity,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { usePageSEO } from '@/hooks/usePageSEO';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface SessionInfo {
  org_id: string;
  org_name: string;
  accessed_at: string;
}

interface WellnessModule {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  path: string;
  duration?: string;
  category: 'relax' | 'scan' | 'activity' | 'explore';
}

const wellnessModules: WellnessModule[] = [
  {
    id: 'scan',
    title: 'Scan Émotionnel',
    description: 'Faites le point sur votre état émotionnel actuel',
    icon: Brain,
    color: 'text-purple-600',
    bgColor: 'bg-purple-500/10',
    path: '/app/scan',
    duration: '2-5 min',
    category: 'scan',
  },
  {
    id: 'music',
    title: 'Musique Adaptative',
    description: 'Musique générée selon votre humeur',
    icon: Music,
    color: 'text-blue-600',
    bgColor: 'bg-blue-500/10',
    path: '/app/music',
    duration: '5-30 min',
    category: 'relax',
  },
  {
    id: 'breath',
    title: 'Respiration Guidée',
    description: 'Exercices de respiration pour vous recentrer',
    icon: Wind,
    color: 'text-teal-600',
    bgColor: 'bg-teal-500/10',
    path: '/app/breath',
    duration: '3-10 min',
    category: 'relax',
  },
  {
    id: 'meditation',
    title: 'Méditation',
    description: 'Séances de méditation guidées',
    icon: Sparkles,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-500/10',
    path: '/app/meditation',
    duration: '5-20 min',
    category: 'relax',
  },
  {
    id: 'flash-glow',
    title: 'Flash Glow',
    description: 'Session express de bien-être lumineux',
    icon: Zap,
    color: 'text-amber-600',
    bgColor: 'bg-amber-500/10',
    path: '/app/flash-glow',
    duration: '1-3 min',
    category: 'activity',
  },
  {
    id: 'mood-mixer',
    title: 'Mood Mixer',
    description: 'Créez votre ambiance sonore idéale',
    icon: Headphones,
    color: 'text-pink-600',
    bgColor: 'bg-pink-500/10',
    path: '/app/mood-mixer',
    duration: '5-15 min',
    category: 'explore',
  },
  {
    id: 'journal',
    title: 'Journal',
    description: 'Notez vos pensées et ressentis',
    icon: BookOpen,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-500/10',
    path: '/app/journal',
    duration: 'Variable',
    category: 'explore',
  },
  {
    id: 'vr',
    title: 'Expériences VR',
    description: 'Immersion dans des environnements apaisants',
    icon: Eye,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-500/10',
    path: '/app/vr',
    duration: '5-15 min',
    category: 'explore',
  },
];

const quickSessions = [
  { label: 'Pause 2 min', duration: 2, icon: Timer },
  { label: 'Détente 5 min', duration: 5, icon: Heart },
  { label: 'Reset 10 min', duration: 10, icon: Sparkles },
];

export default function WellnessHubPage() {
  const navigate = useNavigate();
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  usePageSEO({
    title: 'Espace Bien-être - EmotionsCare',
    description: 'Votre espace personnel de bien-être émotionnel. Musique, respiration, méditation et plus.',
  });

  useEffect(() => {
    // Récupérer les infos de session
    const stored = sessionStorage.getItem('b2b_access');
    if (stored) {
      setSessionInfo(JSON.parse(stored));
    }
  }, []);

  const handleStartSession = async (module: WellnessModule) => {
    // Enregistrer le début de session (anonymisé)
    if (sessionInfo) {
      try {
        await supabase.from('b2b_anonymous_sessions').insert({
          org_id: sessionInfo.org_id,
          session_hash: crypto.randomUUID(), // Hash anonyme
          session_type: module.id,
        });
      } catch (err) {
        // Ignorer les erreurs d'enregistrement
        console.debug('Session tracking skipped');
      }
    }

    navigate(module.path);
  };

  const filteredModules = selectedCategory 
    ? wellnessModules.filter(m => m.category === selectedCategory)
    : wellnessModules;

  const categories = [
    { id: 'relax', label: 'Relaxation', icon: Heart },
    { id: 'scan', label: 'État émotionnel', icon: Brain },
    { id: 'activity', label: 'Activités', icon: Activity },
    { id: 'explore', label: 'Explorer', icon: Palette },
  ];

  return (
    <main className="min-h-screen bg-background p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Badge variant="outline" className="mb-4">
            <Lock className="h-3 w-3 mr-1" />
            Session sécurisée
          </Badge>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            Votre espace bien-être
          </h1>
          {sessionInfo && (
            <p className="text-muted-foreground">
              Bienvenue dans l'espace {sessionInfo.org_name}
            </p>
          )}
        </motion.div>

        {/* Quick sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold mb-1">Session rapide</h2>
                  <p className="text-sm text-muted-foreground">
                    Pas beaucoup de temps ? Choisissez une session express.
                  </p>
                </div>
                <div className="flex gap-2">
                  {quickSessions.map((session) => (
                    <Button
                      key={session.duration}
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/app/quick-session?duration=${session.duration}`)}
                    >
                      <session.icon className="h-4 w-4 mr-1" />
                      {session.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filtres par catégorie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-2 justify-center"
        >
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            Tout
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
            >
              <cat.icon className="h-4 w-4 mr-1" />
              {cat.label}
            </Button>
          ))}
        </motion.div>

        {/* Modules grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {filteredModules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              <Card
                className="h-full cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group"
                onClick={() => handleStartSession(module)}
              >
                <CardHeader className="pb-2">
                  <div className={cn('p-3 rounded-xl w-fit', module.bgColor)}>
                    <module.icon className={cn('h-6 w-6', module.color)} />
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {module.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {module.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      <Timer className="h-3 w-3 mr-1" />
                      {module.duration}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Info anonymat */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Alert className="border-muted">
            <Lock className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Rappel :</strong> Votre utilisation est entièrement anonyme. 
              Aucune donnée personnelle n'est partagée avec votre employeur.
              Seules des statistiques globales d'utilisation sont collectées.
            </AlertDescription>
          </Alert>
        </motion.div>
      </div>
    </main>
  );
}
