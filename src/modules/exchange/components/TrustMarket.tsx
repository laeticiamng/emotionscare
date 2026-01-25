/**
 * Trust Market - Exchange and invest trust
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Users, 
  TrendingUp,
  Award,
  Star,
  Heart,
  Plus,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTrustProfile, useTrustProjects, useGiveTrust, useCreateTrustProject, useTrustLeaderboard } from '../hooks/useExchangeData';
import type { TrustLevel } from '../types';
import { toast } from 'sonner';

const levelColors: Record<TrustLevel, string> = {
  newcomer: 'from-gray-400 to-gray-500',
  trusted: 'from-blue-400 to-blue-500',
  verified: 'from-emerald-400 to-emerald-500',
  expert: 'from-purple-400 to-purple-500',
  legend: 'from-amber-400 to-amber-500',
};

const levelLabels: Record<TrustLevel, string> = {
  newcomer: 'Nouveau',
  trusted: 'Fiable',
  verified: 'Vérifié',
  expert: 'Expert',
  legend: 'Légende',
};

const projectCategories = [
  { value: 'wellness', label: 'Bien-être' },
  { value: 'education', label: 'Éducation' },
  { value: 'community', label: 'Communauté' },
  { value: 'health', label: 'Santé' },
  { value: 'environment', label: 'Environnement' },
  { value: 'innovation', label: 'Innovation' },
];

const TrustMarket: React.FC = () => {
  const { data: profile } = useTrustProfile();
  const { data: projects, isLoading: projectsLoading } = useTrustProjects();
  const { data: leaderboard, isLoading: leaderboardLoading } = useTrustLeaderboard();
  const giveTrust = useGiveTrust();
  const createProject = useCreateTrustProject();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [trustAmount, setTrustAmount] = useState(10);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    category: '',
  });

  const handleGiveTrust = async (projectId: string) => {
    try {
      await giveTrust.mutateAsync({
        toProjectId: projectId,
        amount: trustAmount,
        reason: 'Support du projet',
      });
      toast.success(`${trustAmount} points de confiance donnés !`);
      setSelectedProject(null);
    } catch (error) {
      toast.error('Erreur lors du don de confiance');
    }
  };

  const handleCreateProject = async () => {
    if (!newProject.title || !newProject.category) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }

    try {
      await createProject.mutateAsync(newProject);
      toast.success('Projet créé avec succès !');
      setIsProjectDialogOpen(false);
      setNewProject({ title: '', description: '', category: '' });
    } catch (error) {
      toast.error('Erreur lors de la création du projet');
    }
  };

  const trustScore = profile?.trust_score || 50;
  const level = (profile?.level as TrustLevel) || 'newcomer';
  const levelProgress = (trustScore % 20) * 5; // Progress to next level

  return (
    <div className="space-y-8">
      {/* Market Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-500" aria-hidden="true" />
            Trust Market
          </h2>
          <p className="text-muted-foreground">
            Échangez et investissez votre confiance
          </p>
        </div>
      </div>

      {/* User Trust Profile */}
      <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Trust Score */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <div className="w-28 h-28 rounded-full bg-background flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-3xl font-bold">{trustScore}</span>
                    <p className="text-xs text-muted-foreground">Trust Score</p>
                  </div>
                </div>
              </div>
              <Badge 
                className={`absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r ${levelColors[level]}`}
              >
                {levelLabels[level]}
              </Badge>
            </div>

            {/* Stats */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-card/50 rounded-lg">
                <Heart className="w-5 h-5 mx-auto mb-2 text-rose-500" aria-hidden="true" />
                <p className="text-2xl font-bold">{profile?.total_given || 0}</p>
                <p className="text-xs text-muted-foreground">Donné</p>
              </div>
              <div className="text-center p-4 bg-card/50 rounded-lg">
                <Star className="w-5 h-5 mx-auto mb-2 text-amber-500" aria-hidden="true" />
                <p className="text-2xl font-bold">{profile?.total_received || 0}</p>
                <p className="text-xs text-muted-foreground">Reçu</p>
              </div>
              <div className="text-center p-4 bg-card/50 rounded-lg">
                <CheckCircle className="w-5 h-5 mx-auto mb-2 text-emerald-500" aria-hidden="true" />
                <p className="text-2xl font-bold">{profile?.verified_actions || 0}</p>
                <p className="text-xs text-muted-foreground">Actions vérifiées</p>
              </div>
              <div className="text-center p-4 bg-card/50 rounded-lg">
                <Award className="w-5 h-5 mx-auto mb-2 text-purple-500" aria-hidden="true" />
                <p className="text-2xl font-bold">{profile?.badges?.length || 0}</p>
                <p className="text-xs text-muted-foreground">Badges</p>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progression vers le niveau suivant</span>
              <span>{levelProgress}%</span>
            </div>
            <Progress value={levelProgress} className="h-2" aria-label={`Progression: ${levelProgress}%`} />
          </div>
        </CardContent>
      </Card>

      {/* Trust Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Projets à soutenir</h3>
          <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                Créer un projet
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un projet de confiance</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="project-title">Titre du projet</Label>
                  <Input
                    id="project-title"
                    value={newProject.title}
                    onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ex: Programme de bien-être communautaire"
                  />
                </div>
                <div>
                  <Label htmlFor="project-category">Catégorie</Label>
                  <Select
                    value={newProject.category}
                    onValueChange={(v) => setNewProject(prev => ({ ...prev, category: v }))}
                  >
                    <SelectTrigger id="project-category">
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectCategories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="project-description">Description (optionnel)</Label>
                  <Textarea
                    id="project-description"
                    value={newProject.description}
                    onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Décrivez votre projet..."
                  />
                </div>
                <Button 
                  onClick={handleCreateProject}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600"
                  disabled={createProject.isPending}
                >
                  {createProject.isPending ? 'Création...' : 'Créer le projet'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {projectsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="h-48" />
              </Card>
            ))}
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{project.title}</CardTitle>
                        <Badge variant="outline" className="mt-1 capitalize">
                          {project.category}
                        </Badge>
                      </div>
                      {project.verified && (
                        <CheckCircle className="w-5 h-5 text-emerald-500" aria-label="Projet vérifié" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {project.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {project.description}
                      </p>
                    )}
                    
                    {/* Trust Pool */}
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="text-xs text-muted-foreground">Pool de confiance</p>
                        <p className="text-xl font-bold">{project.trust_pool}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Supporters</p>
                        <p className="font-semibold flex items-center gap-1">
                          <Users className="w-4 h-4" aria-hidden="true" />
                          {project.backers_count}
                        </p>
                      </div>
                    </div>

                    {/* Give Trust */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600"
                          aria-label={`Donner de la confiance au projet ${project.title}`}
                        >
                          <Heart className="w-4 h-4 mr-2" aria-hidden="true" />
                          Donner ma confiance
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Soutenir "{project.title}"</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div>
                            <Label htmlFor="trust-amount">Montant de confiance</Label>
                            <Input
                              id="trust-amount"
                              type="number"
                              value={trustAmount}
                              onChange={(e) => setTrustAmount(parseInt(e.target.value) || 0)}
                              min={1}
                              max={100}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Votre score actuel: {trustScore}
                            </p>
                          </div>
                          <Button 
                            onClick={() => handleGiveTrust(project.id)}
                            className="w-full"
                            disabled={giveTrust.isPending || trustAmount > trustScore}
                          >
                            {giveTrust.isPending ? 'Envoi...' : `Donner ${trustAmount} points`}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" aria-hidden="true" />
            <h3 className="font-semibold mb-2">Aucun projet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Soyez le premier à créer un projet de confiance
            </p>
            <Button onClick={() => setIsProjectDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
              Créer un projet
            </Button>
          </Card>
        )}
      </div>

      {/* Trust Leaderboard Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" aria-hidden="true" />
            Top Contributeurs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboardLoading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted/30 rounded-lg animate-pulse" />
              ))
            ) : leaderboard && leaderboard.length > 0 ? (
              leaderboard.map((entry: any, index: number) => {
                const rank = index + 1;
                const userLevel = entry.level as TrustLevel || 'trusted';
                return (
                  <div 
                    key={entry.id}
                    className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg"
                  >
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      rank === 1 ? 'bg-amber-500 text-white' :
                      rank === 2 ? 'bg-gray-400 text-white' :
                      rank === 3 ? 'bg-amber-700 text-white' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {rank}
                    </span>
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>{entry.user_id?.slice(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">Utilisateur</p>
                      <p className="text-xs text-muted-foreground">{levelLabels[userLevel]}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{entry.trust_score || 0}</p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </div>
                );
              })
            ) : (
              // Fallback mock data
              [...Array(5)].map((_, rank) => (
                <div 
                  key={rank}
                  className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg"
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    rank === 0 ? 'bg-amber-500 text-white' :
                    rank === 1 ? 'bg-gray-400 text-white' :
                    rank === 2 ? 'bg-amber-700 text-white' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {rank + 1}
                  </span>
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>U{rank + 1}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">Utilisateur #{rank + 1}</p>
                    <p className="text-xs text-muted-foreground">Niveau Expert</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{1000 - rank * 100}</p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrustMarket;
