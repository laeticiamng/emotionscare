
import React from 'react';

interface ColorSwatchProps {
  name: string;
  bgColor: string;
  textColor: string;
  hasBorder?: boolean;
  borderColor?: string;
}

/**
 * Composant réutilisable pour afficher un échantillon de couleur
 */
const ColorSwatch: React.FC<ColorSwatchProps> = ({ 
  name, 
  bgColor, 
  textColor, 
  hasBorder = false, 
  borderColor 
}) => {
  return (
    <div 
      className="p-4 rounded" 
      style={{ 
        backgroundColor: bgColor, 
        color: textColor,
        border: hasBorder ? `1px solid ${borderColor || 'currentColor'}` : 'none'
      }}
    >
      {name}
    </div>
  );
};

export default ColorSwatch;
