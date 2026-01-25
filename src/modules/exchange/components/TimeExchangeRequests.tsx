/**
 * Time Exchange Requests - Manage incoming/outgoing exchange requests
 */
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowRight,
  Star,
  User,
  CheckCheck
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useTimeExchangeRequests, useRespondToExchange, useRateExchange, useCompleteTimeExchange } from '../hooks/useExchangeData';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const statusColors = {
  pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  accepted: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  completed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const statusLabels = {
  pending: 'En attente',
  accepted: 'Accepté',
  completed: 'Terminé',
  cancelled: 'Annulé',
};

interface TimeExchangeRequestsProps {
  type: 'incoming' | 'outgoing';
}

const TimeExchangeRequests: React.FC<TimeExchangeRequestsProps> = ({ type }) => {
  const { data: requests, isLoading } = useTimeExchangeRequests(type);
  const respondToExchange = useRespondToExchange();
  const rateExchange = useRateExchange();
  const completeExchange = useCompleteTimeExchange();
  const [ratingDialog, setRatingDialog] = React.useState<{ exchangeId: string; isProvider: boolean } | null>(null);
  const [rating, setRating] = React.useState(5);
  const [feedback, setFeedback] = React.useState('');

  const handleComplete = async (exchangeId: string) => {
    try {
      await completeExchange.mutateAsync(exchangeId);
      toast.success('Échange marqué comme terminé !');
    } catch (error) {
      toast.error('Erreur lors de la complétion');
    }
  };

  const handleRespond = async (exchangeId: string, accept: boolean) => {
    try {
      await respondToExchange.mutateAsync({ exchangeId, accept });
      toast.success(accept ? 'Échange accepté !' : 'Échange refusé');
    } catch (error) {
      toast.error('Erreur lors de la réponse');
    }
  };

  const handleRate = async () => {
    if (!ratingDialog) return;
    try {
      await rateExchange.mutateAsync({
        exchangeId: ratingDialog.exchangeId,
        rating,
        feedback,
        isProvider: ratingDialog.isProvider,
      });
      toast.success('Évaluation envoyée !');
      setRatingDialog(null);
      setRating(5);
      setFeedback('');
    } catch (error) {
      toast.error('Erreur lors de l\'évaluation');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="h-24" />
          </Card>
        ))}
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" aria-hidden="true" />
        <h3 className="font-semibold mb-2">Aucune demande</h3>
        <p className="text-sm text-muted-foreground">
          {type === 'incoming' 
            ? 'Vous n\'avez pas de demandes d\'échange entrantes' 
            : 'Vous n\'avez pas envoyé de demandes d\'échange'}
        </p>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {requests.map((exchange: any, index: number) => {
          const status = exchange.status as keyof typeof statusColors;
          const canRate = status === 'completed' && (
            (type === 'incoming' && !exchange.rating_given) ||
            (type === 'outgoing' && !exchange.rating_received)
          );

          return (
            <motion.div
              key={exchange.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                          <User className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {exchange.offer?.skill_name || 'Compétence'}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{exchange.hours_exchanged}h</span>
                          <ArrowRight className="w-3 h-3" />
                          <span>
                            {type === 'incoming' ? 'Demandé par' : 'Demandé à'} un utilisateur
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={statusColors[status]}>
                        {statusLabels[status]}
                      </Badge>

                      {type === 'incoming' && status === 'pending' && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-emerald-500 hover:bg-emerald-500/10"
                            onClick={() => handleRespond(exchange.id, true)}
                            disabled={respondToExchange.isPending}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-500 hover:bg-red-500/10"
                            onClick={() => handleRespond(exchange.id, false)}
                            disabled={respondToExchange.isPending}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      )}

                      {/* Bouton Compléter pour les échanges acceptés */}
                      {status === 'accepted' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-blue-500 hover:bg-blue-500/10"
                          onClick={() => handleComplete(exchange.id)}
                          disabled={completeExchange.isPending}
                        >
                          <CheckCheck className="w-4 h-4 mr-1" />
                          Terminer
                        </Button>
                      )}

                      {canRate && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setRatingDialog({ 
                            exchangeId: exchange.id, 
                            isProvider: type === 'incoming' 
                          })}
                        >
                          <Star className="w-4 h-4 mr-1" />
                          Évaluer
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Rating Dialog */}
      <Dialog open={!!ratingDialog} onOpenChange={(open) => !open && setRatingDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Évaluer l'échange</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label>Note</Label>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= rating ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="feedback">Commentaire (optionnel)</Label>
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Partagez votre expérience..."
              />
            </div>
            <Button
              onClick={handleRate}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600"
              disabled={rateExchange.isPending}
            >
              {rateExchange.isPending ? 'Envoi...' : 'Envoyer l\'évaluation'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TimeExchangeRequests;
