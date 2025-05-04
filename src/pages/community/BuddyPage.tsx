
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserAvatar from '@/components/community/UserAvatar';
import { findBuddy, fetchUserBuddies, fetchUserById } from '@/lib/communityService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { UserRole, User } from '@/types';
import { Buddy } from '@/types/community';
import { ArrowLeft, User as UserIcon, Heart, MessageSquare, Calendar } from 'lucide-react';

const BuddyPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isBuddiesLoading, setIsBuddiesLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | undefined>(undefined);
  const [matchedBuddy, setMatchedBuddy] = useState<Buddy | null>(null);
  const [buddies, setBuddies] = useState<Buddy[]>([]);
  const [buddyUsers, setBuddyUsers] = useState<Record<string, User | null>>({});
  
  // Fetch existing buddies
  useEffect(() => {
    if (!user) return;
    
    const loadBuddies = async () => {
      try {
        setIsBuddiesLoading(true);
        const userBuddies = await fetchUserBuddies(user.id);
        setBuddies(userBuddies);
        
        // Load buddy user details
        const buddyUserIds = userBuddies.map(b => b.buddy_user_id);
        const userDetailsPromises = buddyUserIds.map(async id => {
          const userData = await fetchUserById(id);
          return { id, user: userData };
        });
        
        const userDetails = await Promise.all(userDetailsPromises);
        const newBuddyUsers: Record<string, User | null> = {};
        
        userDetails.forEach(({ id, user }) => {
          newBuddyUsers[id] = user;
        });
        
        setBuddyUsers(newBuddyUsers);
      } catch (error) {
        console.error("Erreur lors du chargement des buddies:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger vos buddies existants",
          variant: "destructive"
        });
      } finally {
        setIsBuddiesLoading(false);
      }
    };
    
    loadBuddies();
  }, [user, toast]);

  const handleFindBuddy = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const buddy = await findBuddy(user.id, selectedRole);
      
      // Fetch buddy user details
      const buddyUser = await fetchUserById(buddy.buddy_user_id);
      setBuddyUsers(prev => ({
        ...prev,
        [buddy.buddy_user_id]: buddyUser
      }));
      
      setMatchedBuddy(buddy);
      setBuddies(prev => [buddy, ...prev]);
      
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
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6 flex items-center">
        <Link to="/community" className="mr-4">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </Link>
        <h1 className="text-3xl font-semibold flex items-center">
          <UserIcon className="h-6 w-6 mr-2" />
          Programme Buddy
        </h1>
      </div>
      
      <p className="text-muted-foreground mb-8">
        Trouvez un collègue avec qui échanger sur votre bien-être et vous soutenir mutuellement.
      </p>
      
      <Tabs defaultValue="find" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="find">Trouver un buddy</TabsTrigger>
          <TabsTrigger value="my-buddies">Mes buddies</TabsTrigger>
        </TabsList>
        
        <TabsContent value="find">
          <Card>
            <CardHeader>
              <CardTitle>Trouvez votre partenaire de bien-être</CardTitle>
              <p className="text-muted-foreground">
                Nous vous mettons en relation avec un professionnel qui partage vos défis quotidiens.
              </p>
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
                      className="mb-2"
                    >
                      {role}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-md">
                <h4 className="font-medium mb-2 flex items-center">
                  <Heart className="h-4 w-4 mr-2 text-rose-500" />
                  Pourquoi trouver un buddy ?
                </h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Partagez vos expériences et défis quotidiens</li>
                  <li>Bénéficiez d'un soutien émotionnel</li>
                  <li>Échangez des conseils pratiques pour votre bien-être</li>
                  <li>Créez des liens durables avec vos pairs</li>
                </ul>
              </div>
              
              <Button 
                onClick={handleFindBuddy} 
                disabled={isLoading}
                className="w-full mt-4"
              >
                {isLoading ? "Recherche en cours..." : "Trouver un buddy"}
              </Button>
            </CardContent>
          </Card>
          
          {matchedBuddy && (
            <div className="mt-8 space-y-4">
              <h2 className="text-xl font-semibold">Votre nouveau buddy :</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <UserAvatar user={buddyUsers[matchedBuddy.buddy_user_id]} size="lg" />
                    <div>
                      <h3 className="text-lg font-semibold">
                        {buddyUsers[matchedBuddy.buddy_user_id]?.name || "Nouveau buddy"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {buddyUsers[matchedBuddy.buddy_user_id]?.role || "Professionnel de santé"}
                      </p>
                      <div className="flex items-center mt-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>
                          Match créé le {new Date(matchedBuddy.date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t flex justify-between">
                    <Button variant="outline" className="w-1/2 mr-2">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Envoyer un message
                    </Button>
                    <Button variant="secondary" className="w-1/2 ml-2">
                      Voir le profil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="my-buddies">
          <h2 className="text-xl font-semibold mb-4">Vos buddies actuels</h2>
          
          {isBuddiesLoading ? (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">Chargement de vos buddies...</p>
            </Card>
          ) : buddies.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">Vous n'avez pas encore de buddies. Essayez d'en trouver un !</p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {buddies.map((buddy) => (
                <Card key={buddy.id} className="hover:shadow-md transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <UserAvatar user={buddyUsers[buddy.buddy_user_id]} size="md" />
                      <div>
                        <h3 className="font-semibold">
                          {buddyUsers[buddy.buddy_user_id]?.name || "Buddy"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {buddyUsers[buddy.buddy_user_id]?.role || "Professionnel de santé"}
                        </p>
                        <div className="flex items-center mt-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>
                            Depuis le {new Date(buddy.date).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t flex justify-end">
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BuddyPage;
