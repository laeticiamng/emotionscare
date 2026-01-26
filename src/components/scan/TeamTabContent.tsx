import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MoreVertical, ArrowDown, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from '@/contexts/AuthContext';

interface TeamTabContentProps {
  teamId: string;
}

interface Member {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  emotional_score?: number;
  department?: string;
  position?: string;
}

const TeamTabContent: React.FC<TeamTabContentProps> = ({ teamId }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const { user } = useAuth();
  
  useEffect(() => {
    // Simuler le chargement des membres de l'équipe
    const loadTeamMembers = async () => {
      setIsLoading(true);
      try {
        // Simuler une requête API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Données simulées
        const mockMembers: Member[] = [
          {
            id: '1',
            name: 'Alice Dubois',
            email: 'alice.dubois@example.com',
            avatarUrl: 'https://i.pravatar.cc/150?img=1',
            emotional_score: 75,
            department: 'Marketing',
            position: 'Chef de projet'
          },
          {
            id: '2',
            name: 'Bob Martin',
            email: 'bob.martin@example.com',
            avatarUrl: 'https://i.pravatar.cc/150?img=2',
            emotional_score: 62,
            department: 'Ventes',
            position: 'Commercial'
          },
          {
            id: '3',
            name: 'Charlie Dupont',
            email: 'charlie.dupont@example.com',
            avatarUrl: 'https://i.pravatar.cc/150?img=3',
            emotional_score: 88,
            department: 'IT',
            position: 'Développeur'
          },
          {
            id: '4',
            name: 'Diana Leclerc',
            email: 'diana.leclerc@example.com',
            avatarUrl: 'https://i.pravatar.cc/150?img=4',
            emotional_score: 92,
            department: 'RH',
            position: 'Responsable RH'
          },
          {
            id: '5',
            name: 'Eva Garcia',
            email: 'eva.garcia@example.com',
            avatarUrl: 'https://i.pravatar.cc/150?img=5',
            emotional_score: 55,
            department: 'Finance',
            position: 'Analyste financier'
          },
        ];
        
        setMembers(mockMembers);
      } catch (error) {
        // Team members loading error
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTeamMembers();
  }, [teamId]);
  
  const toggleSortDirection = () => {
    setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };
  
  const sortedMembers = [...members].sort((a, b) => {
    // Utilisez emotional_score au lieu de emotionalScore
    const scoreA = a.emotional_score || 0;
    const scoreB = b.emotional_score || 0;
    return sortDirection === 'asc' ? scoreA - scoreB : scoreB - scoreA;
  });
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Membres de l'équipe</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" onClick={toggleSortDirection}>
                      Score Emotionnel
                      {sortDirection === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />}
                    </Button>
                  </TableHead>
                  <TableHead>Département</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Avatar>
                          <AvatarImage src={member.avatarUrl} alt={member.name} />
                          <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                        </Avatar>
                        <span>{member.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.emotional_score}</TableCell>
                    <TableCell>{member.department}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Ouvrir le menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Voir le profil</DropdownMenuItem>
                          <DropdownMenuItem>Envoyer un message</DropdownMenuItem>
                          {user?.role === 'admin' && (
                            <DropdownMenuItem>Supprimer de l'équipe</DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamTabContent;
