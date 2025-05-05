export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  streak?: number;
  dailyGoal?: number;
  weeklyGoal?: number;
  preferences?: {
    fontSize?: 'small' | 'medium' | 'large';
    backgroundColor?: 'default' | 'blue' | 'mint' | 'coral';
    theme?: 'light' | 'dark';
  };
}
