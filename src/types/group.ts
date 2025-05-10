
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
