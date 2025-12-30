/**
 * B2BTeamManagementPanel - Gestion des équipes pour admin B2B
 * Création, modification, suppression d'équipes et membres
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Users, Plus, Edit2, Trash2, Search, 
  Mail, Shield, UserPlus, MoreHorizontal,
  Building2, TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'member';
  avatar?: string;
  status: 'active' | 'invited' | 'inactive';
  joinedAt: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  wellnessScore: number;
  createdAt: string;
}

export const B2BTeamManagementPanel: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showTeamDialog, setShowTeamDialog] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const [teams, setTeams] = useState<Team[]>([
    {
      id: '1',
      name: 'Équipe Produit',
      description: 'Design et développement produit',
      members: [
        { id: '1', name: 'Claire Dubois', email: 'claire@org.com', role: 'manager', status: 'active', joinedAt: '2024-01-15' },
        { id: '2', name: 'Léa Martin', email: 'lea@org.com', role: 'member', status: 'active', joinedAt: '2024-02-20' },
        { id: '3', name: 'Mohamed Benali', email: 'mohamed@org.com', role: 'member', status: 'active', joinedAt: '2024-03-10' },
      ],
      wellnessScore: 72,
      createdAt: '2024-01-01',
    },
    {
      id: '2',
      name: 'Équipe Tech',
      description: 'Infrastructure et développement',
      members: [
        { id: '4', name: 'Thomas Lefèvre', email: 'thomas@org.com', role: 'manager', status: 'active', joinedAt: '2024-01-10' },
        { id: '5', name: 'Sarah Cohen', email: 'sarah@org.com', role: 'member', status: 'active', joinedAt: '2024-04-01' },
      ],
      wellnessScore: 68,
      createdAt: '2024-01-05',
    },
    {
      id: '3',
      name: 'Équipe Marketing',
      description: 'Communication et acquisition',
      members: [
        { id: '6', name: 'Julie Moreau', email: 'julie@org.com', role: 'manager', status: 'active', joinedAt: '2024-02-01' },
      ],
      wellnessScore: 81,
      createdAt: '2024-02-01',
    },
  ]);

  const [newMember, setNewMember] = useState<{ email: string; role: 'admin' | 'manager' | 'member' }>({ email: '', role: 'member' });
  const [newTeam, setNewTeam] = useState({ name: '', description: '' });

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: 'Admin',
      manager: 'Manager',
      member: 'Membre',
    };
    return labels[role] || role;
  };

  const getRoleBadgeVariant = (role: string) => {
    if (role === 'admin') return 'destructive';
    if (role === 'manager') return 'default';
    return 'secondary';
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') return <Badge className="bg-green-500/10 text-green-600">Actif</Badge>;
    if (status === 'invited') return <Badge className="bg-yellow-500/10 text-yellow-600">Invité</Badge>;
    return <Badge variant="secondary">Inactif</Badge>;
  };

  const handleInviteMember = () => {
    if (!selectedTeam || !newMember.email) return;
    
    toast({
      title: 'Invitation envoyée',
      description: `Une invitation a été envoyée à ${newMember.email}`,
    });
    
    setShowInviteDialog(false);
    setNewMember({ email: '', role: 'member' });
  };

  const handleCreateTeam = () => {
    if (!newTeam.name) return;
    
    const team: Team = {
      id: Date.now().toString(),
      name: newTeam.name,
      description: newTeam.description,
      members: [],
      wellnessScore: 0,
      createdAt: new Date().toISOString(),
    };
    
    setTeams([...teams, team]);
    setShowTeamDialog(false);
    setNewTeam({ name: '', description: '' });
    
    toast({
      title: 'Équipe créée',
      description: `L'équipe "${team.name}" a été créée avec succès`,
    });
  };

  const handleDeleteTeam = (teamId: string) => {
    setTeams(teams.filter(t => t.id !== teamId));
    toast({
      title: 'Équipe supprimée',
      description: 'L\'équipe a été supprimée avec succès',
    });
  };

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.members.some(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalMembers = teams.reduce((acc, team) => acc + team.members.length, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6" />
            Gestion des équipes
          </h2>
          <p className="text-muted-foreground">
            {teams.length} équipes • {totalMembers} membres
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showTeamDialog} onOpenChange={setShowTeamDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle équipe
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer une équipe</DialogTitle>
                <DialogDescription>
                  Ajoutez une nouvelle équipe à votre organisation
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="team-name">Nom de l'équipe</Label>
                  <Input
                    id="team-name"
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                    placeholder="Ex: Équipe Design"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team-description">Description</Label>
                  <Input
                    id="team-description"
                    value={newTeam.description}
                    onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                    placeholder="Description de l'équipe..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowTeamDialog(false)}>
                  Annuler
                </Button>
                <Button onClick={handleCreateTeam}>Créer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher une équipe ou un membre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Liste des équipes */}
      <div className="grid gap-4">
        {filteredTeams.map((team) => (
          <Card key={team.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{team.name}</CardTitle>
                    <CardDescription>{team.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right mr-2">
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="font-medium">{team.wellnessScore}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Bien-être</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDeleteTeam(team.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">
                  {team.members.length} membre{team.members.length > 1 ? 's' : ''}
                </span>
                <Dialog open={showInviteDialog && selectedTeam?.id === team.id} onOpenChange={(open) => {
                  setShowInviteDialog(open);
                  if (open) setSelectedTeam(team);
                }}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setSelectedTeam(team)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Inviter
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Inviter un membre</DialogTitle>
                      <DialogDescription>
                        Ajoutez un nouveau membre à l'équipe {team.name}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="member-email">Email</Label>
                        <Input
                          id="member-email"
                          type="email"
                          value={newMember.email}
                          onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                          placeholder="email@exemple.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="member-role">Rôle</Label>
                        <Select
                          value={newMember.role}
                          onValueChange={(value: 'admin' | 'manager' | 'member') => 
                            setNewMember({ ...newMember, role: value })
                          }
                        >
                          <SelectTrigger id="member-role">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="member">Membre</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                        Annuler
                      </Button>
                      <Button onClick={handleInviteMember}>
                        <Mail className="h-4 w-4 mr-2" />
                        Envoyer l'invitation
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {team.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(member.status)}
                        <Badge variant={getRoleBadgeVariant(member.role) as any}>
                          {getRoleLabel(member.role)}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Shield className="h-4 w-4 mr-2" />
                              Modifier le rôle
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Retirer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default B2BTeamManagementPanel;
