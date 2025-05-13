
import { Badge } from '@/types/gamification';
import { unlockBadge, getBadges } from '@/lib/gamification/badge-service';
import { addPoints } from '@/lib/gamification/points-service';
import { useToast } from '@/components/ui/use-toast';

/**
 * Traite une émotion détectée pour les badges et récompenses
 * @param userId ID de l'utilisateur
 * @param emotion Émotion détectée
 * @param confidence Niveau de confiance de la détection (0-1)
 */
export async function processEmotionForBadges(
  userId: string,
  emotion: string,
  confidence: number = 0.5
): Promise<Badge | null> {
  try {
    // Pour les émotions détectées avec haute confiance, on attribue plus de points
    const emotionPoints = Math.round((confidence * 10) + 5);
    
    // Ajouter des points pour avoir enregistré une émotion
    await addPoints(userId, emotionPoints);
    
    // Récupérer les badges actuels de l'utilisateur
    const userBadges = await getBadges(userId);
    
    // Badges liés aux émotions
    const emotionBadgeMap: Record<string, { id: string, name: string, minDetections: number }> = {
      "joy": { id: "joy_master", name: "Maître de la Joie", minDetections: 5 },
      "happy": { id: "joy_master", name: "Maître de la Joie", minDetections: 5 },
      "sadness": { id: "sad_master", name: "Maître de la Résilience", minDetections: 3 },
      "sad": { id: "sad_master", name: "Maître de la Résilience", minDetections: 3 },
      "anger": { id: "anger_master", name: "Maître du Calme", minDetections: 3 },
      "angry": { id: "anger_master", name: "Maître du Calme", minDetections: 3 },
      "fear": { id: "fear_master", name: "Maître du Courage", minDetections: 3 },
      "fearful": { id: "fear_master", name: "Maître du Courage", minDetections: 3 },
      "calm": { id: "calm_master", name: "Maître de la Sérénité", minDetections: 5 },
      "surprise": { id: "surprise_master", name: "Maître de l'Adaptation", minDetections: 3 },
      "surprised": { id: "surprise_master", name: "Maître de l'Adaptation", minDetections: 3 },
      "disgust": { id: "disgust_master", name: "Maître de l'Acceptation", minDetections: 2 },
      "disgusted": { id: "disgust_master", name: "Maître de l'Acceptation", minDetections: 2 }
    };
    
    // Vérifier si l'émotion est associée à un badge
    const normalizedEmotion = emotion.toLowerCase();
    const badgeInfo = emotionBadgeMap[normalizedEmotion];
    
    if (badgeInfo) {
      // Vérifier si l'utilisateur a déjà ce badge
      const existingBadge = userBadges.find(badge => badge.id === badgeInfo.id);
      
      // Si le badge n'existe pas encore, on peut considérer qu'il est débloqué
      // Dans une implémentation réelle, on vérifierait le nombre de détections dans la base
      if (!existingBadge && confidence > 0.7) {
        // Simuler un déblocage de badge
        await unlockBadge(userId, badgeInfo.id);
        
        // Badge simulé à retourner
        const newBadge: Badge = {
          id: badgeInfo.id,
          name: badgeInfo.name,
          description: `Détecter l'émotion ${normalizedEmotion} avec une haute confiance`,
          category: "émotions",
          unlocked: true,
          date_earned: new Date().toISOString(),
          tier: "silver"
        };
        
        return newBadge;
      }
    }
    
    // Aucun nouveau badge n'a été débloqué
    return null;
    
  } catch (error) {
    console.error("Erreur dans processEmotionForBadges:", error);
    return null;
  }
}

/**
 * Attribue des points en fonction de la qualité de la journalisation
 * @param userId ID de l'utilisateur
 * @param textLength Longueur du texte
 * @param emotionCount Nombre d'émotions détectées
 */
export async function processJournalEntry(
  userId: string,
  textLength: number,
  emotionCount: number
): Promise<number> {
  try {
    // Calcul des points basé sur la longueur et la richesse émotionnelle
    let points = 0;
    
    // Points pour la longueur
    if (textLength > 500) points += 20;
    else if (textLength > 200) points += 10;
    else if (textLength > 50) points += 5;
    
    // Points pour la richesse émotionnelle
    if (emotionCount > 3) points += 15;
    else if (emotionCount > 1) points += 10;
    else if (emotionCount === 1) points += 5;
    
    // Attribution des points
    if (points > 0) {
      await addPoints(userId, points);
    }
    
    return points;
  } catch (error) {
    console.error("Erreur dans processJournalEntry:", error);
    return 0;
  }
}

export default {
  processEmotionForBadges,
  processJournalEntry
};
