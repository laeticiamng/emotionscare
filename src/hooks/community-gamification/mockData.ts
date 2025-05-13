
import { Badge, Challenge } from '@/types/gamification';

// Badges fictifs pour la démo
export const mockBadges: Badge[] = [
  {
    id: "badge1",
    name: "Premier Scan",
    description: "Effectuez votre premier scan émotionnel",
    imageUrl: "/badges/first-scan.svg",
    category: "débutant",
    unlocked: true,
    date_earned: "2023-09-15T10:30:00Z",
    tier: "bronze"
  },
  {
    id: "badge2",
    name: "Explorateur Émotionnel",
    description: "Identifiez 5 émotions différentes",
    imageUrl: "/badges/emotion-explorer.svg",
    category: "exploration",
    unlocked: true,
    date_earned: "2023-09-20T14:45:00Z",
    tier: "silver"
  },
  {
    id: "badge3",
    name: "Maître de la Résilience",
    description: "Naviguez avec succès à travers une période de stress intense",
    imageUrl: "/badges/resilience-master.svg",
    category: "avancé",
    unlocked: false,
    progress: 70,
    tier: "gold"
  },
  {
    id: "badge4",
    name: "Champion de la Pleine Conscience",
    description: "Complétez 10 sessions de méditation",
    imageUrl: "/badges/mindfulness-champion.svg",
    category: "bien-être",
    unlocked: false,
    progress: 40,
    tier: "silver"
  }
];

// Défis fictifs pour la démo
export const mockChallenges: Challenge[] = [
  {
    id: "challenge1",
    title: "Semaine de Pleine Conscience",
    name: "Semaine de Pleine Conscience",
    description: "Effectuez une séance de méditation chaque jour pendant une semaine",
    points: 500,
    badge_reward: "badge4",
    start_date: "2023-10-01T00:00:00Z",
    end_date: "2023-10-07T23:59:59Z",
    status: "in_progress",
    requirements: ["Méditer au moins 5 minutes par jour", "Enregistrer chaque session dans l'application"]
  },
  {
    id: "challenge2",
    title: "Journaliste Émotionnel",
    name: "Journaliste Émotionnel",
    description: "Tenez un journal émotionnel pendant 30 jours consécutifs",
    points: 1000,
    start_date: "2023-09-15T00:00:00Z",
    end_date: "2023-10-15T23:59:59Z",
    status: "in_progress",
    requirements: ["Écrire au moins 100 mots par jour", "Identifier au moins une émotion principale"]
  },
  {
    id: "challenge3",
    title: "Maître de la Communication",
    name: "Maître de la Communication",
    description: "Participez à 3 sessions de communication émotionnelle avec d'autres utilisateurs",
    points: 750,
    badge_reward: "badge5",
    start_date: "2023-10-05T00:00:00Z",
    end_date: "2023-11-05T23:59:59Z",
    status: "open",
    requirements: ["Chaque session doit durer au moins 15 minutes", "Donner et recevoir du feedback"]
  }
];

// Défis de communauté pour le B2B (RH/Entreprise)
export const mockCommunityB2BChallenges: Challenge[] = [
  {
    id: "com-challenge1",
    title: "Défi Bien-être d'Équipe",
    name: "Défi Bien-être d'Équipe",
    description: "Chaque membre de l'équipe doit compléter au moins 3 activités bien-être cette semaine",
    points: 1000,
    badge_reward: "team_wellbeing",
    start_date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 jours avant
    end_date: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 jours après
    status: "in_progress",
    requirements: [
      "3 activités bien-être par personne minimum", 
      "Au moins 80% de l'équipe doit participer",
      "Partager un retour d'expérience en équipe"
    ]
  },
  {
    id: "com-challenge2",
    title: "30 Jours de Gratitude",
    name: "30 Jours de Gratitude",
    description: "Chaque jour pendant 30 jours, notez une chose pour laquelle vous êtes reconnaissant au travail",
    points: 1500,
    start_date: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 jours avant
    end_date: new Date(Date.now() + 86400000 * 20).toISOString(), // 20 jours après
    status: "in_progress",
    requirements: [
      "Entrée quotidienne requise",
      "Être spécifique dans l'expression de la gratitude",
      "Au moins 10 entrées doivent concerner des collègues"
    ]
  },
  {
    id: "com-challenge3",
    title: "Marche Quotidienne",
    name: "Marche Quotidienne",
    description: "Faites au moins 7000 pas chaque jour pendant 2 semaines",
    points: 1200,
    badge_reward: "walking_warrior",
    start_date: new Date(Date.now()).toISOString(), // Aujourd'hui
    end_date: new Date(Date.now() + 86400000 * 14).toISOString(), // 14 jours après
    status: "open",
    requirements: [
      "7000 pas minimum par jour",
      "Synchroniser les données avec l'application",
      "Au moins une marche doit être pendant la pause déjeuner"
    ]
  },
  {
    id: "com-challenge4",
    title: "Pause Déconnexion",
    name: "Pause Déconnexion",
    description: "Prenez une pause de 15 minutes sans écran chaque jour de travail pendant une semaine",
    points: 800,
    start_date: new Date(Date.now() + 86400000 * 7).toISOString(), // Dans 7 jours
    end_date: new Date(Date.now() + 86400000 * 14).toISOString(), // Dans 14 jours
    status: "open",
    requirements: [
      "15 minutes sans aucun écran",
      "Faire une activité relaxante (méditation, étirements, marche...)",
      "Documenter brièvement chaque pause"
    ]
  },
  {
    id: "com-challenge5",
    title: "Alimentation Consciente",
    name: "Alimentation Consciente",
    description: "Mangez consciemment pendant 5 jours, en prenant le temps d'apprécier chaque repas",
    points: 700,
    start_date: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 jours avant
    end_date: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 jours après
    status: "in_progress",
    requirements: [
      "Pas d'écrans pendant les repas",
      "Prendre au moins 20 minutes pour manger",
      "Noter les sensations pendant le repas"
    ]
  },
  {
    id: "com-challenge6",
    title: "Feedback Positif",
    name: "Feedback Positif",
    description: "Donnez un feedback positif spécifique à 3 collègues différents cette semaine",
    points: 600,
    badge_reward: "positivity_spreader",
    start_date: new Date(Date.now()).toISOString(), // Aujourd'hui
    end_date: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 jours après
    status: "open",
    requirements: [
      "Le feedback doit être spécifique et sincère",
      "Il doit être donné en personne ou lors d'un appel vidéo",
      "Doit concerner 3 collègues différents"
    ]
  },
  {
    id: "com-challenge7",
    title: "Journal de Réussites",
    name: "Journal de Réussites",
    description: "Notez 3 réussites professionnelles chaque jour pendant 10 jours",
    points: 900,
    start_date: new Date(Date.now() + 86400000 * 3).toISOString(), // Dans 3 jours
    end_date: new Date(Date.now() + 86400000 * 13).toISOString(), // Dans 13 jours
    status: "open",
    requirements: [
      "3 réussites quotidiennes, même petites",
      "Inclure au moins une réussite d'équipe",
      "Réfléchir à l'impact de chaque réussite"
    ]
  },
  {
    id: "com-challenge8",
    title: "Repos Digital Weekend",
    name: "Repos Digital Weekend",
    description: "Passez un weekend complet sans emails ni notifications professionnelles",
    points: 1000,
    start_date: new Date(Date.now() + 86400000 * 5).toISOString(), // Dans 5 jours
    end_date: new Date(Date.now() + 86400000 * 7).toISOString(), // Dans 7 jours
    status: "open",
    requirements: [
      "Désactiver les notifications professionnelles",
      "Ne pas consulter les emails de travail",
      "Partager un retour d'expérience lundi"
    ]
  }
];
