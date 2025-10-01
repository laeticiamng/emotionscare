// @ts-nocheck

import React, { useEffect, useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'select' | 'checkbox' | 'radio';
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
}

interface OnboardingFormStepProps {
  fields: FormField[];
  stepId: string;
}

const OnboardingFormStep: React.FC<OnboardingFormStepProps> = ({
  fields,
  stepId
}) => {
  const { updateResponse, userResponses } = useOnboarding();
  const [formValues, setFormValues] = useState<Record<string, any>>(
    userResponses[stepId] || {}
  );
  
  const handleInputChange = (fieldId: string, value: any) => {
    setFormValues(prev => {
      const updatedValues = { ...prev, [fieldId]: value };
      return updatedValues;
    });
  };
  
  useEffect(() => {
    // Update responses in context when form values change
    updateResponse(stepId, formValues);
  }, [formValues, stepId, updateResponse]);
  
  return (
    <div className="space-y-6">
      {fields.map((field) => (
        <div key={field.id} className="space-y-2">
          <Label 
            htmlFor={field.id}
            className={field.required ? 'after:content-["*"] after:text-red-500 after:ml-1' : ''}
          >
            {field.label}
          </Label>
          
          {field.type === 'text' || field.type === 'email' ? (
            <Input
              id={field.id}
              type={field.type}
              value={formValues[field.id] || ''}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
            />
          ) : field.type === 'select' && field.options ? (
            <Select
              value={formValues[field.id] || ''}
              onValueChange={(value) => handleInputChange(field.id, value)}
            >
              <SelectTrigger id={field.id}>
                <SelectValue placeholder={field.placeholder || 'Sélectionner...'} />
              </SelectTrigger>
              <SelectContent>
                {field.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : field.type === 'checkbox' ? (
            <div className="flex items-center space-x-2">
              <Checkbox
                id={field.id}
                checked={!!formValues[field.id]}
                onCheckedChange={(checked) => handleInputChange(field.id, checked)}
              />
              <label
                htmlFor={field.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {field.placeholder || field.label}
              </label>
            </div>
          ) : field.type === 'radio' && field.options ? (
            <RadioGroup
              value={formValues[field.id] || ''}
              onValueChange={(value) => handleInputChange(field.id, value)}
            >
              {field.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${field.id}-${option.value}`} />
                  <Label htmlFor={`${field.id}-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default OnboardingFormStep;
