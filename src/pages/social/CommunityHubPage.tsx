// @ts-nocheck
/**
 * CommunityHubPage — Hub social unifié
 * Regroupe Entraide, Buddies, Sessions de groupe et Cercles
 */
import React, { Suspense, lazy } from 'react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Heart, UserPlus, Video, MessageCircle, Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const CommunityPage = lazy(() => import('@/pages/social/CommunityPage'));
const BuddiesPage = lazy(() => import('@/pages/social/BuddiesPage'));
const GroupSessionsPage = lazy(() => import('@/pages/social/GroupSessionsPage'));
const EntraidePage = lazy(() => import('@/pages/EntraidePage'));

const TABS = [
  { id: 'entraide', label: 'Entraide', icon: Heart },
  { id: 'buddies', label: 'Buddies', icon: UserPlus },
  { id: 'groups', label: 'Sessions', icon: Video },
  { id: 'community', label: 'Cercles', icon: MessageCircle },
] as const;

const LoadingFallback = () => (
  <div className="flex items-center justify-center py-20">
    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
  </div>
);

const CommunityHubPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'entraide';

  usePageSEO({
    title: 'Communauté — Entraide & Soutien | EmotionsCare',
    description: 'Rejoignez la communauté EmotionsCare : cercles d\'entraide entre soignants, buddies, sessions de groupe et espaces de parole.',
  });

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab }, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-7 w-7 text-primary" />
            <h1 className="text-3xl font-bold">Communauté</h1>
          </div>
          <p className="text-muted-foreground">
            Un espace bienveillant entre soignants — entraide, écoute et partage
          </p>
        </div>

        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        >
          <Card>
            <CardContent className="p-4 text-center">
              <Heart className="h-5 w-5 text-rose-500 mx-auto mb-1" />
              <p className="text-lg font-bold">Entraide</p>
              <p className="text-xs text-muted-foreground">Cercles de soutien</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <UserPlus className="h-5 w-5 text-blue-500 mx-auto mb-1" />
              <p className="text-lg font-bold">Buddies</p>
              <p className="text-xs text-muted-foreground">Trouver un binôme</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Video className="h-5 w-5 text-green-500 mx-auto mb-1" />
              <p className="text-lg font-bold">Sessions</p>
              <p className="text-xs text-muted-foreground">Pratiquer ensemble</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <MessageCircle className="h-5 w-5 text-violet-500 mx-auto mb-1" />
              <p className="text-lg font-bold">Cercles</p>
              <p className="text-xs text-muted-foreground">Groupes thématiques</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Important notice */}
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardContent className="p-4 flex items-start gap-3">
            <span className="text-xl">🤝</span>
            <div>
              <p className="text-sm font-medium">Espace bienveillant & confidentiel</p>
              <p className="text-xs text-muted-foreground">
                Cet espace est réservé aux professionnels de santé. Les échanges sont anonymisés par défaut. 
                La modération est active 24/7 pour garantir un cadre sécurisant.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="w-full justify-start overflow-x-auto flex-nowrap mb-6">
            {TABS.map(({ id, label, icon: Icon }) => (
              <TabsTrigger key={id} value={id} className="gap-1.5 shrink-0">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="entraide">
            <Suspense fallback={<LoadingFallback />}>
              <EntraidePage />
            </Suspense>
          </TabsContent>

          <TabsContent value="buddies">
            <Suspense fallback={<LoadingFallback />}>
              <BuddiesPage />
            </Suspense>
          </TabsContent>

          <TabsContent value="groups">
            <Suspense fallback={<LoadingFallback />}>
              <GroupSessionsPage />
            </Suspense>
          </TabsContent>

          <TabsContent value="community">
            <Suspense fallback={<LoadingFallback />}>
              <CommunityPage />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CommunityHubPage;
