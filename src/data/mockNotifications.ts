// @ts-nocheck

import { v4 as uuidv4 } from 'uuid';

const generateRecentDate = (minutesAgo: number) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutesAgo);
  return date.toISOString();
};

const mockNotifications = [
  {
    id: uuidv4(),
    title: "Nouvel événement disponible",
    message: "Un atelier sur la gestion du stress est disponible près de chez vous.",
    type: "event",
    read: false,
    created_at: generateRecentDate(5),
    action_url: "/events/123"
  },
  {
    id: uuidv4(),
    title: "Complétez votre profil",
    message: "Ajoutez vos préférences pour des recommandations personnalisées.",
    type: "profile",
    read: true,
    created_at: generateRecentDate(120),
    action_url: "/profile/edit"
  },
  {
    id: uuidv4(),
    title: "Nouveau badge débloqué",
    message: "Félicitations ! Vous avez obtenu le badge 'Régularité'.",
    type: "achievement",
    read: false,
    created_at: generateRecentDate(240),
    action_url: "/badges"
  },
  {
    id: uuidv4(),
    title: "Rapport hebdomadaire disponible",
    message: "Consultez votre rapport émotionnel de la semaine dernière.",
    type: "report",
    read: false,
    created_at: generateRecentDate(480),
    action_url: "/reports/weekly"
  },
  {
    id: uuidv4(),
    title: "Nouvelle fonctionnalité",
    message: "Découvrez notre nouvelle fonctionnalité de suivi du sommeil.",
    type: "feature",
    read: true,
    created_at: generateRecentDate(1440),
    action_url: "/features/sleep"
  }
];

export default mockNotifications;
