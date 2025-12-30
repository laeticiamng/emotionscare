/**
 * Page des sessions de groupe B2C
 */

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, Plus, Sparkles, Video, TrendingUp } from 'lucide-react';
import PageRoot from '@/components/common/PageRoot';
import { useAuth } from '@/contexts/AuthContext';
import { useGroupSessions, useGroupSession } from '@/modules/group-sessions/hooks/useGroupSessions';
import { GroupSessionCard } from '@/modules/group-sessions/components/GroupSessionCard';
import { CreateSessionModal } from '@/modules/group-sessions/components/CreateSessionModal';
import { GroupSessionDetail } from '@/modules/group-sessions/components/GroupSessionDetail';
import { GroupSessionCalendar } from '@/modules/group-sessions/components/GroupSessionCalendar';
import type { GroupSession } from '@/modules/group-sessions/types';
import { motion } from 'framer-motion';

const GroupSessionsPage: React.FC = () => {
  const { user } = useAuth();
  const {
    sessions,
    liveSessions,
    mySessions,
    categories,
    loading,
    createSession,
    registerForSession,
    unregisterFromSession,
    joinSession,
    leaveSession
  } = useGroupSessions({ autoLoad: true });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const sessionDetail = useGroupSession(selectedSessionId || '');

  const handleSelectSession = (session: GroupSession) => {
    setSelectedSessionId(session.id);
    setShowDetail(true);
  };

  const registeredIds = mySessions.map(s => s.id);

  return (
    <PageRoot>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
          >
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Sessions de Groupe
                </span>
              </h1>
              <p className="text-muted-foreground mt-1">
                Participez à des sessions collectives de bien-être
              </p>
            </div>

            <div className="flex items-center gap-3">
              {liveSessions.length > 0 && (
                <Badge className="bg-green-500 gap-1.5 py-1.5">
                  <Video className="h-4 w-4" />
                  {liveSessions.length} en direct
                </Badge>
              )}
              <Button onClick={() => setShowCreateModal(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Créer une session
              </Button>
            </div>
          </motion.div>

          {/* Live Sessions Banner */}
          {liveSessions.length > 0 && (
            <Card className="mb-6 border-green-500/20 bg-gradient-to-r from-green-500/5 to-emerald-500/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-semibold">Sessions en direct</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {liveSessions.map(session => (
                    <GroupSessionCard
                      key={session.id}
                      session={session}
                      isRegistered={registeredIds.includes(session.id)}
                      onJoin={() => handleSelectSession(session)}
                      onSelect={() => handleSelectSession(session)}
                      compact
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Tabs */}
          <Tabs defaultValue="upcoming" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="upcoming" className="gap-2">
                <Sparkles className="h-4 w-4" />
                À venir
              </TabsTrigger>
              <TabsTrigger value="calendar" className="gap-2">
                <Calendar className="h-4 w-4" />
                Calendrier
              </TabsTrigger>
              <TabsTrigger value="my-sessions" className="gap-2">
                <Users className="h-4 w-4" />
                Mes sessions
              </TabsTrigger>
              <TabsTrigger value="stats" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Statistiques
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => (
                    <Card key={i} className="animate-pulse h-48" />
                  ))}
                </div>
              ) : sessions.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Aucune session programmée</p>
                    <Button className="mt-4" onClick={() => setShowCreateModal(true)}>
                      Créer la première session
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sessions.map(session => (
                    <GroupSessionCard
                      key={session.id}
                      session={session}
                      isRegistered={registeredIds.includes(session.id)}
                      onRegister={() => registerForSession(session.id)}
                      onUnregister={() => unregisterFromSession(session.id)}
                      onJoin={() => handleSelectSession(session)}
                      onSelect={() => handleSelectSession(session)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="calendar">
              <GroupSessionCalendar
                sessions={sessions}
                onSelectSession={handleSelectSession}
              />
            </TabsContent>

            <TabsContent value="my-sessions">
              {mySessions.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Vous n'êtes inscrit à aucune session</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mySessions.map(session => (
                    <GroupSessionCard
                      key={session.id}
                      session={session}
                      isRegistered={true}
                      onUnregister={() => unregisterFromSession(session.id)}
                      onJoin={() => handleSelectSession(session)}
                      onSelect={() => handleSelectSession(session)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="stats">
              <Card>
                <CardContent className="py-12 text-center">
                  <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Statistiques disponibles après vos premières sessions</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Modals */}
      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={createSession}
        categories={categories}
      />

      <GroupSessionDetail
        session={sessionDetail.session}
        participants={sessionDetail.participants}
        messages={sessionDetail.messages}
        resources={sessionDetail.resources}
        isRegistered={sessionDetail.isRegistered}
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        onRegister={() => selectedSessionId && registerForSession(selectedSessionId)}
        onUnregister={() => selectedSessionId && unregisterFromSession(selectedSessionId)}
        onJoin={(mood) => selectedSessionId && joinSession(selectedSessionId, mood)}
        onLeave={(mood, feedback, rating) => selectedSessionId && leaveSession(selectedSessionId, mood, feedback, rating)}
        onSendMessage={sessionDetail.sendMessage}
        currentUserId={user?.id}
      />
    </PageRoot>
  );
};

export default GroupSessionsPage;
