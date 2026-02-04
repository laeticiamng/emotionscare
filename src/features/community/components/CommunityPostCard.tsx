/**
 * CommunityPostCard - Carte de publication communautaire
 */

import React, { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal,
  Flag,
  Bookmark,
  Smile,
  Shield
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorBadge?: string;
  content: string;
  mood?: string;
  createdAt: Date;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  tags: string[];
  isModerated: boolean;
}

interface CommunityPostCardProps {
  post: CommunityPost;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onReport: (postId: string) => void;
  className?: string;
}

export const CommunityPostCard = memo<CommunityPostCardProps>(({
  post,
  onLike,
  onComment,
  onShare,
  onBookmark,
  onReport,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = post.content.length > 280;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={post.authorAvatar} alt={post.authorName} />
                <AvatarFallback>
                  {post.authorName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{post.authorName}</span>
                  {post.authorBadge && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {post.authorBadge}
                    </Badge>
                  )}
                  {post.isModerated && (
                    <Shield className="h-3 w-3 text-green-500" aria-label="Modéré" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(post.createdAt, { locale: fr, addSuffix: true })}
                </span>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onBookmark(post.id)}>
                  <Bookmark className="h-4 w-4 mr-2" />
                  {post.isBookmarked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onReport(post.id)}
                  className="text-destructive"
                >
                  <Flag className="h-4 w-4 mr-2" />
                  Signaler
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          {/* Mood tag */}
          {post.mood && (
            <Badge variant="outline" className="mb-2">
              <Smile className="h-3 w-3 mr-1" />
              {post.mood}
            </Badge>
          )}

          {/* Contenu */}
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {shouldTruncate && !isExpanded 
              ? `${post.content.slice(0, 280)}...`
              : post.content
            }
          </p>
          
          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary text-sm font-medium mt-1 hover:underline"
            >
              {isExpanded ? 'Voir moins' : 'Voir plus'}
            </button>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {post.tags.map((tag, i) => (
                <Badge 
                  key={i} 
                  variant="secondary" 
                  className="text-xs font-normal"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-0 border-t">
          <div className="flex items-center justify-between w-full pt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike(post.id)}
              className={cn(
                "gap-2",
                post.isLiked && "text-red-500"
              )}
            >
              <Heart 
                className={cn("h-4 w-4", post.isLiked && "fill-current")} 
              />
              <span>{post.likesCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onComment(post.id)}
              className="gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{post.commentsCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare(post.id)}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
});

CommunityPostCard.displayName = 'CommunityPostCard';

export default CommunityPostCard;
