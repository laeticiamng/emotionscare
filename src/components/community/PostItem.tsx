
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { reactToPost } from '@/lib/communityService';
import { Post } from '@/types/community';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, MessageSquare, User as UserIcon } from 'lucide-react';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

interface PostItemProps {
  post: Post;
  getUserName: (userId: string) => string;
  onPostUpdated: () => void;
}

const PostItem: React.FC<PostItemProps> = ({ post, getUserName, onPostUpdated }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [commentText, setCommentText] = useState('');

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
    } catch (error) {
      console.error('Error reacting to post:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter votre réaction",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="mb-6 hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <UserIcon className="h-5 w-5" />
            <span className="font-medium">{getUserName(post.user_id)}</span>
          </div>
          <span className="text-sm text-gray-500">
            {new Date(post.date).toLocaleString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="mb-4 leading-relaxed text-lg whitespace-pre-wrap">{post.content}</p>
        {(post.media_url || post.image_url) && (
          <img
            src={post.media_url || post.image_url}
            className="w-full rounded-lg mb-4 max-h-80 object-cover"
            alt="Media"
          />
        )}
      </CardContent>

      <CardFooter className="flex flex-col border-t pt-4">
        <div className="flex items-center space-x-4 w-full mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReact}
            className="flex items-center space-x-1"
          >
            <ThumbsUp className="h-4 w-4" />
            <span>{post.reactions}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{post.comments?.length || 0}</span>
          </Button>
        </div>

        <CommentList comments={post.comments || []} getUserName={getUserName} />
        <CommentForm 
          postId={post.id} 
          commentText={commentText} 
          setCommentText={setCommentText} 
          onCommentAdded={onPostUpdated}
        />
      </CardFooter>
    </Card>
  );
};

export default PostItem;
