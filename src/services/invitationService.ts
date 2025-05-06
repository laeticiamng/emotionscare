
import { supabase } from "@/lib/supabase-client";
import { InvitationFormData, InvitationStats } from "@/types/invitation";

const PROJECT_ID = "yaincoxihiqdksxgrsrk"; // L'ID de votre projet Supabase

export const sendInvitation = async (data: InvitationFormData): Promise<void> => {
  const { email, role } = data;
  
  // Appel à la fonction Edge pour envoyer l'invitation
  const response = await supabase.functions.invoke("send-invitation", {
    body: { email, role },
  });
  
  if (response.error) {
    console.error("Error sending invitation:", response.error);
    throw new Error(response.error.message || "Échec de l'envoi de l'invitation");
  }
  
  return response.data;
};

export const getInvitationStats = async (): Promise<InvitationStats> => {
  try {
    // En situation réelle, récupérer des données agrégées depuis Supabase
    // Exemple agrégé pour respecter la confidentialité
    const { data: pendingCount } = await supabase
      .rpc('count_invitations_by_status', { status_param: 'pending' });
      
    const { data: acceptedCount } = await supabase
      .rpc('count_invitations_by_status', { status_param: 'accepted' });
      
    const { data: expiredCount } = await supabase
      .rpc('count_invitations_by_status', { status_param: 'expired' });
      
    const { data: totalCount } = await supabase
      .rpc('count_all_invitations');
    
    return {
      sent: totalCount || 0,
      pending: pendingCount || 0,
      accepted: acceptedCount || 0,
      expired: expiredCount || 0
    };
  } catch (error) {
    console.error("Error fetching invitation stats:", error);
    // Retourner des statistiques par défaut en cas d'erreur
    return {
      sent: 0,
      accepted: 0,
      pending: 0,
      expired: 0
    };
  }
};
