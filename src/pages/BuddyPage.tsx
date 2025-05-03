
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { findBuddy, fetchUserById } from '@/lib/communityService';
import type { Buddy, User } from '@/types';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserIcon, Users, RefreshCw } from 'lucide-react';

const BuddyPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [buddy, setBuddy] = useState<Buddy | null>(null);
  const [buddyUser, setBuddyUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If we have a buddy, load their user details
    async function loadBuddyDetails() {
      if (buddy && buddy.buddy_user_id) {
        try {
          const userData = await fetchUserById(buddy.buddy_user_id);
          setBuddyUser(userData);
        } catch (error) {
          console.error('Error fetching buddy details:', error);
        }
      }
    }
    
    loadBuddyDetails();
  }, [buddy]);

  const handleFindBuddy = async () => {
    if (!user) {
      toast({
        title: "Non connecté",
        description: "Vous devez être connecté pour trouver un buddy",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      const newBuddy = await findBuddy(user.id, user.role);
      setBuddy(newBuddy);
      toast({
        title: "Buddy trouvé!",
        description: "Un compagnon de soutien a été trouvé pour vous"
      });
    } catch (error) {
      console.error('Error finding buddy:', error);
      toast({
        title: "Erreur",
        description: "Aucun buddy disponible pour le moment",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-semibold mb-6">🤝 Trouver un Buddy</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-xl font-medium">Programme de soutien entre pairs</h2>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Le programme Buddy vous connecte à un collègue de travail qui partage votre rôle 
            ou votre expérience. C'est une opportunité de soutien mutuel et d'entraide.
          </p>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="bg-blue-50 rounded-md p-4 flex-1">
              <h3 className="font-medium mb-2">Pourquoi avoir un buddy?</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Soutien émotionnel</li>
                <li>Partage d'expériences</li>
                <li>Conseils pratiques</li>
                <li>Réduction du stress</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-md p-4 flex-1">
              <h3 className="font-medium mb-2">Comment ça marche</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Appuyez sur le bouton ci-dessous</li>
                <li>Nous vous connectons à un collègue disponible</li>
                <li>Contactez votre buddy et présentez-vous</li>
                <li>Planifiez un moment d'échange régulier</li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleFindBuddy} 
            disabled={loading}
            className="w-full sm:w-auto flex items-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Recherche en cours...
              </>
            ) : (
              <>
                <Users className="h-4 w-4" />
                Trouver un buddy
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {buddy && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <h3 className="text-lg font-medium text-green-700">Votre Buddy</h3>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-center gap-4">
            <div className="bg-white rounded-full p-6 shadow-md">
              <UserIcon className="h-12 w-12 text-green-600" />
            </div>
            <div>
              <p className="text-lg font-medium">{buddyUser?.name || "Utilisateur"}</p>
              <p className="text-gray-600">{buddyUser?.role || "Collègue"}</p>
              <p className="text-sm text-gray-500 mt-2">
                Attribué le {new Date(buddy.date).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="w-full sm:w-auto">
              Envoyer un message
            </Button>
            <Button className="w-full sm:w-auto">
              Prendre rendez-vous
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default BuddyPage;
