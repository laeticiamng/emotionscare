// @ts-nocheck
import { useState, useEffect } from 'react';

export interface TourStep {
  attractionId: string;
  title: string;
  message: string;
  reason: string;
}

export interface EmotionalProfile {
  primary: 'stress' | 'energy' | 'creativity' | 'calm' | 'social';
  preferences: string[];
}

const TOUR_STORAGE_KEY = 'emotional-park-tour-completed';
const PROFILE_STORAGE_KEY = 'emotional-profile';

export const useGuidedTour = () => {
  const [tourActive, setTourActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [tourCompleted, setTourCompleted] = useState(false);
  const [emotionalProfile, setEmotionalProfile] = useState<EmotionalProfile | null>(null);
  const [recommendedSteps, setRecommendedSteps] = useState<TourStep[]>([]);

  useEffect(() => {
    const completed = localStorage.getItem(TOUR_STORAGE_KEY);
    const profile = localStorage.getItem(PROFILE_STORAGE_KEY);
    
    setTourCompleted(completed === 'true');
    if (profile) {
      setEmotionalProfile(JSON.parse(profile));
    }
  }, []);

  const generateRecommendedPath = (profile: EmotionalProfile): TourStep[] => {
    const pathMap: Record<string, TourStep[]> = {
      stress: [
        {
          attractionId: 'nyvee',
          title: 'La Bulle Respirante',
          message: 'Commence par cette expérience de respiration pour apaiser ton stress.',
          reason: 'La respiration est le premier pas vers le calme'
        },
        {
          attractionId: 'breath',
          title: 'L\'Océan Intérieur',
          message: 'Continue avec des exercices de breathwork plus profonds.',
          reason: 'Approfondir la détente respiratoire'
        },
        {
          attractionId: 'music',
          title: 'La Forêt Sonore',
          message: 'La musique thérapeutique va t\'aider à te relaxer davantage.',
          reason: 'La musique amplifie l\'effet calmant'
        },
        {
          attractionId: 'coach',
          title: 'Le Jardin des Pensées',
          message: 'Notre coach IA peut t\'accompagner dans ta gestion du stress.',
          reason: 'Accompagnement personnalisé anti-stress'
        }
      ],
      energy: [
        {
          attractionId: 'flash-glow',
          title: 'La Chambre des Lumières',
          message: 'Booste ton énergie avec cette expérience lumineuse dynamique.',
          reason: 'Stimulation énergétique immédiate'
        },
        {
          attractionId: 'bubble-beat',
          title: 'Le Labo des Bulles',
          message: 'Un jeu rythmique qui maintient ton énergie haute.',
          reason: 'Maintenir l\'élan énergétique'
        },
        {
          attractionId: 'boss-grit',
          title: 'L\'Arène de la Persévérance',
          message: 'Canalise ton énergie dans des défis motivants.',
          reason: 'Transformer l\'énergie en motivation'
        },
        {
          attractionId: 'music',
          title: 'La Forêt Sonore',
          message: 'De la musique énergisante pour amplifier ta vitalité.',
          reason: 'Musique énergisante adaptative'
        }
      ],
      creativity: [
        {
          attractionId: 'scan',
          title: 'La Galerie des Masques',
          message: 'Explore ta créativité en créant des masques émotionnels uniques.',
          reason: 'Expression créative immédiate'
        },
        {
          attractionId: 'mood-mixer',
          title: 'Le Studio DJ des Émotions',
          message: 'Mixe tes propres ambiances créatives.',
          reason: 'Création musicale personnalisée'
        },
        {
          attractionId: 'face-ar',
          title: 'La Chambre des Reflets',
          message: 'Expérimente avec les filtres AR pour une expression créative.',
          reason: 'Art numérique et expression visuelle'
        },
        {
          attractionId: 'story-synth',
          title: 'Le Théâtre des Histoires',
          message: 'Crée tes propres histoires émotionnelles.',
          reason: 'Narration créative personnelle'
        }
      ],
      calm: [
        {
          attractionId: 'meditation',
          title: 'Le Sanctuaire du Silence',
          message: 'Commence par une méditation guidée pour trouver la paix intérieure.',
          reason: 'Base de la sérénité'
        },
        {
          attractionId: 'vr-breath',
          title: 'Le Temple de l\'Air',
          message: 'Une expérience VR de respiration dans un temple apaisant.',
          reason: 'Immersion totale dans le calme'
        },
        {
          attractionId: 'nyvee',
          title: 'La Bulle Respirante',
          message: 'Des exercices de respiration en douceur.',
          reason: 'Maintenir la sérénité'
        },
        {
          attractionId: 'journal',
          title: 'La Bibliothèque des Émotions',
          message: 'Écris tes pensées dans un espace de paix.',
          reason: 'Introspection calme'
        }
      ],
      social: [
        {
          attractionId: 'community',
          title: 'Le Village Bienveillant',
          message: 'Connecte-toi avec la communauté dans un espace bienveillant.',
          reason: 'Connexion humaine authentique'
        },
        {
          attractionId: 'leaderboard',
          title: 'Le Ciel des Auras',
          message: 'Découvre l\'aura collective de la communauté.',
          reason: 'Énergie collective positive'
        },
        {
          attractionId: 'story-synth',
          title: 'Le Théâtre des Histoires',
          message: 'Partage tes histoires avec les autres.',
          reason: 'Narration partagée'
        },
        {
          attractionId: 'scan',
          title: 'La Galerie des Masques',
          message: 'Exprime tes émotions et partage-les.',
          reason: 'Expression émotionnelle collective'
        }
      ]
    };

    return pathMap[profile.primary] || pathMap.stress;
  };

  const startTour = (profile: EmotionalProfile) => {
    setEmotionalProfile(profile);
    setRecommendedSteps(generateRecommendedPath(profile));
    setTourActive(true);
    setCurrentStepIndex(0);
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  };

  const nextStep = () => {
    if (currentStepIndex < recommendedSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      completeTour();
    }
  };

  const previousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const skipTour = () => {
    setTourActive(false);
    setTourCompleted(true);
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
  };

  const completeTour = () => {
    setTourActive(false);
    setTourCompleted(true);
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
  };

  const resetTour = () => {
    setTourActive(false);
    setCurrentStepIndex(0);
    setTourCompleted(false);
    localStorage.removeItem(TOUR_STORAGE_KEY);
  };

  const currentStep = recommendedSteps[currentStepIndex];

  return {
    tourActive,
    currentStep,
    currentStepIndex,
    totalSteps: recommendedSteps.length,
    tourCompleted,
    emotionalProfile,
    startTour,
    nextStep,
    previousStep,
    skipTour,
    completeTour,
    resetTour
  };
};
