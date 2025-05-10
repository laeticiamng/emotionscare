
export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string | Date;
  updated_at: string | Date;
  likes_count: number;
  comments_count: number;
  tags: string[];
  is_anonymous: boolean;
  emotion_tag?: string;
  category?: 'success' | 'gratitude' | 'challenge' | 'question' | 'general';
}

export interface CommunityComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string | Date;
  likes_count: number;
  is_anonymous: boolean;
  emotion?: string;
}

export interface CommunityStats {
  total_posts: number;
  total_comments: number;
  most_active_tags: string[];
  trending_emotions: {
    emotion: string;
    count: number;
  }[];
  user_participation_rate: number;
}

export interface UserCommunityProfile {
  user_id: string;
  display_name?: string;
  bio?: string;
  join_date: string | Date;
  posts_count: number;
  comments_count: number;
  likes_given: number;
  likes_received: number;
  badges: string[];
  is_anonymous_by_default: boolean;
}
