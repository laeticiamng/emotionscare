
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  Settings,
  Crown,
  Shield,
  User
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import TeamMoodTimeline from '@/components/scan/TeamMoodTimeline';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  department: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  lastActivity: string;
  moodScore: number;
  avatar?: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  department: string;
  managerId: string;
  members: TeamMember[];
  createdAt: string;
  status: 'active' | 'inactive';
  moodAverage: number;
}

const TeamsPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([
    {
      id: '1',
      name: 'Équipe Marketing',
      description: 'Responsable de la stratégie marketing et communication',
      department: 'Marketing',
      managerId: '1',
      status: 'active',
      moodAverage: 7.8,
      createdAt: '2024-01-15',
      members: [
        {
          id: '1',
          name: 'Sophie Martin',
          email: 'sophie.martin@company.com',
          role: 'manager',
          department: 'Marketing',
          status: 'active',
          joinDate: '2024-01-15',
          lastActivity: '2024-01-20',
          moodScore: 8.2
        },
        {
          id: '2',
          name: 'Thomas Dubois',
          email: 'thomas.dubois@company.com',
          role: 'employee',
          department: 'Marketing',
          status: 'active',
          joinDate: '2024-01-18',
          lastActivity: '2024-01-20',
          moodScore: 7.5
        },
        {
          id: '3',
          name: 'Julie Moreau',
          email: 'julie.moreau@company.com',
          role: 'employee',
          department: 'Marketing',
          status: 'pending',
          joinDate: '2024-01-20',
          lastActivity: '2024-01-20',
          moodScore: 7.8
        }
      ]
    },
    {
      id: '2',
      name: 'Équipe Développement',
      description: 'Développement de produits et solutions techniques',
      department: 'IT',
      managerId: '4',
      status: 'active',
      moodAverage: 8.1,
      createdAt: '2024-01-10',
      members: [
        {
          id: '4',
          name: 'Pierre Laurent',
          email: 'pierre.laurent@company.com',
          role: 'manager',
          department: 'IT',
          status: 'active',
          joinDate: '2024-01-10',
          lastActivity: '2024-01-20',
          moodScore: 8.5
        },
        {
          id: '5',
          name: 'Marie Petit',
          email: 'marie.petit@company.com',
          role: 'employee',
          department: 'IT',
          status: 'active',
          joinDate: '2024-01-12',
          lastActivity: '2024-01-19',
          moodScore: 7.8
        }
      ]
    }
  ]);

  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4" />;
      case 'manager': return <Shield className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-purple-600 bg-purple-100';
      case 'manager': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMoodColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || team.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const departments = [...new Set(teams.map(team => team.department))];

  return (
    <div className="container mx-auto py-6 space-y-6" data-testid="page-root">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Gestion des Équipes</h1>
            <p className="text-muted-foreground">Organisez et suivez vos équipes</p>
          </div>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="bg-gradient-to-r from-blue-500 to-purple-500">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Équipe
        </Button>
      </motion.div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="teams">Équipes</TabsTrigger>
          <TabsTrigger value="members">Membres</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{teams.length}</p>
                    <p className="text-sm text-muted-foreground">Équipes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">
                      {teams.reduce((acc, team) => acc + team.members.length, 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Membres</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">
                      {(teams.reduce((acc, team) => acc + team.moodAverage, 0) / teams.length).toFixed(1)}
                    </p>
                    <p className="text-sm text-muted-foreground">Humeur Moy.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold">
                      {teams.filter(team => team.status === 'active').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Équipes Actives</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Équipes Récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teams.slice(0, 5).map((team) => (
                    <div key={team.id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium">{team.name}</h4>
                          <p className="text-sm text-muted-foreground">{team.department}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(team.status)}>
                          {team.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          {team.members.length} membres
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alertes Équipes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-800">Équipe Marketing</p>
                      <p className="text-sm text-yellow-700">Humeur en baisse cette semaine</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-800">3 Invitations en attente</p>
                      <p className="text-sm text-blue-700">Nouveaux membres à valider</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">Objectifs atteints</p>
                      <p className="text-sm text-green-700">Équipe Dev: 95% de satisfaction</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une équipe..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Département" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les départements</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(team.status)}>
                        {team.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedTeam(team)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Ajouter membre
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardTitle className="text-lg">{team.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{team.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Département</span>
                        <Badge variant="outline">{team.department}</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Membres</span>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span className="font-medium">{team.members.length}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Humeur moyenne</span>
                        <span className={`font-bold ${getMoodColor(team.moodAverage)}`}>
                          {team.moodAverage.toFixed(1)}/10
                        </span>
                      </div>

                      <div className="flex -space-x-2">
                        {team.members.slice(0, 4).map((member, index) => (
                          <Avatar key={member.id} className="border-2 border-background h-8 w-8">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="text-xs">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {team.members.length > 4 && (
                          <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                            <span className="text-xs font-medium">+{team.members.length - 4}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tous les Membres</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teams.flatMap(team => team.members).map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/20 transition-colors">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span>{member.email}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className={getRoleColor(member.role)}>
                        <div className="flex items-center space-x-1">
                          {getRoleIcon(member.role)}
                          <span className="capitalize">{member.role}</span>
                        </div>
                      </Badge>
                      <Badge className={getStatusColor(member.status)}>
                        {member.status}
                      </Badge>
                      <div className="text-right">
                        <p className="font-medium">{member.department}</p>
                        <p className={`text-sm ${getMoodColor(member.moodScore)}`}>
                          Humeur: {member.moodScore}/10
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Contacter
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Retirer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Performance par Équipe</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teams.map((team) => (
                    <div key={team.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{team.name}</span>
                        <span className={getMoodColor(team.moodAverage)}>
                          {team.moodAverage.toFixed(1)}/10
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                          style={{ width: `${(team.moodAverage / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Évolution de l'Humeur</CardTitle>
              </CardHeader>
              <CardContent>
                <TeamMoodTimeline />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Départements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {departments.map((dept) => {
                  const deptTeams = teams.filter(team => team.department === dept);
                  const totalMembers = deptTeams.reduce((acc, team) => acc + team.members.length, 0);
                  const avgMood = deptTeams.reduce((acc, team) => acc + team.moodAverage, 0) / deptTeams.length;

                  return (
                    <Card key={dept}>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">{dept}</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Équipes:</span>
                            <span className="font-medium">{deptTeams.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Membres:</span>
                            <span className="font-medium">{totalMembers}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Humeur Moy.:</span>
                            <span className={`font-medium ${getMoodColor(avgMood)}`}>
                              {avgMood.toFixed(1)}/10
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamsPage;
