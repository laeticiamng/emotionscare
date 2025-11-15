import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TrendingPost {
  id: string;
  title: string;
  snippet: string;
  engagementScore: number;
  reactionCount: number;
  commentCount: number;
  trend: 'up' | 'stable' | 'down';
}

interface TrendingPostsSectionProps {
  posts: TrendingPost[];
  onPostClick?: (postId: string) => void;
  isLoading?: boolean;
}

export const TrendingPostsSection: React.FC<TrendingPostsSectionProps> = ({
  posts,
  onPostClick,
  isLoading = false,
}) => {
  const [displayedPosts] = useState(posts.slice(0, 5));

  if (displayedPosts.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-emerald-50/30 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-sky-600" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-sky-900">
          Trending Communauté
        </h2>
        <span className="text-xs text-sky-600 bg-sky-100/60 px-2 py-1 rounded-full">
          {displayedPosts.length} tendances
        </span>
      </div>

      <div className="space-y-2">
        {displayedPosts.map((post, index) => (
          <button
            key={post.id}
            onClick={() => onPostClick?.(post.id)}
            className="w-full text-left p-3 rounded-lg bg-white/60 hover:bg-white/80 transition-colors border border-sky-100/50 hover:border-sky-200 cursor-pointer group"
            aria-label={`Tendance ${index + 1}: ${post.title}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-sky-400 to-emerald-400 flex items-center justify-center text-white text-xs font-semibold">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm text-slate-800 group-hover:text-sky-700 transition-colors truncate">
                  {post.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {post.snippet}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      post.trend === 'up'
                        ? 'bg-green-100 text-green-700'
                        : post.trend === 'down'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {post.trend === 'up' ? '↑' : post.trend === 'down' ? '↓' : '→'}{' '}
                    {post.engagementScore}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {post.reactionCount} réactions
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {post.commentCount} commentaires
                  </span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-sky-400 group-hover:text-sky-600 transition-colors flex-shrink-0 mt-1" aria-hidden="true" />
            </div>
          </button>
        ))}
      </div>

      {posts.length > 5 && (
        <Button
          variant="outline"
          className="w-full mt-3 text-sky-700 border-sky-200 hover:bg-sky-50"
          onClick={() => onPostClick?.('view-all')}
        >
          Voir toutes les tendances
        </Button>
      )}
    </section>
  );
};
