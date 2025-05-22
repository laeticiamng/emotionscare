
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserPlus, BarChart2, CalendarClock, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  status: 'active' | 'offline' | 'busy';
  avatar?: string;
  wellbeingScore: number;
}

const TeamsPage: React.FC = () => {
  // Données de démo
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: 1,
      name: 'Marie Dupont',
      role: 'Chef d\'équipe',
      status: 'active',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marie',
      wellbeingScore: 85
    },
    {
      id: 2,
      name: 'Thomas Bernard',
      role: 'Développeur Senior',
      status: 'busy',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas',
      wellbeingScore: 72
    },
    {
      id: 3,
      name: 'Sophie Martin',
      role: 'Designer UX/UI',
      status: 'active',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
      wellbeingScore: 90
    },
    {
      id: 4,
      name: 'Lucas Petit',
      role: 'Développeur Frontend',
      status: 'offline',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas',
      wellbeingScore: 65
    },
    {
      id: 5,
      name: 'Camille Rousseau',
      role: 'Chef de projet',
      status: 'active',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Camille',
      wellbeingScore: 79
    }
  ]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'offline': return 'bg-gray-400';
      case 'busy': return 'bg-orange-500';
      default: return 'bg-gray-400';
    }
  };

  const getWellbeingColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="h-7 w-7" />
          Gestion d'équipe
        </h1>
        <Button className="bg-primary hover:bg-primary/90 text-white">
          <UserPlus className="mr-2 h-4 w-4" />
          Ajouter un membre
        </Button>
      </div>

      <Tabs defaultValue="members" className="space-y-4">
        <TabsList>
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Membres
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Analytiques
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4" />
            Événements
          </TabsTrigger>
          <TabsTrigger value="access" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Accès
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Membres de l'équipe</CardTitle>
              <CardDescription>Gérez les membres de votre équipe et suivez leur bien-être</CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {members.map(member => (
                  <motion.div 
                    key={member.id} 
                    variants={itemVariants}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></span>
                      </div>
                      <div>
                        <h3 className="font-medium">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="w-40">
                        <span className={`text-sm font-medium ${getWellbeingColor(member.wellbeingScore)}`}>
                          Bien-être: {member.wellbeingScore}%
                        </span>
                        <Progress value={member.wellbeingScore} className="h-2" />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Profil</Button>
                        <Button variant="outline" size="sm">Message</Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytiques d'équipe</CardTitle>
              <CardDescription>Visualisez les tendances et les statistiques de votre équipe</CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center bg-muted/20 rounded-md">
              <p className="text-muted-foreground">Graphiques et statistiques d'équipe (à implémenter)</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Événements d'équipe</CardTitle>
              <CardDescription>Planifiez et gérez vos événements d'équipe</CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center bg-muted/20 rounded-md">
              <p className="text-muted-foreground">Calendrier des événements d'équipe (à implémenter)</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des accès</CardTitle>
              <CardDescription>Gérez les permissions et les accès des membres de l'équipe</CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center bg-muted/20 rounded-md">
              <p className="text-muted-foreground">Tableau des permissions et des accès (à implémenter)</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamsPage;
