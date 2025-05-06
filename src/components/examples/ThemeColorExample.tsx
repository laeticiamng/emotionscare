
import React from 'react';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Couleurs de base</h3>
            <div className="p-4 rounded" style={{ backgroundColor: colors.background, color: colors.foreground }}>
              Background
            </div>
            <div className="p-4 rounded" style={{ backgroundColor: colors.primary, color: colors.primaryForeground }}>
              Primary
            </div>
            <div className="p-4 rounded" style={{ backgroundColor: colors.secondary, color: colors.secondaryForeground }}>
              Secondary
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Composants</h3>
            <div className="p-4 rounded" style={{ backgroundColor: colors.card, color: colors.cardForeground, border: `1px solid ${colors.border}` }}>
              Card
            </div>
            <div className="p-4 rounded" style={{ backgroundColor: colors.muted, color: colors.mutedForeground }}>
              Muted
            </div>
            <div className="p-4 rounded" style={{ backgroundColor: colors.accent, color: colors.accentForeground }}>
              Accent
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Couleurs Wellness</h3>
            <div className="p-4 rounded" style={{ backgroundColor: wellness.blue, color: 'white' }}>
              Bleu
            </div>
            <div className="p-4 rounded" style={{ backgroundColor: wellness.mint, color: 'black' }}>
              Menthe
            </div>
            <div className="p-4 rounded" style={{ backgroundColor: wellness.coral, color: 'white' }}>
              Corail
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeColorExample;
