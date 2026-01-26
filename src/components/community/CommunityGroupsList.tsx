/**
 * CommunityGroupsList - Liste des groupes de soutien
 */

import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Lock, Globe, Search, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { CommunityGroup } from '@/hooks/community/useCommunityGroups';

interface CommunityGroupsListProps {
  groups: CommunityGroup[];
  myGroups: CommunityGroup[];
  loading: boolean;
  onJoinGroup: (groupId: string) => Promise<void>;
  onLeaveGroup: (groupId: string) => Promise<void>;
  onCreateGroup: (data: { name: string; description: string; icon?: string; is_private?: boolean }) => Promise<void>;
}

const GroupCard = memo(function GroupCard({
  group,
  onJoin,
  onLeave,
}: {
  group: CommunityGroup;
  onJoin: (id: string) => void;
  onLeave: (id: string) => void;
}) {
  const [isJoining, setIsJoining] = useState(false);

  const handleAction = async () => {
    setIsJoining(true);
    try {
      if (group.is_member) {
        await onLeave(group.id);
      } else {
        await onJoin(group.id);
      }
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 text-2xl">
              {group.icon || '👥'}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm truncate">{group.name}</h3>
                {group.is_private ? (
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                {group.description}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="secondary" className="text-[10px]">
                  <Users className="h-3 w-3 mr-1" />
                  {group.member_count} membres
                </Badge>
                {group.is_member && (
                  <Badge variant="outline" className="text-[10px] text-primary border-primary">
                    Membre
                  </Badge>
                )}
              </div>
            </div>

            {/* Action */}
            <Button
              variant={group.is_member ? 'outline' : 'default'}
              size="sm"
              onClick={handleAction}
              disabled={isJoining}
              className="shrink-0"
            >
              {isJoining ? (
                '...'
              ) : group.is_member ? (
                'Quitter'
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Rejoindre
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

export const CommunityGroupsList = memo(function CommunityGroupsList({
  groups,
  myGroups,
  loading,
  onJoinGroup,
  onLeaveGroup,
  onCreateGroup,
}: CommunityGroupsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    icon: '👥',
    is_private: false,
  });
  const [isCreating, setIsCreating] = useState(false);

  // Filter groups
  const filteredGroups = groups.filter(
    (g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateGroup = async () => {
    if (!newGroup.name.trim() || !newGroup.description.trim()) return;

    setIsCreating(true);
    try {
      await onCreateGroup(newGroup);
      setShowCreateDialog(false);
      setNewGroup({ name: '', description: '', icon: '👥', is_private: false });
    } finally {
      setIsCreating(false);
    }
  };

  const iconOptions = ['👥', '💙', '🌿', '☀️', '🌙', '🧘', '💪', '🎯', '🌈', '✨'];

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-9 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search & Create */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un groupe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Créer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau groupe</DialogTitle>
              <DialogDescription>
                Crée un espace de partage thématique pour la communauté.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="group-icon">Icône</Label>
                <div className="flex flex-wrap gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setNewGroup((prev) => ({ ...prev, icon }))}
                      className={`h-10 w-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                        newGroup.icon === icon
                          ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="group-name">Nom du groupe</Label>
                <Input
                  id="group-name"
                  placeholder="Ex: Gestion du stress"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="group-description">Description</Label>
                <Textarea
                  id="group-description"
                  placeholder="Décris l'objectif de ce groupe..."
                  value={newGroup.description}
                  onChange={(e) => setNewGroup((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="group-private">Groupe privé</Label>
                  <p className="text-xs text-muted-foreground">
                    Seuls les membres invités peuvent voir le contenu
                  </p>
                </div>
                <Switch
                  id="group-private"
                  checked={newGroup.is_private}
                  onCheckedChange={(checked) =>
                    setNewGroup((prev) => ({ ...prev, is_private: checked }))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Annuler
              </Button>
              <Button
                onClick={handleCreateGroup}
                disabled={isCreating || !newGroup.name.trim() || !newGroup.description.trim()}
              >
                {isCreating ? 'Création...' : 'Créer le groupe'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">
            Tous les groupes ({groups.length})
          </TabsTrigger>
          <TabsTrigger value="my">
            Mes groupes ({myGroups.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3 mt-4">
          {filteredGroups.length === 0 ? (
            <Card className="text-center p-8">
              <Users className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
              <h3 className="text-sm font-semibold mb-1">
                {searchQuery ? 'Aucun groupe trouvé' : 'Aucun groupe disponible'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {searchQuery
                  ? 'Essaie avec d\'autres mots-clés'
                  : 'Sois le premier à créer un groupe thématique !'}
              </p>
            </Card>
          ) : (
            <AnimatePresence>
              {filteredGroups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  onJoin={onJoinGroup}
                  onLeave={onLeaveGroup}
                />
              ))}
            </AnimatePresence>
          )}
        </TabsContent>

        <TabsContent value="my" className="space-y-3 mt-4">
          {myGroups.length === 0 ? (
            <Card className="text-center p-8">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
              <h3 className="text-sm font-semibold mb-1">Tu n'as rejoint aucun groupe</h3>
              <p className="text-xs text-muted-foreground">
                Explore les groupes disponibles et rejoins ceux qui t'intéressent.
              </p>
            </Card>
          ) : (
            <AnimatePresence>
              {myGroups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  onJoin={onJoinGroup}
                  onLeave={onLeaveGroup}
                />
              ))}
            </AnimatePresence>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
});
