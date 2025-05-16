
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Theme, FontFamily, FontSize, ThemeOption } from '@/types/theme';

interface ThemeSettingsTabProps {
  currentTheme: string;
  onThemeChange: (theme: Theme) => void;
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
  const themes: ThemeOption[] = [
    { name: 'Light', value: 'light', preview: '#ffffff' },
    { name: 'Dark', value: 'dark', preview: '#1f2937' },
    { name: 'System', value: 'system', preview: 'linear-gradient(to right, #ffffff 50%, #1f2937 50%)' }
  ];
  
  const handleThemeChange = (value: string) => {
    onThemeChange(value as Theme);
  };
  
  // Font family options
  const fontFamilies: {value: FontFamily, label: string}[] = [
    { value: "system", label: "System Default" },
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
    { value: "xs", label: "Extra Small" },
    { value: "sm", label: "Small" },
    { value: "md", label: "Medium" },
    { value: "lg", label: "Large" },
    { value: "xl", label: "Extra Large" }
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
                className="cursor-pointer"
              >
                <div
                  className={cn(
                    "h-16 rounded-md border-2 flex items-center justify-center",
                    currentTheme === theme.value && "border-primary"
                  )}
                  style={{ background: theme.preview }}
                >
                  <span 
                    className={cn(
                      "text-xs font-medium",
                      theme.value === 'dark' ? "text-white" : null
                    )}
                  >
                    {theme.name}
                  </span>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      {onFontFamilyChange && (
        <div>
          <h3 className="text-lg font-medium">Font Family</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Select a font family for the UI.
          </p>
          
          <RadioGroup
            defaultValue={fontFamily}
            onValueChange={handleFontFamilyChange}
            className="grid grid-cols-2 gap-4"
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
                  className="cursor-pointer"
                >
                  <div
                    className={cn(
                      "h-12 rounded-md border-2 flex items-center justify-center p-2",
                      fontFamily === font.value && "border-primary"
                    )}
                  >
                    <span className={cn("text-sm", font.value)}>
                      {font.label}
                    </span>
                  </div>
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
            Select the font size for the UI.
          </p>
          
          <RadioGroup
            defaultValue={fontSize}
            onValueChange={handleFontSizeChange}
            className="grid grid-cols-4 gap-4"
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
                  className="cursor-pointer"
                >
                  <div
                    className={cn(
                      "h-10 rounded-md border-2 flex items-center justify-center",
                      fontSize === size.value && "border-primary"
                    )}
                  >
                    <span 
                      className={cn(
                        size.value === "xs" ? "text-xs" : 
                        size.value === "sm" ? "text-sm" : 
                        size.value === "md" ? "text-base" : 
                        size.value === "lg" ? "text-lg" :
                        "text-xl"
                      )}
                    >
                      {size.label}
                    </span>
                  </div>
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
