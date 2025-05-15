
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { themes, ColorPalette } from '@/themes/theme';

const ThemeColorExample: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme Color Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(themes).map(([name, palette]) => (
              <div key={name} className="space-y-2">
                <h3 className="font-medium capitalize">{name} Theme</h3>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  <ColorSwatch name="Background" color={palette.background} />
                  <ColorSwatch name="Foreground" color={palette.foreground} />
                  <ColorSwatch name="Primary" color={palette.primary} />
                  <ColorSwatch name="Secondary" color={palette.secondary} />
                  <ColorSwatch name="Accent" color={palette.accent} />
                  <ColorSwatch name="Success" color={palette.success.DEFAULT} />
                  <ColorSwatch name="Warning" color={palette.warning.DEFAULT} />
                  <ColorSwatch name="Error" color={palette.error.DEFAULT} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface ColorSwatchProps {
  name: string;
  color: string;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ name, color }) => {
  return (
    <div className="flex flex-col items-center">
      <div 
        className="w-12 h-12 rounded-md border border-gray-200 mb-1" 
        style={{ backgroundColor: color }}
      />
      <span className="text-xs text-center">{name}</span>
    </div>
  );
};

export default ThemeColorExample;
