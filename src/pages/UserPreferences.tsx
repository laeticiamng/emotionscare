
import React, { useState } from 'react';
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

const formSchema = z.object({
  fontSize: z.enum(['small', 'medium', 'large']),
  backgroundColor: z.enum(['default', 'blue', 'mint', 'coral']),
});

type FormValues = z.infer<typeof formSchema>;

const UserPreferences = () => {
  const { user, updateUserProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  // Initialize with user preferences if available
  const preferences = user?.preferences || {};
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fontSize: preferences.fontSize || 'medium',
      backgroundColor: preferences.backgroundColor || 'default',
    }
  });

  const onSubmit = async (data: FormValues) => {
    try {
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
    <div className="container max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Mes préférences</CardTitle>
          <CardDescription>Personnalisez votre expérience EmotionsCare</CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="fontSize"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Taille de la police</FormLabel>
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
                    <FormLabel>Couleur d'accent</FormLabel>
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
                            <div className="w-6 h-6 rounded-full bg-[#1B365D]"></div>
                            Par défaut
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="blue" id="blue-color" />
                          <Label 
                            htmlFor="blue-color" 
                            className="flex items-center gap-2"
                          >
                            <div className="w-6 h-6 rounded-full bg-[#4A90E2]"></div>
                            Bleu
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="mint" id="mint-color" />
                          <Label 
                            htmlFor="mint-color" 
                            className="flex items-center gap-2"
                          >
                            <div className="w-6 h-6 rounded-full bg-[#A8E6CF]"></div>
                            Menthe
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="coral" id="coral-color" />
                          <Label 
                            htmlFor="coral-color" 
                            className="flex items-center gap-2"
                          >
                            <div className="w-6 h-6 rounded-full bg-[#FF6F61]"></div>
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

              <div className="space-y-3">
                <FormLabel>Thème</FormLabel>
                <div className="flex items-center space-x-2">
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={toggleTheme}
                    className="flex items-center gap-2"
                  >
                    {theme === 'dark' ? (
                      <>
                        <Sun className="h-4 w-4" />
                        Passer au mode clair
                      </>
                    ) : (
                      <>
                        <Moon className="h-4 w-4" />
                        Passer au mode sombre
                      </>
                    )}
                  </Button>
                </div>
                <FormDescription>
                  Cette option modifie l'apparence globale de l'application.
                </FormDescription>
              </div>

              <Button type="submit">Enregistrer mes préférences</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPreferences;
