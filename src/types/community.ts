
// Add or update the Community types
export interface Post {
  id: string;
  user_id: string;
  date: string | Date;
  content: string;
  reactions: number;
  image_url?: string;
  user?: {
    name: string;
    avatar_url?: string;
  };
  comments?: Comment[];
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  date: string | Date;
  content: string;
  user?: {
    name: string;
    avatar_url?: string;
  };
}

export interface CommunityStats {
  total_users: number;
  active_users: number;
  total_posts: number;
  posts_today: number;
}
