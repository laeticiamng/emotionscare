/**
 * Page des Buddies B2C - Version enrichie
 */

import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
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
  Filter,
  Settings,
  Send,
  Bell,
  Circle
} from 'lucide-react';
import PageRoot from '@/components/common/PageRoot';
import { useAuth } from '@/contexts/AuthContext';
import { 
  useBuddies, 
  useBuddyChat, 
  useBuddyPresence,
  useBuddyNotifications 
} from '@/modules/buddies/hooks';
import { 
  BuddyCard, 
  BuddyChat, 
  BuddyRequests, 
  BuddyStatsCard,
  BuddyProfileEditor,
  BuddyFiltersModal,
  BuddySentRequests,
  OnlineBuddiesList,
  NotificationsPanel,
  BuddyRecommendations
} from '@/modules/buddies/components';
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
    discoverBuddies,
    updateProfile
  } = useBuddies();

  // Extraire les IDs des buddies pour la présence
  const buddyIds = useMemo(() => 
    matches.map(m => m.buddy_profile?.user_id).filter(Boolean) as string[], 
    [matches]
  );

  // Hook de présence temps réel
  const { 
    onlineBuddies, 
    onlineCount, 
    isConnected,
    isBuddyOnline 
  } = useBuddyPresence(buddyIds);

  // Hook de notifications
  const {
    notifications,
    unreadCount: notifUnreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification
  } = useBuddyNotifications();

  const [activeTab, setActiveTab] = useState('matches');
  const [selectedMatch, setSelectedMatch] = useState<BuddyMatch | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileEditorOpen, setProfileEditorOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const buddyChat = useBuddyChat(
    selectedMatch?.id || '',
    selectedMatch?.buddy_profile?.user_id || ''
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    discoverBuddies({ ...filters, search: searchQuery });
  };

  // Séparer les buddies en ligne et hors ligne
  const onlineMatches = matches.filter(m => m.buddy_profile && isBuddyOnline(m.buddy_profile.user_id));
  const offlineMatches = matches.filter(m => m.buddy_profile && !isBuddyOnline(m.buddy_profile.user_id));

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
                {isConnected && onlineCount > 0 && (
                  <Badge variant="outline" className="gap-1 ml-2">
                    <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                    {onlineCount} en ligne
                  </Badge>
                )}
              </h1>
              <p className="text-muted-foreground mt-1">
                Trouvez votre partenaire de bien-être idéal
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <div className="relative">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="gap-2"
                >
                  <Bell className="h-4 w-4" />
                  {notifUnreadCount > 0 && (
                    <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {notifUnreadCount}
                    </Badge>
                  )}
                </Button>
                
                {notificationsOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 z-50">
                    <NotificationsPanel
                      notifications={notifications}
                      onMarkAsRead={markAsRead}
                      onMarkAllAsRead={markAllAsRead}
                      onClear={clearNotification}
                    />
                  </div>
                )}
              </div>

              <Button variant="outline" size="sm" onClick={() => setProfileEditorOpen(true)} className="gap-2">
                <Settings className="h-4 w-4" />
                Mon profil
              </Button>
              
              {requests.length > 0 && (
                <Badge variant="destructive" className="gap-1">
                  <UserPlus className="h-4 w-4" />
                  {requests.length}
                </Badge>
              )}
              {unreadCount > 0 && (
                <Badge className="gap-1">
                  <MessageCircle className="h-4 w-4" />
                  {unreadCount}
                </Badge>
              )}
            </div>
          </motion.div>

          {/* Profile Editor Modal */}
          <BuddyProfileEditor
            open={profileEditorOpen}
            onOpenChange={setProfileEditorOpen}
            profile={myProfile}
            onSave={updateProfile}
          />

          {/* Filters Modal */}
          <BuddyFiltersModal
            open={filtersOpen}
            onOpenChange={setFiltersOpen}
            filters={filters}
            onApply={(newFilters) => {
              setFilters(newFilters);
              discoverBuddies(newFilters);
            }}
          />

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
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar - Buddies en ligne */}
              <div className="lg:col-span-1 space-y-4">
                <OnlineBuddiesList
                  buddies={onlineBuddies}
                  isConnected={isConnected}
                  onMessageBuddy={(odaL) => {
                    const match = matches.find(m => m.buddy_profile?.user_id === odaL);
                    if (match) setSelectedMatch(match);
                  }}
                />

                {/* Recommandations */}
                <BuddyRecommendations
                  buddies={discoveredBuddies.slice(0, 5)}
                  onSendRequest={sendBuddyRequest}
                  onRefresh={() => discoverBuddies(filters)}
                />
              </div>

              {/* Main Area */}
              <div className="lg:col-span-3">
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <div className="space-y-6">
                        {/* Buddies en ligne */}
                        {onlineMatches.length > 0 && (
                          <div className="space-y-3">
                            <h3 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                              <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                              En ligne ({onlineMatches.length})
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {onlineMatches.map(match => (
                                <BuddyCard
                                  key={match.id}
                                  profile={match.buddy_profile!}
                                  compatibilityScore={match.compatibility_score}
                                  isMatched={true}
                                  onMessage={() => setSelectedMatch(match)}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Buddies hors ligne */}
                        {offlineMatches.length > 0 && (
                          <div className="space-y-3">
                            <h3 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                              <Circle className="h-2 w-2 fill-gray-400 text-gray-400" />
                              Hors ligne ({offlineMatches.length})
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {offlineMatches.map(match => (
                                <BuddyCard
                                  key={match.id}
                                  profile={match.buddy_profile!}
                                  compatibilityScore={match.compatibility_score}
                                  isMatched={true}
                                  onMessage={() => setSelectedMatch(match)}
                                />
                              ))}
                            </div>
                          </div>
                        )}
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
                          <Button type="button" variant="outline" onClick={() => setFiltersOpen(true)}>
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                  {/* Demandes reçues */}
                  <TabsContent value="requests" className="space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <UserPlus className="h-5 w-5" /> Demandes reçues
                    </h3>
                    <BuddyRequests
                      requests={requests}
                      onAccept={id => respondToRequest(id, true)}
                      onDecline={id => respondToRequest(id, false)}
                    />
                    
                    <h3 className="text-lg font-semibold flex items-center gap-2 pt-4">
                      <Send className="h-5 w-5" /> Demandes envoyées
                    </h3>
                    {user && <BuddySentRequests userId={user.id} />}
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {matches.map(match => {
                          const isOnline = match.buddy_profile && isBuddyOnline(match.buddy_profile.user_id);
                          return (
                            <Card 
                              key={match.id}
                              className="cursor-pointer hover:shadow-lg transition-shadow"
                              onClick={() => setSelectedMatch(match)}
                            >
                              <CardContent className="p-4 flex items-center gap-3">
                                <div className="relative">
                                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-semibold">
                                    {match.buddy_profile?.display_name?.charAt(0) || 'B'}
                                  </div>
                                  <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">
                                    {match.buddy_profile?.display_name || 'Buddy'}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {match.interaction_count} messages
                                  </p>
                                </div>
                                {isOnline && (
                                  <Badge variant="outline" className="text-xs gap-1">
                                    <Circle className="h-1.5 w-1.5 fill-green-500 text-green-500" />
                                    En ligne
                                  </Badge>
                                )}
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </TabsContent>

                  {/* Statistiques */}
                  <TabsContent value="stats">
                    <BuddyStatsCard stats={stats} />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageRoot>
  );
};

export default BuddiesPage;
