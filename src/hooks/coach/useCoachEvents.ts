import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { completeChallenge } from "@/lib/gamificationService";
import { saveRelaxationSession } from "@/lib/vrService";
import { saveJournalEntry } from "@/lib/journalService";

export function useCoachEvents() {
  const { toast } = useToast();

  // Mutation to complete a challenge
  const completeChallengeMutation = useMutation({
    mutationFn: completeChallenge,
    onSuccess: () => {
      toast({
        title: "Défi terminé",
        description: "Félicitations ! Vous avez terminé ce défi.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de terminer le défi.",
        variant: "destructive",
      });
    },
  });

  // Function to handle completing a challenge
  const handleCompleteChallenge = async (challengeId: string) => {
    completeChallengeMutation.mutate(challengeId);
    toast({
      title: "Défi en cours",
      description: "Votre défi est en cours de traitement."
    });
  };

  // Mutation to save a relaxation session
  const saveRelaxationSessionMutation = useMutation({
    mutationFn: saveRelaxationSession,
    onSuccess: () => {
      toast({
        title: "Session sauvegardée",
        description: "Votre session de relaxation a été sauvegardée avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de sauvegarder la session.",
        variant: "destructive",
      });
    },
  });

  // Function to handle saving a relaxation session
  const handleSaveRelaxationSession = async (sessionId: string) => {
    saveRelaxationSessionMutation.mutate(sessionId);
    toast({
      title: "Enregistrement terminé",
      description: "Votre session de relaxation a été sauvegardée avec succès."
    });
  };

  // Mutation to save a journal entry
  const saveJournalEntryMutation = useMutation({
    mutationFn: saveJournalEntry,
    onSuccess: () => {
      toast({
        title: "Journal sauvegardé",
        description: "Votre entrée de journal a été sauvegardée avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de sauvegarder l'entrée de journal.",
        variant: "destructive",
      });
    },
  });

  // Function to handle saving a journal entry
  const handleSaveJournalEntry = async (entryData: any) => {
    saveJournalEntryMutation.mutate(entryData);
    toast({
      title: "Journal enregistré",
      description: "Votre entrée de journal a été sauvegardée avec succès."
    });
  };

  return {
    handleCompleteChallenge,
    handleSaveRelaxationSession,
    handleSaveJournalEntry,
    isCompletingChallenge: completeChallengeMutation.isLoading,
    isSavingRelaxation: saveRelaxationSessionMutation.isLoading,
    isSavingJournalEntry: saveJournalEntryMutation.isLoading,
  };
}
