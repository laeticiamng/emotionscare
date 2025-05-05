
import { User } from './index';

export interface Post {
  id: string;
  user_id: string;
  content: string;
  likes: number;
  date?: string;
  created_at?: string;
  user?: User;
  comments_count?: number;
  image_url?: string;
  media_url?: string;
  reactions?: number;
  comments?: any[];
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  likes: number;
  date?: string;
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
  topic?: string;
  is_private?: boolean;
  created_at?: string;
  joined?: boolean;
}

export interface Buddy {
  id: string;
  user_id: string;
  buddy_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  user?: User;
  buddy?: User;
  date?: string;
  matched_on?: string;
  buddy_user_id?: string;
}
