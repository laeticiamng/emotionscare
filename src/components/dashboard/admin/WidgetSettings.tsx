
import React, { useState, useEffect } from 'react';
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { 
  Drawer,
  DrawerClose, 
  DrawerContent, 
  DrawerDescription, 
  DrawerFooter, 
  DrawerHeader, 
  DrawerTitle 
} from "@/components/ui/drawer";
import { toast } from "sonner";
import { Check } from "lucide-react";

// Widget catalog definition
export interface Widget {
  key: string;
  label: string;
  description: string;
  default: boolean;
}

// Available widgets in the system
export const widgetCatalog: Widget[] = [
  { key: "absenteeism", label: "Taux d'absentéisme", description: "Évolution du taux d'absence", default: true },
  { key: "emotionalScore", label: "Climate Émotionnel", description: "Évolution du score émotionnel", default: true },
  { key: "kpiCards", label: "Cartes KPI", description: "Indicateurs clés de performance", default: true },
  { key: "gdprDisclaimer", label: "Rappel RGPD", description: "Information légale sur la confidentialité", default: true }
];

interface WidgetSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WidgetSettings: React.FC<WidgetSettingsProps> = ({ open, onOpenChange }) => {
  const [enabledWidgets, setEnabledWidgets] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load saved widget preferences or defaults
  useEffect(() => {
    const loadSavedPreferences = () => {
      try {
        const savedWidgets = localStorage.getItem('dashboard.enabledWidgets');
        if (savedWidgets) {
          setEnabledWidgets(JSON.parse(savedWidgets));
        } else {
          // Use defaults
          const defaultWidgets = widgetCatalog
            .filter(widget => widget.default)
            .map(widget => widget.key);
          setEnabledWidgets(defaultWidgets);
        }
      } catch (error) {
        console.error('Error loading widget preferences:', error);
        // Fallback to all widgets enabled
        setEnabledWidgets(widgetCatalog.map(w => w.key));
      }
    };

    if (open) {
      loadSavedPreferences();
    }
  }, [open]);

  const handleToggleWidget = (widgetKey: string) => {
    setEnabledWidgets(prev => {
      if (prev.includes(widgetKey)) {
        return prev.filter(key => key !== widgetKey);
      } else {
        return [...prev, widgetKey];
      }
    });
  };

  const savePreferences = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      // await fetch('/api/users/me/widgets', {
      //   method: 'PUT',
      //   body: JSON.stringify({ widgets: enabledWidgets }),
      //   headers: { 'Content-Type': 'application/json' }
      // });
      
      // For now, save to localStorage
      localStorage.setItem('dashboard.enabledWidgets', JSON.stringify(enabledWidgets));
      
      toast.success("Préférences enregistrées", {
        description: "Votre configuration de widgets a été sauvegardée"
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving widget preferences:', error);
      toast.error("Impossible de sauvegarder", {
        description: "Veuillez réessayer."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle>Configurer vos widgets</DrawerTitle>
          <DrawerDescription>
            Personnalisez votre tableau de bord en activant ou désactivant les widgets
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="px-4 py-2 space-y-4 overflow-y-auto">
          {widgetCatalog.map((widget) => (
            <div key={widget.key} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
              <div>
                <h3 className="text-lg font-medium">{widget.label}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{widget.description}</p>
              </div>
              <Switch
                checked={enabledWidgets.includes(widget.key)}
                onCheckedChange={() => handleToggleWidget(widget.key)}
                aria-label={`Activer ou désactiver ${widget.label}`}
              />
            </div>
          ))}
          
          {enabledWidgets.length === 0 && (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              <p>Aucun widget sélectionné.</p>
              <p>Activez au moins un widget pour voir quelque chose sur votre tableau de bord.</p>
            </div>
          )}
        </div>
        
        <DrawerFooter>
          <Button 
            onClick={savePreferences} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Enregistrement..." : (
              <>
                <Check size={16} />
                Enregistrer les préférences
              </>
            )}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Annuler</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default WidgetSettings;
