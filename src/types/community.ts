
import { User } from './index';

export interface Post {
  id: string;
  user_id: string;
  content: string;
  likes: number;
  created_at?: string;
  user?: User;
  comments_count?: number;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  likes: number;
  created_at?: string;
  user?: User;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  members?: User[];
  members_count?: number;
  is_member?: boolean;
}

export interface Buddy {
  id: string;
  user_id: string;
  buddy_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  user?: User;
  buddy?: User;
}
