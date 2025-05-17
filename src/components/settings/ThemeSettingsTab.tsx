
import React from 'react';
import ThemeSelector from './ThemeSelector';
import { Theme } from '@/types/theme';

interface ThemeSettingsTabProps {
  currentTheme: Theme;
  onThemeChange: (newTheme: Theme) => void;
}

const ThemeSettingsTab: React.FC<ThemeSettingsTabProps> = ({ currentTheme, onThemeChange }) => {
  return (
    <div className="grid gap-6">
      <ThemeSelector 
        currentTheme={currentTheme}
        onChange={onThemeChange}
      />
      
      {/* Autres paramètres liés au thème pourraient être ajoutés ici */}
    </div>
  );
};

export default ThemeSettingsTab;
