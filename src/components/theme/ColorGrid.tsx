
import React from 'react';
import ColorSwatch from './ColorSwatch';

interface ColorGridProps {
  title: string;
  colors: Array<{
    name: string;
    bgColor: string;
    textColor: string;
    hasBorder?: boolean;
    borderColor?: string;
  }>;
}

/**
 * Composant pour afficher une grille de couleurs avec un titre
 */
const ColorGrid: React.FC<ColorGridProps> = ({ title, colors }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">{title}</h3>
      {colors.map((color, index) => (
        <ColorSwatch 
          key={index}
          name={color.name}
          bgColor={color.bgColor}
          textColor={color.textColor}
          hasBorder={color.hasBorder}
          borderColor={color.borderColor}
        />
      ))}
    </div>
  );
};

export default ColorGrid;
