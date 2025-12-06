
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PenSquare, Plus, Trash2, User, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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

interface TeamManagementProps {
  teams: Team[];
  departments: Department[];
}

const TeamManagement: React.FC<TeamManagementProps> = ({ teams, departments }) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>(undefined);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    departmentId: '',
    lead: ''
  });
  
  const filteredTeams = selectedDepartment 
    ? teams.filter(team => team.departmentId === selectedDepartment)
    : teams;
    
  const handleNewTeam = () => {
    setEditingTeam(null);
    setFormData({ name: '', departmentId: selectedDepartment || '', lead: '' });
    setIsDialogOpen(true);
  };
  
  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setFormData({ 
      name: team.name, 
      departmentId: team.departmentId, 
      lead: team.lead 
    });
    setIsDialogOpen(true);
  };
  
  const handleSave = () => {
    if (editingTeam) {
      toast({
        title: "Équipe modifiée",
        description: `L'équipe ${formData.name} a été modifiée avec succès.`
      });
    } else {
      toast({
        title: "Équipe créée",
        description: `L'équipe ${formData.name} a été créée avec succès.`
      });
    }
    setIsDialogOpen(false);
  };
  
  const handleDeleteTeam = (team: Team) => {
    toast({
      title: "Équipe supprimée",
      description: `L'équipe ${team.name} a été supprimée avec succès.`,
      variant: "destructive"
    });
  };
  
  const getDepartmentName = (id: string) => {
    const dept = departments.find(d => d.id === id);
    return dept ? dept.name : 'N/A';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Label htmlFor="department-filter">Filtrer par département:</Label>
          <Select 
            value={selectedDepartment} 
            onValueChange={setSelectedDepartment}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Tous les départements" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={undefined}>Tous les départements</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={handleNewTeam}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle équipe
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTeams.length > 0 ? (
          filteredTeams.map((team) => (
            <Card key={team.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-muted p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{team.name}</h3>
                    <div className="text-xs text-muted-foreground">
                      Département: {getDepartmentName(team.departmentId)}
                    </div>
                  </div>
                  <div className="space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEditTeam(team)}>
                      <PenSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteTeam(team)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center mb-3">
                    <User className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm font-medium">Lead: {team.lead}</span>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="mt-3">
                    <div className="flex items-center mb-2">
                      <Users className="h-4 w-4 mr-2" />
                      <span className="text-sm">Membres de l'équipe ({team.members.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {team.members.map((member) => (
                        <Badge key={member.id} variant="secondary" className="text-xs">
                          {member.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-2 flex justify-center items-center p-8 border rounded-lg">
            <div className="text-center text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <h3 className="font-medium">Aucune équipe trouvée</h3>
              <p className="text-sm mt-1">
                {selectedDepartment 
                  ? "Aucune équipe n'est associée à ce département" 
                  : "Commencez par créer une équipe"}
              </p>
              <Button variant="outline" className="mt-4" onClick={handleNewTeam}>
                <Plus className="mr-2 h-4 w-4" />
                Créer une équipe
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTeam ? 'Modifier l\'équipe' : 'Nouvelle équipe'}</DialogTitle>
            <DialogDescription>
              {editingTeam 
                ? 'Modifiez les détails de l\'équipe existante.' 
                : 'Créez une nouvelle équipe dans votre organisation.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="team-name">Nom de l'équipe</Label>
              <Input 
                id="team-name" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="team-department">Département</Label>
              <Select 
                value={formData.departmentId} 
                onValueChange={(value) => setFormData({...formData, departmentId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un département" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="team-lead">Responsable d'équipe</Label>
              <Input 
                id="team-lead" 
                value={formData.lead} 
                onChange={(e) => setFormData({...formData, lead: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave}>{editingTeam ? 'Enregistrer' : 'Créer'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManagement;
