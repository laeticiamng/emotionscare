import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCustomChallenges } from '@/hooks/useCustomChallenges';
import { ArrowLeft, Plus } from 'lucide-react';
import { toast } from 'sonner';

const CreateCustomChallenge = () => {
  const navigate = useNavigate();
  const { createChallenge } = useCustomChallenges();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    type: string;
    objective: string;
    target_value: number;
    reward_type: string;
    reward_value: any;
    emotional_profile: string;
    is_active: boolean;
    start_date: string;
    end_date: string;
  }>({
    title: '',
    description: '',
    type: 'visit',
    objective: '',
    target_value: 1,
    reward_type: 'points',
    reward_value: { points: '100' },
    emotional_profile: 'all',
    is_active: true,
    start_date: '',
    end_date: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let rewardValue = {};
      
      if (formData.reward_type === 'points') {
        rewardValue = { points: parseInt((formData.reward_value as any).points || '100') };
      } else if (formData.reward_type === 'badge') {
        rewardValue = { badgeId: (formData.reward_value as any).badgeId || 'custom_badge' };
      } else if (formData.reward_type === 'premium_access') {
        rewardValue = { days: parseInt((formData.reward_value as any).days || '7') };
      } else if (formData.reward_type === 'avatar_unlock') {
        rewardValue = { avatarId: (formData.reward_value as any).avatarId || 'custom_avatar' };
      } else if (formData.reward_type === 'theme_unlock') {
        rewardValue = { themeId: (formData.reward_value as any).themeId || 'custom_theme' };
      }

      const result = await createChallenge({
        ...formData,
        reward_value: rewardValue,
      });

      if (result) {
        toast.success('Défi créé avec succès !');
        navigate('/admin/challenges');
      }
    } catch (error) {
      console.error('Error creating challenge:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Créer un défi personnalisé</h1>
          <p className="text-muted-foreground">Définissez un nouveau défi avec récompenses</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informations du défi</CardTitle>
            <CardDescription>
              Configurez les paramètres du défi personnalisé
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Complète 5 sessions de méditation"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type de défi *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visit">Visite</SelectItem>
                    <SelectItem value="streak">Série</SelectItem>
                    <SelectItem value="time_spent">Temps passé</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="custom">Personnalisé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Décrivez le défi en détail..."
                  rows={3}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="objective">Objectif *</Label>
                <Input
                  id="objective"
                  value={formData.objective}
                  onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                  placeholder="Ex: Médite 5 fois dans la semaine"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target_value">Valeur cible</Label>
                <Input
                  id="target_value"
                  type="number"
                  value={formData.target_value}
                  onChange={(e) => setFormData({ ...formData, target_value: parseInt(e.target.value) })}
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emotional_profile">Profil émotionnel *</Label>
                <Select
                  value={formData.emotional_profile}
                  onValueChange={(value) => setFormData({ ...formData, emotional_profile: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="stress">Stress</SelectItem>
                    <SelectItem value="calm">Calme</SelectItem>
                    <SelectItem value="energy">Énergie</SelectItem>
                    <SelectItem value="creativity">Créativité</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reward_type">Type de récompense *</Label>
                <Select
                  value={formData.reward_type}
                  onValueChange={(value) => setFormData({ ...formData, reward_type: value, reward_value: {} })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="points">Points bonus</SelectItem>
                    <SelectItem value="badge">Badge</SelectItem>
                    <SelectItem value="premium_access">Accès premium temporaire</SelectItem>
                    <SelectItem value="avatar_unlock">Avatar exclusif</SelectItem>
                    <SelectItem value="theme_unlock">Thème débloqué</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reward_config">Configuration récompense</Label>
                {formData.reward_type === 'points' && (
                  <Input
                    id="reward_config"
                    type="number"
                    placeholder="Nombre de points"
                    value={(formData.reward_value as any).points || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      reward_value: { points: e.target.value }
                    })}
                  />
                )}
                {formData.reward_type === 'premium_access' && (
                  <Input
                    id="reward_config"
                    type="number"
                    placeholder="Nombre de jours"
                    value={(formData.reward_value as any).days || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      reward_value: { days: e.target.value }
                    })}
                  />
                )}
                {(formData.reward_type === 'badge' || formData.reward_type === 'avatar_unlock' || formData.reward_type === 'theme_unlock') && (
                  <Input
                    id="reward_config"
                    placeholder="ID de la récompense"
                    value={
                      (formData.reward_value as any).badgeId || 
                      (formData.reward_value as any).avatarId || 
                      (formData.reward_value as any).themeId || 
                      ''
                    }
                    onChange={(e) => {
                      const key = formData.reward_type === 'badge' ? 'badgeId' : 
                                  formData.reward_type === 'avatar_unlock' ? 'avatarId' : 'themeId';
                      setFormData({ 
                        ...formData, 
                        reward_value: { [key]: e.target.value }
                      });
                    }}
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="start_date">Date de début</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">Date de fin</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                <Plus className="h-4 w-4 mr-2" />
                {loading ? 'Création...' : 'Créer le défi'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default CreateCustomChallenge;
