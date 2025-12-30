/**
 * Page des Buddies B2C
 */

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Search, 
  Heart, 
  MessageCircle, 
  UserPlus,
  TrendingUp,
  Sparkles,
  Filter
} from 'lucide-react';
import PageRoot from '@/components/common/PageRoot';
import { useAuth } from '@/contexts/AuthContext';
import { useBuddies, useBuddyChat } from '@/modules/buddies/hooks/useBuddies';
import { BuddyCard } from '@/modules/buddies/components/BuddyCard';
import { BuddyChat } from '@/modules/buddies/components/BuddyChat';
import { BuddyRequests } from '@/modules/buddies/components/BuddyRequests';
import { BuddyStatsCard } from '@/modules/buddies/components/BuddyStats';
import type { BuddyMatch } from '@/modules/buddies/types';
import { motion } from 'framer-motion';

const BuddiesPage: React.FC = () => {
  const { user } = useAuth();
  const {
    myProfile,
    matches,
    discoveredBuddies,
    requests,
    stats,
    unreadCount,
    loading,
    filters,
    setFilters,
    sendBuddyRequest,
    respondToRequest,
    discoverBuddies
  } = useBuddies();

  const [activeTab, setActiveTab] = useState('matches');
  const [selectedMatch, setSelectedMatch] = useState<BuddyMatch | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const buddyChat = useBuddyChat(
    selectedMatch?.id || '',
    selectedMatch?.buddy_profile?.user_id || ''
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    discoverBuddies({ ...filters, search: searchQuery });
  };

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
                <Heart className="h-8 w-8 text-pink-500" />
                <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                  Buddy System
                </span>
              </h1>
              <p className="text-muted-foreground mt-1">
                Trouvez votre partenaire de bien-être idéal
              </p>
            </div>

            <div className="flex items-center gap-3">
              {requests.length > 0 && (
                <Badge variant="destructive" className="gap-1">
                  <UserPlus className="h-4 w-4" />
                  {requests.length} demande{requests.length > 1 ? 's' : ''}
                </Badge>
              )}
              {unreadCount > 0 && (
                <Badge className="gap-1">
                  <MessageCircle className="h-4 w-4" />
                  {unreadCount} message{unreadCount > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </motion.div>

          {/* Chat View */}
          {selectedMatch && (
            <div className="fixed inset-0 z-50 bg-background md:relative md:inset-auto">
              <div className="h-screen md:h-[600px]">
                <BuddyChat
                  buddy={selectedMatch.buddy_profile!}
                  messages={buddyChat.messages}
                  currentUserId={user?.id || ''}
                  onSendMessage={buddyChat.sendMessage}
                  onBack={() => setSelectedMatch(null)}
                />
              </div>
            </div>
          )}

          {/* Main Content */}
          {!selectedMatch && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
                <TabsTrigger value="matches" className="gap-2">
                  <Users className="h-4 w-4" />
                  Mes Buddies ({matches.length})
                </TabsTrigger>
                <TabsTrigger value="discover" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Découvrir
                </TabsTrigger>
                <TabsTrigger value="requests" className="gap-2 relative">
                  <UserPlus className="h-4 w-4" />
                  Demandes
                  {requests.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center">
                      {requests.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="messages" className="gap-2 relative">
                  <MessageCircle className="h-4 w-4" />
                  Messages
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="stats" className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Statistiques
                </TabsTrigger>
              </TabsList>

              {/* Mes Buddies */}
              <TabsContent value="matches">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                      <Card key={i} className="animate-pulse h-64" />
                    ))}
                  </div>
                ) : matches.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Aucun buddy pour le moment</h3>
                      <p className="text-muted-foreground mb-4">
                        Découvrez de nouveaux profils et envoyez des demandes
                      </p>
                      <Button onClick={() => setActiveTab('discover')}>
                        Découvrir des buddies
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {matches.map(match => (
                      <BuddyCard
                        key={match.id}
                        profile={match.buddy_profile!}
                        compatibilityScore={match.compatibility_score}
                        isMatched={true}
                        onMessage={() => setSelectedMatch(match)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Découvrir */}
              <TabsContent value="discover" className="space-y-6">
                {/* Search */}
                <Card>
                  <CardContent className="p-4">
                    <form onSubmit={handleSearch} className="flex gap-2">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Rechercher par intérêts, objectifs..."
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Button type="submit">Rechercher</Button>
                      <Button type="button" variant="outline">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Results */}
                {discoveredBuddies.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Aucun profil trouvé. Essayez d'autres critères.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {discoveredBuddies.map(buddy => (
                      <BuddyCard
                        key={buddy.id}
                        profile={buddy}
                        onSendRequest={() => sendBuddyRequest(buddy.user_id)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Demandes */}
              <TabsContent value="requests">
                <BuddyRequests
                  requests={requests}
                  onAccept={id => respondToRequest(id, true)}
                  onDecline={id => respondToRequest(id, false)}
                />
              </TabsContent>

              {/* Messages */}
              <TabsContent value="messages">
                {matches.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Connectez-vous avec des buddies pour commencer à discuter
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {matches.map(match => (
                      <Card 
                        key={match.id}
                        className="cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => setSelectedMatch(match)}
                      >
                        <CardContent className="p-4 flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            {match.buddy_profile?.display_name?.charAt(0) || 'B'}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">
                              {match.buddy_profile?.display_name || 'Buddy'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {match.interaction_count} messages
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Statistiques */}
              <TabsContent value="stats">
                <BuddyStatsCard stats={stats} />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </PageRoot>
  );
};

export default BuddiesPage;
