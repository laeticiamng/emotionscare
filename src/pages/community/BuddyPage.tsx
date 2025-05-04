
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { findBuddy, fetchUsersByRole } from '@/lib/communityService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import BuddyCard from '@/components/community/BuddyCard';
import LoadingAnimation from '@/components/ui/loading-animation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, UserPlus, Users } from 'lucide-react';
import type { User as UserType } from '@/types';
import type { Buddy } from '@/types/community';

const BuddyPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [buddyMatch, setBuddyMatch] = useState<Buddy | null>(null);
  const [availableUsers, setAvailableUsers] = useState<UserType[]>([]);

  // Function to search for potential buddies
  const searchBuddies = async () => {
    if (!user) {
      toast({
        title: "Non connecté",
        description: "Vous devez être connecté pour chercher des buddies",
        variant: "destructive"
      });
      return;
    }

    try {
      setSearching(true);
      const users = await fetchUsersByRole(selectedRole);
      setAvailableUsers(users.filter(u => u.id !== user.id));
    } catch (error) {
      console.error('Error searching for buddies:', error);
      toast({
        title: "Erreur",
        description: "Impossible de trouver des buddies correspondants",
        variant: "destructive"
      });
    } finally {
      setSearching(false);
    }
  };

  // Function to request a buddy match
  const requestBuddy = async () => {
    if (!user) {
      toast({
        title: "Non connecté",
        description: "Vous devez être connecté pour trouver un buddy",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      const match = await findBuddy(user.id, selectedRole);
      setBuddyMatch(match);
      
      toast({
        title: "Buddy trouvé",
        description: "Vous avez été mis en relation avec un buddy",
      });
    } catch (error) {
      console.error('Error finding buddy:', error);
      toast({
        title: "Erreur",
        description: "Impossible de trouver un buddy pour le moment",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold flex items-center mb-2">
          <Users className="h-6 w-6 mr-2" />
          Trouvez un buddy
        </h1>
        <p className="text-muted-foreground">
          Un buddy est un partenaire de soutien qui partage votre parcours. Vous pouvez discuter, 
          vous entraider et progresser ensemble.
        </p>
      </div>

      <Card className="p-6 mb-8">
        <h2 className="text-xl font-medium mb-4">Trouvez votre buddy idéal</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="role-select" className="block text-sm font-medium mb-1">
              Quel type de buddy recherchez-vous ?
            </label>
            <Select onValueChange={setSelectedRole} value={selectedRole}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="soignant">Soignant</SelectItem>
                <SelectItem value="patient">Patient</SelectItem>
                <SelectItem value="professionnel">Professionnel</SelectItem>
                <SelectItem value="étudiant">Étudiant</SelectItem>
                <SelectItem value="tout">Peu importe</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={requestBuddy} 
            disabled={loading || !selectedRole}
            className="w-full"
          >
            {loading ? (
              <LoadingAnimation text="Recherche..." iconClassName="h-4 w-4" className="p-0" />
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Trouvez-moi un buddy
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Display buddy match if found */}
      {buddyMatch && (
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Votre buddy</h2>
          <BuddyCard 
            alias="Buddy" 
            role="Support" 
            description="Ce buddy a été jumelé en fonction de vos préférences et est prêt à vous accompagner dans votre parcours." 
            joinDate={new Date(buddyMatch.date).toLocaleDateString()} 
            isMatched={true}
          />
        </div>
      )}

      {/* Display available users */}
      {availableUsers.length > 0 && (
        <div>
          <h2 className="text-xl font-medium mb-4">Buddies disponibles</h2>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {availableUsers.map((user) => (
              <BuddyCard 
                key={user.id} 
                alias={user.name || 'Anonyme'} 
                role={selectedRole} 
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!buddyMatch && availableUsers.length === 0 && !loading && !searching && (
        <Card className="p-6 text-center">
          <div className="flex flex-col items-center gap-2 py-8">
            <User className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-medium mt-2">Pas encore de buddy</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Trouvez un buddy pour partager votre parcours et vous soutenir mutuellement dans vos objectifs.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default BuddyPage;
