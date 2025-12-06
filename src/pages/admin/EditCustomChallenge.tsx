import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useCustomChallenges } from '@/hooks/useCustomChallenges';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

type RewardValueState = {
  points?: string;
  badgeId?: string;
  days?: string;
  avatarId?: string;
  themeId?: string;
};

interface FormState {
  title: string;
  description: string;
  type: string;
  objective: string;
  target_value: number;
  reward_type: string;
  reward_value: RewardValueState | Record<string, never>;
  emotional_profile: string;
  is_active: boolean;
  start_date: string;
  end_date: string;
}

const defaultFormState: FormState = {
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
};

const formatDateValue = (value?: string | null) => {
  if (!value) return '';
  if (value.length === 10) return value;
  return value.split('T')[0] ?? '';
};

const mapRewardValue = (type: string, value: any): RewardValueState | Record<string, never> => {
  if (!value) {
    return {};
  }

  if (type === 'points') {
    return { points: value.points ? String(value.points) : '' };
  }

  if (type === 'premium_access') {
    return { days: value.days ? String(value.days) : '' };
  }

  if (type === 'badge') {
    return { badgeId: value.badgeId ? String(value.badgeId) : '' };
  }

  if (type === 'avatar_unlock') {
    return { avatarId: value.avatarId ? String(value.avatarId) : '' };
  }

  if (type === 'theme_unlock') {
    return { themeId: value.themeId ? String(value.themeId) : '' };
  }

  return {};
};

const EditCustomChallenge = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { challenges, loading: loadingChallenges, updateChallenge } = useCustomChallenges();
  const [formData, setFormData] = useState<FormState>(defaultFormState);
  const [saving, setSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const currentChallenge = useMemo(
    () => challenges.find((challenge) => challenge.id === id),
    [challenges, id]
  );

  useEffect(() => {
    if (!loadingChallenges && !initialized) {
      if (!id) {
        toast.error('Identifiant du défi manquant');
        setNotFound(true);
        setInitialized(true);
        return;
      }

      if (currentChallenge) {
        setFormData({
          title: currentChallenge.title ?? '',
          description: currentChallenge.description ?? '',
          type: currentChallenge.type ?? 'visit',
          objective: currentChallenge.objective ?? '',
          target_value: currentChallenge.target_value ?? 1,
          reward_type: currentChallenge.reward_type ?? 'points',
          reward_value: mapRewardValue(currentChallenge.reward_type, currentChallenge.reward_value),
          emotional_profile: currentChallenge.emotional_profile ?? 'all',
          is_active: currentChallenge.is_active ?? true,
          start_date: formatDateValue(currentChallenge.start_date),
          end_date: formatDateValue(currentChallenge.end_date),
        });
        setInitialized(true);
      } else {
        setNotFound(true);
        setInitialized(true);
      }
    }
  }, [loadingChallenges, initialized, id, currentChallenge]);

  useEffect(() => {
    if (notFound && id) {
      toast.error('Défi personnalisé introuvable');
    }
  }, [notFound, id]);

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('Le titre est requis');
      return false;
    }

    if (!formData.objective.trim()) {
      toast.error("L'objectif est requis");
      return false;
    }

    if (!formData.type) {
      toast.error('Le type de défi est requis');
      return false;
    }

    if (!formData.emotional_profile) {
      toast.error('Le profil émotionnel est requis');
      return false;
    }

    if (!formData.target_value || formData.target_value < 1) {
      toast.error("La valeur cible doit être supérieure ou égale à 1");
      return false;
    }

    if (formData.reward_type === 'points' && !(formData.reward_value as RewardValueState).points) {
      toast.error('Veuillez indiquer le nombre de points de récompense');
      return false;
    }

    if (formData.reward_type === 'premium_access' && !(formData.reward_value as RewardValueState).days) {
      toast.error('Veuillez indiquer la durée de l\'accès premium');
      return false;
    }

    if (
      (formData.reward_type === 'badge' || formData.reward_type === 'avatar_unlock' || formData.reward_type === 'theme_unlock') &&
      !((formData.reward_value as RewardValueState).badgeId ||
        (formData.reward_value as RewardValueState).avatarId ||
        (formData.reward_value as RewardValueState).themeId)
    ) {
      toast.error('Veuillez renseigner la récompense associée');
      return false;
    }

    if (formData.start_date && formData.end_date && formData.start_date > formData.end_date) {
      toast.error('La date de début doit précéder la date de fin');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      toast.error('Identifiant de défi invalide');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      let rewardValue: Record<string, any> = {};

      if (formData.reward_type === 'points') {
        rewardValue = { points: parseInt((formData.reward_value as RewardValueState).points || '0', 10) };
      } else if (formData.reward_type === 'badge') {
        rewardValue = { badgeId: (formData.reward_value as RewardValueState).badgeId || 'custom_badge' };
      } else if (formData.reward_type === 'premium_access') {
        rewardValue = { days: parseInt((formData.reward_value as RewardValueState).days || '0', 10) };
      } else if (formData.reward_type === 'avatar_unlock') {
        rewardValue = { avatarId: (formData.reward_value as RewardValueState).avatarId || 'custom_avatar' };
      } else if (formData.reward_type === 'theme_unlock') {
        rewardValue = { themeId: (formData.reward_value as RewardValueState).themeId || 'custom_theme' };
      }

      const success = await updateChallenge(id, {
        ...formData,
        reward_value: rewardValue,
      });

      if (success) {
        navigate('/app/admin/challenges');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loadingChallenges && !initialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Défi introuvable</CardTitle>
            <CardDescription>Le défi que vous tentez de modifier n'existe plus.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/app/admin/challenges')}>Revenir à la liste des défis</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Modifier le défi</h1>
          <p className="text-muted-foreground">Ajustez les informations de votre défi personnalisé</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informations du défi</CardTitle>
            <CardDescription>Mettez à jour les paramètres du défi personnalisé</CardDescription>
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
                  onChange={(e) => setFormData({ ...formData, target_value: parseInt(e.target.value || '0', 10) })}
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
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      reward_type: value,
                      reward_value: {},
                    })
                  }
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
                    value={(formData.reward_value as RewardValueState).points || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reward_value: { points: e.target.value },
                      })
                    }
                  />
                )}
                {formData.reward_type === 'premium_access' && (
                  <Input
                    id="reward_config"
                    type="number"
                    placeholder="Nombre de jours"
                    value={(formData.reward_value as RewardValueState).days || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reward_value: { days: e.target.value },
                      })
                    }
                  />
                )}
                {(formData.reward_type === 'badge' ||
                  formData.reward_type === 'avatar_unlock' ||
                  formData.reward_type === 'theme_unlock') && (
                  <Input
                    id="reward_config"
                    placeholder="ID de la récompense"
                    value={
                      (formData.reward_value as RewardValueState).badgeId ||
                      (formData.reward_value as RewardValueState).avatarId ||
                      (formData.reward_value as RewardValueState).themeId ||
                      ''
                    }
                    onChange={(e) => {
                      const key =
                        formData.reward_type === 'badge'
                          ? 'badgeId'
                          : formData.reward_type === 'avatar_unlock'
                            ? 'avatarId'
                            : 'themeId';

                      setFormData({
                        ...formData,
                        reward_value: { [key]: e.target.value },
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

              <div className="flex items-center justify-between md:col-span-2 rounded-lg border p-4">
                <div>
                  <Label htmlFor="is_active" className="font-semibold">
                    Défi actif
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Activez ou désactivez le défi pour les participants
                  </p>
                </div>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={saving}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default EditCustomChallenge;
