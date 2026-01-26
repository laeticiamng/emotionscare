import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Building, Users, UserPlus, Briefcase, FolderTree, Settings } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import OrgChart from './organization/OrgChart';
import DepartmentsList from './organization/DepartmentsList';
import TeamManagement from './organization/TeamManagement';

interface Department {
  id: string;
  name: string;
  manager: string;
  employeeCount: number;
}

interface Team {
  id: string;
  name: string;
  departmentId: string;
  lead: string;
  members: Array<{id: string; name: string;}>;
}

const OrganizationStructure = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('hierarchy');
  
  // Mock data for departments
  const [departments, _setDepartments] = useState<Department[]>([
    { id: 'dept-1', name: 'Ressources Humaines', manager: 'Sophie Lemaire', employeeCount: 8 },
    { id: 'dept-2', name: 'Marketing', manager: 'Thomas Dubois', employeeCount: 12 },
    { id: 'dept-3', name: 'Développement', manager: 'Julie Martin', employeeCount: 15 },
    { id: 'dept-4', name: 'Ventes', manager: 'Maxime Petit', employeeCount: 10 },
  ]);
  
  // Mock data for teams
  const [teams, _setTeams] = useState<Team[]>([
    { 
      id: 'team-1', 
      name: 'Équipe RH Opérations', 
      departmentId: 'dept-1', 
      lead: 'Marie Dupont',
      members: [
        { id: 'user-1', name: 'Marie Dupont' },
        { id: 'user-2', name: 'Paul Bernard' },
        { id: 'user-3', name: 'Claire Rousseau' },
      ] 
    },
    { 
      id: 'team-2', 
      name: 'Équipe Marketing Digital', 
      departmentId: 'dept-2', 
      lead: 'Lucas Moreau',
      members: [
        { id: 'user-4', name: 'Lucas Moreau' },
        { id: 'user-5', name: 'Emma Richard' },
        { id: 'user-6', name: 'Noah Lambert' },
        { id: 'user-7', name: 'Léa Bonnet' },
      ] 
    },
    { 
      id: 'team-3', 
      name: 'Équipe Dev Frontend', 
      departmentId: 'dept-3', 
      lead: 'Camille Legrand',
      members: [
        { id: 'user-8', name: 'Camille Legrand' },
        { id: 'user-9', name: 'Hugo Roux' },
        { id: 'user-10', name: 'Inès Fournier' },
      ] 
    },
  ]);
  
  const handleInvite = () => {
    toast({
      title: "Invitation envoyée",
      description: "L'utilisateur a été invité à rejoindre l'organisation"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Structure Organisationnelle</h1>
          <p className="text-muted-foreground">
            Gérez les départements, équipes et la hiérarchie de votre organisation
          </p>
        </div>
        <Button onClick={handleInvite}>
          <UserPlus className="mr-2 h-4 w-4" />
          Inviter un membre
        </Button>
      </div>
      
      <Tabs defaultValue="hierarchy" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="hierarchy">
            <FolderTree className="h-4 w-4 mr-2" />
            Hiérarchie
          </TabsTrigger>
          <TabsTrigger value="departments">
            <Building className="h-4 w-4 mr-2" />
            Départements
          </TabsTrigger>
          <TabsTrigger value="teams">
            <Users className="h-4 w-4 mr-2" />
            Équipes
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="hierarchy" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FolderTree className="mr-2 h-5 w-5" /> 
                Vue Hiérarchique
              </CardTitle>
              <CardDescription>
                Visualisez la structure complète de votre organisation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrgChart departments={departments} teams={teams} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="departments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-5 w-5" /> 
                Gestion des Départements
              </CardTitle>
              <CardDescription>
                Créez et gérez les départements de votre organisation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DepartmentsList departments={departments} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="teams" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" /> 
                Gestion des Équipes
              </CardTitle>
              <CardDescription>
                Créez et gérez les équipes inter-départementales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TeamManagement teams={teams} departments={departments} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" /> 
                Paramètres Organisationnels
              </CardTitle>
              <CardDescription>
                Configurez les paramètres de votre organisation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Structure Hiérarchique</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Définissez la profondeur maximale de votre hiérarchie organisationnelle
                    </p>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline">3 niveaux</Button>
                      <Button variant="outline">4 niveaux</Button>
                      <Button variant="default">5 niveaux</Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Permissions par Défaut</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Définissez les permissions par défaut pour les nouveaux membres
                    </p>
                    <Button variant="outline">Configurer les permissions</Button>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Données Organisationnelles</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Gérez l'importation et l'exportation des données de votre organisation
                  </p>
                  <div className="flex space-x-2">
                    <Button variant="outline">
                      <Briefcase className="mr-2 h-4 w-4" />
                      Importer
                    </Button>
                    <Button variant="outline">
                      <Briefcase className="mr-2 h-4 w-4" />
                      Exporter
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizationStructure;
