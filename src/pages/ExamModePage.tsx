/**
 * ExamModePage - Mode Examens / Étudiants
 * Page dédiée aux expériences de bien-être pour les périodes d'examens
 * Accessible via SSO depuis Med MNG
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/auth-service';
import { useAuth } from '@/hooks/useAuth';
import { logger } from '@/lib/logger';
import {
  GraduationCap,
  Music,
  Heart,
  Brain,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Wind,
  Star
} from 'lucide-react';

interface ExamExperience {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  duration: string;
  type: 'pre-exam' | 'post-exam' | 'stress-relief';
  actionLabel: string;
}

const EXAM_EXPERIENCES: ExamExperience[] = [
  {
    id: 'pre-exam-routine',
    title: 'Routine Pré-Examen',
    description: 'Préparez-vous mentalement et émotionnellement avant votre examen. Musique apaisante et exercices de concentration.',
    icon: Brain,
    color: 'from-blue-500 to-cyan-500',
    duration: '10 min',
    type: 'pre-exam',
    actionLabel: 'Commencer la préparation'
  },
  {
    id: 'post-exam-routine',
    title: 'Routine Post-Examen',
    description: 'Décompressez après votre examen. Relaxation guidée et musique douce pour évacuer le stress.',
    icon: CheckCircle2,
    color: 'from-green-500 to-emerald-500',
    duration: '15 min',
    type: 'post-exam',
    actionLabel: 'Décompresser maintenant'
  },
  {
    id: 'stress-management',
    title: 'Je me sens stressé·e / saturé·e',
    description: 'Besoin de calmer votre anxiété ? Exercices de respiration, méditation guidée et sons apaisants.',
    icon: Heart,
    color: 'from-purple-500 to-pink-500',
    duration: '5-20 min',
    type: 'stress-relief',
    actionLabel: 'Apaiser mon stress'
  }
];

export default function ExamModePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isSSOProcessing, setIsSSOProcessing] = useState(false);
  const [ssoAttempted, setSsoAttempted] = useState(false);

  // Gérer le SSO via tokens URL
  useEffect(() => {
    const handleSSO = async () => {
      // Éviter les tentatives multiples
      if (ssoAttempted || authLoading) return;

      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');

      // Pas de tokens = comportement normal
      if (!accessToken) {
        setSsoAttempted(true);
        return;
      }

      // Si déjà authentifié, nettoyer l'URL et continuer
      if (isAuthenticated && user) {
        cleanUrlTokens();
        setSsoAttempted(true);
        return;
      }

      setIsSSOProcessing(true);
      setSsoAttempted(true);

      try {
        logger.info('Attempting SSO login from Med MNG', 'EXAM_MODE');

        const { user: ssoUser, error } = await authService.signInWithTokens(
          accessToken,
          refreshToken || undefined
        );

        if (error || !ssoUser) {
          throw error || new Error('SSO failed');
        }

        // Nettoyer les tokens de l'URL pour la sécurité
        cleanUrlTokens();

        toast({
          title: 'Connexion réussie',
          description: `Bienvenue ${ssoUser.name} ! Vous êtes maintenant en mode Examens.`,
          duration: 4000,
        });

        logger.info('SSO login successful for exam mode', 'EXAM_MODE');
      } catch (error: any) {
        logger.error('SSO login failed', error, 'EXAM_MODE');

        // Nettoyer l'URL même en cas d'erreur
        cleanUrlTokens();

        toast({
          title: 'Erreur de connexion',
          description: 'La session a expiré ou est invalide. Veuillez vous reconnecter.',
          variant: 'destructive',
          duration: 5000,
        });

        // Rediriger vers la page de login après 2 secondes
        setTimeout(() => {
          navigate('/login', {
            state: { returnTo: '/exam-mode' }
          });
        }, 2000);
      } finally {
        setIsSSOProcessing(false);
      }
    };

    handleSSO();
  }, [searchParams, isAuthenticated, user, authLoading, ssoAttempted, navigate, toast]);

  // Nettoyer les tokens de l'URL (sécurité)
  const cleanUrlTokens = () => {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('access_token');
    newUrl.searchParams.delete('refresh_token');
    window.history.replaceState({}, '', newUrl.toString());
  };

  // Lancer une expérience
  const handleStartExperience = (experience: ExamExperience) => {
    logger.info(`Starting exam experience: ${experience.id}`, 'EXAM_MODE');

    toast({
      title: experience.title,
      description: `Lancement de votre expérience de ${experience.duration}...`,
    });

    // Rediriger vers la page appropriée selon le type
    // TODO: Adapter selon les vraies routes de l'app
    switch (experience.type) {
      case 'pre-exam':
        navigate('/b2c/music-enhanced'); // Page musique existante
        break;
      case 'post-exam':
        navigate('/b2c/music-enhanced'); // Page musique existante
        break;
      case 'stress-relief':
        navigate('/breath'); // Page respiration existante
        break;
      default:
        navigate('/b2c/dashboard');
    }
  };

  // Afficher loader pendant le SSO
  if (isSSOProcessing || (authLoading && !ssoAttempted)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-lg text-gray-700">Connexion en cours...</p>
          <p className="text-sm text-gray-500 mt-2">Initialisation de votre session</p>
        </div>
      </div>
    );
  }

  // Si pas authentifié et pas de tokens, rediriger vers login
  if (!isAuthenticated && !isSSOProcessing && ssoAttempted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <CardTitle>Connexion requise</CardTitle>
            <CardDescription>
              Vous devez être connecté pour accéder au mode Examens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate('/login', { state: { returnTo: '/exam-mode' }})}
              className="w-full"
            >
              Se connecter
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  EmotionsCare – Mode Examens
                </h1>
                <p className="text-sm text-gray-600">
                  Votre bien-être pendant les révisions et examens
                </p>
              </div>
            </div>
            {user && (
              <Badge variant="outline" className="gap-2">
                <Star className="w-3 h-3" />
                {user.email}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Sparkles className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Bienvenue dans votre espace bien-être
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choisissez une expérience adaptée à votre moment : avant un examen,
            après un examen, ou quand vous ressentez du stress.
          </p>
        </motion.div>

        {/* Experiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EXAM_EXPERIENCES.map((experience, index) => {
            const IconComponent = experience.icon as React.ComponentType<{className?: string}>;

            return (
              <motion.div
                key={experience.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardHeader>
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${experience.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{experience.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {experience.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{experience.duration}</span>
                    </div>
                    <Button
                      onClick={() => handleStartExperience(experience)}
                      className={`w-full bg-gradient-to-r ${experience.color} text-white hover:opacity-90`}
                    >
                      {experience.actionLabel}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
            <CardContent className="py-6">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Music className="w-5 h-5 text-indigo-600" />
                <Wind className="w-5 h-5 text-purple-600" />
                <Heart className="w-5 h-5 text-pink-600" />
              </div>
              <p className="text-gray-700">
                Toutes nos expériences combinent musique thérapeutique, exercices de respiration,
                et guidages adaptés pour optimiser votre bien-être pendant les examens.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
