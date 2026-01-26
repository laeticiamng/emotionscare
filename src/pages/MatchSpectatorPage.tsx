import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, MessageCircle, TrendingUp, Trophy, Send } from 'lucide-react';
import { spectatorService, MatchChatMessage, SpectatorStats } from '@/services/spectator-service';
import { tournamentService } from '@/services/tournament-service';
import { toast } from 'sonner';

export default function MatchSpectatorPage() {
  const { matchId } = useParams<{ matchId: string }>();
  const [match, setMatch] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<MatchChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [stats, setStats] = useState<SpectatorStats>({ total_spectators: 0, active_viewers: 0, predictions_count: 0 });
  const [prediction, setPrediction] = useState<any>(null);
  const [selectedWinner, setSelectedWinner] = useState<string>('');
  const [confidence, setConfidence] = useState(50);

  useEffect(() => {
    if (!matchId) return;

    loadMatchData();
    spectatorService.joinAsSpectator(matchId);

    spectatorService.subscribeToMatch(
      matchId,
      (payload) => {
        setMatch(payload.new);
      },
      (message) => {
        setChatMessages((prev) => [message, ...prev]);
      }
    );

    return () => {
      spectatorService.leaveAsSpectator(matchId);
      spectatorService.unsubscribeFromMatch(matchId);
    };
  }, [matchId]);

  const loadMatchData = async () => {
    if (!matchId) return;

    const [matchData, messages, statsData, userPrediction] = await Promise.all([
      tournamentService.getMatch(matchId),
      spectatorService.getChatMessages(matchId),
      spectatorService.getSpectatorStats(matchId),
      spectatorService.getUserPrediction(matchId),
    ]);

    setMatch(matchData);
    setChatMessages(messages);
    setStats(statsData);
    setPrediction(userPrediction);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !matchId) return;

    const success = await spectatorService.sendChatMessage(matchId, newMessage);
    if (success) {
      setNewMessage('');
    } else {
      toast.error('Échec de l\'envoi du message');
    }
  };

  const handleSubmitPrediction = async () => {
    if (!matchId || !selectedWinner) return;

    const success = await spectatorService.submitPrediction(matchId, selectedWinner, confidence);
    if (success) {
      toast.success('Prédiction enregistrée !');
      loadMatchData();
    } else {
      toast.error('Échec de la prédiction');
    }
  };

  if (!match) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Chargement du match...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Match Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Match en direct
            </CardTitle>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {stats.active_viewers} spectateurs
              </Badge>
              <Badge variant="secondary">
                {match.status === 'scheduled' && 'Programmé'}
                {match.status === 'in_progress' && 'En cours'}
                {match.status === 'completed' && 'Terminé'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 items-center">
            {/* Player 1 */}
            <div className="text-center space-y-2">
              <Avatar className="h-20 w-20 mx-auto">
                <AvatarImage src={match.player1?.avatar_url} />
                <AvatarFallback>{match.player1?.display_name?.[0]}</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold">{match.player1?.display_name}</h3>
              <div className="text-3xl font-bold text-primary">{match.player1_score || 0}</div>
            </div>

            {/* VS */}
            <div className="text-center">
              <div className="text-4xl font-bold text-muted-foreground">VS</div>
            </div>

            {/* Player 2 */}
            <div className="text-center space-y-2">
              <Avatar className="h-20 w-20 mx-auto">
                <AvatarImage src={match.player2?.avatar_url} />
                <AvatarFallback>{match.player2?.display_name?.[0]}</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold">{match.player2?.display_name}</h3>
              <div className="text-3xl font-bold text-primary">{match.player2_score || 0}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Predictions Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Prédictions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {prediction ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Votre prédiction :</p>
                <Badge variant="secondary">
                  {prediction.predicted_winner_id === match.player1_id 
                    ? match.player1?.display_name 
                    : match.player2?.display_name}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Confiance : {prediction.confidence}%
                </p>
                {prediction.reward_earned > 0 && (
                  <Badge variant="default">+{prediction.reward_earned} XP gagnés</Badge>
                )}
              </div>
            ) : match.status !== 'completed' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Qui va gagner ?</label>
                  <div className="space-y-2">
                    <Button
                      variant={selectedWinner === match.player1_id ? 'default' : 'outline'}
                      className="w-full"
                      onClick={() => setSelectedWinner(match.player1_id)}
                    >
                      {match.player1?.display_name}
                    </Button>
                    <Button
                      variant={selectedWinner === match.player2_id ? 'default' : 'outline'}
                      className="w-full"
                      onClick={() => setSelectedWinner(match.player2_id)}
                    >
                      {match.player2?.display_name}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confiance : {confidence}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={confidence}
                    onChange={(e) => setConfidence(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <Button
                  onClick={handleSubmitPrediction}
                  disabled={!selectedWinner}
                  className="w-full"
                >
                  Valider la prédiction
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Gagnez jusqu'à {confidence * 2} XP si vous devinez juste !
                </p>
              </div>
            )}
            <Separator />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {stats.predictions_count} prédictions au total
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Chat Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Chat des spectateurs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={msg.user?.avatar_url} />
                      <AvatarFallback>{msg.user?.display_name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{msg.user?.display_name}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Envoyer un message..."
                disabled={match.status === 'completed'}
              />
              <Button onClick={handleSendMessage} disabled={match.status === 'completed'}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
