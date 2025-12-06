/**
 * LanguageSettingsPage - Paramètres de langue
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Check } from 'lucide-react';
import { usePageSEO } from '@/hooks/usePageSEO';

const LANGUAGES = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

const LanguageSettingsPage: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = React.useState('fr');

  usePageSEO({
    title: 'Paramètres de langue - EmotionsCare',
    description: 'Choisissez votre langue préférée pour l\'application EmotionsCare.',
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" aria-hidden="true" />
            Langue de l'application
          </CardTitle>
          <CardDescription>
            Choisissez la langue dans laquelle vous souhaitez utiliser EmotionsCare.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {LANGUAGES.map((lang) => (
            <Button
              key={lang.code}
              variant={selectedLanguage === lang.code ? 'default' : 'outline'}
              className="w-full justify-between h-14"
              onClick={() => setSelectedLanguage(lang.code)}
              aria-label={`Sélectionner ${lang.name}`}
            >
              <span className="flex items-center gap-3">
                <span className="text-2xl" aria-hidden="true">{lang.flag}</span>
                <span>{lang.name}</span>
              </span>
              {selectedLanguage === lang.code && (
                <Check className="h-5 w-5" aria-hidden="true" />
              )}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default LanguageSettingsPage;
