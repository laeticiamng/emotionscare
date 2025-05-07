
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Simple color swatch component
const ColorSwatch = ({ color, name, textColor = 'white' }: { color: string; name: string; textColor?: string }) => (
  <div 
    className="rounded-md overflow-hidden shadow-sm mb-2" 
    style={{ backgroundColor: color }}
  >
    <div className="p-4 flex items-center justify-between" style={{ color: textColor }}>
      <span className="font-medium">{name}</span>
      <span className="text-xs opacity-70">{color}</span>
    </div>
  </div>
);

// Color grid component for displaying color groups
const ColorGrid = ({ 
  title, 
  colors 
}: { 
  title: string; 
  colors: Array<{ name: string; bgColor: string; textColor?: string; hasBorder?: boolean; borderColor?: string }> 
}) => {
  return (
    <div>
      <h3 className="font-medium text-sm mb-2">{title}</h3>
      <div className="space-y-1">
        {colors.map((colorItem, i) => (
          <div 
            key={`${colorItem.name}-${i}`}
            className={`${colorItem.hasBorder ? 'border' : ''} rounded-md overflow-hidden`}
            style={{ borderColor: colorItem.borderColor || 'transparent' }}
          >
            <ColorSwatch 
              color={colorItem.bgColor} 
              name={colorItem.name}
              textColor={colorItem.textColor}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

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
