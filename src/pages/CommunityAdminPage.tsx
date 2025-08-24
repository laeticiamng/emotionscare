
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  MessageCircle, 
  AlertTriangle, 
  CheckCircle, 
  Ban, 
  Eye,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Trash2,
  Settings,
  UserCheck,
  UserX,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

interface CommunityMember {
  id: string;
  name: string;
  avatar?: string;
  role: 'user' | 'moderator' | 'admin';
  status: 'active' | 'suspended' | 'banned';
  joinDate: Date;
  postsCount: number;
  reportsCount: number;
  lastActivity: Date;
}

interface Post {
  id: string;
  author: CommunityMember;
  content: string;
  timestamp: Date;
  likes: number;
  reports: number;
  status: 'published' | 'flagged' | 'removed';
  category: string;
}

interface Report {
  id: string;
  post: Post;
  reporter: CommunityMember;
  reason: string;
  timestamp: Date;
  status: 'pending' | 'reviewed' | 'resolved';
}

const CommunityAdminPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const communityStats = {
    totalMembers: 2847,
    activeToday: 324,
    totalPosts: 12567,
    pendingReports: 8,
    moderators: 5,
    bannedUsers: 23
  };

  const recentReports: Report[] = [
    {
      id: '1',
      post: {
        id: 'p1',
        author: { 
          id: 'u1', name: 'Marie Dubois', role: 'user', status: 'active', 
          joinDate: new Date(), postsCount: 45, reportsCount: 0, lastActivity: new Date() 
        },
        content: 'Contenu potentiellement inapproprié...',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        likes: 2,
        reports: 3,
        status: 'flagged',
        category: 'Discussion'
      },
      reporter: { 
        id: 'u2', name: 'Paul Martin', role: 'user', status: 'active',
        joinDate: new Date(), postsCount: 78, reportsCount: 0, lastActivity: new Date()
      },
      reason: 'Contenu offensant',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: 'pending'
    },
    {
      id: '2',
      post: {
        id: 'p2',
        author: { 
          id: 'u3', name: 'Sophie Laurent', role: 'user', status: 'active',
          joinDate: new Date(), postsCount: 23, reportsCount: 1, lastActivity: new Date()
        },
        content: 'Message de spam répété...',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        likes: 0,
        reports: 5,
        status: 'flagged',
        category: 'Entraide'
      },
      reporter: { 
        id: 'u4', name: 'Jean Dupont', role: 'moderator', status: 'active',
        joinDate: new Date(), postsCount: 156, reportsCount: 0, lastActivity: new Date()
      },
      reason: 'Spam',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      status: 'pending'
    }
  ];

  const topMembers: CommunityMember[] = [
    {
      id: 'u5',
      name: 'Dr. Alice Bernard',
      role: 'moderator',
      status: 'active',
      joinDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      postsCount: 456,
      reportsCount: 0,
      lastActivity: new Date()
    },
    {
      id: 'u6',
      name: 'Thomas Rousseau',
      role: 'user',
      status: 'active',
      joinDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      postsCount: 298,
      reportsCount: 1,
      lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 'u7',
      name: 'Camille Moreau',
      role: 'user',
      status: 'active',
      joinDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
      postsCount: 267,
      reportsCount: 0,
      lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000)
    }
  ];

  const handleReportAction = (reportId: string, action: 'approve' | 'reject') => {
    toast.success(`Rapport ${action === 'approve' ? 'approuvé' : 'rejeté'} avec succès`);
  };

  const handleUserAction = (userId: string, action: 'suspend' | 'ban' | 'promote') => {
    const actionText = action === 'suspend' ? 'suspendu' : action === 'ban' ? 'banni' : 'promu';
    toast.success(`Utilisateur ${actionText} avec succès`);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'moderator': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      case 'banned': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50" data-testid="page-root">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Administration Communauté
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Gérez et modérez la communauté EmotionsCare pour maintenir un environnement sain et bienveillant.
          </p>
        </motion.div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{communityStats.totalMembers}</div>
              <p className="text-sm text-gray-600">Membres totaux</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <UserCheck className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{communityStats.activeToday}</div>
              <p className="text-sm text-gray-600">Actifs aujourd'hui</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{communityStats.totalPosts}</div>
              <p className="text-sm text-gray-600">Messages publiés</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Flag className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{communityStats.pendingReports}</div>
              <p className="text-sm text-gray-600">Signalements</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Eye className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-indigo-600">{communityStats.moderators}</div>
              <p className="text-sm text-gray-600">Modérateurs</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Ban className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">{communityStats.bannedUsers}</div>
              <p className="text-sm text-gray-600">Utilisateurs bannis</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="reports">Signalements</TabsTrigger>
            <TabsTrigger value="members">Membres</TabsTrigger>
            <TabsTrigger value="moderation">Modération</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Activité Récente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Nouveaux membres cette semaine</span>
                      <Badge className="bg-green-100 text-green-800">+47</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Messages publiés aujourd'hui</span>
                      <Badge className="bg-blue-100 text-blue-800">156</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Signalements résolus</span>
                      <Badge className="bg-purple-100 text-purple-800">23</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Taux d'engagement</span>
                      <Badge className="bg-orange-100 text-orange-800">72%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Statistiques Modération
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Messages supprimés</span>
                      <Badge className="bg-red-100 text-red-800">12</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Utilisateurs suspendus</span>
                      <Badge className="bg-yellow-100 text-yellow-800">5</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Avertissements émis</span>
                      <Badge className="bg-orange-100 text-orange-800">18</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Temps de réponse moyen</span>
                      <Badge className="bg-green-100 text-green-800">2.3h</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flag className="h-5 w-5 text-orange-600" />
                  Signalements en Attente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReports.map((report) => (
                    <div key={report.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium">Signalement par {report.reporter.name}</h4>
                            <Badge className="bg-red-100 text-red-800">{report.reason}</Badge>
                            <Badge variant="outline">{report.post.category}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            Message de {report.post.author.name}: "{report.post.content}"
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Il y a {Math.floor((Date.now() - report.timestamp.getTime()) / 60000)} min</span>
                            <span>{report.post.reports} signalements</span>
                            <span>{report.post.likes} likes</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReportAction(report.id, 'reject')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Rejeter
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReportAction(report.id, 'approve')}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Membres les Plus Actifs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{member.name}</h4>
                            <Badge className={getRoleColor(member.role)}>{member.role}</Badge>
                            <Badge className={getStatusColor(member.status)}>{member.status}</Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            {member.postsCount} messages • Membre depuis {Math.floor((Date.now() - member.joinDate.getTime()) / (24 * 60 * 60 * 1000))} jours
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUserAction(member.id, 'suspend')}
                        >
                          <UserX className="h-4 w-4 mr-1" />
                          Suspendre
                        </Button>
                        {member.role === 'user' && (
                          <Button
                            size="sm"
                            onClick={() => handleUserAction(member.id, 'promote')}
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Promouvoir
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="moderation">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-gray-600" />
                    Outils de Modération
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start" variant="outline">
                    <Ban className="h-4 w-4 mr-2" />
                    Gestion des utilisateurs bannis
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Modération automatique
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Flag className="h-4 w-4 mr-2" />
                    Configuration des signalements
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Journaux d'activité
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Règles de la Communauté</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p>Respecter la bienveillance et l'empathie</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p>Pas de contenu offensant ou discriminatoire</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p>Éviter le spam et les messages répétitifs</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p>Protéger la confidentialité des autres</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p>Signaler les comportements inappropriés</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CommunityAdminPage;
