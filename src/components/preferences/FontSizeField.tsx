
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  fontSize: z.enum(['small', 'medium', 'large']),
  backgroundColor: z.enum(['default', 'blue', 'mint', 'coral']),
  theme: z.enum(['light', 'dark', 'pastel', 'system'])
});

type FormValues = z.infer<typeof formSchema>;

interface FontSizeFieldProps {
  form: UseFormReturn<FormValues>;
}

const FontSizeField: React.FC<FontSizeFieldProps> = ({ form }) => {
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
};

export default FontSizeField;
