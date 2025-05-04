import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BuddyCard from '@/components/community/BuddyCard';
import { findBuddy } from '@/lib/communityService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types';

const BuddyPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | undefined>(undefined);
  const [matchedBuddy, setMatchedBuddy] = useState(null);

  const handleFindBuddy = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const buddy = await findBuddy(user.id, selectedRole);
      
      setMatchedBuddy(buddy);
      toast({
        title: "Nouveau buddy trouvé !",
        description: "Vous avez été mis en relation avec un nouveau collègue."
      });
    } catch (error) {
      console.error("Erreur lors de la recherche d'un buddy:", error);
      toast({
        title: "Erreur",
        description: "Impossible de trouver un buddy pour le moment.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role === selectedRole ? undefined : role);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Programme Buddy</h1>
        <p className="text-muted-foreground">
          Trouvez un collègue avec qui échanger sur votre bien-être et vous soutenir mutuellement.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Trouver un buddy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Filtrer par rôle :</h3>
            <div className="flex flex-wrap gap-2">
              {Object.values(UserRole).map((role) => (
                <Button
                  key={role}
                  variant={selectedRole === role ? "default" : "outline"}
                  onClick={() => handleRoleSelect(role)}
                >
                  {role}
                </Button>
              ))}
            </div>
          </div>
          
          <Button 
            onClick={handleFindBuddy} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Recherche en cours..." : "Trouver un buddy"}
          </Button>
        </CardContent>
      </Card>
      
      {matchedBuddy && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Votre nouveau buddy :</h2>
          <BuddyCard buddy={matchedBuddy} />
        </div>
      )}
      
      {/* More content like recent buddies history, etc. could go here */}
    </div>
  );
};

export default BuddyPage;
