import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

interface LanguageOption {
  code: string;
  label: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
];

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  variant = "outline", 
  size = "icon",
  className = "",
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageOption>(languages[0]);
  
  // Detect browser language on mount
  useEffect(() => {
    const browserLang = navigator.language.substring(0, 2).toLowerCase();
    const matchedLanguage = languages.find(lang => lang.code === browserLang);
    
    if (matchedLanguage) {
      setCurrentLanguage(matchedLanguage);
      localStorage.setItem('preferredLanguage', matchedLanguage.code);
    }
  }, []);
  
  const handleLanguageChange = (language: LanguageOption) => {
    setCurrentLanguage(language);
    localStorage.setItem('preferredLanguage', language.code);
    
    // Here you would trigger your app's internationalization system
    // This is just a UI component example
    
    // Force page refresh to apply language change
    // window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className} aria-label="Changer de langue">
          <span className="mr-2 hidden md:inline">{currentLanguage.flag}</span>
          <Globe className="h-4 w-4 md:hidden" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language)}
            className="cursor-pointer flex items-center gap-2"
          >
            <span>{language.flag}</span>
            <span>{language.label}</span>
            {currentLanguage.code === language.code && (
              <span className="ml-auto text-xs">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
