
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import ThemeSelector from '@/components/theme/ThemeSelector';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeName } from '@/types/theme';

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, className }) => {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className={`flex items-center justify-between space-y-2 font-semibold ${className}`}>
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <ThemeSelector currentTheme={theme} onChange={setTheme} minimal />
        <Button size="sm" variant="outline" className="flex items-center gap-2 hover:bg-muted/80 transition-all duration-300">
          <Search className="h-4 w-4" />
          Search
        </Button>
      </div>
    </div>
  );
};

export default PageHeader;
