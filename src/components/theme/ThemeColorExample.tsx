
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useThemeColors } from '@/hooks/useThemeColors';
import ColorGrid from './ColorGrid';

/**
 * Composant d'exemple pour démontrer l'utilisation des couleurs du thème
 * Ce composant est purement illustratif et peut être supprimé
 */
const ThemeColorExample: React.FC = () => {
  // Récupération des couleurs du thème actif
  const { colors, wellness, currentTheme } = useThemeColors();
  
  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Thème actuel : {currentTheme}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <ColorGrid 
            title="Couleurs de base" 
            colors={[
              { name: "Background", bgColor: colors.background, textColor: colors.foreground },
              { name: "Primary", bgColor: colors.primary, textColor: colors.primaryForeground },
              { name: "Secondary", bgColor: colors.secondary, textColor: colors.secondaryForeground }
            ]} 
          />
          
          <ColorGrid 
            title="Composants" 
            colors={[
              { name: "Card", bgColor: colors.card, textColor: colors.cardForeground, hasBorder: true, borderColor: colors.border },
              { name: "Muted", bgColor: colors.muted, textColor: colors.mutedForeground },
              { name: "Accent", bgColor: colors.accent, textColor: colors.accentForeground }
            ]} 
          />
          
          <ColorGrid 
            title="Couleurs Wellness" 
            colors={[
              { name: "Bleu", bgColor: wellness.blue, textColor: 'white' },
              { name: "Menthe", bgColor: wellness.mint, textColor: 'black' },
              { name: "Corail", bgColor: wellness.coral, textColor: 'white' }
            ]} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeColorExample;
