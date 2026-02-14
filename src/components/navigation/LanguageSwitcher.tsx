import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
];

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  variant = "outline", 
  size = "icon",
  className = "",
}) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<LanguageOption>(
    languages.find(l => l.code === i18n.language) || languages[0]
  );

  // Sync with i18n language on mount
  useEffect(() => {
    const matchedLanguage = languages.find(lang => lang.code === i18n.language);
    if (matchedLanguage) {
      setCurrentLanguage(matchedLanguage);
    }
  }, [i18n.language]);

  const handleLanguageChange = (language: LanguageOption) => {
    setCurrentLanguage(language);
    localStorage.setItem('preferredLanguage', language.code);
    i18n.changeLanguage(language.code);
    document.documentElement.lang = language.code;
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
