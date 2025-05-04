
import React from 'react';
import { 
  LayoutDashboard, 
  Eye,
  BookOpen, 
  Users, 
  Award, 
  Headset
} from 'lucide-react';

export const navItems = [
  { path: '/dashboard', label: 'Tableau de bord', icon: <LayoutDashboard className="w-5 h-5 mr-2" /> },
  { path: '/scan', label: 'Scan émotionnel', icon: <Eye className="w-5 h-5 mr-2" /> },
  { path: '/journal', label: 'Journal', icon: <BookOpen className="w-5 h-5 mr-2" /> },
  { path: '/community', label: 'Communauté', icon: <Users className="w-5 h-5 mr-2" /> },
  { path: '/gamification', label: 'Gamification', icon: <Award className="w-5 h-5 mr-2" /> },
  { path: '/vr', label: 'VR Session', icon: <Headset className="w-5 h-5 mr-2" /> }
];
