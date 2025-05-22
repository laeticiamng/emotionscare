
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Building2, Shield, UserPlus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UnifiedLayout from '@/components/unified/UnifiedLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const OrganizationPage: React.FC = () => {
  // Données fictives pour le tableau des départements
  const departments = [
    { id: 1, name: 'Ressources Humaines', members: 12, manager: 'Marie Dubois' },
    { id: 2, name: 'Informatique', members: 24, manager: 'Thomas Martin' },
    { id: 3, name: 'Marketing', members: 18, manager: 'Sophie Leclerc' },
    { id: 4, name: 'Finance', members: 8, manager: 'Laurent Girard' },
    { id: 5, name: 'Opérations', members: 32, manager: 'Cécile Petit' },
  ];

  return (
    <UnifiedLayout>
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Gestion de l'organisation</h1>
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Entreprise ABC</h2>
            <p className="text-muted-foreground">342 employés · 8 départements</p>
          </div>
          <Button className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Paramètres
          </Button>
        </div>
        
        <Tabs defaultValue="structure" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="structure">Structure</TabsTrigger>
            <TabsTrigger value="departments">Départements</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="roles">Rôles & Accès</TabsTrigger>
          </TabsList>
          
          <TabsContent value="structure">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Organigramme
                </CardTitle>
                <CardDescription>Structure hiérarchique de l'entreprise</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center border-2 border-dashed rounded-md">
                  <p className="text-muted-foreground">Visualisation de l'organigramme</p>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>8</CardTitle>
                  <CardDescription>Départements</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>342</CardTitle>
                  <CardDescription>Employés</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>24</CardTitle>
                  <CardDescription>Managers</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="departments">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Départements</CardTitle>
                  <CardDescription>Gérez les départements de l'organisation</CardDescription>
                </div>
                <Button className="flex items-center gap-1">
                  <UserPlus className="h-4 w-4" />
                  <span>Ajouter</span>
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Manager</TableHead>
                      <TableHead className="text-right">Membres</TableHead>
                      <TableHead className="w-24"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departments.map(dept => (
                      <TableRow key={dept.id}>
                        <TableCell className="font-medium">{dept.name}</TableCell>
                        <TableCell>{dept.manager}</TableCell>
                        <TableCell className="text-right">{dept.members}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            Détails
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Utilisateurs
                  </CardTitle>
                  <CardDescription>Gestion des utilisateurs de la plateforme</CardDescription>
                </div>
                <Button className="flex items-center gap-1">
                  <UserPlus className="h-4 w-4" />
                  <span>Inviter</span>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center border-2 border-dashed rounded-md">
                  <p className="text-muted-foreground">Liste des utilisateurs avec filtres</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="roles">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Rôles et permissions
                </CardTitle>
                <CardDescription>Configuration des accès aux fonctionnalités</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center border-2 border-dashed rounded-md">
                  <p className="text-muted-foreground">Matrice des rôles et permissions</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </UnifiedLayout>
  );
};

export default OrganizationPage;
