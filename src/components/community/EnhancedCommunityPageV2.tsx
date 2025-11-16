import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  HeartHandshake,
  Shield,
  Sparkles,
  Users,
  LayoutGrid,
  BarChart3,
} from 'lucide-react';

import ZeroNumberBoundary from '@/components/accessibility/ZeroNumberBoundary';
import PageSEO from '@/components/seo/PageSEO';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Tabs as UITabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { EnhancedPostComposer } from './EnhancedPostComposer';
import { EnhancedPostCard } from './EnhancedPostCard';
import { TrendingPostsSection } from './TrendingPostsSection';
import { CommunityStatsBoard } from './CommunityStatsBoard';
import { SavedPostsTab } from './SavedPostsTab';
import { useCommunityEnhancements } from '@/hooks/useCommunityEnhancements';

interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  content: string;
  focus: string;
  timestamp: string;
  likes: number;
  comments: number;
  autoFlagged?: boolean;
  userRole?: 'member' | 'mentor' | 'expert';
}

interface TrendingPost {
  id: string;
  title: string;
  snippet: string;
  engagementScore: number;
  reactionCount: number;
  commentCount: number;
  trend: 'up' | 'stable' | 'down';
}

const SENSITIVE_PATTERNS = [
  /suicide/i,
  /me\s+faire\s+mal/i,
  /violence\s+grave/i,
  /danger\s+immédiat/i,
  /harc[eè]lement/i,
];

const REPORT_REASONS = [
  { id: 'tone', label: 'Ton à adoucir' },
  { id: 'privacy', label: 'Respect de l\'intimité' },
  { id: 'other', label: 'Autre' },
] as const;

const detectSensitiveTerm = (message: string) => {
  for (const pattern of SENSITIVE_PATTERNS) {
    if (pattern.test(message)) {
      return pattern.source;
    }
  }
  return null;
};

const generateTrendingPosts = (posts: CommunityPost[]): TrendingPost[] => {
  return posts.slice(0, 5).map((post, index) => ({
    id: post.id,
    title: post.content.slice(0, 50) + '...',
    snippet: post.content.slice(0, 100),
    engagementScore: Math.floor(Math.random() * 100) + 10,
    reactionCount: post.likes,
    commentCount: post.comments,
    trend: index % 2 === 0 ? 'up' : 'stable',
  }));
};

const initialPosts: CommunityPost[] = [
  {
    id: 'aurora',
    author: 'Aurore',
    avatar: '🫧',
    content: 'Je traverse un moment flottant et j\'essaie de rester douce avec moi-même. Merci d\'être là.',
    focus: 'demande d\'écoute',
    timestamp: 'il y a 1 h',
    likes: 12,
    comments: 3,
    userRole: 'member',
  },
  {
    id: 'lumen',
    author: 'Lumen',
    avatar: '🌿',
    content: 'Petit défi : dire non aujourd\'hui sans culpabiliser. Qui veut pratiquer avec moi ? 🙂',
    focus: 'partage d\'expérience',
    timestamp: 'il y a 2 h',
    likes: 8,
    comments: 2,
    userRole: 'mentor',
  },
  {
    id: 'safran',
    author: 'Safran',
    avatar: '🌼',
    content: 'Je cherche une phrase douce pour rassurer une amie. Des idées ?',
    focus: 'entraide',
    timestamp: 'il y a 3 h',
    likes: 5,
    comments: 4,
    userRole: 'expert',
  },
];

interface ReportDraft {
  postId: string | null;
  reason: string;
  message: string;
}

export const EnhancedCommunityPageV2: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // State
  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts);
  const [reportDraft, setReportDraft] = useState<ReportDraft>({ postId: null, reason: REPORT_REASONS[0].id, message: '' });
  const [showSocialConfirm, setShowSocialConfirm] = useState(false);
  const { bookmarks, toggleBookmark, isBookmarked, addReaction } = useCommunityEnhancements();

  const trendingPosts = useMemo(() => generateTrendingPosts(posts), [posts]);

  const communityStats = useMemo(() => ({
    totalMembers: 1250,
    totalPosts: posts.length,
    totalInteractions: posts.reduce((sum, p) => sum + p.likes + p.comments, 0),
    activeToday: 89,
    topContributor: 'Lumen',
    monthlyGrowth: 12,
  }), [posts]);

  const savedPosts = useMemo(() => {
    return bookmarks.map(bookmark => {
      const post = posts.find(p => p.id === bookmark.postId);
      if (!post) return null;
      return {
        id: post.id,
        author: post.author,
        content: post.content,
        timestamp: post.timestamp,
        focus: post.focus,
        savedAt: bookmark.savedAt,
      };
    }).filter(Boolean) as Array<{
      id: string;
      author: string;
      content: string;
      timestamp: string;
      focus?: string;
      savedAt: string;
    }>;
  }, [posts, bookmarks]);

  const handleCreatePost = useCallback((content: string) => {
    const sensitiveTerm = detectSensitiveTerm(content);
    const newEntry: CommunityPost = {
      id: `post-${Date.now()}`,
      author: 'Moi',
      avatar: '✨',
      content,
      focus: 'partage personnel',
      timestamp: 'à l\'instant',
      likes: 0,
      comments: 0,
      autoFlagged: Boolean(sensitiveTerm),
      userRole: 'member',
    };

    setPosts((prev) => [newEntry, ...prev]);

    if (sensitiveTerm) {
      toast({
        title: 'Message partagé avec soin',
        description: 'Notre équipe de veille reçoit un signal discret.',
      });
    } else {
      toast({
        title: 'Merci pour ce partage',
        description: 'Ton message rejoint la communauté.',
      });
    }
  }, [toast]);

  const handleReply = useCallback((postId: string) => {
    toast({
      title: 'Mode réponse',
      description: 'Formule ta réponse avec bienveillance.',
    });
  }, [toast]);

  const handleReport = useCallback((postId: string) => {
    setReportDraft({ postId, reason: REPORT_REASONS[0].id, message: '' });
  }, []);

  const handleSubmitReport = useCallback(() => {
    if (!reportDraft.postId) return;

    toast({
      title: 'Signalement transmis en douceur',
      description: 'Merci, une personne dédiée va regarder.',
    });
    setReportDraft({ postId: null, reason: REPORT_REASONS[0].id, message: '' });
  }, [reportDraft, toast]);

  const handleReactionAdd = useCallback((postId: string, reaction: string) => {
    addReaction(postId, reaction);
    setPosts(prev =>
      prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p)
    );
  }, [addReaction]);

  const handleTrendingPostClick = useCallback((postId: string) => {
    if (postId === 'view-all') {
      toast({
        title: 'Filtrer les tendances',
        description: 'Affichage complet des posts populaires.',
      });
      return;
    }

    const post = posts.find(p => p.id === postId);
    if (post) {
      toast({
        title: post.author,
        description: post.content.slice(0, 100),
      });
    }
  }, [posts, toast]);

  return (
    <ZeroNumberBoundary as="div" className="mx-auto min-h-screen max-w-5xl bg-gradient-to-b from-emerald-50 via-white to-white">
      <PageSEO title="Communauté Enrichie" description="Partage et entraide avec plus de fonctionnalités" noIndex />

      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-emerald-100 bg-white/90 px-4 py-3 backdrop-blur">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          aria-label="Revenir"
          className="transition-colors hover:text-emerald-600"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </Button>
        <div className="text-center">
          <h1 className="text-lg font-semibold">Communauté Améliorée</h1>
          <p className="text-xs text-muted-foreground">On se répond en douceur, sans performance.</p>
        </div>
        <div className="h-8 w-8" aria-hidden="true" />
      </header>

      {/* Main Content */}
      <main className="space-y-6 px-4 pb-16 pt-6">
        {/* Welcome Section */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-emerald-100 bg-white/80 p-4 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <Shield className="mt-1 h-5 w-5 text-emerald-600" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-emerald-700">
                Bienvenue dans notre espace amélioré de bienveillance.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Nouvelle version : réactions enrichies, sauvegarde des messages favoris, et bien plus.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Stats Dashboard */}
        <CommunityStatsBoard stats={communityStats} />

        {/* Trending Posts */}
        {trendingPosts.length > 0 && (
          <TrendingPostsSection
            posts={trendingPosts}
            onPostClick={handleTrendingPostClick}
          />
        )}

        {/* Post Composer */}
        <EnhancedPostComposer onSubmit={handleCreatePost} />

        {/* Tabs: Feed & Saved */}
        <UITabs defaultValue="feed" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="feed" className="flex items-center gap-2">
              <Users className="h-4 w-4" aria-hidden="true" />
              <span>Fil ({posts.length})</span>
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" aria-hidden="true" />
              <span>Favoris ({savedPosts.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* Feed Tab */}
          <TabsContent value="feed" className="space-y-4">
            {posts.length === 0 ? (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-8 text-center">
                <Sparkles className="mx-auto h-12 w-12 text-emerald-300 mb-3" aria-hidden="true" />
                <h3 className="text-sm font-semibold text-emerald-900 mb-1">
                  Aucun message pour le moment
                </h3>
                <p className="text-xs text-emerald-700">
                  Sois la première personne à partager un moment avec la communauté.
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {posts.map((post) => (
                  <li key={post.id}>
                    <EnhancedPostCard
                      id={post.id}
                      author={post.author}
                      avatar={post.avatar}
                      content={post.content}
                      focus={post.focus}
                      timestamp={post.timestamp}
                      likes={post.likes}
                      comments={post.comments}
                      hasAutoFlag={post.autoFlagged}
                      userRole={post.userRole}
                      onReply={handleReply}
                      onReport={handleReport}
                      onReactionAdd={handleReactionAdd}
                    />
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>

          {/* Saved Tab */}
          <TabsContent value="saved">
            <SavedPostsTab posts={savedPosts} />
          </TabsContent>
        </UITabs>
      </main>

      {/* Report Dialog */}
      <Dialog
        open={reportDraft.postId !== null}
        onOpenChange={(open) => {
          if (!open) setReportDraft({ postId: null, reason: REPORT_REASONS[0].id, message: '' });
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Signaler doucement</DialogTitle>
            <DialogDescription>
              Indique la raison et ajoute un message si tu le souhaites.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="report-reason">Raison</Label>
              <Select
                value={reportDraft.reason}
                onValueChange={(value) =>
                  setReportDraft((prev) => ({ ...prev, reason: value }))
                }
              >
                <SelectTrigger id="report-reason">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_REASONS.map((reason) => (
                    <SelectItem key={reason.id} value={reason.id}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="report-message">Message (optionnel)</Label>
              <Textarea
                id="report-message"
                value={reportDraft.message}
                onChange={(event) =>
                  setReportDraft((prev) => ({ ...prev, message: event.target.value }))
                }
                placeholder="Décris ce qui t'a mis mal à l'aise."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setReportDraft({ postId: null, reason: REPORT_REASONS[0].id, message: '' })}
            >
              Annuler
            </Button>
            <Button onClick={handleSubmitReport}>Envoyer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Social Cocon Confirmation */}
      <Dialog open={showSocialConfirm} onOpenChange={setShowSocialConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejoindre le Social Cocon</DialogTitle>
            <DialogDescription>
              Cet espace vocal est modéré en continu.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Une fois dans le Cocon, garde les règles de confidentialité et préviens si tu entends une situation à risque.
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowSocialConfirm(false)}>
              Rester ici
            </Button>
            <Button onClick={() => navigate('/app/social-cocon')}>
              Entrer dans le Cocon
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ZeroNumberBoundary>
  );
};
