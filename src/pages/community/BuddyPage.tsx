
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { fetchUsersByRole, findBuddy } from '@/lib/communityService';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { User, UserRole } from '@/types';
import BuddyCard from '@/components/community/BuddyCard';
import { toast } from '@/components/ui/use-toast';
import { Loader2, UserPlus } from 'lucide-react';

const BuddyPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [matchInProgress, setMatchInProgress] = useState(false);
  const [matchedBuddy, setMatchedBuddy] = useState<string | null>(null);

  // Fetch users by selected role
  const {
    data: availableBuddies = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['buddies', selectedRole],
    queryFn: () => fetchUsersByRole(selectedRole),
    enabled: !!selectedRole,
  });

  // Request a buddy match
  const handleFindBuddy = async () => {
    if (!user?.id) return;
    
    try {
      setMatchInProgress(true);
      const buddy = await findBuddy(user.id, selectedRole);
      setMatchedBuddy(buddy.buddy_user_id);
      
      toast({
        title: "Connexion établie!",
        description: "Vous avez été connecté avec un nouveau buddy.",
      });
    } catch (error) {
      console.error('Error finding buddy:', error);
      toast({
        title: "Erreur",
        description: "Impossible de trouver un buddy. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setMatchInProgress(false);
    }
  };

  // Role options
  const roleOptions: UserRole[] = [
    UserRole.INTERNE,
    UserRole.INFIRMIER,
    UserRole.AIDE_SOIGNANT, 
    UserRole.MEDECIN, 
    UserRole.AUTRE
  ];

  return (
    <div className="container max-w-4xl mx-auto py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Buddy System</h1>
        <p className="text-muted-foreground">
          Connectez-vous avec d'autres professionnels de santé pour partager vos expériences.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Trouver un buddy</h2>
            <p className="text-sm text-muted-foreground">
              Sélectionnez un rôle pour voir les buddies disponibles.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Select
                value={selectedRole}
                onValueChange={(value) => setSelectedRole(value)}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                onClick={handleFindBuddy}
                disabled={!selectedRole || matchInProgress}
                className="gap-2"
              >
                {matchInProgress ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
                Trouver un buddy
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : selectedRole && availableBuddies.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Buddies disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableBuddies.map((buddy: User) => (
              <BuddyCard
                key={buddy.id}
                alias={buddy.name}
                role={buddy.role}
                isMatched={matchedBuddy === buddy.id}
                description="Prêt à participer au système de buddy pour soutenir les collègues."
              />
            ))}
          </div>
        </div>
      ) : selectedRole ? (
        <Card className="p-6 text-center">
          <p className="py-8 text-muted-foreground">
            Aucun buddy disponible avec ce rôle pour le moment.
          </p>
        </Card>
      ) : null}
    </div>
  );
};

export default BuddyPage;
