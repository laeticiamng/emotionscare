
import { useState, useCallback } from 'react';
import { Badge } from '@/types/badge';

export function useCommunityGamification() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [participationBadges, setParticipationBadges] = useState<Badge[]>([]);
  const [supportBadges, setSupportBadges] = useState<Badge[]>([]);
  const [creationBadges, setCreationBadges] = useState<Badge[]>([]);

  const fetchParticipationBadges = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockParticipationBadges: Badge[] = [
        {
          id: "participation-1",
          name: "Nouveau venu",
          description: "A rejoint la communauté",
          imageUrl: "/badges/participation-1.png",
          category: "participation",
          level: 1,
          unlocked: true,
          unlockCriteria: "Rejoindre la communauté",
          rarity: "common",
          dateAwarded: new Date().toISOString()
        }
      ];
      
      setParticipationBadges(mockParticipationBadges);
    } catch (error) {
      console.error("Erreur lors de la récupération des badges de participation:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchSupportBadges = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockSupportBadges: Badge[] = [
        {
          id: "support-1",
          name: "Soutien",
          description: "A soutenu 5 membres",
          imageUrl: "/badges/support-1.png",
          category: "support",
          level: 1,
          unlocked: true,
          unlockCriteria: "Soutenir 5 membres",
          rarity: "common",
          dateAwarded: new Date().toISOString()
        }
      ];
      
      setSupportBadges(mockSupportBadges);
    } catch (error) {
      console.error("Erreur lors de la récupération des badges de soutien:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCreationBadges = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockCreationBadges: Badge[] = [
        {
          id: "creation-1",
          name: "Créateur",
          description: "A créé un nouveau sujet",
          imageUrl: "/badges/creation-1.png",
          category: "creation",
          level: 1,
          unlocked: false,
          unlockCriteria: "Créer un nouveau sujet",
          rarity: "common"
        }
      ];
      
      setCreationBadges(mockCreationBadges);
    } catch (error) {
      console.error("Erreur lors de la récupération des badges de création:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Stats calculées sur les badges
  const stats = {
    totalEarned: participationBadges.length + supportBadges.length + creationBadges.length,
    participationPoints: participationBadges.length * 10,
    supportPoints: supportBadges.length * 15,
    creationPoints: creationBadges.length * 20,
    level: 1 + Math.floor((participationBadges.length + supportBadges.length + creationBadges.length) / 3)
  };

  return {
    isLoading,
    participationBadges,
    supportBadges,
    creationBadges,
    fetchParticipationBadges,
    fetchSupportBadges,
    fetchCreationBadges,
    stats
  };
}

export default useCommunityGamification;
