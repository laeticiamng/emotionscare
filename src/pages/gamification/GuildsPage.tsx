/**
 * GuildsPage - Page de liste des guildes
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Plus, 
  Users, 
  Trophy,
  Crown,
  Loader2,
  Sparkles
} from 'lucide-react';
import { useGuilds, useGuild, guildsService, type GuildPrivacy } from '@/features/guilds';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { GuildCard } from '@/components/gamification';

const EMOJI_OPTIONS = ['⚔️', '🛡️', '🔥', '💎', '🌟', '🦁', '🐉', '🌊', '⚡', '🎯'];

const GuildsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '⚔️',
    privacy: 'public' as GuildPrivacy
  });

  const { guilds, loading, error, refresh } = useGuilds(search);

  const handleCreateGuild = async () => {
    if (!user || !formData.name.trim()) return;
    
    setCreating(true);
    try {
      const guild = await guildsService.createGuild(
        user.id,
        formData.name.trim(),
        formData.description.trim(),
        formData.icon,
        formData.privacy
      );
      
      toast({
        title: 'Guilde créée !',
        description: `${guild.name} est maintenant active.`
      });
      
      setIsCreateOpen(false);
      setFormData({ name: '', description: '', icon: '⚔️', privacy: 'public' });
      refresh();
      navigate(`/gamification/guilds/${guild.id}`);
    } catch (err) {
      toast({
        title: 'Erreur',
        description: (err as Error).message,
        variant: 'destructive'
      });
    } finally {
      setCreating(false);
    }
  };

  const handleJoinGuild = async (guildId: string) => {
    if (!user) {
      toast({
        title: 'Non connecté',
        description: 'Connectez-vous pour rejoindre une guilde.',
        variant: 'destructive'
      });
      return;
    }

    try {
      await guildsService.joinGuild(guildId, user.id, user.email?.split('@')[0] || 'Membre');
      toast({
        title: 'Bienvenue !',
        description: 'Vous avez rejoint la guilde.'
      });
      refresh();
    } catch (err) {
      toast({
        title: 'Erreur',
        description: (err as Error).message,
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Crown className="h-8 w-8 text-yellow-500" />
            Guildes
          </h1>
          <p className="text-muted-foreground mt-1">
            Rejoignez une communauté et progressez ensemble
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Créer une guilde
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Créer une nouvelle guilde
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="guild-icon">Emblème</Label>
                <div className="flex flex-wrap gap-2">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <Button
                      key={emoji}
                      type="button"
                      variant={formData.icon === emoji ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setFormData(prev => ({ ...prev, icon: emoji }))}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="guild-name">Nom de la guilde</Label>
                <Input
                  id="guild-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Les Guerriers du Bien-être"
                  maxLength={50}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guild-desc">Description</Label>
                <Textarea
                  id="guild-desc"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Décrivez votre guilde..."
                  rows={3}
                  maxLength={200}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guild-privacy">Confidentialité</Label>
                <Select 
                  value={formData.privacy} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, privacy: v as GuildPrivacy }))}
                >
                  <SelectTrigger id="guild-privacy">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public - Tout le monde peut rejoindre</SelectItem>
                    <SelectItem value="invite_only">Sur invitation uniquement</SelectItem>
                    <SelectItem value="private">Privé - Invisible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Annuler
              </Button>
              <Button 
                onClick={handleCreateGuild} 
                disabled={!formData.name.trim() || creating}
              >
                {creating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Créer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une guilde..."
          className="pl-10"
        />
      </div>

      {/* Guilds Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-destructive">Erreur: {error.message}</p>
            <Button variant="outline" className="mt-4" onClick={refresh}>
              Réessayer
            </Button>
          </CardContent>
        </Card>
      ) : guilds.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
            <h3 className="text-lg font-medium">Aucune guilde trouvée</h3>
            <p className="text-muted-foreground mt-1">
              {search ? 'Essayez une autre recherche' : 'Soyez le premier à créer une guilde !'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {guilds.map((guild) => (
            <GuildCard
              key={guild.id}
              guild={guild}
              onJoin={() => handleJoinGuild(guild.id)}
              onView={() => navigate(`/gamification/guilds/${guild.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GuildsPage;
