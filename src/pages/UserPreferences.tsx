
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { Sun, Moon, Palette, CloudSun } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const formSchema = z.object({
  fontSize: z.enum(['small', 'medium', 'large']),
  backgroundColor: z.enum(['default', 'blue', 'mint', 'coral']),
  theme: z.enum(['light', 'dark', 'pastel', 'system'])
});

type FormValues = z.infer<typeof formSchema>;

const UserPreferences = () => {
  const { user, updateUserProfile } = useAuth();
  const { themePreference, setThemePreference } = useTheme();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Initialize with user preferences if available
  const preferences = user?.preferences || {};
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fontSize: preferences.fontSize || 'medium',
      backgroundColor: preferences.backgroundColor || 'default',
      theme: preferences.theme || themePreference || 'system',
    }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Apply theme immediately
      setThemePreference(data.theme);
      
      // Save preferences to user profile
      await updateUserProfile({
        ...user,
        preferences: {
          ...preferences,
          ...data
        }
      });
      
      toast({
        title: "Préférences sauvegardées",
        description: "Vos préférences ont été mises à jour avec succès."
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder vos préférences.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container max-w-4xl py-10">
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="text-2xl">Mes préférences</CardTitle>
          <CardDescription>Personnalisez votre expérience EmotionsCare</CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="flex items-center text-lg font-medium">
                      <Palette className="mr-2 h-5 w-5" />
                      Thème visuel
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 md:grid-cols-4 gap-4"
                      >
                        <div className="flex flex-col items-center space-y-2 p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-all">
                          <Sun className="h-8 w-8 text-amber-500" />
                          <RadioGroupItem value="light" id="light-theme" className="sr-only" />
                          <Label htmlFor="light-theme" className="cursor-pointer font-medium">Mode clair</Label>
                          <span className="text-xs text-muted-foreground text-center">Élégant et lumineux</span>
                        </div>
                        <div className="flex flex-col items-center space-y-2 p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-all">
                          <Moon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                          <RadioGroupItem value="dark" id="dark-theme" className="sr-only" />
                          <Label htmlFor="dark-theme" className="cursor-pointer font-medium">Mode sombre</Label>
                          <span className="text-xs text-muted-foreground text-center">Premium et profond</span>
                        </div>
                        <div className="flex flex-col items-center space-y-2 p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-all">
                          <CloudSun className="h-8 w-8 text-blue-500" />
                          <RadioGroupItem value="pastel" id="pastel-theme" className="sr-only" />
                          <Label htmlFor="pastel-theme" className="cursor-pointer font-medium">Mode pastel</Label>
                          <span className="text-xs text-muted-foreground text-center">Doux et apaisant</span>
                        </div>
                        <div className="flex flex-col items-center space-y-2 p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-all">
                          <div className="flex">
                            <Sun className="h-8 w-8 text-amber-500" />
                            <Moon className="h-8 w-8 text-indigo-600 dark:text-indigo-400 -ml-3" />
                          </div>
                          <RadioGroupItem value="system" id="system-theme" className="sr-only" />
                          <Label htmlFor="system-theme" className="cursor-pointer font-medium">Système</Label>
                          <span className="text-xs text-muted-foreground text-center">Suit vos préférences systèmes</span>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>
                      Cette option modifie l'apparence globale de l'application.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fontSize"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-lg font-medium">Taille de la police</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="small" id="small" />
                          <Label htmlFor="small" className="text-sm">Petite</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="medium" id="medium" />
                          <Label htmlFor="medium" className="text-base">Moyenne</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="large" id="large" />
                          <Label htmlFor="large" className="text-lg">Grande</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>
                      Cette option modifie la taille du texte dans l'application.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="backgroundColor"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-lg font-medium">Couleur d'accent</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="default" id="default-color" />
                          <Label 
                            htmlFor="default-color" 
                            className="flex items-center gap-2"
                          >
                            <div className="w-6 h-6 rounded-full bg-[#1B365D] dark:ring-1 dark:ring-white/20"></div>
                            Par défaut
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="blue" id="blue-color" />
                          <Label 
                            htmlFor="blue-color" 
                            className="flex items-center gap-2"
                          >
                            <div className="w-6 h-6 rounded-full bg-[#4A90E2] dark:ring-1 dark:ring-white/20"></div>
                            Bleu
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="mint" id="mint-color" />
                          <Label 
                            htmlFor="mint-color" 
                            className="flex items-center gap-2"
                          >
                            <div className="w-6 h-6 rounded-full bg-[#A8E6CF] dark:ring-1 dark:ring-white/20"></div>
                            Menthe
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="coral" id="coral-color" />
                          <Label 
                            htmlFor="coral-color" 
                            className="flex items-center gap-2"
                          >
                            <div className="w-6 h-6 rounded-full bg-[#FF6F61] dark:ring-1 dark:ring-white/20"></div>
                            Corail
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>
                      Cette option modifie la couleur d'accent dans l'application.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full md:w-auto">Enregistrer mes préférences</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPreferences;
