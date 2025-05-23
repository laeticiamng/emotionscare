
import React from 'react';
import { 
  Heart, Music, MessageCircle, FileText, Activity, Video, 
  Calendar, Headphones, Brain, BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const QuickAccessMenu: React.FC = () => {
  const navigate = useNavigate();
  
  const menuItems = [
    {
      icon: Heart,
      label: 'Scan émotionnel',
      href: '/scan',
      color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    },
    {
      icon: Music,
      label: 'Musique',
      href: '/music',
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    },
    {
      icon: MessageCircle,
      label: 'Coach virtuel',
      href: '/coach',
      color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    },
    {
      icon: FileText,
      label: 'Journal',
      href: '/journal',
      color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    {
      icon: Video,
      label: 'Vidéothérapie',
      href: '/video',
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    },
    {
      icon: Headphones,
      label: 'Audio',
      href: '/audio',
      color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
    },
    {
      icon: Calendar,
      label: 'Sessions',
      href: '/sessions',
      color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
    },
    {
      icon: Brain,
      label: 'Méditation',
      href: '/meditation',
      color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
    },
    {
      icon: Activity,
      label: 'Statistiques',
      href: '/analytics',
      color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    },
    {
      icon: BookOpen,
      label: 'Bibliothèque',
      href: '/library',
      color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    },
  ];

  const handleItemClick = (item: { href: string; label: string }) => {
    // Pour les routes implémentées, naviguer vers elles
    if (['/scan', '/music', '/coach'].includes(item.href)) {
      navigate(item.href);
    } else {
      // Pour les routes non implémentées, afficher un toast
      toast.info(`La fonctionnalité "${item.label}" sera bientôt disponible`);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {menuItems.map((item, index) => (
        <div
          key={index}
          className="bg-card hover:bg-accent p-4 rounded-lg border flex flex-col items-center justify-center cursor-pointer transition-colors"
          onClick={() => handleItemClick(item)}
        >
          <div className={`${item.color} p-3 rounded-full mb-3 flex items-center justify-center`}>
            <item.icon className="h-6 w-6" />
          </div>
          <span className="text-sm font-medium text-center">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default QuickAccessMenu;
