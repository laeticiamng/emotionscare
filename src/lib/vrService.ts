
import { VRSessionTemplate, VRSession } from '@/types/vr';

// Fonction pour obtenir les sessions recommandées
export const getRecommendedSessions = (): VRSessionTemplate[] => {
  return [
    {
      id: "1",
      name: "Méditation Guidée",
      title: "Méditation Guidée pour la Sérénité",
      description: "Une méditation guidée pour retrouver calme et sérénité",
      category: "meditation",
      duration: 600,
      intensity: "low",
      tags: ["calme", "meditation", "respiration"],
      thumbnail: "/images/vr/meditation-thumbnail.jpg",
      popularity: 98,
      recommendedFor: ["stress", "anxiété", "insomnie"],
      emotions: ["calme", "serein", "détendu"],
      theme: "Meditation" // Added required theme property
    },
    {
      id: "2", 
      name: "Forêt Apaisante",
      title: "Immersion en Forêt Relaxante",
      description: "Évadez-vous dans une forêt apaisante pour retrouver votre équilibre naturel",
      category: "nature",
      duration: 900,
      intensity: "medium",
      tags: ["nature", "forêt", "relaxation"],
      thumbnail: "/images/vr/forest-thumbnail.jpg",
      popularity: 85,
      recommendedFor: ["fatigue", "burnout", "concentration"],
      emotions: ["apaisé", "ressourcé", "énergisé"],
      theme: "Nature" // Added required theme property
    }
  ];
};

// Fonction pour enregistrer une session VR
export const saveVRSession = async (session: VRSession): Promise<VRSession> => {
  // Simuler un appel API avec un délai
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Normalement, nous ferions un appel à une API ici
  console.log('Enregistrement de la session VR:', session);
  
  return {
    ...session,
    id: session.id || `session-${Date.now()}`,
    completed: true
  };
};

// Fonction pour enregistrer une session de relaxation
export const saveRelaxationSession = async (sessionData: {
  userId: string;
  duration: number;
  emotionBefore?: string;
  emotionAfter?: string;
  templateId?: string;
}): Promise<{ success: boolean; id: string }> => {
  // Simuler un appel API avec un délai
  await new Promise(resolve => setTimeout(resolve, 300));
  
  console.log('Enregistrement de la session de relaxation:', sessionData);
  
  // Dans une vraie application, nous ferions un appel API ici
  return {
    success: true,
    id: `rel-${Date.now()}`
  };
};

// Fonction pour récupérer l'historique des sessions
export const getVRSessionHistory = async (userId: string): Promise<VRSession[]> => {
  // Simuler un appel API avec un délai
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Dans une application réelle, nous récupérerions l'historique depuis une API
  return [
    {
      id: "session-1",
      user_id: userId,
      template_id: "1",
      start_time: new Date(Date.now() - 86400000).toISOString(),
      end_time: new Date(Date.now() - 86370000).toISOString(),
      duration_seconds: 1800,
      completed: true,
      emotion_before: "stressé",
      emotion_after: "calme",
      emotions: ["calme", "serein"],
      template: {
        id: "1",
        name: "Méditation Guidée",
        title: "Méditation Guidée pour la Sérénité",
        description: "Une méditation guidée pour retrouver calme et sérénité",
        category: "meditation",
        duration: 600,
        intensity: "low",
        tags: ["calme", "meditation", "respiration"],
        thumbnail: "/images/vr/meditation-thumbnail.jpg",
        theme: "Meditation" // Added required theme property
      }
    },
    {
      id: "session-2",
      user_id: userId,
      template_id: "2",
      start_time: new Date(Date.now() - 172800000).toISOString(),
      end_time: new Date(Date.now() - 172770000).toISOString(),
      duration_seconds: 1200,
      completed: true,
      emotion_before: "anxieux",
      emotion_after: "apaisé",
      emotions: ["apaisé", "confiant"],
      template: {
        id: "2", 
        name: "Forêt Apaisante",
        title: "Immersion en Forêt Relaxante",
        description: "Évadez-vous dans une forêt apaisante pour retrouver votre équilibre naturel",
        category: "nature",
        duration: 900,
        intensity: "medium",
        tags: ["nature", "forêt", "relaxation"],
        thumbnail: "/images/vr/forest-thumbnail.jpg",
        theme: "Nature" // Added required theme property
      }
    }
  ];
};
