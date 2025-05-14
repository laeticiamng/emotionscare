
import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/use-theme';
import { TrendingUp } from 'lucide-react';

export interface DashboardHeroData {
  title: string;
  subtitle: string;
  message?: string;
  action?: {
    text: string;
    url: string;
    icon?: React.ElementType;
  };
  backgroundClass?: string;
}

export const useDashboardHero = () => {
  const { isDarkMode } = useTheme();
  const [heroData, setHeroData] = useState<DashboardHeroData>({
    title: "Bonjour!",
    subtitle: "Bienvenue sur votre tableau de bord",
    backgroundClass: isDarkMode ? "bg-gradient-to-r from-slate-900 to-slate-800" : "bg-gradient-to-r from-blue-50 to-indigo-100"
  });
  
  useEffect(() => {
    // Get current hour
    const hour = new Date().getHours();
    
    // Set greeting based on time of day
    let greeting = "Bonjour";
    if (hour < 12) {
      greeting = "Bonjour";
    } else if (hour < 17) {
      greeting = "Bon après-midi";
    } else {
      greeting = "Bonsoir";
    }
    
    setHeroData({
      title: `${greeting}!`,
      subtitle: "Comment vous sentez-vous aujourd'hui?",
      message: "Prenez un moment pour faire le point sur votre bien-être émotionnel.",
      action: {
        text: "Scanner mon émotion",
        url: "/scan",
        icon: TrendingUp
      },
      backgroundClass: isDarkMode 
        ? "bg-gradient-to-r from-slate-900 to-slate-800" 
        : "bg-gradient-to-r from-blue-50 to-indigo-100"
    });
  }, [isDarkMode]);
  
  return { heroData };
};

export default useDashboardHero;
