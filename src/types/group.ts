
export interface Group {
  id: string;
  name: string;
  description?: string;
  members_count: number;
  topic: string;
  image_url?: string;
  created_at: string | Date;
  updated_at: string | Date;
  is_private?: boolean;
  owner_id: string;
  category?: string;
  tags?: string[];
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string | Date;
  status: 'active' | 'pending' | 'inactive';
}

export interface GroupPost {
  id: string;
  group_id: string;
  user_id: string;
  content: string;
  created_at: string | Date;
  updated_at: string | Date;
  likes_count?: number;
  comments_count?: number;
  media_urls?: string[];
}
