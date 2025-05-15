
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { z } from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  displayName: z.string().min(2, {
    message: "Le nom d'affichage doit contenir au moins 2 caractères.",
  }),
  pronouns: z.string().optional(),
  biography: z.string().max(300, {
    message: "La biographie ne doit pas dépasser 300 caractères.",
  }),
});

const IdentitySettings = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(preferences.avatarUrl || '');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: preferences.displayName || '',
      pronouns: preferences.pronouns || '',
      biography: preferences.biography || '',
    },
  });
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // Upload avatar if changed
      let avatarUrl = preferences.avatarUrl;
      if (avatarFile) {
        // In a real app, we would upload the file to a storage service
        // For this example, we'll just use the current preview URL
        avatarUrl = avatarPreview;
      }
      
      // Update preferences with form values
      await updatePreferences({
        displayName: values.displayName,
        pronouns: values.pronouns,
        biography: values.biography,
        avatarUrl,
      });
      
      toast({
        title: "Paramètres identitaires mis à jour",
        description: "Vos informations de profil ont été enregistrées.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder vos paramètres identitaires.",
        variant: "destructive",
      });
      console.error('Error saving identity settings:', error);
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const getAvatarFallback = () => {
    if (preferences.displayName) {
      return preferences.displayName.substring(0, 2).toUpperCase();
    }
    return 'U';
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres identitaires</CardTitle>
        <CardDescription>
          Personnalisez comment les autres vous voient sur la plateforme
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-2">
              <FormLabel>Photo de profil</FormLabel>
              <div className="flex items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarPreview} />
                  <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                </Avatar>
                <div>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="max-w-sm"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    JPG, PNG ou GIF. Taille maximale 2MB.
                  </p>
                </div>
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom d'affichage</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre nom d'affichage" {...field} />
                  </FormControl>
                  <FormDescription>
                    C'est le nom qui sera affiché aux autres utilisateurs.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="pronouns"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pronoms</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: il/lui, elle/elle, iel/ellui" {...field} />
                  </FormControl>
                  <FormDescription>
                    Optionnel. Précisez vos pronoms préférés.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="biography"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biographie</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Parlez un peu de vous..." 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Une brève description qui apparaîtra sur votre profil public.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Sauvegarde en cours..." : "Enregistrer les modifications"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default IdentitySettings;
