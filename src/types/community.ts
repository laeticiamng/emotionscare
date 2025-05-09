
import { User } from './index';

export interface Post {
  id: string;
  user_id: string;
  content: string;
  date: string;
  reactions: number;
  is_anonymous: boolean;
  tags?: string[];
  comments?: Comment[];
  media_url?: string;
  image_url?: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  date: string;
  likes: number;
  is_anonymous: boolean;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  created_at: string;
  members_count: number;
  image_url?: string;
  tags?: string[];
  topic?: string;
  members?: User[];
}

export interface BuddyRequest {
  id: string;
  from_user_id: string;
  to_user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at?: string;
  user?: User;
}
