
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { Badge } from '@/components/ui/badge';

const ScanPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Since we don't have a real users table in Supabase,
        // let's simulate some users with emotional scores
        const simulatedUsers: User[] = [
          {
            id: '1',
            name: 'Jean Dupont',
            email: 'jean.dupont@example.com',
            avatar: '',
            anonymity_code: 'Anon-5678',
            emotional_score: 85,
            role: 'Médecin'
          },
          {
            id: '2',
            name: 'Marie Martin',
            email: 'marie.martin@example.com',
            avatar: '',
            anonymity_code: 'Anon-9012',
            emotional_score: 65,
            role: 'Infirmier'
          },
          {
            id: '3',
            name: 'Pierre Bernard',
            email: 'pierre.bernard@example.com',
            avatar: '',
            anonymity_code: 'Anon-3456',
            emotional_score: 32,
            role: 'Aide-soignant'
          },
          {
            id: '4',
            name: 'Sophie Petit',
            email: 'sophie.petit@example.com',
            avatar: '',
            anonymity_code: 'Anon-7890',
            emotional_score: 50,
            role: 'Interne'
          },
        ];
        
        setUsers(simulatedUsers);
        
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: `Impossible de charger les utilisateurs: ${error.message}`,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  const getScoreColor = (score?: number) => {
    if (!score) return 'bg-gray-200';
    if (score >= 70) return 'bg-green-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const handleUserClick = (userId: string) => {
    navigate(`/scan/${userId}`);
  };

  return (
    <div className="container max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Scan émotionnel</h1>
      
      {loading ? (
        <div className="flex justify-center my-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map((userData) => (
            <Card 
              key={userData.id}
              className="cursor-pointer transition-all hover:shadow-md hover:bg-accent"
              onClick={() => handleUserClick(userData.id)}
            >
              <CardContent className="flex items-center p-4">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={userData.avatar} />
                  <AvatarFallback>{(userData.name?.substring(0, 2) || 'UN').toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">
                    {user?.id === userData.id ? 
                      userData.name : 
                      userData.anonymity_code || `Anonyme ${userData.id.substring(0, 4)}`
                    }
                  </div>
                  <div className="text-sm text-muted-foreground">{userData.role || 'Pas de rôle'}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={userData.emotional_score ? "default" : "outline"}>
                    Score: {userData.emotional_score || 'N/A'}
                  </Badge>
                  <div className={`w-3 h-3 rounded-full ${getScoreColor(userData.emotional_score)}`}></div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {users.length === 0 && (
            <div className="col-span-2 text-center p-8 text-muted-foreground">
              Aucun utilisateur trouvé
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScanPage;
