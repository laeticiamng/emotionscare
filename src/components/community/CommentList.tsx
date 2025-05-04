
import React from 'react';
import { Comment } from '@/types/community';

interface CommentListProps {
  comments: Comment[];
  getUserName: (userId: string) => string;
}

const CommentList: React.FC<CommentListProps> = ({ comments, getUserName }) => {
  if (!comments || comments.length === 0) {
    return null;
  }

  return (
    <div className="w-full mb-4 space-y-2 border-t pt-4">
      <h4 className="text-sm font-medium">Commentaires</h4>
      {comments.map(comment => (
        <div key={comment.id} className="bg-gray-50 p-3 rounded-md">
          <div className="flex justify-between">
            <span className="font-medium text-sm">{getUserName(comment.user_id)}</span>
            <span className="text-xs text-gray-500">
              {new Date(comment.date).toLocaleString('fr-FR', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          <p className="text-sm mt-1">{comment.content}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
