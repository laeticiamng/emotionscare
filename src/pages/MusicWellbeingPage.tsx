import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Music } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Form } from "@/components/ui/form"
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useForm } from "react-hook-form"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import { useMusic } from '@/contexts/MusicContext';

const MusicWellbeingPage: React.FC = () => {
  const [openPanel, setOpenPanel] = useState(false);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const { toast } = useToast();
  const { initializeMusicSystem } = useMusic();

  useEffect(() => {
    const loadMusic = async () => {
      try {
        await initializeMusicSystem();
      } catch (err) {
        console.error("Erreur d'initialisation du système musical:", err);
        toast({
          title: "Erreur d'initialisation",
          description: "Impossible de charger le module musical. Veuillez réessayer.",
          variant: "destructive"
        });
      }
    };

    loadMusic();
  }, [initializeMusicSystem, toast]);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Music className="mr-2 h-5 w-5" />
            Musique Thérapeutique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Explorez des playlists conçues pour améliorer votre bien-être émotionnel.
          </p>
          <div className="mt-4 space-y-4">
            <Button onClick={() => {
              if (setOpenPanel) {
                setOpenPanel(true);
              }
            }} variant="outline">
              Ouvrir le panneau de contrôle
            </Button>
            <Drawer open={openPanel} onOpenChange={setOpenPanel}>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Paramètres de la musique</DrawerTitle>
                  <DrawerDescription>
                    Ajustez les paramètres pour une expérience personnalisée.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4">
                  <FormMusicSettings />
                </div>
                <DrawerFooter>
                  <DrawerClose>Fermer</DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
            <Button onClick={() => setOpenFormDialog(true)} variant="outline" className="w-full">
              Créer une nouvelle playlist
            </Button>
          </div>
        </CardContent>
      </Card>
      <CreatePlaylistDialog open={openFormDialog} setOpen={setOpenFormDialog} />
    </div>
  );
};

interface PreferencesFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function PreferencesForm({ open, setOpen }: PreferencesFormProps) {
  const form = useForm({
    defaultValues: {
      theme: "light",
      notifications: true,
    },
  })

  function onSubmit(values: any) {
    console.log("Form values:", values);
    toast({
      title: "Préférences mises à jour.",
      description: "Vos préférences ont été enregistrées.",
    })
    setOpen(false);
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Preferences</Button>
      </DrawerTrigger>
      <DrawerContent className="text-foreground">
        <DrawerHeader>
          <DrawerTitle>Preferences</DrawerTitle>
          <DrawerDescription>
            Customize your experience.
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Theme</FormLabel>
                  <FormDescription>
                    Choose your preferred theme.
                  </FormDescription>
                  <div className="space-y-2">
                    <div className="grid gap-2">
                      <Label htmlFor="theme-light" className="peer-available:cursor-pointer peer-available:opacity-70">
                        <Input
                          type="radio"
                          id="theme-light"
                          value="light"
                          className="peer hidden"
                          {...field}
                        />
                        Light
                      </Label>
                      <Label htmlFor="theme-dark" className="peer-available:cursor-pointer peer-available:opacity-70">
                        <Input
                          type="radio"
                          id="theme-dark"
                          value="dark"
                          className="peer hidden"
                          {...field}
                        />
                        Dark
                      </Label>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Notifications</FormLabel>
                    <FormDescription>
                      Enable notifications to stay updated.
                    </FormDescription>
                  </div>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormItem>
              )}
            />
            <DrawerFooter>
              <Button type="submit">Submit</Button>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  )
}

interface FormMusicSettingsProps {
  // preferences: UserPreferences;
  // onSave: (preferences: UserPreferences) => void;
}

export function FormMusicSettings() {
  const form = useForm({
    defaultValues: {
      volume: 50,
      shuffle: false,
      repeat: false,
    },
  })

  function onSubmit(values: any) {
    console.log("Form values:", values);
    toast({
      title: "Paramètres mis à jour.",
      description: "Vos paramètres musicaux ont été enregistrés.",
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="volume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Volume</FormLabel>
              <FormDescription>
                Ajustez le volume de la musique.
              </FormDescription>
              <Slider
                defaultValue={[field.value]}
                max={100}
                step={1}
                onValueChange={(value) => field.onChange(value[0])}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="shuffle"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Lecture aléatoire</FormLabel>
                <FormDescription>
                  Mélanger les pistes de la playlist.
                </FormDescription>
              </div>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="repeat"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Répéter</FormLabel>
                <FormDescription>
                  Répéter la playlist en boucle.
                </FormDescription>
              </div>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormItem>
          )}
        />
        <Button type="submit">Enregistrer les paramètres</Button>
      </form>
    </Form>
  )
}

interface CreatePlaylistDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CreatePlaylistDialog({ open, setOpen }: CreatePlaylistDialogProps) {
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
  })

  function onSubmit(values: any) {
    console.log("Form values:", values);
    toast({
      title: "Playlist créée.",
      description: "Votre nouvelle playlist a été créée avec succès.",
    })
    setOpen(false);
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="text-foreground">
        <DrawerHeader>
          <DrawerTitle>Créer une playlist</DrawerTitle>
          <DrawerDescription>
            Ajoutez un nom et une description pour votre nouvelle playlist.
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormDescription>
                    Choisissez un nom pour votre playlist.
                  </FormDescription>
                  <Input placeholder="Nom de la playlist" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormDescription>
                    Ajoutez une description pour votre playlist.
                  </FormDescription>
                  <Input placeholder="Description de la playlist" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <DrawerFooter>
              <Button type="submit">Créer</Button>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  )
}

export default MusicWellbeingPage;
