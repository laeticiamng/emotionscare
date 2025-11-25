// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Users,
  TrendingUp,
  TrendingDown,
  UserPlus,
  Mail,
  Search,
  Filter,
  MoreHorizontal,
  Heart,
  Activity,
  Award,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';

interface TeamTabProps {
  className?: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  department: string;
  wellbeingScore: number;
  wellbeingTrend: number;
  lastActivity: string;
  status: 'active' | 'inactive' | 'at_risk';
  streakDays: number;
}

interface DepartmentData {
  name: string;
  wellbeing: number;
  engagement: number;
  participation: number;
}

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Marie Dupont',
    email: 'marie.dupont@company.com',
    role: 'Designer',
    department: 'Produit',
    wellbeingScore: 85,
    wellbeingTrend: 5,
    lastActivity: '2024-11-25T10:30:00',
    status: 'active',
    streakDays: 12,
  },
  {
    id: '2',
    name: 'Pierre Martin',
    email: 'pierre.martin@company.com',
    role: 'Développeur',
    department: 'Tech',
    wellbeingScore: 72,
    wellbeingTrend: -3,
    lastActivity: '2024-11-24T16:45:00',
    status: 'active',
    streakDays: 5,
  },
  {
    id: '3',
    name: 'Sophie Bernard',
    email: 'sophie.bernard@company.com',
    role: 'Manager',
    department: 'RH',
    wellbeingScore: 78,
    wellbeingTrend: 8,
    lastActivity: '2024-11-25T09:15:00',
    status: 'active',
    streakDays: 21,
  },
  {
    id: '4',
    name: 'Lucas Petit',
    email: 'lucas.petit@company.com',
    role: 'Commercial',
    department: 'Ventes',
    wellbeingScore: 58,
    wellbeingTrend: -12,
    lastActivity: '2024-11-20T14:30:00',
    status: 'at_risk',
    streakDays: 0,
  },
  {
    id: '5',
    name: 'Emma Leroy',
    email: 'emma.leroy@company.com',
    role: 'Analyste',
    department: 'Finance',
    wellbeingScore: 82,
    wellbeingTrend: 2,
    lastActivity: '2024-11-25T11:00:00',
    status: 'active',
    streakDays: 8,
  },
];

const mockDepartmentData: DepartmentData[] = [
  { name: 'Tech', wellbeing: 75, engagement: 82, participation: 88 },
  { name: 'Produit', wellbeing: 82, engagement: 78, participation: 92 },
  { name: 'RH', wellbeing: 85, engagement: 90, participation: 95 },
  { name: 'Ventes', wellbeing: 68, engagement: 72, participation: 75 },
  { name: 'Finance', wellbeing: 78, engagement: 80, participation: 85 },
];

const TeamTab: React.FC<TeamTabProps> = ({ className }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  const filteredMembers = mockTeamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      selectedDepartment === 'all' || member.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const teamStats = {
    totalMembers: mockTeamMembers.length,
    activeMembers: mockTeamMembers.filter((m) => m.status === 'active').length,
    atRiskMembers: mockTeamMembers.filter((m) => m.status === 'at_risk').length,
    averageWellbeing: Math.round(
      mockTeamMembers.reduce((sum, m) => sum + m.wellbeingScore, 0) /
        mockTeamMembers.length
    ),
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Actif
          </Badge>
        );
      case 'at_risk':
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            À risque
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Inactif
          </Badge>
        );
    }
  };

  const getWellbeingColor = (score: number) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatLastActivity = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffHours < 1) return 'Il y a moins d\'une heure';
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffHours < 48) return 'Hier';
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Gestion de l'équipe
          </h2>
          <p className="text-muted-foreground">
            Suivez le bien-être et l'engagement de votre équipe
          </p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Inviter un membre
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{teamStats.totalMembers}</p>
                  <p className="text-sm text-muted-foreground">Membres total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{teamStats.activeMembers}</p>
                  <p className="text-sm text-muted-foreground">Actifs cette semaine</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{teamStats.atRiskMembers}</p>
                  <p className="text-sm text-muted-foreground">À surveiller</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Heart className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{teamStats.averageWellbeing}%</p>
                  <p className="text-sm text-muted-foreground">Bien-être moyen</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Department Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Performance par département
          </CardTitle>
          <CardDescription>
            Comparaison du bien-être, engagement et participation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockDepartmentData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="wellbeing"
                name="Bien-être"
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="engagement"
                name="Engagement"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="participation"
                name="Participation"
                fill="#8b5cf6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Team Members Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Membres de l'équipe</CardTitle>
              <CardDescription>
                {filteredMembers.length} membres trouvés
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedDepartment('all')}>
                    Tous les départements
                  </DropdownMenuItem>
                  {['Tech', 'Produit', 'RH', 'Ventes', 'Finance'].map((dept) => (
                    <DropdownMenuItem
                      key={dept}
                      onClick={() => setSelectedDepartment(dept)}
                    >
                      {dept}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Membre</TableHead>
                <TableHead>Département</TableHead>
                <TableHead>Bien-être</TableHead>
                <TableHead>Série</TableHead>
                <TableHead>Dernière activité</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {member.role}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{member.department}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-medium ${getWellbeingColor(
                          member.wellbeingScore
                        )}`}
                      >
                        {member.wellbeingScore}%
                      </span>
                      {member.wellbeingTrend > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {member.streakDays > 0 ? (
                      <div className="flex items-center gap-1 text-orange-500">
                        <Award className="h-4 w-4" />
                        <span>{member.streakDays}j</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatLastActivity(member.lastActivity)}
                  </TableCell>
                  <TableCell>{getStatusBadge(member.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" />
                          Envoyer un message
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Activity className="h-4 w-4 mr-2" />
                          Voir les statistiques
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Calendar className="h-4 w-4 mr-2" />
                          Planifier un suivi
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" className="flex-1 min-w-[200px]">
          <Mail className="h-4 w-4 mr-2" />
          Envoyer un rappel collectif
        </Button>
        <Button variant="outline" className="flex-1 min-w-[200px]">
          <Calendar className="h-4 w-4 mr-2" />
          Planifier une activité d'équipe
        </Button>
        <Button className="flex-1 min-w-[200px]">
          <Activity className="h-4 w-4 mr-2" />
          Générer un rapport
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default TeamTab;
