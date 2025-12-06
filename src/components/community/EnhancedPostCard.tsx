import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  Heart,
  AlertCircle,
  Smile,
  Flag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookmarkButton } from './BookmarkButton';
import { SharePostButton } from './SharePostButton';
import { UserProfileCard } from './UserProfileCard';

interface EnhancedPostCardProps {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  focus?: string;
  timestamp: string;
  likes?: number;
  comments?: number;
  hasAutoFlag?: boolean;
  onReply?: (postId: string) => void;
  onReport?: (postId: string) => void;
  onReactionAdd?: (postId: string, reaction: string) => void;
  userRole?: 'member' | 'mentor' | 'expert';
}

const ReactionEmojis = ['❤️', '😊', '🙏', '✨', '💪'];

export const EnhancedPostCard: React.FC<EnhancedPostCardProps> = ({
  id,
  author,
  avatar = '👤',
  content,
  focus,
  timestamp,
  likes = 0,
  comments = 0,
  hasAutoFlag = false,
  onReply,
  onReport,
  onReactionAdd,
  userRole = 'member',
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const [totalLikes, setTotalLikes] = useState(likes);

  const handleReaction = (emoji: string) => {
    setTotalLikes(totalLikes + 1);
    onReactionAdd?.(id, emoji);
    setShowReactions(false);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-emerald-100 bg-white/90 p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <header className="flex items-start gap-3 mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-lg flex-shrink-0">
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
            {focus && (
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 text-xs">
                {focus}
              </Badge>
            )}
            <span className="text-xs text-muted-foreground ml-auto flex-shrink-0">
              {timestamp}
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mb-3">
        <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap break-words">
          {content}
        </p>
        {hasAutoFlag && (
          <div className="mt-2 flex items-start gap-2 rounded-lg bg-amber-50 p-2 border border-amber-100">
            <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs text-amber-700">
              Notre équipe de bienveillance veille sur ce message.
            </p>
          </div>
        )}
      </div>

      {/* Engagement Stats */}
      <div className="flex flex-wrap gap-3 mb-3 text-xs text-muted-foreground">
        {totalLikes > 0 && (
          <button className="hover:text-emerald-600 transition-colors flex items-center gap-1">
            <Heart className="h-3 w-3 fill-emerald-500 text-emerald-500" aria-hidden="true" />
            {totalLikes} soutien{totalLikes > 1 ? 's' : ''}
          </button>
        )}
        {comments > 0 && (
          <button className="hover:text-emerald-600 transition-colors flex items-center gap-1">
            <MessageCircle className="h-3 w-3 text-emerald-600" aria-hidden="true" />
            {comments} réponse{comments > 1 ? 's' : ''}
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-1 border-t border-emerald-50 pt-3 -mx-2">
        {/* Reactions */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReactions(!showReactions)}
            className="text-muted-foreground hover:text-emerald-600 h-8"
            title="Ajouter une réaction"
          >
            <Heart className="h-4 w-4 mr-1" aria-hidden="true" />
            <span className="text-xs">Soutien</span>
          </Button>

          {showReactions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute bottom-full left-0 mb-2 flex gap-1 rounded-full bg-white border border-emerald-200 p-2 shadow-lg z-20"
              onClick={(e) => e.stopPropagation()}
            >
              {ReactionEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className="text-xl hover:scale-125 transition-transform"
                  aria-label={`Réaction ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </motion.div>
          )}
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
        <BookmarkButton
          postId={id}
          onBookmarkChange={(bookmarked) => {
            // Handle bookmark change
          }}
        />

        {/* Share */}
        <SharePostButton
          postId={id}
          postContent={content}
          postAuthor={author}
        />

        {/* Report */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onReport?.(id)}
          className="text-muted-foreground hover:text-amber-600 h-8"
          title="Signaler"
        >
          <Flag className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Signaler</span>
        </Button>
      </div>
    </motion.article>
  );
};
