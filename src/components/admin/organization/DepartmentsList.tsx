
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, PenSquare, Trash2, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Department {
  id: string;
  name: string;
  manager: string;
  employeeCount: number;
}

interface DepartmentsListProps {
  departments: Department[];
}

const DepartmentsList: React.FC<DepartmentsListProps> = ({ departments }) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    manager: ''
  });
  
  const handleNewDepartment = () => {
    setEditingDepartment(null);
    setFormData({ name: '', manager: '' });
    setIsDialogOpen(true);
  };
  
  const handleEditDepartment = (dept: Department) => {
    setEditingDepartment(dept);
    setFormData({ name: dept.name, manager: dept.manager });
    setIsDialogOpen(true);
  };
  
  const handleSave = () => {
    if (editingDepartment) {
      toast({
        title: "Département modifié",
        description: `Le département ${formData.name} a été modifié avec succès.`
      });
    } else {
      toast({
        title: "Département créé",
        description: `Le département ${formData.name} a été créé avec succès.`
      });
    }
    setIsDialogOpen(false);
  };
  
  const handleDeleteDepartment = (dept: Department) => {
    toast({
      title: "Département supprimé",
      description: `Le département ${dept.name} a été supprimé avec succès.`,
      variant: "destructive"
    });
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <div className="text-sm text-muted-foreground">
          {departments.length} départements au total
        </div>
        <Button onClick={handleNewDepartment}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau département
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom du département</TableHead>
              <TableHead>Responsable</TableHead>
              <TableHead className="text-center">Membres</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((dept) => (
              <TableRow key={dept.id}>
                <TableCell className="font-medium">{dept.name}</TableCell>
                <TableCell>{dept.manager}</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {dept.employeeCount}
                  </div>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleEditDepartment(dept)}
                  >
                    <PenSquare className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteDepartment(dept)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDepartment ? 'Modifier le département' : 'Nouveau département'}</DialogTitle>
            <DialogDescription>
              {editingDepartment 
                ? 'Modifiez les détails du département existant.' 
                : 'Créez un nouveau département dans votre organisation.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom du département</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="manager">Responsable</Label>
              <Input 
                id="manager" 
                value={formData.manager} 
                onChange={(e) => setFormData({...formData, manager: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave}>{editingDepartment ? 'Enregistrer' : 'Créer'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DepartmentsList;
