
import React from 'react';
import { Theme } from '@/types';

interface ThemeColorExampleProps {
  theme: Theme;
}

const ThemeColorExample: React.FC<ThemeColorExampleProps> = ({ theme }) => {
  const getColors = () => {
    switch (theme) {
      case 'dark':
        return {
          background: '#1A1F2C',
          primary: '#9b87f5',
          secondary: '#7E69AB',
          text: '#F6F6F7'
        };
      case 'light':
        return {
          background: '#FFFFFF',
          primary: '#8B5CF6',
          secondary: '#D6BCFA',
          text: '#333333'
        };
      case 'system':
        // This should depend on user's system setting but for demo purposes
        return {
          background: '#F6F6F7',
          primary: '#8B5CF6',
          secondary: '#D6BCFA',
          text: '#333333'
        };
      case 'pastel':
        return {
          background: '#F1F0FB',
          primary: '#E5DEFF',
          secondary: '#FFDEE2',
          text: '#403E43'
        };
      default:
        return {
          background: '#FFFFFF',
          primary: '#8B5CF6',
          secondary: '#D6BCFA',
          text: '#333333'
        };
    }
  };

  const colors = getColors();

  return (
    <div 
      className="rounded-md p-4 border"
      style={{ backgroundColor: colors.background }}
    >
      <div className="flex flex-col gap-3">
        <div 
          className="rounded-md h-6"
          style={{ backgroundColor: colors.primary }}
        />
        <div 
          className="rounded-md h-6"
          style={{ backgroundColor: colors.secondary }}
        />
        <p style={{ color: colors.text }}>
          Text sample for {theme} theme
        </p>
      </div>
    </div>
  );
};

export default ThemeColorExample;
