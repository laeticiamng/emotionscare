/**
 * Collaborative Playlist UI - Partage et édition temps réel
 * Invitations, permissions, synchronisation live avec Supabase Realtime
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Users,
  Copy,
  Check,
  Trash2,
  Lock,
  Unlock,
  UserPlus,
  Clock,
  Wifi,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Collaborator {
  id: string;
  name: string;
  avatar?: string;
  role: 'owner' | 'editor' | 'viewer';
  joinedAt: Date;
  lastActive?: Date;
}

interface CollaborativePlaylistUIProps {
  playlistId: string;
  playlistName: string;
  collaborators: Collaborator[];
  currentUserId: string;
  isPublic: boolean;
  onAddCollaborator?: (email: string, role: 'editor' | 'viewer') => void;
  onRemoveCollaborator?: (collaboratorId: string) => void;
  onChangeRole?: (collaboratorId: string, newRole: 'editor' | 'viewer') => void;
  onTogglePublic?: (isPublic: boolean) => void;
}

const roleLabels: Record<'owner' | 'editor' | 'viewer', string> = {
  owner: 'Propriétaire',
  editor: 'Éditeur',
  viewer: 'Lecteur',
};

const roleColors: Record<'owner' | 'editor' | 'viewer', string> = {
  owner: 'bg-purple-500/20 text-purple-700 border-purple-500/30',
  editor: 'bg-blue-500/20 text-blue-700 border-blue-500/30',
  viewer: 'bg-gray-500/20 text-gray-700 border-gray-500/30',
};

export const CollaborativePlaylistUI: React.FC<CollaborativePlaylistUIProps> = ({
  playlistId,
  collaborators,
  currentUserId,
  isPublic,
  onAddCollaborator,
  onRemoveCollaborator,
  onChangeRole,
  onTogglePublic,
}) => {
  const { toast } = useToast();
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('viewer');
  const [copiedLink, setCopiedLink] = useState(false);
  const [expandedCollaborator, setExpandedCollaborator] = useState<string | null>(null);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const [_realtimeActivity, setRealtimeActivity] = useState<string[]>([]);

  // Subscribe to realtime updates for this playlist
  useEffect(() => {
    const channel = supabase
      .channel(`playlist-${playlistId}`)
      .on('presence', { event: 'sync' }, () => {
        setIsRealtimeConnected(true);
      })
 .on('presence', { event: 'join' }, ({ newPresences }) => {
        const activity = `${newPresences[0]?.user_name || 'Quelqu\'un'} a rejoint`;
        setRealtimeActivity(prev => [...prev.slice(-4), activity]);
        toast({ title: '👤 Nouveau collaborateur', description: activity, duration: 2000 });
      })
 .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        const activity = `${leftPresences[0]?.user_name || 'Quelqu\'un'} est parti`;
        setRealtimeActivity(prev => [...prev.slice(-4), activity]);
      })
      .on('broadcast', { event: 'playlist_update' }, ({ payload }) => {
        const activity = `${payload.user_name} a ${payload.action}`;
        setRealtimeActivity(prev => [...prev.slice(-4), activity]);
        toast({ title: '🎵 Mise à jour', description: activity, duration: 2000 });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setIsRealtimeConnected(true);
          await channel.track({
            user_id: currentUserId,
            user_name: collaborators.find(c => c.id === currentUserId)?.name || 'Anonyme',
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
      setIsRealtimeConnected(false);
    };
  }, [playlistId, currentUserId, collaborators, toast]);

  const currentUser = collaborators.find((c) => c.id === currentUserId);
  const isOwner = currentUser?.role === 'owner';
  const isEditor = currentUser?.role === 'editor';

  const handleInvite = () => {
    if (!inviteEmail.trim()) {
      toast({
        title: 'Erreur',
        description: 'Veuillez entrer une adresse email',
        variant: 'destructive',
      });
      return;
    }

    onAddCollaborator?.(inviteEmail, inviteRole);
    toast({
      title: '✉️ Invitation envoyée',
      description: `${inviteEmail} a été invité comme ${roleLabels[inviteRole]}`,
    });

    setInviteEmail('');
    setInviteRole('viewer');
    setShowInvite(false);
  };

  const handleCopyLink = () => {
    const shareLink = `${window.location.origin}/collab-playlist/${playlistId}`;
    navigator.clipboard.writeText(shareLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);

    toast({
      title: '🔗 Lien copié',
      description: 'Le lien de partage est dans le presse-papiers',
    });
  };

  const handleRemoveCollaborator = (collaboratorId: string) => {
    if (confirm('Retirer ce collaborateur ?')) {
      onRemoveCollaborator?.(collaboratorId);
      toast({
        title: '❌ Collaborateur supprimé',
        description: 'Accès révoqué',
      });
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'à l\'instant';
    if (diffMins < 60) return `il y a ${diffMins}m`;
    if (diffHours < 24) return `il y a ${diffHours}h`;
    if (diffDays < 7) return `il y a ${diffDays}j`;
    return new Date(date).toLocaleDateString('fr-FR');
  };

  return (
    <TooltipProvider>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Collaboration
                {isRealtimeConnected && (
                  <Badge variant="secondary" className="text-xs gap-1">
                    <Wifi className="h-3 w-3 text-green-500" />
                    Live
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {collaborators.length} collaborateur{collaborators.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Public Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant={isPublic ? 'default' : 'outline'}
                  onClick={() => onTogglePublic?.(!isPublic)}
                  disabled={!isOwner}
                  className="gap-2"
                >
                  {isPublic ? (
                    <Unlock className="h-4 w-4" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline text-xs">
                    {isPublic ? 'Public' : 'Privé'}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isOwner
                  ? 'Cliquez pour basculer la visibilité'
                  : 'Seul le propriétaire peut changer ceci'}
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Share Link Section */}
          {isPublic && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 space-y-2"
            >
              <p className="text-sm font-medium text-blue-700">Lien de partage public</p>
              <div className="flex gap-2">
                <Input
                  value={`${window.location.origin}/collab-playlist/${playlistId}`}
                  readOnly
                  className="text-xs h-9"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyLink}
                  className="h-9 gap-2"
                >
                  {copiedLink ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copié
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copier
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Invite Section */}
          {(isOwner || isEditor) && (
            <div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowInvite(!showInvite)}
                className="w-full gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Inviter un collaborateur
              </Button>

              <AnimatePresence>
                {showInvite && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 p-3 rounded-lg bg-muted/30 border space-y-3"
                  >
                    <Input
                      placeholder="Adresse email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      type="email"
                      className="h-9"
                    />

                    <div className="flex gap-2">
                      <select
                        value={inviteRole}
                        onChange={(e) =>
                          setInviteRole(e.target.value as 'editor' | 'viewer')
                        }
                        className="flex-1 h-9 px-3 rounded-md border bg-background text-sm"
                      >
                        <option value="viewer">Lecteur (lecture seule)</option>
                        <option value="editor">Éditeur (modification)</option>
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleInvite}
                        className="flex-1"
                      >
                        Inviter
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowInvite(false)}
                        className="flex-1"
                      >
                        Annuler
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Collaborators List */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Collaborateurs</h4>
            <div className="space-y-2">
              <AnimatePresence>
                {collaborators.map((collab) => (
                  <motion.div
                    key={collab.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="p-3 rounded-lg bg-muted/30 border hover:bg-muted/50 transition-all"
                  >
                    <div
                      className="flex items-start justify-between cursor-pointer"
                      onClick={() =>
                        setExpandedCollaborator(
                          expandedCollaborator === collab.id ? null : collab.id
                        )
                      }
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-8 h-8 rounded-full bg-accent/30 flex items-center justify-center text-xs font-semibold">
                            {collab.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {collab.name}
                              {collab.id === currentUserId && ' (vous)'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Ajouté {formatDate(collab.joinedAt)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge
                          variant="outline"
                          className={`text-xs ${roleColors[collab.role]}`}
                        >
                          {roleLabels[collab.role]}
                        </Badge>
                        {collab.lastActive && (
                          <Tooltip>
                            <TooltipTrigger>
                              <span className="text-xs text-muted-foreground">
                                ●
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              Actif {formatDate(collab.lastActive)}
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </div>

                    {/* Expanded Options */}
                    <AnimatePresence>
                      {expandedCollaborator === collab.id && isOwner && collab.id !== currentUserId && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 pt-2 border-t space-y-2"
                        >
                          <p className="text-xs text-muted-foreground">Changer le rôle:</p>
                          <div className="flex gap-2">
                            {(['editor', 'viewer'] as const).map((role) => (
                              <Button
                                key={role}
                                size="sm"
                                variant={collab.role === role ? 'default' : 'outline'}
                                onClick={() => onChangeRole?.(collab.id, role)}
                                className="flex-1 text-xs"
                              >
                                {roleLabels[role]}
                              </Button>
                            ))}
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="w-full gap-2 text-xs"
                            onClick={() => handleRemoveCollaborator(collab.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                            Supprimer
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="pt-3 border-t space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Activité récente
            </h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Playlist créée par {currentUser?.name}</p>
              <p>• Dernière modification il y a 2 heures</p>
              <p>• {collaborators.filter(c => c.lastActive).length} collaborateur(s) actif(s)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default CollaborativePlaylistUI;
