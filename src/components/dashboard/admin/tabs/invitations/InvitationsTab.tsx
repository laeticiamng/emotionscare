
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import InvitationModal from './InvitationModal';
import { InvitationFormData, InvitationStats } from '@/types/invitation';
import InvitationStatsCard from './InvitationStats';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { isAdminRole } from '@/utils/roleUtils';

const InvitationsTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Exemple de statistiques d'invitation (en situation réelle, à charger depuis l'API)
  const [invitationStats, setInvitationStats] = useState<InvitationStats>({
    sent: 50,
    accepted: 42,
    pending: 5,
    expired: 3
  });

  // Vérifier si l'utilisateur est un administrateur
  const isAdmin = isAdminRole(user?.role);
  
  if (!isAdmin) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-xl font-medium mb-2">Accès non autorisé</h3>
        <p className="text-muted-foreground">
          Vous n'avez pas les autorisations nécessaires pour accéder à cette section.
        </p>
      </Card>
    );
  }

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSendInvitation = async (data: InvitationFormData) => {
    // En situation réelle, effectuez un appel API pour envoyer l'invitation
    console.log("Sending invitation to:", data);
    
    // Simuler un délai réseau
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Mettre à jour les statistiques (en situation réelle, à rafraîchir depuis l'API)
    setInvitationStats(prev => ({
      ...prev,
      sent: prev.sent + 1,
      pending: prev.pending + 1
    }));
    
    toast({
      title: "Invitation envoyée",
      description: `Une invitation a été envoyée à ${data.email}`,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestion des invitations</h2>
          <p className="text-muted-foreground mt-2">
            Invitez des collaborateurs à rejoindre la plateforme EmotionsCare de façon sécurisée et confidentielle.
          </p>
        </div>
        
        <Button onClick={handleOpenModal}>
          <UserPlus className="mr-2 h-4 w-4" />
          Inviter un collaborateur
        </Button>
      </div>
      
      <InvitationStatsCard stats={invitationStats} />
      
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Sécurité et confidentialité des invitations</h3>
        <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
          <li>Les liens d'invitation sont sécurisés et expirent après 48 heures</li>
          <li>Les emails des invités sont chiffrés et supprimés après acceptation ou expiration</li>
          <li>Conformément au RGPD, aucune donnée personnelle n'est conservée après activation</li>
          <li>Pour des raisons de confidentialité, seules des statistiques anonymisées sont présentées</li>
        </ul>
      </div>
      
      <InvitationModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSubmit={handleSendInvitation} 
      />
    </div>
  );
};

export default InvitationsTab;
