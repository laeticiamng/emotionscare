import React, { useState, useEffect } from 'react';
import { Trophy, Target, Plus, Star, Crown, Flame, Heart, Zap, Award, CheckCircle2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Ambition {
  id: string;
  title: string;
  description: string;
  category: 'personnel' | 'santé' | 'carrière' | 'créatif' | 'social';
  status: 'en-cours' | 'excellent' | 'en-pause';
  createdAt: Date;
  completedMilestones: number;
  totalMilestones: number;
  badges: Badge[];
  lastActivity: Date;
}

interface Badge {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  unlockedAt?: Date;
}

const AmbitionArcadePage = () => {
  const [ambitions, setAmbitions] = useState<Ambition[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('tous');
  const [newAmbitionDialog, setNewAmbitionDialog] = useState(false);
  const [newAmbition, setNewAmbition] = useState({ title: '', description: '', category: 'personnel' });
  const [recentBadge, setRecentBadge] = useState<Badge | null>(null);

  const categories = {
    tous: { label: 'Tous', icon: Target, color: 'from-slate-500 to-slate-600' },
    personnel: { label: 'Personnel', icon: Heart, color: 'from-pink-500 to-rose-500' },
    santé: { label: 'Santé', icon: Zap, color: 'from-green-500 to-emerald-500' },
    carrière: { label: 'Carrière', icon: Trophy, color: 'from-blue-500 to-indigo-500' },
    créatif: { label: 'Créatif', icon: Star, color: 'from-purple-500 to-violet-500' },
    social: { label: 'Social', icon: Crown, color: 'from-orange-500 to-amber-500' }
  };

  const availableBadges: Badge[] = [
    { id: 'starter', name: 'Explorateur', icon: Target, color: 'bg-blue-500', description: 'Premier objectif créé' },
    { id: 'persistent', name: 'Persévérant', icon: Flame, color: 'bg-orange-500', description: '7 jours consécutifs d\'activité' },
    { id: 'achiever', name: 'Accomplisseur', icon: Trophy, color: 'bg-yellow-500', description: 'Premier objectif complété' },
    { id: 'diverse', name: 'Polyvalent', icon: Star, color: 'bg-purple-500', description: 'Objectifs dans 3 catégories' },
    { id: 'focused', name: 'Déterminé', icon: Crown, color: 'bg-red-500', description: '5 objectifs en excellence' },
    { id: 'social', name: 'Solidaire', icon: Heart, color: 'bg-pink-500', description: 'Objectifs sociaux actifs' }
  ];

  // Charger les ambitions depuis localStorage
  useEffect(() => {
    const savedAmbitions = localStorage.getItem('ambitions');
    if (savedAmbitions) {
      const parsed = JSON.parse(savedAmbitions).map((amb: any) => ({
        ...amb,
        createdAt: new Date(amb.createdAt),
        lastActivity: new Date(amb.lastActivity)
      }));
      setAmbitions(parsed);
    }
  }, []);

  // Sauvegarder les ambitions
  const saveAmbitions = (newAmbitions: Ambition[]) => {
    localStorage.setItem('ambitions', JSON.stringify(newAmbitions));
    setAmbitions(newAmbitions);
  };

  const createAmbition = () => {
    if (!newAmbition.title.trim()) {
      toast.error('Le titre est requis');
      return;
    }

    const ambition: Ambition = {
      id: Date.now().toString(),
      title: newAmbition.title,
      description: newAmbition.description,
      category: newAmbition.category as any,
      status: 'en-cours',
      createdAt: new Date(),
      completedMilestones: 0,
      totalMilestones: Math.floor(Math.random() * 5) + 3, // 3-7 étapes
      badges: [],
      lastActivity: new Date()
    };

    const updatedAmbitions = [...ambitions, ambition];
    saveAmbitions(updatedAmbitions);

    // Débloquer badge starter
    if (ambitions.length === 0) {
      unlockBadge('starter');
    }

    toast.success('Objectif ajouté avec succès !', {
      description: `"${ambition.title}" est maintenant dans votre arcade`,
      duration: 3000
    });

    setNewAmbition({ title: '', description: '', category: 'personnel' });
    setNewAmbitionDialog(false);
  };

  const updateAmbitionStatus = (id: string, newStatus: Ambition['status']) => {
    const updatedAmbitions = ambitions.map(amb => 
      amb.id === id 
        ? { ...amb, status: newStatus, lastActivity: new Date() }
        : amb
    );
    saveAmbitions(updatedAmbitions);

    const statusMessages = {
      'en-cours': 'Objectif remis en route ! 🚀',
      'excellent': 'Excellent progrès ! Continue comme ça ! ⭐',
      'en-pause': 'Pause accordée, tu reviendras plus fort ! 💪'
    };

    toast.success(statusMessages[newStatus]);

    // Vérifier les badges
    checkBadges(updatedAmbitions);
  };

  const progressMilestone = (id: string) => {
    const updatedAmbitions = ambitions.map(amb => {
      if (amb.id === id && amb.completedMilestones < amb.totalMilestones) {
        const newCompleted = amb.completedMilestones + 1;
        const newStatus = newCompleted === amb.totalMilestones ? 'excellent' : 'en-cours';
        
        return {
          ...amb,
          completedMilestones: newCompleted,
          status: newStatus,
          lastActivity: new Date()
        };
      }
      return amb;
    });

    saveAmbitions(updatedAmbitions);
    
    const ambition = updatedAmbitions.find(a => a.id === id);
    if (ambition?.completedMilestones === ambition?.totalMilestones) {
      toast.success('Objectif accompli ! 🎉', {
        description: 'Tu as atteint l\'excellence !',
        duration: 4000
      });
      unlockBadge('achiever');
    } else {
      toast.success('Étape franchie ! 🎯', {
        description: 'Continue sur cette lancée !',
        duration: 2000
      });
    }

    checkBadges(updatedAmbitions);
  };

  const unlockBadge = (badgeId: string) => {
    const badge = availableBadges.find(b => b.id === badgeId);
    if (badge) {
      setRecentBadge({ ...badge, unlockedAt: new Date() });
      
      setTimeout(() => {
        toast.success(`🏆 Nouveau badge : ${badge.name}`, {
          description: badge.description,
          duration: 4000
        });
      }, 500);

      setTimeout(() => setRecentBadge(null), 4000);
    }
  };

  const checkBadges = (currentAmbitions: Ambition[]) => {
    const excellentCount = currentAmbitions.filter(a => a.status === 'excellent').length;
    const categoriesUsed = new Set(currentAmbitions.map(a => a.category)).size;

    if (excellentCount >= 5) unlockBadge('focused');
    if (categoriesUsed >= 3) unlockBadge('diverse');
    if (currentAmbitions.some(a => a.category === 'social')) unlockBadge('social');
  };

  const deleteAmbition = (id: string) => {
    const updatedAmbitions = ambitions.filter(amb => amb.id !== id);
    saveAmbitions(updatedAmbitions);
    toast.success('Objectif supprimé');
  };

  const filteredAmbitions = selectedCategory === 'tous' 
    ? ambitions 
    : ambitions.filter(amb => amb.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en-cours': return 'bg-blue-500';
      case 'excellent': return 'bg-green-500';
      case 'en-pause': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'en-cours': return 'En cours';
      case 'excellent': return 'Excellent';
      case 'en-pause': return 'En pause';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header avec animation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Ambition Arcade
          </h1>
          <p className="text-purple-200">
            Vos objectifs personnels gamifiés avec bienveillance
          </p>
          {ambitions.length > 0 && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex justify-center gap-4 mt-4 text-sm"
            >
              <span className="text-yellow-300">🎯 {ambitions.length} objectifs</span>
              <span className="text-green-300">✨ {ambitions.filter(a => a.status === 'excellent').length} excellents</span>
              <span className="text-blue-300">🚀 {ambitions.filter(a => a.status === 'en-cours').length} actifs</span>
            </motion.div>
          )}
        </motion.div>

        {/* Badge récent */}
        <AnimatePresence>
          {recentBadge && (
            <motion.div
              initial={{ opacity: 0, scale: 0, y: -100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0, y: -100 }}
              className="fixed top-4 right-4 z-50"
            >
              <Card className="p-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-2xl">
                <div className="text-center space-y-2">
                  <div className="text-2xl">🏆</div>
                  <div className="font-bold">Nouveau badge !</div>
                  <div className="text-sm">{recentBadge.name}</div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="space-y-4">
            {/* Bouton création */}
            <Dialog open={newAmbitionDialog} onOpenChange={setNewAmbitionDialog}>
              <DialogTrigger asChild>
                <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvel objectif
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700 text-white">
                <DialogHeader>
                  <DialogTitle>Créer un nouvel objectif</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Titre de votre ambition..."
                    value={newAmbition.title}
                    onChange={(e) => setNewAmbition(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-slate-700 border-slate-600"
                  />
                  <Textarea
                    placeholder="Décrivez votre objectif (optionnel)..."
                    value={newAmbition.description}
                    onChange={(e) => setNewAmbition(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-slate-700 border-slate-600"
                    rows={3}
                  />
                  <select
                    value={newAmbition.category}
                    onChange={(e) => setNewAmbition(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-2 bg-slate-700 border border-slate-600 rounded"
                  >
                    {Object.entries(categories).filter(([key]) => key !== 'tous').map(([key, cat]) => (
                      <option key={key} value={key}>{cat.label}</option>
                    ))}
                  </select>
                  <Button onClick={createAmbition} className="w-full">
                    Créer l'objectif
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Filtres par catégorie */}
            <Card className="p-4 bg-slate-800/30 backdrop-blur-sm border-slate-700">
              <h3 className="font-semibold text-white mb-3">Catégories</h3>
              <div className="space-y-2">
                {Object.entries(categories).map(([key, category]) => {
                  const Icon = category.icon;
                  const count = key === 'tous' ? ambitions.length : ambitions.filter(a => a.category === key).length;
                  
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key)}
                      className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all ${
                        selectedCategory === key 
                          ? 'bg-gradient-to-r ' + category.color + ' text-white' 
                          : 'text-slate-300 hover:bg-slate-700/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="flex-1 text-left">{category.label}</span>
                      <span className="text-xs opacity-75">{count}</span>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Badges */}
            <Card className="p-4 bg-slate-800/30 backdrop-blur-sm border-slate-700">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Award className="w-4 h-4" />
                Badges
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {availableBadges.map((badge) => {
                  const Icon = badge.icon;
                  const unlocked = Math.random() > 0.7; // Simulation
                  
                  return (
                    <div
                      key={badge.id}
                      className={`aspect-square rounded-lg p-2 flex items-center justify-center transition-all ${
                        unlocked 
                          ? badge.color + ' shadow-lg' 
                          : 'bg-slate-700/50 opacity-50'
                      }`}
                      title={badge.description}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Zone principale */}
          <div className="lg:col-span-3">
            {ambitions.length === 0 ? (
              /* État vide */
              <Card className="p-12 text-center bg-slate-800/20 backdrop-blur-sm border-slate-700">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="w-24 h-24 mx-auto bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                    <Target className="w-12 h-12 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-2">
                      Commencez votre aventure !
                    </h3>
                    <p className="text-slate-300 mb-6">
                      Créez votre premier objectif et débloquez votre potentiel.<br />
                      Chaque grande réussite commence par un premier pas.
                    </p>
                    <Button 
                      onClick={() => setNewAmbitionDialog(true)}
                      size="lg"
                      className="bg-gradient-to-r from-purple-500 to-pink-500"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Créer mon premier objectif
                    </Button>
                  </div>
                </motion.div>
              </Card>
            ) : (
              /* Liste des ambitions */
              <div className="grid gap-4">
                <AnimatePresence>
                  {filteredAmbitions.map((ambition, index) => (
                    <motion.div
                      key={ambition.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-6 bg-slate-800/30 backdrop-blur-sm border-slate-700 hover:border-slate-600 transition-all">
                        <div className="space-y-4">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-white">{ambition.title}</h3>
                                <Badge className={`${getStatusColor(ambition.status)} text-white`}>
                                  {getStatusLabel(ambition.status)}
                                </Badge>
                              </div>
                              {ambition.description && (
                                <p className="text-slate-300 text-sm">{ambition.description}</p>
                              )}
                            </div>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-slate-400">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-slate-800 border-slate-700">
                                <DropdownMenuItem onClick={() => updateAmbitionStatus(ambition.id, 'en-cours')}>
                                  Marquer "En cours"
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateAmbitionStatus(ambition.id, 'excellent')}>
                                  Marquer "Excellent"
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateAmbitionStatus(ambition.id, 'en-pause')}>
                                  Mettre en pause
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => deleteAmbition(ambition.id)}
                                  className="text-red-400"
                                >
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Progression */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-400">Progression</span>
                              <span className="text-purple-300">
                                {ambition.completedMilestones} / {ambition.totalMilestones} étapes
                              </span>
                            </div>
                            <div className="flex gap-1">
                              {Array.from({ length: ambition.totalMilestones }, (_, i) => (
                                <div
                                  key={i}
                                  className={`h-2 flex-1 rounded-full transition-all ${
                                    i < ambition.completedMilestones
                                      ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                                      : 'bg-slate-700'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            {ambition.completedMilestones < ambition.totalMilestones && (
                              <Button
                                onClick={() => progressMilestone(ambition.id)}
                                size="sm"
                                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Étape suivante
                              </Button>
                            )}
                            
                            <div className="flex-1" />
                            
                            <div className="text-xs text-slate-500">
                              Créé le {ambition.createdAt.toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmbitionArcadePage;