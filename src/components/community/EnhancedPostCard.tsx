import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Heart,
  AlertCircle,
  Flag,
  MoreHorizontal,
  Eye,
  Clock,
  TrendingUp,
  Share2,
  Copy,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserProfileCard } from './UserProfileCard';
import { useToast } from '@/hooks/use-toast';

interface EnhancedPostCardProps {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  focus?: string;
  timestamp: string;
  likes?: number;
  comments?: number;
  views?: number;
  hasAutoFlag?: boolean;
  onReply?: (postId: string) => void;
  onReport?: (postId: string) => void;
  onReactionAdd?: (postId: string, reaction: string) => void;
  userRole?: 'member' | 'mentor' | 'expert';
}

const ReactionEmojis = ['❤️', '😊', '🙏', '✨', '💪', '🤗', '💯'];
const STORAGE_KEY = 'post_interactions';

interface PostInteraction {
  postId: string;
  liked: boolean;
  bookmarked: boolean;
  reactions: string[];
  viewedAt?: string;
}

export const EnhancedPostCard: React.FC<EnhancedPostCardProps> = ({
  id,
  author,
  avatar = '👤',
  content,
  focus,
  timestamp,
  likes = 0,
  comments = 0,
  views = 0,
  hasAutoFlag = false,
  onReply,
  onReport,
  onReactionAdd,
  userRole = 'member',
}) => {
  const { toast } = useToast();
  const [showReactions, setShowReactions] = useState(false);
  const [totalLikes, setTotalLikes] = useState(likes);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userReactions, setUserReactions] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewCount, setViewCount] = useState(views);

  // Load interaction state
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const interactions: PostInteraction[] = JSON.parse(stored);
        const myInteraction = interactions.find(i => i.postId === id);
        if (myInteraction) {
          setIsLiked(myInteraction.liked);
          setIsBookmarked(myInteraction.bookmarked);
          setUserReactions(myInteraction.reactions || []);
        }
      }
    } catch {}
  }, [id]);

  const saveInteraction = useCallback((update: Partial<PostInteraction>) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const interactions: PostInteraction[] = stored ? JSON.parse(stored) : [];
      const existingIdx = interactions.findIndex(i => i.postId === id);
      
      const current: PostInteraction = existingIdx >= 0 
        ? interactions[existingIdx] 
        : { postId: id, liked: false, bookmarked: false, reactions: [] };
      
      const updated = { ...current, ...update };
      
      if (existingIdx >= 0) {
        interactions[existingIdx] = updated;
      } else {
        interactions.push(updated);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(interactions));
    } catch {}
  }, [id]);

  const handleLike = () => {
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setTotalLikes(prev => newLiked ? prev + 1 : prev - 1);
    saveInteraction({ liked: newLiked });
  };

  const handleReaction = (emoji: string) => {
    if (!userReactions.includes(emoji)) {
      const newReactions = [...userReactions, emoji];
      setUserReactions(newReactions);
      setTotalLikes(prev => prev + 1);
      saveInteraction({ reactions: newReactions });
      onReactionAdd?.(id, emoji);
    }
    setShowReactions(false);
  };

  const handleBookmark = () => {
    const newBookmarked = !isBookmarked;
    setIsBookmarked(newBookmarked);
    saveInteraction({ bookmarked: newBookmarked });
    toast({
      title: newBookmarked ? 'Ajouté aux favoris' : 'Retiré des favoris',
      duration: 2000
    });
  };

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/community/post/${id}`;
    await navigator.clipboard.writeText(url);
    toast({ title: 'Lien copié !', duration: 2000 });
  };

  const handleShare = async () => {
    const text = `💬 ${author}: "${content.slice(0, 100)}${content.length > 100 ? '...' : ''}"`;
    if (navigator.share) {
      await navigator.share({ title: 'Post EmotionsCare', text });
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copié !', duration: 2000 });
    }
  };

  const shouldTruncate = content.length > 280;
  const displayContent = shouldTruncate && !isExpanded 
    ? content.slice(0, 280) + '...' 
    : content;

  const roleConfig = {
    member: { label: 'Membre', color: 'bg-slate-100 text-slate-700' },
    mentor: { label: 'Mentor', color: 'bg-blue-100 text-blue-700' },
    expert: { label: 'Expert', color: 'bg-purple-100 text-purple-700' }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-emerald-100 bg-white/90 dark:bg-slate-900/90 dark:border-slate-700 p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <header className="flex items-start gap-3 mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-lg flex-shrink-0">
          {avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <UserProfileCard
              userName={author}
              userAvatar={avatar}
              userRole={userRole}
              stats={{
                postsCount: Math.floor(Math.random() * 50) + 1,
                commentsCount: Math.floor(Math.random() * 100) + 1,
                reactionsCount: totalLikes,
                joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
              }}
            />
            <Badge className={roleConfig[userRole].color}>
              {roleConfig[userRole].label}
            </Badge>
            {focus && (
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 text-xs">
                {focus}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" aria-hidden="true" />
            <span>{timestamp}</span>
            {viewCount > 0 && (
              <>
                <span>•</span>
                <Eye className="h-3 w-3" aria-hidden="true" />
                <span>{viewCount} vues</span>
              </>
            )}
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleCopyLink}>
              <Copy className="h-4 w-4 mr-2" />
              Copier le lien
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Partager
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onReport?.(id)} className="text-amber-600">
              <Flag className="h-4 w-4 mr-2" />
              Signaler
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Content */}
      <div className="mb-3">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-wrap break-words">
          {displayContent}
        </p>
        {shouldTruncate && (
          <Button 
            variant="link" 
            className="p-0 h-auto text-primary" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Voir moins' : 'Voir plus'}
          </Button>
        )}
        {hasAutoFlag && (
          <div className="mt-2 flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 p-2 border border-amber-100 dark:border-amber-800">
            <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Notre équipe de bienveillance veille sur ce message.
            </p>
          </div>
        )}
      </div>

      {/* User reactions display */}
      {userReactions.length > 0 && (
        <div className="flex items-center gap-1 mb-3">
          <span className="text-xs text-muted-foreground">Vos réactions:</span>
          {userReactions.map((emoji, idx) => (
            <span key={idx} className="text-sm">{emoji}</span>
          ))}
        </div>
      )}

      {/* Engagement Stats */}
      <div className="flex flex-wrap gap-3 mb-3 text-xs text-muted-foreground">
        {totalLikes > 0 && (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            className="hover:text-emerald-600 transition-colors flex items-center gap-1"
          >
            <Heart className={`h-3 w-3 ${isLiked ? 'fill-emerald-500 text-emerald-500' : ''}`} aria-hidden="true" />
            {totalLikes} soutien{totalLikes > 1 ? 's' : ''}
          </motion.button>
        )}
        {comments > 0 && (
          <button className="hover:text-emerald-600 transition-colors flex items-center gap-1">
            <MessageCircle className="h-3 w-3 text-emerald-600" aria-hidden="true" />
            {comments} réponse{comments > 1 ? 's' : ''}
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-1 border-t border-emerald-50 dark:border-slate-700 pt-3 -mx-2">
        {/* Like */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={`h-8 ${isLiked ? 'text-emerald-600' : 'text-muted-foreground hover:text-emerald-600'}`}
        >
          <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} aria-hidden="true" />
          <span className="text-xs">{isLiked ? 'Aimé' : 'Aimer'}</span>
        </Button>

        {/* Reactions */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReactions(!showReactions)}
            className="text-muted-foreground hover:text-emerald-600 h-8"
            title="Ajouter une réaction"
          >
            <span className="text-sm mr-1">😊</span>
            <span className="text-xs">Réagir</span>
          </Button>

          <AnimatePresence>
            {showReactions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                className="absolute bottom-full left-0 mb-2 flex gap-1 rounded-full bg-white dark:bg-slate-800 border border-emerald-200 dark:border-slate-600 p-2 shadow-lg z-20"
                onClick={(e) => e.stopPropagation()}
              >
                {ReactionEmojis.map((emoji) => (
                  <motion.button
                    key={emoji}
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleReaction(emoji)}
                    className={`text-xl ${userReactions.includes(emoji) ? 'opacity-50' : ''}`}
                    aria-label={`Réaction ${emoji}`}
                    disabled={userReactions.includes(emoji)}
                  >
                    {emoji}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Reply */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onReply?.(id)}
          className="text-muted-foreground hover:text-emerald-600 h-8"
          title="Répondre"
        >
          <MessageCircle className="h-4 w-4 mr-1" aria-hidden="true" />
          <span className="text-xs">Répondre</span>
        </Button>

        {/* Bookmark */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBookmark}
          className={`h-8 ${isBookmarked ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
        >
          {isBookmarked ? (
            <BookmarkCheck className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Bookmark className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>

        {/* Share */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          className="text-muted-foreground hover:text-emerald-600 h-8"
        >
          <Share2 className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </motion.article>
  );
};

export default EnhancedPostCard;
