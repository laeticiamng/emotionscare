
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { RadioGroup } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Palette, Sun, Moon, CloudSun } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  fontSize: z.enum(['small', 'medium', 'large']),
  backgroundColor: z.enum(['default', 'blue', 'mint', 'coral']),
  theme: z.enum(['light', 'dark', 'pastel', 'system'])
});

type FormValues = z.infer<typeof formSchema>;

interface ThemeSelectionFieldProps {
  form: UseFormReturn<FormValues>;
}

const ThemeSelectionField: React.FC<ThemeSelectionFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="theme"
      render={({ field }) => (
        <FormItem className="space-y-4">
          <FormLabel className="flex items-center text-lg font-medium">
            <Palette className="mr-2 h-5 w-5" />
            Thème visuel
          </FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="grid grid-cols-1 md:grid-cols-4 gap-5"
            >
              <div className={`flex flex-col items-center space-y-2.5 p-5 border rounded-xl hover:bg-accent/50 cursor-pointer transition-all ${field.value === "light" ? "bg-accent/30 ring-2 ring-primary/30" : ""}`}>
                <Sun className="h-9 w-9 text-amber-500" />
                <input 
                  type="radio"
                  id="light-theme"
                  value="light"
                  {...field}
                  className="sr-only"
                  checked={field.value === "light"}
                />
                <Label htmlFor="light-theme" className="cursor-pointer font-medium text-base">Mode clair</Label>
                <span className="text-sm text-muted-foreground text-center">Élégant et lumineux</span>
              </div>
              <div className={`flex flex-col items-center space-y-2.5 p-5 border rounded-xl hover:bg-accent/50 cursor-pointer transition-all ${field.value === "dark" ? "bg-accent/30 ring-2 ring-primary/30" : ""}`}>
                <Moon className="h-9 w-9 text-indigo-600 dark:text-indigo-400" />
                <input
                  type="radio"
                  id="dark-theme"
                  value="dark"
                  {...field}
                  className="sr-only"
                  checked={field.value === "dark"}
                />
                <Label htmlFor="dark-theme" className="cursor-pointer font-medium text-base">Mode sombre</Label>
                <span className="text-sm text-muted-foreground text-center">Premium et profond</span>
              </div>
              <div className={`flex flex-col items-center space-y-2.5 p-5 border rounded-xl hover:bg-accent/50 cursor-pointer transition-all ${field.value === "pastel" ? "bg-accent/30 ring-2 ring-primary/30" : ""}`}>
                <CloudSun className="h-9 w-9 text-blue-500" />
                <input
                  type="radio"
                  id="pastel-theme"
                  value="pastel"
                  {...field}
                  className="sr-only"
                  checked={field.value === "pastel"}
                />
                <Label htmlFor="pastel-theme" className="cursor-pointer font-medium text-base">Mode pastel</Label>
                <span className="text-sm text-muted-foreground text-center">Doux et apaisant</span>
              </div>
              <div className={`flex flex-col items-center space-y-2.5 p-5 border rounded-xl hover:bg-accent/50 cursor-pointer transition-all ${field.value === "system" ? "bg-accent/30 ring-2 ring-primary/30" : ""}`}>
                <div className="flex">
                  <Sun className="h-9 w-9 text-amber-500" />
                  <Moon className="h-9 w-9 text-indigo-600 dark:text-indigo-400 -ml-3" />
                </div>
                <input
                  type="radio"
                  id="system-theme"
                  value="system"
                  {...field}
                  className="sr-only"
                  checked={field.value === "system"}
                />
                <Label htmlFor="system-theme" className="cursor-pointer font-medium text-base">Système</Label>
                <span className="text-sm text-muted-foreground text-center">Suit vos préférences systèmes</span>
              </div>
            </RadioGroup>
          </FormControl>
          <FormDescription className="text-base">
            Cette option modifie l'apparence globale de l'application pour une expérience personnalisée.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ThemeSelectionField;
