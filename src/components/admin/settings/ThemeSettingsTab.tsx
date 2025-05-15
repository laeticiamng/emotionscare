
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { Theme, FontFamily, FontSize } from '@/types/theme';

// Theme settings tab component
const ThemeSettingsTab: React.FC = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const [currentTab, setCurrentTab] = useState('theme');

  const handleThemeChange = (theme: Theme) => {
    updatePreferences({ theme });
  };

  const handleFontChange = (font: FontFamily) => {
    updatePreferences({ fontFamily: font });
  };

  const handleFontSizeChange = (fontSize: FontSize) => {
    updatePreferences({ fontSize });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Appearance Settings</CardTitle>
        <CardDescription>
          Customize the appearance of your application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="theme">Theme</TabsTrigger>
            <TabsTrigger value="font">Font</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          </TabsList>
          
          {/* Theme tab content */}
          <TabsContent value="theme">
            <div className="grid gap-4">
              <div>
                <h3 className="text-sm font-medium mb-3">Color Theme</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className={`p-3 rounded-md border flex items-center justify-center ${
                      preferences.theme === 'light' ? 'border-primary bg-primary/10' : ''
                    }`}
                    onClick={() => handleThemeChange('light')}
                  >
                    <span className="mr-2">☀️</span> Light
                  </button>
                  <button
                    className={`p-3 rounded-md border flex items-center justify-center ${
                      preferences.theme === 'dark' ? 'border-primary bg-primary/10' : ''
                    }`}
                    onClick={() => handleThemeChange('dark')}
                  >
                    <span className="mr-2">🌙</span> Dark
                  </button>
                  <button
                    className={`p-3 rounded-md border flex items-center justify-center ${
                      preferences.theme === 'system' ? 'border-primary bg-primary/10' : ''
                    }`}
                    onClick={() => handleThemeChange('system')}
                  >
                    <span className="mr-2">💻</span> System
                  </button>
                  <button
                    className={`p-3 rounded-md border flex items-center justify-center ${
                      preferences.theme === 'pastel' ? 'border-primary bg-primary/10' : ''
                    }`}
                    onClick={() => handleThemeChange('pastel')}
                  >
                    <span className="mr-2">🎨</span> Pastel
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Color Accent</h3>
                <div className="grid grid-cols-4 gap-2">
                  {['blue', 'purple', 'green', 'orange', 'pink', 'red', 'teal', 'yellow'].map((color) => (
                    <button
                      key={color}
                      className={`h-10 rounded-md border ${
                        preferences.colorAccent === color ? 'ring-2 ring-primary' : ''
                      }`}
                      style={{ backgroundColor: `var(--${color})` }}
                      onClick={() => updatePreferences({ colorAccent: color })}
                      aria-label={`${color} accent color`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Font tab content */}
          <TabsContent value="font">
            <div className="grid gap-4">
              <div>
                <h3 className="text-sm font-medium mb-3">Font Family</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className={`p-3 rounded-md border ${
                      preferences.fontFamily === 'system' ? 'border-primary bg-primary/10' : ''
                    }`}
                    onClick={() => handleFontChange('system')}
                    style={{ fontFamily: 'system-ui' }}
                  >
                    System
                  </button>
                  <button
                    className={`p-3 rounded-md border ${
                      preferences.fontFamily === 'serif' ? 'border-primary bg-primary/10' : ''
                    }`}
                    onClick={() => handleFontChange('serif')}
                    style={{ fontFamily: 'serif' }}
                  >
                    Serif
                  </button>
                  <button
                    className={`p-3 rounded-md border ${
                      preferences.fontFamily === 'monospace' ? 'border-primary bg-primary/10' : ''
                    }`}
                    onClick={() => handleFontChange('monospace')}
                    style={{ fontFamily: 'monospace' }}
                  >
                    Monospace
                  </button>
                  <button
                    className={`p-3 rounded-md border ${
                      preferences.fontFamily === 'rounded' ? 'border-primary bg-primary/10' : ''
                    }`}
                    onClick={() => handleFontChange('rounded')}
                    style={{ fontFamily: 'var(--font-rounded, sans-serif)' }}
                  >
                    Rounded
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Font Size</h3>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    className={`p-3 rounded-md border ${
                      preferences.fontSize === 'small' ? 'border-primary bg-primary/10' : ''
                    }`}
                    onClick={() => handleFontSizeChange('small')}
                    style={{ fontSize: '0.875rem' }}
                  >
                    Small
                  </button>
                  <button
                    className={`p-3 rounded-md border ${
                      preferences.fontSize === 'medium' ? 'border-primary bg-primary/10' : ''
                    }`}
                    onClick={() => handleFontSizeChange('medium')}
                    style={{ fontSize: '1rem' }}
                  >
                    Medium
                  </button>
                  <button
                    className={`p-3 rounded-md border ${
                      preferences.fontSize === 'large' ? 'border-primary bg-primary/10' : ''
                    }`}
                    onClick={() => handleFontSizeChange('large')}
                    style={{ fontSize: '1.125rem' }}
                  >
                    Large
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Accessibility tab content */}
          <TabsContent value="accessibility">
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <h3 className="font-medium">High Contrast</h3>
                  <p className="text-sm text-muted-foreground">
                    Increase contrast for better readability
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={preferences.accessibilityFeatures?.highContrast || false}
                    onChange={() => updatePreferences({
                      accessibilityFeatures: {
                        ...preferences.accessibilityFeatures,
                        highContrast: !(preferences.accessibilityFeatures?.highContrast || false)
                      }
                    })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <h3 className="font-medium">Reduced Motion</h3>
                  <p className="text-sm text-muted-foreground">
                    Minimize animations and transitions
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={preferences.accessibilityFeatures?.reducedMotion || false}
                    onChange={() => updatePreferences({
                      accessibilityFeatures: {
                        ...preferences.accessibilityFeatures,
                        reducedMotion: !(preferences.accessibilityFeatures?.reducedMotion || false)
                      }
                    })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <h3 className="font-medium">Screen Reader Optimization</h3>
                  <p className="text-sm text-muted-foreground">
                    Improve compatibility with screen readers
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={preferences.accessibilityFeatures?.screenReader || false}
                    onChange={() => updatePreferences({
                      accessibilityFeatures: {
                        ...preferences.accessibilityFeatures,
                        screenReader: !(preferences.accessibilityFeatures?.screenReader || false)
                      }
                    })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ThemeSettingsTab;
