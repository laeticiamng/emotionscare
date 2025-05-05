
import { User } from './index';

export interface Post {
  id: string;
  user_id: string;
  content: string;
  likes: number;
  reactions?: number;
  date?: string;
  created_at?: string;
  user?: User;
  comments_count?: number;
  image_url?: string;
  media_url?: string;
  comments?: Comment[];
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
  members?: string[] | User[];
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
  buddy_id?: string;
  status: 'pending' | 'accepted' | 'rejected';
  user?: User;
  buddy?: User;
  date?: string;
  matched_on?: string;
  buddy_user_id?: string;
}

// Define BuddyRequest interface for BuddyPage to use
export interface BuddyRequest {
  id: string;
  user_id: string;
  buddy_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar: string;
  };
}
