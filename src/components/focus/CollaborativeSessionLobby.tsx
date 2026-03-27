// @ts-nocheck
/**
 * CollaborativeSessionLobby - Interface pour sessions Focus Flow collaboratives
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Users,
  Play,
  Coffee,
  MessageCircle,
  Trophy,
  Clock,
  LogOut,
  Send,
  Target,
} from 'lucide-react';
import { useCollaborativeFocus } from '@/hooks/useCollaborativeFocus';
import { useAuth } from '@/contexts/AuthContext';

export const CollaborativeSessionLobby: React.FC = () => {
  const { user } = useAuth();
  const {
    activeSession,
    participants,
    chatMessages,
    leaderboard,
    createTeamSession,
    joinTeamSession,
    leaveTeamSession,
    startWorkPhase,
    startBreakPhase,
    sendChatMessage,
    loadLeaderboard,
  } = useCollaborativeFocus();

  const [teamName, setTeamName] = useState('');
  const [mode, setMode] = useState<'work' | 'study' | 'meditation'>('work');
  const [chatInput, setChatInput] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const handleCreateSession = async () => {
    if (!teamName.trim()) return;
    await createTeamSession(teamName, mode);
    setTeamName('');
  };

  const handleSendMessage = () => {
    if (!chatInput.trim() || !activeSession) return;
    sendChatMessage(activeSession.id, chatInput);
    setChatInput('');
  };

  const phaseColors = {
    waiting: 'bg-yellow-500/20 text-yellow-500',
    active: 'bg-green-500/20 text-green-500',
    break: 'bg-blue-500/20 text-blue-500',
    completed: 'bg-purple-500/20 text-purple-500',
  };

  const phaseLabels = {
    waiting: 'En attente',
    active: 'En cours',
    break: 'Pause',
    completed: 'Terminée',
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Création de session */}
      {!activeSession && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Créer une session collaborative
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Nom de l'équipe"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {(['work', 'study', 'meditation'] as const).map((m) => (
                <Button
                  key={m}
                  variant={mode === m ? 'default' : 'outline'}
                  onClick={() => setMode(m)}
                  className="flex-1 capitalize"
                >
                  {m === 'work' && '💼'}
                  {m === 'study' && '📚'}
                  {m === 'meditation' && '🧘'}
                  {' '}
                  {m}
                </Button>
              ))}
            </div>
            <Button onClick={handleCreateSession} className="w-full gap-2">
              <Users className="h-4 w-4" />
              Créer la session
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Session active */}
      {activeSession && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informations session */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    {activeSession.team_name}
                  </CardTitle>
                  <Badge className={phaseColors[activeSession.current_phase]}>
                    {phaseLabels[activeSession.current_phase]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center gap-2 p-4 bg-card/50 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                    <div className="text-2xl font-bold">{activeSession.participant_count}</div>
                    <div className="text-xs text-muted-foreground">Participants</div>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 bg-card/50 rounded-lg">
                    <Clock className="h-6 w-6 text-orange-500" />
                    <div className="text-2xl font-bold">{activeSession.duration_minutes}</div>
                    <div className="text-xs text-muted-foreground">Minutes</div>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 bg-card/50 rounded-lg">
                    <span className="text-2xl">
                      {activeSession.mode === 'work' && '💼'}
                      {activeSession.mode === 'study' && '📚'}
                      {activeSession.mode === 'meditation' && '🧘'}
                    </span>
                    <div className="text-sm font-medium capitalize">{activeSession.mode}</div>
                  </div>
                </div>

                {/* Contrôles */}
                <div className="flex gap-2">
                  {activeSession.current_phase === 'waiting' && (
                    <Button
                      onClick={() => startWorkPhase(activeSession.id)}
                      className="flex-1 gap-2"
                    >
                      <Play className="h-4 w-4" />
                      Démarrer
                    </Button>
                  )}
                  {activeSession.current_phase === 'active' && (
                    <Button
                      onClick={() => startBreakPhase(activeSession.id)}
                      variant="secondary"
                      className="flex-1 gap-2"
                    >
                      <Coffee className="h-4 w-4" />
                      Pause
                    </Button>
                  )}
                  <Button
                    onClick={() => leaveTeamSession(activeSession.id)}
                    variant="outline"
                    className="gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Quitter
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Chat */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  Chat de pause
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-[300px] rounded-lg border p-4">
                  <div className="space-y-3">
                    {chatMessages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-2"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {msg.user_id.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            {msg.user_id === user?.id ? 'Vous' : 'Participant'}
                          </div>
                          <div className="text-sm text-muted-foreground">{msg.message}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="flex gap-2">
                  <Input
                    placeholder="Votre message..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} size="icon" aria-label="Envoyer le message">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Participants */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Participants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {participants.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-2 bg-card/50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {p.user_id.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">
                          {p.user_id === user?.id ? 'Vous' : 'Participant'}
                        </span>
                      </div>
                      <Badge variant="secondary">{p.pomodoros_completed} 🍅</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  Classement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {leaderboard.slice(0, 5).map((entry, idx) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-2 bg-card/50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-bold text-primary">#{idx + 1}</div>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {entry.user_id.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <Badge variant="secondary">{entry.total_pomodoros} 🍅</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
