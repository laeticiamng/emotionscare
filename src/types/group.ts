
import { User } from './user';

export interface Group {
  id: string;
  name: string;
  description?: string;
  created_at: Date | string;
  members: User[];
  owner_id: string;
  image_url?: string;
  members_count?: number;
  topic?: string;
}
