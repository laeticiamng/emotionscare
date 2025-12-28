/**
 * Exchange Profile Card - Display and edit user's exchange profile
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Edit2, 
  Trophy, 
  Zap, 
  Award,
  TrendingUp,
  Shield,
  Clock,
  Heart,
  Save,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useExchangeProfile, useUpdateExchangeProfile, useExchangeStats } from '../hooks/useExchangeData';
import ExchangeDataExport from './ExchangeDataExport';
import { toast } from 'sonner';

const rankIcons = {
  improvement: TrendingUp,
  trust: Shield,
  time: Clock,
  emotion: Heart,
};

const ExchangeProfileCard: React.FC = () => {
  const { data: profile, isLoading } = useExchangeProfile();
  const { data: stats } = useExchangeStats();
  const updateProfile = useUpdateExchangeProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    display_name: '',
  });

  const handleEdit = () => {
    setEditData({
      display_name: profile?.display_name || '',
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync(editData);
      toast.success('Profil mis à jour !');
      setIsEditing(false);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="h-48" />
      </Card>
    );
  }

  const xpProgress = profile ? ((profile.total_xp % 1000) / 1000) * 100 : 0;
  const nextLevel = profile ? profile.level + 1 : 2;

  return (
    <>
      <Card className="overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500" />
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Mon Profil Exchange
            </CardTitle>
            <div className="flex gap-1">
              <ExchangeDataExport />
              <Button variant="ghost" size="sm" onClick={handleEdit}>
                <Edit2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-2 border-primary">
              {profile?.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt="Avatar" />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white text-xl">
                  {profile?.display_name?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <h3 className="font-bold text-lg">{profile?.display_name || 'Utilisateur'}</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/10">
                  <Trophy className="w-3 h-3 mr-1" />
                  Niveau {profile?.level || 1}
                </Badge>
                <Badge variant="secondary">
                  <Zap className="w-3 h-3 mr-1" />
                  {profile?.total_xp?.toLocaleString() || 0} XP
                </Badge>
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progression vers niveau {nextLevel}</span>
              <span className="font-medium">{Math.round(xpProgress)}%</span>
            </div>
            <Progress value={xpProgress} className="h-2" />
          </div>

          {/* Market Rankings */}
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(rankIcons).map(([market, Icon]) => {
              const rank = profile?.[`${market}_rank` as keyof typeof profile] as number | undefined;
              return (
                <motion.div
                  key={market}
                  whileHover={{ scale: 1.02 }}
                  className="p-3 bg-muted/50 rounded-lg flex items-center gap-3"
                >
                  <div className="p-2 rounded-lg bg-background">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground capitalize">{market}</p>
                    <p className="font-bold">
                      {rank ? `#${rank}` : '-'}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Badges */}
          {profile?.badges && profile.badges.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Badges</p>
              <div className="flex flex-wrap gap-2">
                {profile.badges.map((badge, index) => (
                  <Badge key={index} variant="outline" className="bg-background">
                    <Award className="w-3 h-3 mr-1" />
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          {stats && (
            <div className="grid grid-cols-3 gap-2 pt-2 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold">{stats.totalGoals || 0}</p>
                <p className="text-xs text-muted-foreground">Objectifs</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{stats.totalExchanges || 0}</p>
                <p className="text-xs text-muted-foreground">Échanges</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{stats.trustGiven || 0}</p>
                <p className="text-xs text-muted-foreground">Confiance</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier mon profil</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label htmlFor="display-name">Nom d'affichage</Label>
              <Input
                id="display-name"
                value={editData.display_name}
                onChange={(e) => setEditData(prev => ({ ...prev, display_name: e.target.value }))}
                placeholder="Votre pseudo"
              />
            </div>
            <Button
              onClick={handleSave}
              className="w-full"
              disabled={updateProfile.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              {updateProfile.isPending ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExchangeProfileCard;
