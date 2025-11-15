import React, { useState, useEffect } from 'react';
import { Bookmark, Trash2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

interface SavedPost {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  focus?: string;
  savedAt: string;
}

interface SavedPostsTabProps {
  posts: SavedPost[];
  onPostClick?: (postId: string) => void;
  onRemoveSaved?: (postId: string) => void;
}

const BOOKMARKS_KEY = 'community_bookmarks';

export const SavedPostsTab: React.FC<SavedPostsTabProps> = ({
  posts,
  onPostClick,
  onRemoveSaved,
}) => {
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>(posts);
  const { toast } = useToast();

  useEffect(() => {
    setSavedPosts(posts);
  }, [posts]);

  const handleRemoveFromSaved = (postId: string) => {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    if (stored) {
      try {
        let bookmarks = JSON.parse(stored) as string[];
        bookmarks = bookmarks.filter(id => id !== postId);
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
      } catch {
        // ignore parsing errors
      }
    }

    setSavedPosts(prev => prev.filter(p => p.id !== postId));
    onRemoveSaved?.(postId);
    toast({
      title: 'Supprimé',
      description: 'Le message a été retiré de tes favoris.',
    });
  };

  if (savedPosts.length === 0) {
    return (
      <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-8 text-center">
        <Bookmark className="mx-auto h-12 w-12 text-amber-300 mb-3" aria-hidden="true" />
        <h3 className="text-sm font-semibold text-amber-900 mb-1">
          Aucun message favorisé
        </h3>
        <p className="text-xs text-amber-700">
          Les messages que tu marques comme favoris apparaîtront ici. C'est une bonne façon de
          retrouver les paroles qui t'ont touchée.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Bookmark className="h-5 w-5 text-amber-600" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-amber-900">
          {savedPosts.length} message{savedPosts.length > 1 ? 's' : ''} favori{savedPosts.length > 1 ? 's' : ''}
        </h2>
      </div>

      {savedPosts.map((post) => (
        <article
          key={post.id}
          className="rounded-xl border border-amber-100 bg-white p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onPostClick?.(post.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onPostClick?.(post.id);
            }
          }}
        >
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="font-semibold text-emerald-800">{post.author}</p>
                {post.focus && (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-700 text-xs mt-1">
                    {post.focus}
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {post.timestamp}
              </span>
            </div>

            <p className="text-sm text-slate-700 line-clamp-3">
              {post.content}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-amber-50">
              <span className="text-xs text-muted-foreground">
                Ajouté {post.savedAt}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFromSaved(post.id);
                }}
                className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                title="Retirer des favoris"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Retirer</span>
              </Button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};
