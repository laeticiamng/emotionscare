import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Users, Plus, Edit, Trash2, Award, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  skills: string[] | string;
  specializations: string[];
  max_concurrent_tickets: number;
  performance_score: number;
  current_workload?: number;
  is_active: boolean;
}

const TeamMemberSkillsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: [] as string[],
    specializations: [] as string[],
    max_concurrent_tickets: 5,
    performance_score: 0.80,
    is_active: true
  });

  const [skillInput, setSkillInput] = useState('');
  const [specializationInput, setSpecializationInput] = useState('');

  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ['team-member-skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_member_skills')
        .select('*')
        .order('performance_score', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: autoDetectedSkills } = useQuery({
    queryKey: ['auto-detected-skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('auto_detected_skills')
        .select('*, team_member_skills(name)')
        .eq('approved', false)
        .order('confidence_score', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('team_member_skills')
        .insert({
          ...data,
          skills: JSON.stringify(data.skills)
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-member-skills'] });
      toast.success('Membre ajouté avec succès');
      resetForm();
    },
    onError: (error) => {
      logger.error('Create member error:', error, 'PAGE');
      toast.error('Erreur lors de l\'ajout');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<typeof formData> }) => {
      const { error } = await supabase
        .from('team_member_skills')
        .update({
          ...data,
          skills: data.skills ? JSON.stringify(data.skills) : undefined
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-member-skills'] });
      toast.success('Membre mis à jour');
      resetForm();
    },
    onError: (error) => {
      logger.error('Update member error:', error, 'PAGE');
      toast.error('Erreur lors de la mise à jour');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('team_member_skills')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-member-skills'] });
      toast.success('Membre supprimé');
    },
    onError: (error) => {
      logger.error('Delete member error:', error, 'PAGE');
      toast.error('Erreur lors de la suppression');
    }
  });

  const approveSkillMutation = useMutation({
    mutationFn: async (skillId: string) => {
      const { error } = await supabase
        .from('auto_detected_skills')
        .update({ approved: true })
        .eq('id', skillId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auto-detected-skills'] });
      toast.success('Compétence approuvée');
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      skills: [],
      specializations: [],
      max_concurrent_tickets: 5,
      performance_score: 0.80,
      is_active: true
    });
    setSkillInput('');
    setSpecializationInput('');
    setEditingMember(null);
    setIsDialogOpen(false);
  };

  const handleSubmit = () => {
    if (editingMember) {
      updateMutation.mutate({ id: editingMember.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    let parsedSkills: string[] = [];

    if (Array.isArray(member.skills)) {
      parsedSkills = member.skills;
    } else if (typeof member.skills === 'string') {
      try {
        parsedSkills = JSON.parse(member.skills);
      } catch (error) {
        logger.error('Failed to parse member skills', error as Error, 'UI');
        parsedSkills = [];
      }
    }

    setFormData({
      ...member,
      skills: parsedSkills
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (memberId: string) => {
    setMemberToDelete(memberId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (memberToDelete) {
      deleteMutation.mutate(memberToDelete);
      setDeleteDialogOpen(false);
      setMemberToDelete(null);
    }
  };

  const addSkill = () => {
    if (skillInput && !formData.skills.includes(skillInput)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, skillInput] }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const addSpecialization = () => {
    if (specializationInput && !formData.specializations.includes(specializationInput)) {
      setFormData(prev => ({ ...prev, specializations: [...prev.specializations, specializationInput] }));
      setSpecializationInput('');
    }
  };

  const removeSpecialization = (spec: string) => {
    setFormData(prev => ({ ...prev, specializations: prev.specializations.filter(s => s !== spec) }));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            Compétences de l'Équipe
          </h1>
          <p className="text-muted-foreground">
            Gérez les compétences et disponibilités des membres pour optimiser l'assignation ML
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un membre
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMember ? 'Modifier le membre' : 'Nouveau membre d\'équipe'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Alice Martin"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="alice@company.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Compétences (Skills)</Label>
                <div className="flex gap-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    placeholder="Ex: database, backend, api..."
                  />
                  <Button type="button" onClick={addSkill}>Ajouter</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="cursor-pointer" onClick={() => removeSkill(skill)}>
                      {skill} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Spécialisations</Label>
                <div className="flex gap-2">
                  <Input
                    value={specializationInput}
                    onChange={(e) => setSpecializationInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSpecialization()}
                    placeholder="Ex: PostgreSQL, Node.js..."
                  />
                  <Button type="button" onClick={addSpecialization}>Ajouter</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.specializations.map(spec => (
                    <Badge key={spec} variant="outline" className="cursor-pointer" onClick={() => removeSpecialization(spec)}>
                      {spec} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="max_tickets">Tickets max simultanés</Label>
                  <Input
                    id="max_tickets"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.max_concurrent_tickets}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_concurrent_tickets: parseInt(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="performance">Score de performance (0-1)</Label>
                  <Input
                    id="performance"
                    type="number"
                    min="0"
                    max="1"
                    step="0.05"
                    value={formData.performance_score}
                    onChange={(e) => setFormData(prev => ({ ...prev, performance_score: parseFloat(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">Membre actif</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingMember ? 'Mettre à jour' : 'Créer'}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Annuler
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Team Members Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-6">Chargement...</CardContent>
          </Card>
        ) : !teamMembers || teamMembers.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-6">
              Aucun membre configuré. Ajoutez votre premier membre d'équipe.
            </CardContent>
          </Card>
        ) : (
          teamMembers.map((member) => {
            let skills: string[] = [];
            if (Array.isArray(member.skills)) {
              skills = member.skills;
            } else if (typeof member.skills === 'string') {
              try {
                skills = JSON.parse(member.skills);
              } catch (error) {
                logger.error('Failed to parse member skills for display', error as Error, 'UI');
                skills = [];
              }
            }
            return (
              <Card key={member.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <CardDescription className="text-xs">{member.email}</CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(member)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteClick(member.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Performance</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-primary" />
                      <span className="font-semibold">{(member.performance_score * 100).toFixed(0)}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Charge actuelle</span>
                    <span className="font-semibold">{member.current_workload}/{member.max_concurrent_tickets}</span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Compétences:</p>
                    <div className="flex flex-wrap gap-1">
                      {skills.map((skill: string) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {member.specializations && member.specializations.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Spécialisations:</p>
                      <div className="flex flex-wrap gap-1">
                        {member.specializations.map((spec: string) => (
                          <Badge key={spec} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Badge variant={member.is_active ? 'default' : 'secondary'} className="w-full justify-center">
                    {member.is_active ? 'Actif' : 'Inactif'}
                  </Badge>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Auto-detected Skills */}
      {autoDetectedSkills && autoDetectedSkills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Compétences Détectées par ML
            </CardTitle>
            <CardDescription>
              Le système a automatiquement identifié de nouvelles compétences basées sur l'historique des tickets résolus
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {autoDetectedSkills.map((skill) => (
                <div key={skill.id} className="p-3 border rounded-lg flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-semibold text-sm">
                      {skill.team_member_skills?.name} • <span className="text-primary">{skill.skill_name}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Confiance: {(skill.confidence_score * 100).toFixed(0)}% • Source: {skill.detection_source}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => approveSkillMutation.mutate(skill.id)}
                    disabled={approveSkillMutation.isPending}
                  >
                    Approuver
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce membre de l'équipe ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMemberToDelete(null)}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TeamMemberSkillsPage;
