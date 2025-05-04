
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { reactToPost } from '@/lib/communityService';
import { Post } from '@/types/community';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, MessageSquare } from 'lucide-react';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import UserAvatar from './UserAvatar';

interface PostItemProps {
  post: Post;
  getUserName: (userId: string) => string;
  onPostUpdated: () => void;
}

const PostItem: React.FC<PostItemProps> = ({ post, getUserName, onPostUpdated }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleReact = async () => {
    if (!user) {
      toast({
        title: "Non connecté",
        description: "Vous devez être connecté pour réagir",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await reactToPost(post.id);
      onPostUpdated();
      toast({
        title: "Merci !",
        description: "Votre réaction a été enregistrée"
      });
    } catch (error) {
      console.error('Error reacting to post:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter votre réaction",
        variant: "destructive"
      });
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Aujourd'hui, " + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return "Hier, " + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  };

  return (
    <Card className="mb-6 hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <UserAvatar user={{ id: post.user_id, name: getUserName(post.user_id) }} />
            <div>
              <span className="font-medium">{getUserName(post.user_id)}</span>
              <p className="text-xs text-muted-foreground">
                {formatDate(post.date)}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="mb-4 leading-relaxed text-lg whitespace-pre-wrap">{post.content}</p>
        {(post.media_url || post.image_url) && (
          <div className="rounded-lg overflow-hidden">
            <img
              src={post.media_url || post.image_url}
              className="w-full max-h-80 object-cover"
              alt="Media"
            />
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col border-t pt-4">
        <div className="flex items-center space-x-4 w-full mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReact}
            className="flex items-center space-x-2"
          >
            <ThumbsUp className="h-4 w-4" />
            <span>{post.reactions}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleComments}
            className="flex items-center space-x-2"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{post.comments?.length || 0}</span>
          </Button>
        </div>

        {showComments && (
          <>
            <CommentList comments={post.comments || []} getUserName={getUserName} />
            <CommentForm 
              postId={post.id} 
              commentText={commentText} 
              setCommentText={setCommentText} 
              onCommentAdded={onPostUpdated}
            />
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default PostItem;
