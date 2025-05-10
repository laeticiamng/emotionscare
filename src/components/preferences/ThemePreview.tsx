
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemeName } from '@/types';
import { Bell, Check, Heart, Moon, SunMedium, Trees, CloudRain } from 'lucide-react';

interface ThemePreviewProps {
  theme: ThemeName;
  isSelected: boolean;
  onClick: () => void;
}

const themeConfig = {
  light: {
    name: 'Clair Pur',
    icon: SunMedium,
    bgColor: 'bg-yellow-500/80',
    previewBg: 'bg-gradient-to-br from-yellow-50 to-blue-50',
    previewText: 'text-gray-800',
    previewButton: 'bg-blue-500 hover:bg-blue-600',
  },
  dark: {
    name: 'Nuit Étoilée',
    icon: Moon,
    bgColor: 'bg-indigo-900/80',
    previewBg: 'bg-gradient-to-br from-slate-900 to-indigo-950',
    previewText: 'text-slate-100',
    previewButton: 'bg-indigo-500 hover:bg-indigo-600',
  },
  pastel: {
    name: 'Pastel-Lumière',
    icon: Heart,
    bgColor: 'bg-pink-300/80',
    previewBg: 'bg-gradient-to-br from-pink-100 to-purple-100',
    previewText: 'text-gray-700',
    previewButton: 'bg-purple-400 hover:bg-purple-500',
  },
  nature: {
    name: 'Nature Vibrante',
    icon: Trees,
    bgColor: 'bg-green-600/80',
    previewBg: 'bg-gradient-to-br from-green-100 to-emerald-200',
    previewText: 'text-emerald-900',
    previewButton: 'bg-emerald-600 hover:bg-emerald-700',
  },
  misty: {
    name: 'Brume Bleue',
    icon: CloudRain,
    bgColor: 'bg-blue-400/80',
    previewBg: 'bg-gradient-to-br from-blue-100 to-slate-200',
    previewText: 'text-slate-700',
    previewButton: 'bg-blue-500 hover:bg-blue-600',
  },
  starry: {
    name: 'Nuit Étoilée',
    icon: Moon,
    bgColor: 'bg-indigo-900/80',
    previewBg: 'bg-gradient-to-br from-slate-900 to-indigo-950',
    previewText: 'text-slate-100',
    previewButton: 'bg-indigo-500 hover:bg-indigo-600',
  }
};

const ThemePreview: React.FC<ThemePreviewProps> = ({ theme, isSelected, onClick }) => {
  const config = themeConfig[theme] || themeConfig.light;
  const Icon = config.icon;
  
  return (
    <div 
      className={`rounded-xl p-4 cursor-pointer transition-all border-2 ${
        isSelected ? 'border-primary bg-white/40' : 'border-transparent bg-white/20 hover:bg-white/30'
      }`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-white">
        <div className={`w-12 h-12 rounded-full ${config.bgColor} flex items-center justify-center mb-3`}>
          <Icon size={24} className="text-white" />
        </div>
        <span>{config.name}</span>
        
        {/* Mini theme preview (visible only on larger screens) */}
        <div className="hidden md:block mt-3 w-full">
          <div className={`rounded-md p-2 ${config.previewBg}`}>
            <div className={`text-xs font-medium mb-1 ${config.previewText}`}>
              Aperçu
            </div>
            <div className="flex justify-between items-center">
              <div className={`text-xs ${config.previewText}`}>Aa</div>
              <div className={`rounded-full w-4 h-4 ${config.previewButton} flex items-center justify-center`}>
                {isSelected && <Check size={10} className="text-white" />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemePreview;
