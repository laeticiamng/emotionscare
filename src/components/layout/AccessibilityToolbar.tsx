import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Accessibility, 
  Type, 
  Eye, 
  Volume2, 
  MousePointer,
  Settings,
  X,
  Plus,
  Minus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { PremiumCard, PremiumCardContent, PremiumCardHeader, PremiumCardTitle } from '@/components/ui/premium-card';
import { useAccessibility } from '@/components/common/AccessibilityProvider';
import { cn } from '@/lib/utils';

const AccessibilityToolbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, updateSetting, resetSettings } = useAccessibility();

  const adjustFontSize = (increment: boolean) => {
    const newSize = increment 
      ? Math.min(settings.fontSize + 0.1, 2) 
      : Math.max(settings.fontSize - 0.1, 0.8);
    updateSetting('fontSize', newSize);
  };

  return (
    <>
      {/* Floating Accessibility Button */}
      <motion.div
        className="fixed bottom-4 left-4 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="w-12 h-12 rounded-full shadow-premium bg-primary hover:bg-primary/90"
          aria-label="Ouvrir les options d'accessibilité"
        >
          <Accessibility className="w-6 h-6" />
        </Button>
      </motion.div>

      {/* Accessibility Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-20 left-4 z-50 w-80 max-w-[calc(100vw-2rem)]"
            >
              <PremiumCard variant="glass">
                <PremiumCardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <PremiumCardTitle className="text-lg flex items-center gap-2">
                      <Accessibility className="w-5 h-5" />
                      Accessibilité
                    </PremiumCardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </PremiumCardHeader>

                <PremiumCardContent className="space-y-6">
                  {/* Font Size */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Type className="w-4 h-4" />
                      <span className="text-sm font-medium">Taille du texte</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => adjustFontSize(false)}
                        disabled={settings.fontSize <= 0.8}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <div className="flex-1">
                        <Slider
                          value={[settings.fontSize]}
                          onValueChange={([value]) => updateSetting('fontSize', value)}
                          min={0.8}
                          max={2}
                          step={0.1}
                          className="w-full"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => adjustFontSize(true)}
                        disabled={settings.fontSize >= 2}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground text-center">
                      {Math.round(settings.fontSize * 100)}%
                    </div>
                  </div>

                  {/* High Contrast */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-medium">Contraste élevé</span>
                    </div>
                    <Switch
                      checked={settings.highContrast}
                      onCheckedChange={(checked) => updateSetting('highContrast', checked)}
                    />
                  </div>

                  {/* Reduced Motion */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MousePointer className="w-4 h-4" />
                      <span className="text-sm font-medium">Réduire les animations</span>
                    </div>
                    <Switch
                      checked={settings.reducedMotion}
                      onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
                    />
                  </div>

                  {/* Enhanced Focus */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      <span className="text-sm font-medium">Focus amélioré</span>
                    </div>
                    <Switch
                      checked={settings.focusIndicators}
                      onCheckedChange={(checked) => updateSetting('focusIndicators', checked)}
                    />
                  </div>

                  {/* Screen Reader Mode */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Mode lecteur d'écran</span>
                    </div>
                    <Switch
                      checked={settings.screenReader}
                      onCheckedChange={(checked) => updateSetting('screenReader', checked)}
                    />
                  </div>

                  {/* Reset Button */}
                  <div className="pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={resetSettings}
                      className="w-full"
                      size="sm"
                    >
                      Réinitialiser les paramètres
                    </Button>
                  </div>
                </PremiumCardContent>
              </PremiumCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AccessibilityToolbar;