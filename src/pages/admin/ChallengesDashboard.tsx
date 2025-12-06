import React, { useState } from 'react';
import { useCustomChallenges } from '@/hooks/useCustomChallenges';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Loader2, Edit, Trash2, Search, TrendingUp, Users, Award, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const ChallengesDashboard: React.FC = () => {
  const { challenges, loading, updateChallenge, deleteChallenge } = useCustomChallenges();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const navigate = useNavigate();

  const filteredChallenges = challenges.filter(challenge =>
    challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    challenge.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleActive = async (id: string, currentState: boolean) => {
    await updateChallenge(id, { is_active: !currentState });
  };

  const handleBulkActivate = async (activate: boolean) => {
    for (const id of selectedChallenges) {
      await updateChallenge(id, { is_active: activate });
    }
    setSelectedChallenges([]);
    toast.success(`${selectedChallenges.length} défi(s) ${activate ? 'activé(s)' : 'désactivé(s)'}`);
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Supprimer ${selectedChallenges.length} défi(s) ?`)) return;
    
    for (const id of selectedChallenges) {
      await deleteChallenge(id);
    }
    setSelectedChallenges([]);
  };

  const handleSelectAll = () => {
    if (selectedChallenges.length === filteredChallenges.length) {
      setSelectedChallenges([]);
    } else {
      setSelectedChallenges(filteredChallenges.map(c => c.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedChallenges(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const stats = {
    totalChallenges: challenges.length,
    activeChallenges: challenges.filter(c => c.is_active).length,
    avgCompletionRate: 67,
    totalParticipants: 234,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Défis</h1>
          <p className="text-muted-foreground">Gérez tous vos défis personnalisés</p>
        </div>
        <Button onClick={() => navigate('/admin/challenges/create')}>
          Créer un Défi
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Défis</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalChallenges}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actifs</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeChallenges}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Moyen</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgCompletionRate}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalParticipants}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Rechercher un défi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {selectedChallenges.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedChallenges.length} sélectionné(s)
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkActivate(true)}
                >
                  Activer
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkActivate(false)}
                >
                  Désactiver
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  Supprimer
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 pb-2 border-b border-border">
              <input
                type="checkbox"
                checked={selectedChallenges.length === filteredChallenges.length && filteredChallenges.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-border"
              />
              <span className="text-sm font-medium">Tout sélectionner</span>
            </div>

            {filteredChallenges.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Aucun défi trouvé</p>
            ) : (
              filteredChallenges.map((challenge) => (
                <motion.div
                  key={challenge.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedChallenges.includes(challenge.id)}
                    onChange={() => toggleSelect(challenge.id)}
                    className="w-4 h-4 rounded border-border"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{challenge.title}</h3>
                      <Badge variant={challenge.is_active ? 'default' : 'secondary'}>
                        {challenge.is_active ? 'Actif' : 'Inactif'}
                      </Badge>
                      <Badge variant="outline">{challenge.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {challenge.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Objectif: {challenge.target_value}</span>
                      <span>Récompense: {challenge.reward_type}</span>
                      <span>Profil: {challenge.emotional_profile}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={challenge.is_active}
                      onCheckedChange={() => handleToggleActive(challenge.id, challenge.is_active)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/admin/challenges/edit/${challenge.id}`)}
                      aria-label="Modifier le défi"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm('Supprimer ce défi ?')) {
                          deleteChallenge(challenge.id);
                        }
                      }}
                      aria-label="Supprimer le défi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChallengesDashboard;