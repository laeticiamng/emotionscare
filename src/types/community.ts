
export interface CommunityPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string | Date;
  updated_at: string | Date;
  likes: number;
  comments_count: number;
  is_anonymous: boolean;
  tags?: string[];
  emotion?: string;
  mood?: number;
}

export interface CommunityComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string | Date;
  updated_at: string | Date;
  likes: number;
  is_anonymous: boolean;
}

export interface CommunityStats {
  total_posts: number;
  total_comments: number;
  active_users: number;
  trending_tags: string[];
  most_discussed_emotion: string;
}
