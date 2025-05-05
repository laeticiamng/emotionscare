
import { User } from './index';

export interface Post {
  id: string;
  user_id: string;
  content: string;
  likes: number;
  likes_count?: number;
  reactions?: number;
  date?: string;
  created_at?: string;
  user?: Partial<User>;
  comments_count?: number;
  image_url?: string;
  media_url?: string;
  comments?: Comment[];
  tags?: string[];
  is_anonymous?: boolean;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  likes: number;
  likes_count?: number;
  date?: string;
  created_at?: string;
  user?: Partial<User>;
  is_anonymous?: boolean;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  members?: string[] | User[];
  members_count?: number;
  member_count?: number;
  is_member?: boolean;
  topic?: string;
  is_private?: boolean;
  created_at?: string;
  joined?: boolean;
}

export interface GroupMember {
  group_id: string;
  user_id: string;
  role: 'admin' | 'member';
  joined_at: string;
  user?: User;
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

export interface CommunityStats {
  total_users: number;
  active_users_today: number;
  posts_today: number;
  comments_today: number;
  top_tags: { name: string; count: number }[];
}
