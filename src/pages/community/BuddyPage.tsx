import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { UserRole } from '@/types';
// Importer Buddy directement depuis les types
import { Buddy } from '@/types/community';
import { getBuddyRequests, sendBuddyRequest, acceptBuddyRequest, rejectBuddyRequest } from '@/lib/communityService';

interface BuddyRequest {
  id: string;
  user_id: string;
  buddy_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  user?: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar: string;
  };
}

const BuddyPage = () => {
  const { user } = useAuth();
  const [buddyRequests, setBuddyRequests] = useState<BuddyRequest[]>([]);
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchBuddyRequests = async () => {
      if (user) {
        try {
          const requests = await getBuddyRequests(user.id);
          setBuddyRequests(requests);
        } catch (error) {
          toast({
            title: "Erreur",
            description: "Impossible de charger les demandes de buddy.",
            variant: "destructive"
          });
        }
      }
    };

    fetchBuddyRequests();
  }, [user, toast]);

  const handleSendBuddyRequest = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour envoyer une demande de buddy.",
        variant: "destructive"
      });
      return;
    }

    try {
      await sendBuddyRequest(user.id, email);
      toast({
        title: "Demande envoyée",
        description: `Une demande de buddy a été envoyée à ${email}.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la demande de buddy.",
        variant: "destructive"
      });
    }
  };

  const handleAcceptBuddyRequest = async (requestId: string) => {
    try {
      await acceptBuddyRequest(requestId);
      // Update the buddy requests list
      setBuddyRequests(buddyRequests.map(req =>
        req.id === requestId ? { ...req, status: 'accepted' } : req
      ));
      toast({
        title: "Demande acceptée",
        description: "Vous avez accepté la demande de buddy.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'accepter la demande de buddy.",
        variant: "destructive"
      });
    }
  };

  const handleRejectBuddyRequest = async (requestId: string) => {
    try {
      await rejectBuddyRequest(requestId);
      // Update the buddy requests list
      setBuddyRequests(buddyRequests.map(req =>
        req.id === requestId ? { ...req, status: 'rejected' } : req
      ));
      toast({
        title: "Demande rejetée",
        description: "Vous avez rejeté la demande de buddy.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de rejeter la demande de buddy.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Mes Buddies</CardTitle>
          <CardDescription>
            Connectez-vous avec vos collègues pour un soutien mutuel
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email de votre collègue"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button onClick={handleSendBuddyRequest}>Envoyer une demande</Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Demandes de Buddy</h3>
            {buddyRequests.length > 0 ? (
              buddyRequests.map((request) => (
                <Card key={request.id} className="shadow-sm">
                  <CardContent className="flex items-center justify-between">
                    <div>
                      <p>
                        <strong>{request.user?.name}</strong> ({request.user?.email})
                      </p>
                      <p>Statut: {request.status}</p>
                    </div>
                    <div>
                      {request.status === 'pending' && (
                        <>
                          <Button 
                            variant="secondary"
                            onClick={() => handleAcceptBuddyRequest(request.id)}
                            className="mr-2"
                          >
                            Accepter
                          </Button>
                          <Button 
                            variant="destructive"
                            onClick={() => handleRejectBuddyRequest(request.id)}
                          >
                            Rejeter
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>Aucune demande de buddy pour le moment.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuddyPage;
