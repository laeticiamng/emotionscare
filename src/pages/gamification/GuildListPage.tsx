import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Plus, Search, Music, TrendingUp, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { guildService, Guild } from '@/services/guild-service';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const GuildListPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newGuildName, setNewGuildName] = useState('');
  const [newGuildDescription, setNewGuildDescription] = useState('');
  const [newGuildGenre, setNewGuildGenre] = useState('');

  const { data: guilds, isLoading, refetch } = useQuery({
    queryKey: ['guilds'],
    queryFn: () => guildService.getGuilds(100),
  });

  const filteredGuilds = guilds?.filter((guild) =>
    guild.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guild.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guild.music_genre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateGuild = async () => {
    if (!newGuildName.trim()) {
      toast({
        title: 'Erreur',
        description: 'Le nom du cercle est requis.',
        variant: 'destructive',
      });
      return;
    }

    const guild = await guildService.createGuild(
      newGuildName,
      newGuildDescription,
      true,
      newGuildGenre
    );

    if (guild) {
      toast({
        title: 'Cercle créé !',
        description: `Le cercle "${guild.name}" a été créé avec succès.`,
      });
      setCreateDialogOpen(false);
      setNewGuildName('');
      setNewGuildDescription('');
      setNewGuildGenre('');
      refetch();
      navigate(`/app/guilds/${guild.id}`);
    } else {
      toast({
        title: 'Erreur',
        description: 'Impossible de créer le cercle.',
        variant: 'destructive',
      });
    }
  };

  const handleJoinGuild = async (guildId: string) => {
    const success = await guildService.joinGuild(guildId);
    if (success) {
      toast({
        title: 'Cercle rejoint !',
        description: 'Vous avez rejoint le cercle de soutien avec succès.',
      });
      navigate(`/app/guilds/${guildId}`);
    } else {
      toast({
        title: 'Erreur',
        description: 'Impossible de rejoindre le cercle.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Shield className="w-10 h-10 text-primary" />
              Cercles de Soutien
            </h1>
            <p className="text-muted-foreground mt-2">
              Rejoignez un groupe d'entraide et progressez ensemble
            </p>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Créer un cercle
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un nouveau cercle de soutien</DialogTitle>
                <DialogDescription>
                  Créez votre propre groupe d'entraide et invitez des collègues
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="name">Nom du cercle *</Label>
                  <Input
                    id="name"
                    value={newGuildName}
                    onChange={(e) => setNewGuildName(e.target.value)}
                    placeholder="Équipe Urgences"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newGuildDescription}
                    onChange={(e) => setNewGuildDescription(e.target.value)}
                    placeholder="Une guilde pour les passionnés de musique..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="genre">Genre musical</Label>
                  <Input
                    id="genre"
                    value={newGuildGenre}
                    onChange={(e) => setNewGuildGenre(e.target.value)}
                    placeholder="Rock, Pop, Jazz..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleCreateGuild}>Créer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="Rechercher un cercle par nom, description ou spécialité..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Guilds Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-32 w-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-10 w-full" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuilds?.map((guild) => (
              <motion.div
                key={guild.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-6 h-full flex flex-col">
                  {/* Guild Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{guild.name}</h3>
                      {guild.music_genre && (
                        <Badge variant="secondary" className="gap-1">
                          <Music className="w-3 h-3" />
                          {guild.music_genre}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-3">
                    {guild.description || 'Aucune description'}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{guild.member_count}/{guild.max_members}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <span>{guild.total_xp.toLocaleString()} XP</span>
                    </div>
                  </div>

                  {/* Join Button */}
                  <Button
                    onClick={() => handleJoinGuild(guild.id)}
                    className="w-full"
                    disabled={guild.member_count >= guild.max_members}
                  >
                    {guild.member_count >= guild.max_members ? 'Complet' : 'Rejoindre'}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {filteredGuilds?.length === 0 && !isLoading && (
          <Card className="p-12 text-center">
            <Shield className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucun cercle trouvé</h3>
            <p className="text-muted-foreground mb-4">
              Soyez le premier à créer un cercle de soutien !
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              Créer un cercle
            </Button>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default GuildListPage;
