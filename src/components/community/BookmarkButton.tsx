import React, { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface BookmarkButtonProps {
  postId: string;
  initialBookmarked?: boolean;
  onBookmarkChange?: (bookmarked: boolean) => void;
}

const BOOKMARKS_KEY = 'community_bookmarks';

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  postId,
  initialBookmarked = false,
  onBookmarkChange,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load bookmarks from localStorage
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    if (stored) {
      try {
        const bookmarks = JSON.parse(stored) as string[];
        setIsBookmarked(bookmarks.includes(postId));
      } catch {
        // ignore parsing errors
      }
    }
  }, [postId]);

  const handleToggleBookmark = async () => {
    try {
      setIsLoading(true);
      const stored = localStorage.getItem(BOOKMARKS_KEY);
      let bookmarks: string[] = [];

      if (stored) {
        try {
          bookmarks = JSON.parse(stored) as string[];
        } catch {
          bookmarks = [];
        }
      }

      let newBookmarked = isBookmarked;
      if (isBookmarked) {
        bookmarks = bookmarks.filter(id => id !== postId);
        newBookmarked = false;
      } else {
        if (!bookmarks.includes(postId)) {
          bookmarks.push(postId);
        }
        newBookmarked = true;
      }

      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
      setIsBookmarked(newBookmarked);
      onBookmarkChange?.(newBookmarked);

      toast({
        title: newBookmarked ? 'Enregistré' : 'Marque-page supprimé',
        description: newBookmarked
          ? 'Tu peux retrouver ce message dans tes favoris.'
          : 'Le message a été retiré de tes favoris.',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de gérer ton favori.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleBookmark}
      disabled={isLoading}
      className={`${
        isBookmarked ? 'text-amber-500' : 'text-muted-foreground'
      } hover:text-amber-600 transition-colors`}
      title={isBookmarked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      aria-pressed={isBookmarked}
    >
      <Bookmark
        className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`}
        aria-hidden="true"
      />
      <span className="sr-only">
        {isBookmarked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      </span>
    </Button>
  );
};
