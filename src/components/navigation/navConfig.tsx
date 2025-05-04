
import React from 'react';
import { 
  LayoutDashboard, 
  Eye,
  BookOpen, 
  Users, 
  Award, 
  Headset,
  MessageSquare
} from 'lucide-react';

export const navItems = [
  { path: '/dashboard', label: 'Tableau de bord', icon: <LayoutDashboard className="w-5 h-5 mr-2" /> },
  { path: '/scan', label: 'Scan émotionnel', icon: <Eye className="w-5 h-5 mr-2" /> },
  { path: '/journal', label: 'Journal', icon: <BookOpen className="w-5 h-5 mr-2" /> },
  { path: '/community', label: 'Social Cocoon', icon: <MessageSquare className="w-5 h-5 mr-2" /> },
  { path: '/gamification', label: 'Gamification', icon: <Award className="w-5 h-5 mr-2" /> },
  { path: '/vr-session', label: 'VR Session', icon: <Headset className="w-5 h-5 mr-2" /> }
];
