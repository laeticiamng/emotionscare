export interface SocialPost {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  comments: SocialComment[];
  reactions: Reaction[];
  anonymized?: boolean;
}

export interface SocialComment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface Reaction {
  id: string;
  postId: string;
  userId: string;
  type: 'like' | 'love' | 'support';
}

export interface Badge {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  awardedAt?: string;
  userId?: string;
}

export interface SocialNotification {
  id: string;
  userId: string;
  type: 'comment' | 'like' | 'badge';
  read: boolean;
  data?: Record<string, unknown>;
  createdAt: string;
}
