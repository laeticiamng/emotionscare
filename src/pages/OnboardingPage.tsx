import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ThemeSelectionField from '@/components/preferences/ThemeSelectionField';
import FontSizeField from '@/components/preferences/FontSizeField';
import ColorAccentField from '@/components/preferences/ColorAccentField';
import { updateUser } from '@/lib/userService';
import { useAuth } from '@/contexts/AuthContext';
import { UserPreferences } from '@/types';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const OnboardingPage: React.FC = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [theme, setTheme] = useState<"light" | "dark" | "pastel" | "system">("light");
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
  const [backgroundColor, setBackgroundColor] = useState<"default" | "blue" | "mint" | "coral">("default");
  
  const themeOptions = [
    { value: "light", label: "Lumineux" },
    { value: "dark", label: "Sombre" },
    { value: "system", label: "Système" },
    { value: "pastel", label: "Pastel" } 
  ] as const;

  type ThemeOption = (typeof themeOptions)[number]['value'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Create preferences object
      const preferences: UserPreferences = {
        theme,
        fontSize,
        backgroundColor,
        accentColor: "#FF6F61", // Default accent color
        notifications: {
          email: true,
          push: true,
          sms: false
        }
      };
      
      // Update user with new preferences and mark as onboarded
      const updatedUser = await updateUser({
        ...user,
        preferences,
        onboarded: true
      });
      
      // Update local user state
      setUser(updatedUser);
      
      // Redirect to dashboard
      navigate('/dashboard');
      
      toast({
        title: "Bienvenue !",
        description: "Vos préférences ont été enregistrées."
      });
    } catch (error) {
      console.error("Error during onboarding:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de vos préférences.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-[#FAFBFC] to-[#E8F1FA]">
      <div className="w-full max-w-xl p-4 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-[#1B365D] mb-1">
            Bienvenue sur EmotionsCare<span className="text-xs align-super">™</span>
          </h1>
          <p className="text-slate-600">Personnalisons votre expérience</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Card className="shadow-lg border-[#E8F1FA]">
            <CardHeader>
              <CardTitle>Préférences d'affichage</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-8">
              <ThemeSelectionField
                value={theme}
                onChange={setTheme}
              />
              
              <FontSizeField
                value={fontSize}
                onChange={setFontSize}
              />
              
              <ColorAccentField
                value={backgroundColor}
                onChange={(color) => setBackgroundColor(color as "default" | "blue" | "mint" | "coral")}
              />
            </CardContent>
            
            <CardFooter className="flex justify-end">
              <Button 
                type="submit" 
                size="lg"
                disabled={isSubmitting}
                className="bg-[#FF6F61] hover:bg-[#FF6F61]/90 text-white"
              >
                {isSubmitting ? 'Enregistrement...' : 'Commencer mon expérience'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;
