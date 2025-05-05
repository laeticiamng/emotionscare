
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getBuddyRequests, sendBuddyRequest, acceptBuddyRequest, rejectBuddyRequest } from '@/lib/communityService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const BuddyPage = () => {
  const [buddyRequests, setBuddyRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadBuddyRequests = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const requests = await getBuddyRequests();
        setBuddyRequests(requests);
      } catch (error) {
        console.error('Error loading buddy requests:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les demandes de connexion",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadBuddyRequests();
  }, [user, toast]);

  const handleSendRequest = async () => {
    if (!user) return;
    
    try {
      await sendBuddyRequest('some-user-id');
      toast({
        title: "Demande envoyée",
        description: "Votre demande de connexion a été envoyée"
      });
    } catch (error) {
      console.error('Error sending buddy request:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la demande de connexion",
        variant: "destructive"
      });
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await acceptBuddyRequest(requestId);
      
      // Update local state
      setBuddyRequests(prevRequests => 
        prevRequests.filter(request => request.id !== requestId)
      );
      
      toast({
        title: "Demande acceptée",
        description: "Vous êtes maintenant connectés"
      });
    } catch (error) {
      console.error('Error accepting buddy request:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'accepter la demande",
        variant: "destructive"
      });
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await rejectBuddyRequest(requestId);
      
      // Update local state
      setBuddyRequests(prevRequests => 
        prevRequests.filter(request => request.id !== requestId)
      );
      
      toast({
        title: "Demande refusée",
        description: "La demande a été refusée"
      });
    } catch (error) {
      console.error('Error rejecting buddy request:', error);
      toast({
        title: "Erreur",
        description: "Impossible de refuser la demande",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Connexions</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Demandes de connexion</h2>
        
        {buddyRequests.length === 0 ? (
          <p className="text-muted-foreground">Vous n'avez pas de demandes en attente</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {buddyRequests.map(request => (
              <Card key={request.id} className="p-4 flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    {request.sender?.name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <h3 className="font-medium">{request.sender?.name || "Utilisateur"}</h3>
                    <p className="text-sm text-muted-foreground">Envoyée il y a 2 jours</p>
                  </div>
                </div>
                
                <div className="flex space-x-2 mt-auto">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleAcceptRequest(request.id)}
                  >
                    Accepter
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleRejectRequest(request.id)}
                  >
                    Refuser
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Trouver des connexions</h2>
        <p className="text-muted-foreground mb-4">
          Connectez-vous avec d'autres utilisateurs pour partager votre parcours de bien-être
        </p>
        
        <Button onClick={handleSendRequest}>
          Rechercher des connexions
        </Button>
      </div>
    </div>
  );
};

export default BuddyPage;
