/**
 * Constantes pour la page d'accueil
 * Centralisation des données statiques pour faciliter la maintenance
 */

import {
  Brain,
  Camera,
  Heart,
  Headphones,
  Music,
  BarChart3,
  Users,
  Star,
  Award,
  TrendingUp,
  Activity,
  MessageCircle,
  Target,
  Smile,
  Shield,
  Sparkles
} from 'lucide-react';

// Types
export interface Feature {
  icon: any;
  title: string;
  description: string;
  color: string;
  gradient: string;
  benefits?: string[];
  demo?: string;
}

export interface Stat {
  icon: any;
  value: string;
  label: string;
  description?: string;
  progress?: number;
}

export interface Testimonial {
  name: string;
  role: string;
  company?: string;
  content: string;
  rating: number;
  avatar?: string;
  avatarAlt?: string;
  highlight?: string;
}

export interface QuickAction {
  title: string;
  desc: string;
  icon: any;
  href: string;
  color: string;
}

export interface UseCase {
  title: string;
  description: string;
  icon: any;
  features: string[];
  cta: string;
  link: string;
}

// Fonctionnalités principales
export const FEATURES: Feature[] = [
  {
    icon: Camera,
    title: 'Scan Émotionnel IA',
    description: 'Analysez vos émotions en temps réel grâce à notre reconnaissance faciale et vocale avancée',
    color: 'from-blue-500 to-cyan-500',
    gradient: 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10',
    benefits: [
      'Reconnaissance micro-expressions',
      'Analyse en continu',
      'Graphiques détaillés'
    ],
    demo: '/app/scan'
  },
  {
    icon: Headphones,
    title: 'Musicothérapie Personnalisée',
    description: 'Des playlists thérapeutiques adaptées à votre humeur avec fréquences binaurales',
    color: 'from-purple-500 to-pink-500',
    gradient: 'bg-gradient-to-r from-purple-500/10 to-pink-500/10',
    benefits: [
      'Génération en temps réel',
      'Binaural beats',
      'Playlist adaptatives'
    ],
    demo: '/app/music'
  },
  {
    icon: Brain,
    title: 'Coach IA Empathique',
    description: 'Accompagnement personnalisé 24/7 par notre intelligence artificielle bienveillante',
    color: 'from-emerald-500 to-teal-500',
    gradient: 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10',
    benefits: [
      'Analyse comportementale avancée',
      'Recommandations personnalisées',
      'Support 24/7'
    ],
    demo: '/app/coach'
  },
  {
    icon: BarChart3,
    title: 'Suivi & Analytics',
    description: 'Visualisez votre progression avec des insights personnalisés et des recommandations IA',
    color: 'from-orange-500 to-red-500',
    gradient: 'bg-gradient-to-r from-orange-500/10 to-red-500/10',
    benefits: [
      'Métriques détaillées',
      'Tendances long-terme',
      'Rapports exportables'
    ],
    demo: '/app/analytics'
  },
  {
    icon: MessageCircle,
    title: 'Journal Intelligent',
    description: 'Espace sécurisé avec analyse automatique de sentiments',
    color: 'from-indigo-500 to-purple-500',
    gradient: 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10',
    benefits: [
      'Chiffrement end-to-end',
      'Analyse de tendances',
      'Rappels personnalisés'
    ],
    demo: '/app/journal'
  },
  {
    icon: Activity,
    title: 'Expériences VR',
    description: 'Immersion thérapeutique avec environnements adaptatifs',
    color: 'from-teal-500 to-blue-500',
    gradient: 'bg-gradient-to-r from-teal-500/10 to-blue-500/10',
    benefits: [
      'Environnements 3D',
      'Respiration guidée',
      'Réalité mixte'
    ],
    demo: '/app/vr-breath-guide'
  }
];

// Statistiques
export const STATS: Stat[] = [
  {
    icon: Users,
    value: '50,000+',
    label: 'Utilisateurs actifs',
    description: 'Personnes accompagnées quotidiennement',
    progress: 85
  },
  {
    icon: Star,
    value: '4.8/5',
    label: 'Note moyenne',
    description: 'Taux de satisfaction utilisateur',
    progress: 96
  },
  {
    icon: Award,
    value: '98%',
    label: 'Satisfaction',
    description: 'Utilisateurs satisfaits',
    progress: 98
  },
  {
    icon: TrendingUp,
    value: '+35%',
    label: 'Amélioration moyenne',
    description: 'Progression émotionnelle mesurée',
    progress: 92
  }
];

// Témoignages
export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Marie L.',
    role: 'Utilisatrice depuis 6 mois',
    content: 'EmotionsCare a transformé ma gestion du stress. Le coach IA est incroyablement empathique et les insights sont précieux.',
    rating: 5,
    highlight: 'Transformation complète',
    avatar: '/images/avatars/marie.jpg',
    avatarAlt: 'Photo de profil de Marie L., utilisatrice satisfaite depuis 6 mois'
  },
  {
    name: 'Thomas B.',
    role: 'Professionnel en reconversion',
    content: 'La musicothérapie personnalisée m\'aide énormément à me concentrer et à retrouver mon calme en quelques minutes.',
    rating: 5,
    highlight: 'Avantage quotidien',
    avatar: '/images/avatars/thomas.jpg',
    avatarAlt: 'Photo de profil de Thomas B., professionnel utilisant EmotionsCare'
  },
  {
    name: 'Sophie M.',
    role: 'Étudiante',
    content: 'Le scan émotionnel est bluffant de précision. J\'adore voir ma progression semaine après semaine.',
    rating: 5,
    highlight: 'Résultats mesurables',
    avatar: '/images/avatars/sophie.jpg',
    avatarAlt: 'Photo de profil de Sophie M., étudiante satisfaite'
  }
];

// Actions rapides
export const QUICK_ACTIONS: QuickAction[] = [
  {
    title: 'Musique émotionnelle',
    desc: 'Génération musicale par IA',
    icon: Music,
    href: '/app/emotion-music',
    color: 'bg-pink-500'
  },
  {
    title: 'Démarrer une session',
    desc: 'Commencer votre parcours bien-être',
    icon: Sparkles,
    href: '/app/sessions/new',
    color: 'bg-blue-500'
  },
  {
    title: 'Voir mes statistiques',
    desc: 'Analyser vos progrès',
    icon: TrendingUp,
    href: '/app/analytics',
    color: 'bg-green-500'
  },
  {
    title: 'Gérer mon profil',
    desc: 'Personnaliser votre expérience',
    icon: Users,
    href: '/app/profile',
    color: 'bg-purple-500'
  }
];

// Cas d'usage
export const USE_CASES: UseCase[] = [
  {
    title: 'Développement Personnel',
    description: 'Découvrez votre potentiel émotionnel complet',
    icon: Target,
    features: [
      'Auto-évaluation continue',
      'Plans de développement',
      'Suivi des progrès'
    ],
    cta: 'Commencer le parcours',
    link: '/b2c'
  },
  {
    title: 'Performance Professionnelle',
    description: 'Optimisez vos interactions et leadership',
    icon: TrendingUp,
    features: [
      'Communication optimisée',
      'Gestion d\'équipe',
      'Résilience au stress'
    ],
    cta: 'Découvrir les solutions',
    link: '/entreprise'
  },
  {
    title: 'Bien-être Quotidien',
    description: 'Maintenez un équilibre émotionnel optimal',
    icon: Smile,
    features: [
      'Routines personnalisées',
      'Alertes préventives',
      'Techniques de relaxation'
    ],
    cta: 'Essayer gratuitement',
    link: '/login'
  }
];

// Avantages
export const BENEFITS: string[] = [
  'Scan émotionnel en temps réel',
  'Playlists thérapeutiques personnalisées',
  'Coach IA disponible 24/7',
  'Journal émotionnel chiffré',
  'Suivi de progression détaillé',
  'Exercices de respiration guidés',
  'Recommandations personnalisées',
  'Conformité RGPD & sécurité maximale'
];

// Réalisations récentes (pour utilisateurs connectés)
export const RECENT_ACHIEVEMENTS = [
  { name: 'Semaine productive', icon: '🎯', date: 'Aujourd\'hui' },
  { name: 'Premier badge', icon: '🏆', date: 'Hier' },
  { name: 'Connexion quotidienne', icon: '🔥', date: 'Il y a 2 jours' }
];

// Indicateurs de confiance
export const TRUST_INDICATORS = [
  {
    icon: Heart,
    text: 'Confiance de 25K+ utilisateurs',
    color: 'text-green-500'
  },
  {
    icon: Shield,
    text: '100% sécurisé RGPD',
    color: 'text-blue-500'
  },
  {
    icon: Sparkles,
    text: 'Installation instantanée',
    color: 'text-purple-500'
  }
];

// Call-to-Action avantages
export const CTA_BENEFITS = [
  { icon: 'CheckCircle', text: 'Gratuit pendant 14 jours' },
  { icon: 'CheckCircle', text: 'Aucune carte requise' },
  { icon: 'CheckCircle', text: 'Annulation simple' }
];
