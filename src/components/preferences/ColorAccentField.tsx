// @ts-nocheck

import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  backgroundColor: z.enum(['default', 'blue', 'mint', 'coral']),
});

type FormValues = z.infer<typeof formSchema>;

interface ColorAccentFieldProps {
  form?: UseFormReturn<FormValues>;
  value?: string;
  onChange?: (accentColor: string) => void;
}

const ColorAccentField: React.FC<ColorAccentFieldProps> = ({ form, value, onChange }) => {
  // If using react-hook-form
  if (form) {
    return (
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
    );
  }
  
  // If using controlled component
  return (
    <div className="space-y-3">
      <div className="text-lg font-medium">Couleur d'accent</div>
      <RadioGroup
        value={value}
        onValueChange={onChange}
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
      <p className="text-sm text-muted-foreground">
        Cette option modifie la couleur d'accent dans l'application.
      </p>
    </div>
  );
};

export default ColorAccentField;
