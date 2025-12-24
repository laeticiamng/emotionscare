// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCaption,
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
    const loadTeamMembers = async () => {
      setIsLoading(true);
      try {
        const { supabase } = await import('@/integrations/supabase/client');

        // Get team members from organization_users table
        const { data: teamData } = await supabase
          .from('organization_users')
          .select(`
            user_id,
            role,
            profiles:user_id (
              id,
              full_name,
              first_name,
              last_name,
              email,
              avatar_url,
              department
            )
          `)
          .eq('organization_id', teamId);

        if (teamData && teamData.length > 0) {
          // Get recent emotion scores for each member
          const memberIds = teamData.map(t => t.user_id);
          const { data: scoresData } = await supabase
            .from('emotion_scans')
            .select('user_id, valence')
            .in('user_id', memberIds)
            .order('created_at', { ascending: false });

          // Calculate average scores per user
          const userScores: Record<string, number[]> = {};
          (scoresData || []).forEach(s => {
            if (!userScores[s.user_id]) userScores[s.user_id] = [];
            userScores[s.user_id].push(s.valence || 50);
          });

          const formattedMembers: Member[] = teamData.map(t => {
            const profile = t.profiles as any;
            const scores = userScores[t.user_id] || [];
            const avgScore = scores.length > 0
              ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
              : 50;

            return {
              id: t.user_id,
              name: profile?.full_name || `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Utilisateur',
              email: profile?.email || '',
              avatarUrl: profile?.avatar_url,
              emotional_score: avgScore,
              department: profile?.department || 'Non spécifié',
              position: t.role || 'Membre'
            };
          });

          setMembers(formattedMembers);
        }
      } catch (error) {
        console.error('Error loading team members:', error);
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
