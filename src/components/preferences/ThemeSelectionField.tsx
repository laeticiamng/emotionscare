// @ts-nocheck

import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  theme: z.enum(['light', 'dark', 'pastel', 'system'])
});

type FormValues = z.infer<typeof formSchema>;

interface ThemeSelectionFieldProps {
  form?: UseFormReturn<FormValues>;
  value?: "light" | "dark" | "pastel" | "system";
  onChange?: (theme: "light" | "dark" | "pastel" | "system") => void;
}

const ThemeSelectionField: React.FC<ThemeSelectionFieldProps> = ({ form, value, onChange }) => {
  // If using react-hook-form
  if (form) {
    return (
      <FormField
        control={form.control}
        name="theme"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-lg font-medium">Thème</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light">Clair</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark">Sombre</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pastel" id="pastel" />
                  <Label htmlFor="pastel">Pastel</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="system" />
                  <Label htmlFor="system">Système</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormDescription>
              Cette option modifie l'apparence générale de l'application.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
  
  // If using controlled component
  return (
    <div className="space-y-3">
      <div className="text-lg font-medium">Thème</div>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="flex flex-col space-y-1"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="light" id="light" />
          <Label htmlFor="light">Clair</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="dark" id="dark" />
          <Label htmlFor="dark">Sombre</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="pastel" id="pastel" />
          <Label htmlFor="pastel">Pastel</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="system" id="system" />
          <Label htmlFor="system">Système</Label>
        </div>
      </RadioGroup>
      <p className="text-sm text-muted-foreground">
        Cette option modifie l'apparence générale de l'application.
      </p>
    </div>
  );
};

export default ThemeSelectionField;
