// @ts-nocheck

import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  fontSize: z.enum(['small', 'medium', 'large']),
});

type FormValues = z.infer<typeof formSchema>;

interface FontSizeFieldProps {
  form?: UseFormReturn<FormValues>;
  value?: "small" | "medium" | "large";
  onChange?: (fontSize: "small" | "medium" | "large") => void;
}

const FontSizeField: React.FC<FontSizeFieldProps> = ({ form, value, onChange }) => {
  // If using react-hook-form
  if (form) {
    return (
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
    );
  }
  
  // If using controlled component
  return (
    <div className="space-y-3">
      <div className="text-lg font-medium">Taille de la police</div>
      <RadioGroup
        value={value}
        onValueChange={onChange}
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
      <p className="text-sm text-muted-foreground">
        Cette option modifie la taille du texte dans l'application.
      </p>
    </div>
  );
};

export default FontSizeField;
