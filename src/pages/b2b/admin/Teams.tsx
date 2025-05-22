import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { teamService } from '@/services/teamService';
import { TeamSummary } from '@/types/dashboard';
import { useToast } from '@/hooks/use-toast';

const B2BAdminTeams: React.FC = () => {
  const [teams, setTeams] = useState<TeamSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState('');
  const { toast } = useToast();

  const loadTeams = async () => {
    setLoading(true);
    try {
      const data = await teamService.listTeams();
      setTeams(data);
    } catch (e: any) {
      console.error(e);
      toast({ title: 'Erreur', description: "Impossible de charger les équipes", variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const addTeam = async () => {
    if (!newName) return;
    try {
      const team = await teamService.createTeam(newName);
      setTeams((t) => [...t, team]);
      setNewName('');
    } catch (e: any) {
      console.error(e);
      toast({ title: 'Erreur', description: "Création d'équipe échouée", variant: 'destructive' });
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  return (
    <div className="container mx-auto py-6 space-y-4">
      <h1 className="text-3xl font-bold">Gestion des Équipes</h1>
      <div className="flex gap-2">
        <Input placeholder="Nouvelle équipe" value={newName} onChange={(e) => setNewName(e.target.value)} />
        <Button onClick={addTeam}>Ajouter</Button>
        <Button variant="outline" onClick={loadTeams} disabled={loading}>Rafraîchir</Button>
      </div>
      <div className="mt-4">
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left">ID</th>
                <th className="text-left">Nom</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team.id} className="border-t">
                  <td>{team.id}</td>
                  <td>{team.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default B2BAdminTeams;
