/**
 * Demandes de buddy envoyées
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Clock, X, Loader2 } from 'lucide-react';
import { formatDistanceToNow, isAfter } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import type { BuddyRequest, BuddyProfile } from '../types';
import { toast } from 'sonner';

interface BuddySentRequestsProps {
  userId: string;
}

interface SentRequest extends BuddyRequest {
  to_profile?: BuddyProfile;
}

export const BuddySentRequests: React.FC<BuddySentRequestsProps> = ({ userId }) => {
  const [requests, setRequests] = useState<SentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    loadSentRequests();
  }, [userId]);

  const loadSentRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('buddy_requests')
        .select('*')
        .eq('from_user_id', userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Récupérer les profils des destinataires
      if (data && data.length > 0) {
        const toIds = data.map(r => r.to_user_id);
        const { data: profiles } = await supabase
          .from('buddy_profiles')
          .select('*')
          .in('user_id', toIds);

        const profileMap = new Map((profiles || []).map(p => [p.user_id, p]));

        setRequests(data.map(r => ({
          ...r,
          to_profile: profileMap.get(r.to_user_id)
        })) as SentRequest[]);
      } else {
        setRequests([]);
      }
    } catch (err) {
      console.error('Error loading sent requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    setCancelling(requestId);
    try {
      const { error } = await supabase
        .from('buddy_requests')
        .update({ status: 'declined' })
        .eq('id', requestId);

      if (error) throw error;

      setRequests(prev => prev.filter(r => r.id !== requestId));
      toast.success('Demande annulée');
    } catch (err) {
      console.error('Error cancelling request:', err);
      toast.error('Erreur lors de l\'annulation');
    } finally {
      setCancelling(null);
    }
  };

  const isExpired = (expiresAt: string) => {
    return isAfter(new Date(), new Date(expiresAt));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Send className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <p className="text-muted-foreground">Aucune demande envoyée en attente</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="gap-1">
          <Send className="h-3 w-3" />
          {requests.length} demande{requests.length > 1 ? 's' : ''} envoyée{requests.length > 1 ? 's' : ''}
        </Badge>
      </div>

      <AnimatePresence>
        {requests.map(request => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <Card className={isExpired(request.expires_at) ? 'opacity-60' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={request.to_profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10">
                      {request.to_profile?.display_name?.charAt(0) || 'B'}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">
                        {request.to_profile?.display_name || 'Buddy'}
                      </h3>
                      {isExpired(request.expires_at) && (
                        <Badge variant="destructive" className="text-xs">Expirée</Badge>
                      )}
                    </div>

                    {request.message && (
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        "{request.message}"
                      </p>
                    )}

                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Envoyée {formatDistanceToNow(new Date(request.created_at), { addSuffix: true, locale: fr })}
                      </span>
                      {!isExpired(request.expires_at) && (
                        <span>
                          Expire {formatDistanceToNow(new Date(request.expires_at), { addSuffix: true, locale: fr })}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCancelRequest(request.id)}
                    disabled={cancelling === request.id}
                  >
                    {cancelling === request.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <X className="h-4 w-4 mr-1" />
                        Annuler
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default BuddySentRequests;
