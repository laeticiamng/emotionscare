
export interface Group {
  id: string;
  name: string;
  description: string;
  topic: string;
  image_url?: string;
  created_at: string | Date;
  members_count: number;
  members: string[];
  is_private: boolean;
  tags?: string[];
  last_activity?: string | Date;
}

export interface CommunityMember {
  user_id: string;
  community_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string | Date;
  last_active?: string | Date;
  is_featured?: boolean;
}

export interface CommunityPost {
  id: string;
  community_id: string;
  user_id: string;
  content: string;
  created_at: string | Date;
  updated_at?: string | Date;
  likes_count: number;
  comments_count: number;
  is_pinned?: boolean;
  is_anonymous?: boolean;
  media_urls?: string[];
}
