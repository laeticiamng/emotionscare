// @ts-nocheck

import { OnboardingStep } from '@/types/onboarding';

export const DEFAULT_ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Bienvenue sur le Dashboard RH',
    description: 'Découvrez comment superviser et améliorer le bien-être de vos équipes avec EmotionsCare.',
    type: 'welcome',
    action: {
      label: 'Commencer la visite',
    },
    isRequired: true,
  },
  {
    id: 'overview',
    title: 'Vue d\'ensemble du tableau de bord',
    description: 'Voici les KPIs principaux qui vous donnent une vue d\'ensemble du bien-être de vos équipes.',
    type: 'info',
    content: 'Les KPIs vous permettent de suivre le climat émotionnel, l\'engagement et la satisfaction de vos collaborateurs en temps réel.',
    isRequired: true,
  },
  {
    id: 'emotional-weather',
    title: 'Météo émotionnelle',
    description: 'Comprendre l\'état émotionnel collectif de vos équipes.',
    type: 'info',
    content: 'Ce widget affiche les émotions dominantes de l\'ensemble de vos équipes. Les données sont anonymisées et actualisées quotidiennement.',
    isRequired: true,
  },
  {
    id: 'team-management',
    title: 'Gestion des équipes',
    description: 'Apprenez à créer et gérer des équipes pour un suivi personnalisé.',
    type: 'action',
    action: {
      label: 'Explorer cette fonctionnalité',
    },
    isRequired: true,
  },
  {
    id: 'analytics',
    title: 'Analytiques avancées',
    description: 'Découvrez les insights et tendances émotionnelles de votre organisation.',
    type: 'info',
    content: 'Les graphiques interactifs vous permettent de filtrer par période, équipe, ou département pour une analyse détaillée.',
    isRequired: false,
  },
  {
    id: 'reports',
    title: 'Génération de rapports',
    description: 'Créez des rapports personnalisés pour mesurer le progrès et identifier les tendances.',
    type: 'action',
    action: {
      label: 'Essayer la génération de rapport',
    },
    isRequired: false,
  },
  {
    id: 'privacy',
    title: 'Confidentialité et RGPD',
    description: 'Comprendre comment nous protégeons les données sensibles de vos collaborateurs.',
    type: 'info',
    content: 'Toutes les données émotionnelles sont anonymisées. Aucune donnée individuelle n\'est accessible sans le consentement explicite du collaborateur.',
    isRequired: true,
  },
  {
    id: 'quiz',
    title: 'Vérifiez vos connaissances',
    description: 'Un petit quiz pour tester votre compréhension du dashboard RH.',
    type: 'quiz',
    quiz: {
      question: 'Les données émotionnelles individuelles des collaborateurs sont-elles visibles par les RH ?',
      options: [
        { id: 'q1-a', text: 'Oui, toutes les données sont visibles', isCorrect: false },
        { id: 'q1-b', text: 'Non, seules les données agrégées et anonymisées sont visibles', isCorrect: true },
        { id: 'q1-c', text: 'Seulement avec l\'autorisation de la direction', isCorrect: false },
        { id: 'q1-d', text: 'Uniquement pour les collaborateurs en période d\'essai', isCorrect: false },
      ],
    },
    isRequired: true,
  },
  {
    id: 'completion',
    title: 'Formation complétée !',
    description: 'Félicitations ! Vous êtes maintenant prêt à utiliser le dashboard RH d\'EmotionsCare.',
    type: 'completion',
    action: {
      label: 'Terminer et accéder au tableau de bord',
    },
    isRequired: true,
  },
];

// To maintain backward compatibility, export the same array under the old name
export const defaultOnboardingSteps = DEFAULT_ONBOARDING_STEPS;

export const b2bAdminOnboardingSteps: OnboardingStep[] = [
  ...DEFAULT_ONBOARDING_STEPS,
  {
    id: 'admin-features',
    title: 'Fonctionnalités administrateur',
    description: 'Découvrez les outils de gestion avancés réservés aux administrateurs.',
    type: 'info',
    content: 'En tant qu\'administrateur, vous pouvez configurer les accès, personnaliser les tableaux de bord et paramétrer les alertes.',
    role: 'b2b_admin',
    isRequired: true,
  },
];

export const b2bUserOnboardingSteps: OnboardingStep[] = DEFAULT_ONBOARDING_STEPS.filter(
  step => !['team-management', 'reports'].includes(step.id)
);
