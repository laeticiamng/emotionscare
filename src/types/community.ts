
import { User } from './user';

export interface CommunityPost {
  id: string;
  user_id: string;
  content: string;
  created_at: Date | string;
  likes: number;
  comments: number;
  author?: User;
}

export interface CommunityComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: Date | string;
  author?: User;
}
