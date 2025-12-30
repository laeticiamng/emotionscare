/**
 * Vue détaillée d'une session de groupe
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  UserPlus,
  UserMinus,
  Heart,
  Sparkles,
  MessageCircle,
  FileText,
  Link as LinkIcon,
  Star,
  ArrowLeft,
  Share2,
  ExternalLink
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { GroupSession, GroupSessionParticipant, GroupSessionResource } from '../types';
import { GroupSessionChat } from './GroupSessionChat';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GroupSessionDetailProps {
  session: GroupSession | null;
  participants: GroupSessionParticipant[];
  messages: any[];
  resources: GroupSessionResource[];
  isRegistered: boolean;
  isOpen: boolean;
  onClose: () => void;
  onRegister: () => void;
  onUnregister: () => void;
  onJoin: (moodBefore?: number) => void;
  onLeave: (moodAfter?: number, feedback?: string, rating?: number) => void;
  onSendMessage: (content: string) => Promise<any>;
  currentUserId?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  wellbeing: 'from-pink-500 to-rose-500',
  meditation: 'from-purple-500 to-violet-500',
  breathing: 'from-cyan-500 to-teal-500',
  discussion: 'from-blue-500 to-indigo-500',
  creative: 'from-amber-500 to-orange-500',
  movement: 'from-green-500 to-emerald-500',
  support: 'from-indigo-500 to-blue-500',
  workshop: 'from-red-500 to-pink-500'
};

export const GroupSessionDetail: React.FC<GroupSessionDetailProps> = ({
  session,
  participants,
  messages,
  resources,
  isRegistered,
  isOpen,
  onClose,
  onRegister,
  onUnregister,
  onJoin,
  onLeave,
  onSendMessage,
  currentUserId
}) => {
  const [activeTab, setActiveTab] = useState('info');
  const [moodBefore, setMoodBefore] = useState(5);
  const [moodAfter, setMoodAfter] = useState(7);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [showJoinFlow, setShowJoinFlow] = useState(false);
  const [showLeaveFlow, setShowLeaveFlow] = useState(false);

  if (!session) return null;

  const isLive = session.status === 'live';
  const isPast = session.status === 'completed';
  const isHost = session.host_id === currentUserId;
  const participantCount = participants.length;

  const handleJoin = () => {
    onJoin(moodBefore);
    setShowJoinFlow(false);
  };

  const handleLeave = () => {
    onLeave(moodAfter, feedback, rating);
    setShowLeaveFlow(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        {/* Header with gradient */}
        <div className={cn(
          "relative px-6 pt-6 pb-16 bg-gradient-to-br",
          CATEGORY_COLORS[session.category] || 'from-primary to-primary/60'
        )}>
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="secondary" className="mb-2">
                  {session.category}
                </Badge>
                <DialogTitle className="text-2xl text-white">
                  {session.title}
                </DialogTitle>
              </div>
              <Badge className="bg-white/20 text-white border-0 gap-1">
                <Sparkles className="h-3 w-3" />
                +{session.xp_reward} XP
              </Badge>
            </div>
          </DialogHeader>

          {isLive && (
            <div className="absolute bottom-4 left-6 flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white text-sm font-medium">EN DIRECT</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto -mt-8 px-6 pb-6">
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{format(new Date(session.scheduled_at), 'EEEE dd MMMM yyyy', { locale: fr })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{format(new Date(session.scheduled_at), 'HH:mm', { locale: fr })}</span>
                  <span className="text-muted-foreground">·</span>
                  <span>{session.duration_minutes} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{participantCount}/{session.max_participants}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="info">Infos</TabsTrigger>
              <TabsTrigger value="participants">
                Participants ({participantCount})
              </TabsTrigger>
              <TabsTrigger value="chat" className="gap-1">
                <MessageCircle className="h-4 w-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="resources">
                Ressources ({resources.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4">
              {session.description && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {session.description}
                    </p>
                  </CardContent>
                </Card>
              )}

              {session.tags && session.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {session.tags.map((tag, i) => (
                    <Badge key={i} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Join/Leave Flow */}
              {showJoinFlow && (
                <Card className="border-primary">
                  <CardHeader>
                    <CardTitle className="text-base">Comment vous sentez-vous ?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">😔</span>
                      <Slider
                        value={[moodBefore]}
                        onValueChange={([v]) => setMoodBefore(v)}
                        min={1}
                        max={10}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-2xl">😊</span>
                      <span className="font-bold text-lg w-8 text-center">{moodBefore}</span>
                    </div>
                    <Button onClick={handleJoin} className="w-full gap-2">
                      <Video className="h-4 w-4" />
                      Rejoindre maintenant
                    </Button>
                  </CardContent>
                </Card>
              )}

              {showLeaveFlow && (
                <Card className="border-primary">
                  <CardHeader>
                    <CardTitle className="text-base">Comment vous sentez-vous maintenant ?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">😔</span>
                      <Slider
                        value={[moodAfter]}
                        onValueChange={([v]) => setMoodAfter(v)}
                        min={1}
                        max={10}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-2xl">😊</span>
                      <span className="font-bold text-lg w-8 text-center">{moodAfter}</span>
                    </div>

                    <div>
                      <p className="text-sm mb-2">Votre avis (optionnel)</p>
                      <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            className="p-1"
                          >
                            <Star 
                              className={cn(
                                "h-6 w-6 transition-colors",
                                star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                              )} 
                            />
                          </button>
                        ))}
                      </div>
                      <Textarea
                        placeholder="Partagez votre expérience..."
                        value={feedback}
                        onChange={e => setFeedback(e.target.value)}
                        rows={2}
                      />
                    </div>

                    <Button onClick={handleLeave} className="w-full">
                      Terminer et quitter
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="participants">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {participants.map(participant => (
                      <div 
                        key={participant.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50"
                      >
                        <Avatar>
                          <AvatarFallback className="bg-primary/10">
                            {participant.user_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {participant.user_name || 'Participant'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {participant.role === 'co-host' ? 'Co-animateur' : 
                             participant.role === 'moderator' ? 'Modérateur' : 'Participant'}
                          </p>
                        </div>
                        {participant.status === 'attended' && (
                          <Badge variant="outline" className="text-green-500 border-green-500/20">
                            Présent
                          </Badge>
                        )}
                      </div>
                    ))}

                    {participants.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">
                        Aucun participant inscrit pour l'instant
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chat" className="h-[400px]">
              <GroupSessionChat
                messages={messages}
                currentUserId={currentUserId}
                onSendMessage={onSendMessage}
                disabled={!isRegistered && !isLive}
              />
            </TabsContent>

            <TabsContent value="resources">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {resources.map(resource => (
                      <a
                        key={resource.id}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          {resource.resource_type === 'link' ? (
                            <LinkIcon className="h-5 w-5 text-primary" />
                          ) : (
                            <FileText className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{resource.title}</p>
                          {resource.description && (
                            <p className="text-xs text-muted-foreground truncate">
                              {resource.description}
                            </p>
                          )}
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </a>
                    ))}

                    {resources.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">
                        Aucune ressource partagée pour cette session
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer Actions */}
        {!isPast && !showJoinFlow && !showLeaveFlow && (
          <div className="border-t p-4 flex gap-3">
            {isLive ? (
              isRegistered ? (
                <>
                  <Button 
                    className="flex-1 gap-2 bg-green-500 hover:bg-green-600"
                    onClick={() => setShowJoinFlow(true)}
                  >
                    <Video className="h-4 w-4" />
                    Rejoindre la session
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowLeaveFlow(true)}
                  >
                    Quitter
                  </Button>
                </>
              ) : (
                <Button 
                  className="flex-1 gap-2"
                  onClick={() => {
                    onRegister();
                    setShowJoinFlow(true);
                  }}
                >
                  <UserPlus className="h-4 w-4" />
                  S'inscrire et rejoindre
                </Button>
              )
            ) : isRegistered ? (
              <Button 
                variant="outline" 
                className="flex-1 gap-2"
                onClick={onUnregister}
              >
                <UserMinus className="h-4 w-4" />
                Annuler l'inscription
              </Button>
            ) : (
              <Button 
                className="flex-1 gap-2"
                onClick={onRegister}
                disabled={participantCount >= session.max_participants}
              >
                <UserPlus className="h-4 w-4" />
                {participantCount >= session.max_participants ? 'Session complète' : "S'inscrire"}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GroupSessionDetail;
