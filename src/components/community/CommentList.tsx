
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export interface CommentListProps {
  comments: any[];
  getUserName?: (userId: string) => string;
}

const CommentList: React.FC<CommentListProps> = ({ comments, getUserName }) => {
  return (
    <div className="space-y-4 mb-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={comment.user?.avatar || ''} />
            <AvatarFallback>
              {comment.user?.name?.charAt(0) || getUserName?.(comment.user_id)?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="bg-muted p-2 rounded-md text-sm">
              <p className="font-medium text-xs">
                {comment.user?.name || getUserName?.(comment.user_id) || 'Anonyme'}
                <span className="font-normal text-muted-foreground ml-2">
                  {comment.date ? formatDistanceToNow(new Date(comment.date), { 
                    addSuffix: true,
                    locale: fr 
                  }) : ''}
                </span>
              </p>
              <p className="mt-1">{comment.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
