// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Heart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import { useAuth } from '@/contexts/AuthContext';
import { reactToPost } from '@/lib/communityService';
import { useToast } from '@/hooks/use-toast';

interface PostItemProps {
  post: any;
  showComments?: boolean;
  onReactionAdded?: () => void;
  getUserName?: (userId: string) => string;
  onPostUpdated?: () => Promise<void>;
}

const PostItem: React.FC<PostItemProps> = ({ 
  post, 
  showComments = false,
  onReactionAdded,
  getUserName,
  onPostUpdated
}) => {
  const [showCommentsSection, setShowCommentsSection] = React.useState(showComments);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const handleReaction = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour réagir",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await reactToPost(post.id, user.id);
      if (onReactionAdded) {
        onReactionAdded();
      }
      if (onPostUpdated) {
        await onPostUpdated();
      }
    } catch (error) {
      // Post reaction error
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter votre réaction",
        variant: "destructive"
      });
    }
  };
  
  // Format the date to "il y a X minutes/heures/jours"
  const formattedDate = post.date ? formatDistanceToNow(new Date(post.date), { 
    addSuffix: true,
    locale: fr 
  }) : '';
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex space-x-2">
          <Avatar>
            <AvatarImage src={post.user?.avatar || ''} />
            <AvatarFallback>
              {post.user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium text-sm">{post.user?.name || 'Anonyme'}</p>
            <p className="text-xs text-muted-foreground">{formattedDate}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="whitespace-pre-line">{post.content}</p>
        
        {post.image_url && (
          <img 
            src={post.image_url}
            alt="Post attachment"
            className="mt-3 rounded-md max-h-72 object-contain"
          />
        )}
      </CardContent>
      
      <CardFooter className="pt-1 pb-2 flex justify-between">
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={handleReaction} className="text-xs">
            <Heart size={16} className="mr-1" />
            {post.reactions || 0}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowCommentsSection(!showCommentsSection)}
            className="text-xs"
          >
            <MessageSquare size={16} className="mr-1" />
            {post.comments?.length || 0}
          </Button>
        </div>
      </CardFooter>
      
      {showCommentsSection && (
        <div className="px-6 pb-3">
          {post.comments && post.comments.length > 0 && (
            <CommentList comments={post.comments} getUserName={getUserName} />
          )}
          <CommentForm postId={post.id} />
        </div>
      )}
    </Card>
  );
};

export default PostItem;
