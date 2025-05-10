
export interface Community {
  id: string;
  name: string;
  description: string;
  members_count: number;
  is_private: boolean;
  created_at: string | Date;
  image_url?: string;
  tags?: string[];
  category?: string;
  owner_id: string;
  admins?: string[];
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
