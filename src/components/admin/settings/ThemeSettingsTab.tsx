import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ThemeName, FontFamily, FontSize } from '@/types/theme';

interface ThemeSettingsTabProps {
  currentTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
  fontFamily?: FontFamily;
  onFontFamilyChange?: (fontFamily: FontFamily) => void;
  fontSize?: FontSize;
  onFontSizeChange?: (fontSize: FontSize) => void;
}

const ThemeSettingsTab: React.FC<ThemeSettingsTabProps> = ({
  currentTheme,
  onThemeChange,
  fontFamily,
  onFontFamilyChange,
  fontSize,
  onFontSizeChange
}) => {
  // Theme options
  const themes: {value: ThemeName, label: string, preview: string}[] = [
    { value: 'light', label: 'Light', preview: '#ffffff' },
    { value: 'dark', label: 'Dark', preview: '#1f2937' },
    { value: 'system', label: 'System', preview: 'linear-gradient(to right, #ffffff 50%, #1f2937 50%)' },
    { value: 'pastel', label: 'Pastel', preview: '#f0f9ff' }
  ];
  
  const handleThemeChange = (value: string) => {
    if (value === 'light' || value === 'dark' || value === 'system' || value === 'pastel') {
      onThemeChange(value as ThemeName);
    }
  };
  
  // Font family options
  const fontFamilies: {value: FontFamily, label: string}[] = [
    { value: "sans", label: "Sans" },
    { value: "serif", label: "Serif" },
    { value: "mono", label: "Monospace" },
    { value: "rounded", label: "Rounded" }
  ];
  
  const handleFontFamilyChange = (value: string) => {
    if (onFontFamilyChange) {
      onFontFamilyChange(value as FontFamily);
    }
  };
  
  // Font size options
  const fontSizes: {value: FontSize, label: string}[] = [
    { value: "sm", label: "Small" },
    { value: "md", label: "Medium" },
    { value: "lg", label: "Large" }
  ];
  
  const handleFontSizeChange = (value: string) => {
    if (onFontSizeChange) {
      onFontSizeChange(value as FontSize);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Theme</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select a theme for the dashboard.
        </p>
        
        <RadioGroup
          defaultValue={currentTheme}
          onValueChange={handleThemeChange}
          className="grid grid-cols-3 gap-4"
        >
          {themes.map((theme) => (
            <div key={theme.value}>
              <RadioGroupItem
                value={theme.value}
                id={`theme-${theme.value}`}
                className="sr-only"
              />
              <Label
                htmlFor={`theme-${theme.value}`}
                className={cn(
                  "flex flex-col items-center justify-center rounded-md p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                  currentTheme === theme.value && "bg-accent text-accent-foreground"
                )}
              >
                <div
                  className="mb-2 h-10 w-10 rounded-full border"
                  style={{ background: theme.preview }}
                />
                <span>{theme.label}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      {onFontFamilyChange && (
        <div>
          <h3 className="text-lg font-medium">Font Family</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Select a font family for text.
          </p>
          
          <RadioGroup
            defaultValue={fontFamily}
            onValueChange={handleFontFamilyChange}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {fontFamilies.map((font) => (
              <div key={font.value}>
                <RadioGroupItem
                  value={font.value}
                  id={`font-${font.value}`}
                  className="sr-only"
                />
                <Label
                  htmlFor={`font-${font.value}`}
                  className={cn(
                    "flex items-center justify-center rounded-md border p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                    fontFamily === font.value && "bg-accent text-accent-foreground"
                  )}
                >
                  <span className={font.value === 'mono' ? 'font-mono' : font.value === 'serif' ? 'font-serif' : 'font-sans'}>
                    {font.label}
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}
      
      {onFontSizeChange && (
        <div>
          <h3 className="text-lg font-medium">Font Size</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Select a base font size.
          </p>
          
          <RadioGroup
            defaultValue={fontSize}
            onValueChange={handleFontSizeChange}
            className="grid grid-cols-3 gap-4"
          >
            {fontSizes.map((size) => (
              <div key={size.value}>
                <RadioGroupItem
                  value={size.value}
                  id={`size-${size.value}`}
                  className="sr-only"
                />
                <Label
                  htmlFor={`size-${size.value}`}
                  className={cn(
                    "flex items-center justify-center rounded-md border p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                    fontSize === size.value && "bg-accent text-accent-foreground",
                    size.value === "sm" && "text-sm",
                    size.value === "md" && "text-base",
                    size.value === "lg" && "text-lg"
                  )}
                >
                  {size.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}
    </div>
  );
};

export default ThemeSettingsTab;
