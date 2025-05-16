import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const AdminTabContents: React.FC = () => {
  const totalUsers = 1250;
  const activeUsers = 1063;
  const newUsers = 75;
  const retentionRate = 85;

  const upcomingChallenges = [
    {
      id: "1",
      title: "Marche quotidienne",
      name: "Marche quotidienne",
      description: "Marchez 30 minutes par jour cette semaine",
      points: 50,
      progress: 0,
      completed: false,
      completions: 0,
      category: "daily",
      goal: 100,
      total: 150,
      status: "upcoming" as const
    },
    {
      id: "2",
      title: "Journal hebdomadaire",
      name: "Journal hebdomadaire",
      description: "Écrivez 3 entrées dans votre journal cette semaine",
      points: 75,
      progress: 0,
      completed: false,
      completions: 0,
      category: "weekly",
      goal: 75,
      total: 100,
      status: "upcoming" as const
    },
    {
      id: "3",
      title: "Défis mensuels",
      name: "Défis mensuels",
      description: "Complétez 5 défis ce mois-ci",
      points: 100,
      progress: 0,
      completed: false,
      completions: 0,
      category: "monthly",
      goal: 50,
      total: 75,
      status: "upcoming" as const
    }
  ];

  const recentActivity = [
    {
      id: "1",
      user: "Alice",
      activity: "a gagné le badge 'Explorateur'",
      time: "Il y a 5 minutes"
    },
    {
      id: "2",
      user: "Bob",
      activity: "a terminé le défi 'Méditation quotidienne'",
      time: "Il y a 12 minutes"
    },
    {
      id: "3",
      user: "Charlie",
      activity: "a rejoint la plateforme",
      time: "Il y a 30 minutes"
    }
  ];

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total des utilisateurs</CardTitle>
            <CardDescription>Nombre total d'utilisateurs inscrits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Utilisateurs actifs</CardTitle>
            <CardDescription>Utilisateurs actifs au cours des 30 derniers jours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeUsers}</div>
            <Progress value={(activeUsers / totalUsers) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nouveaux utilisateurs</CardTitle>
            <CardDescription>Nouveaux utilisateurs inscrits ce mois-ci</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{newUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taux de rétention</CardTitle>
            <CardDescription>Taux de rétention des utilisateurs actifs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{retentionRate}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Défis à venir</CardTitle>
            <CardDescription>Défis qui seront bientôt disponibles</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[300px] w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Nom</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingChallenges.map((challenge) => (
                    <TableRow key={challenge.id}>
                      <TableCell className="font-medium">{challenge.title}</TableCell>
                      <TableCell>{challenge.description}</TableCell>
                      <TableCell className="text-right">{challenge.points}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>Dernières activités des utilisateurs</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[300px] w-full">
              <div className="space-y-3 p-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${activity.user}`} />
                      <AvatarFallback>{activity.user.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">{activity.user} {activity.activity}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminTabContents;
