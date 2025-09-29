export interface Profile {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityFiltersState {
  activityType: string;
  startDate: string;
  endDate: string;
  userId?: string;
}

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void;
  }
}